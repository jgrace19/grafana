#!/usr/bin/env python3
"""Migrate all get*Styles blocks in one file into a single .stylex.ts export."""
import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("m", ROOT / "scripts/stylex-migration/migrate_alerting.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def fn_prefix(name: str) -> str:
    n = name
    if n.startswith("get"):
        n = n[3:]
    if n.endswith("Styles"):
        n = n[:-6]
    if not n:
        return "root"
    return n[0].lower() + n[1:]


def extract_blocks(content: str) -> list[tuple[str, str, str]]:
    blocks = []
    for m in re.finditer(r"const (get\w+) = \(theme: GrafanaTheme2\) => \(\{", content):
        start = m.start()
        brace = m.end() - 1
        depth = 0
        close = None
        for j in range(brace, len(content)):
            if content[j] == "{":
                depth += 1
            elif content[j] == "}":
                depth -= 1
                if depth == 0:
                    close = j
                    break
        if close is None:
            continue
        full = content[start : close + 2]
        body = content[brace + 1 : close]
        blocks.append((m.group(1), full, body))

    for m in re.finditer(r"const (get\w+) = \(theme: GrafanaTheme2\) => \{\s*return \{", content):
        start = m.start()
        brace = content.find("{", m.end() - 1)
        depth = 0
        close = None
        for j in range(brace, len(content)):
            if content[j] == "{":
                depth += 1
            elif content[j] == "}":
                depth -= 1
                if depth == 0:
                    close = j
                    break
        if close is None:
            continue
        fn_close = close
        for j in range(close + 1, len(content)):
            if content[j] == "}":
                fn_close = j
                break
        full = content[start : fn_close + 2]
        ret = re.search(r"return \{([\s\S]*)\};", content[brace + 1 : fn_close])
        if ret:
            blocks.append((m.group(1), full, ret.group(1)))

    # const styles = { timeRange: css
    m = re.search(r"const styles = \{\s*(\w+): css\(\{([\s\S]*?)\}\),\s*\};", content)
    if m:
        blocks.append(("inlineStyles", m.group(0), f"{m.group(1)}: css({{{m.group(2)}}})"))

    return blocks


def migrate(path: Path) -> None:
    content = path.read_text()
    blocks = extract_blocks(content)
    if not blocks:
        print("no blocks", path)
        return

    export = path.stem[0].lower() + path.stem[1:] + "Styles"
    stylex_lines = [
        "import * as stylex from '@stylexjs/stylex';",
        "",
        "import { grafanaTokens } from '@grafana/ui/unstable';",
        "",
    ]
    all_keys: list[tuple[str, str]] = []
    for fn_name, full, body in blocks:
        prefix = fn_prefix(fn_name)
        for key, block in mod.find_css_entries(body):
            sk = f"{prefix}_{key}" if prefix != "root" else key
            all_keys.append((sk, block))
        content = content.replace(full + "\n", "")
        content = content.replace(full, "")

    joined = "\n".join(b for _, b in all_keys)
    if "themeSpacing" in mod.transform_css_block(joined):
        stylex_lines.append(
            f"import {{ themeSpacing, themeSpacingShorthand }} from '{mod.stylex_import_depth(path)}';"
        )
        stylex_lines.append("")

    stylex_lines.append(f"export const {export} = stylex.create({{")
    for sk, block in all_keys:
        transformed = mod.transform_css_block(block)
        indented = "\n".join("    " + line for line in transformed.strip().splitlines())
        stylex_lines.append(f"  {sk}: {{")
        stylex_lines.append(indented)
        stylex_lines.append("  },")
    stylex_lines.append("});")
    stylex_lines.append("")

    path.with_suffix(".stylex.ts").write_text("\n".join(stylex_lines))

    # Replace useStyles2(getFooStyles).key -> stylex.props(export.foo_key)
    for fn_name, _, body in blocks:
        prefix = fn_prefix(fn_name)
        for key, _ in mod.find_css_entries(body):
            sk = f"{prefix}_{key}" if prefix != "root" else key
            content = re.sub(
                rf"useStyles2\({fn_name}\)\.{re.escape(key)}",
                f"stylex.props({export}.{sk})",
                content,
            )
            content = re.sub(
                rf"styles\.{re.escape(key)}\b",
                f"stylex.props({export}.{sk})",
                content,
            )

    content = mod.clean_imports(content)
    if f"from './{path.stem}.stylex'" not in content:
        block = (
            f"import * as stylex from '@stylexjs/stylex';\n"
            f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
            f"import {{ {export} }} from './{path.stem}.stylex';\n"
        )
        content = re.sub(r"(^import .*\n)", block + r"\1", content, count=1)

    # fix className={stylex.props -> {...stylex.props
    content = re.sub(r"className=\{(stylex\.props\([^)]+\))\}", r"{...\1}", content)
    content = re.sub(r"className=\{cx\((stylex\.props\([^)]+\))\)\}", r"{...\1}", content)

    path.write_text(content)
    print("migrated", path)


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        migrate(Path(arg))
