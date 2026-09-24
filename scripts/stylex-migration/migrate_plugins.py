#!/usr/bin/env python3
"""Migrate public/app/plugins Emotion styles to co-located .stylex.ts files."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PLUGINS = ROOT / "public/app/plugins"
APP = ROOT / "public/app"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from migrate_core import (  # noqa: E402
    export_name,
    extract_get_styles,
    needs_spacing_import,
    transform_css_block,
)

UNSAFE_STYLE_MARKERS = [
    "keyframes",
    "Object.fromEntries",
]


def spacing_import_path(file_path: Path) -> str:
    rel = file_path.relative_to(APP)
    depth = len(rel.parts) - 1
    return "../" * depth + "core/stylex/spacing"


def quote_stylex_keys(block: str) -> str:
    """Ensure @media and pseudo selectors are quoted StyleX keys."""
    out = block
    out = re.sub(
        r"^\s*\[@media([^\]]+)\]:",
        lambda m: f"    '@media{m.group(1)}':",
        out,
        flags=re.M,
    )
    out = re.sub(
        r"^\s*\[@media([^\]]+)\]:",
        lambda m: f"    '@media{m.group(1)}':",
        out,
        flags=re.M,
    )
    # Fix broken UNMAPPED typography spread
    out = re.sub(
        r"\.\.\./\* UNMAPPED theme\.typography\.(\w+) \*/ 'inherit',",
        lambda m: f"fontSize: grafanaTokens.typography_{m.group(1)}_fontSize,"
        if f"typography_{m.group(1)}_fontSize" in open(
            ROOT / "packages/grafana-ui/src/themes/stylex/tokens.generated.stylex.ts"
        ).read()
        else "/* typography */",
        out,
    )
    out = out.replace(".../* UNMAPPED theme.typography.h3 */ 'inherit',", "fontSize: grafanaTokens.typography_h3_fontSize,")
    out = re.sub(
        r"themeSpacing\(theme\.components\.height\.md\)",
        "grafanaTokens.spacing_x4",
        out,
    )
    out = re.sub(
        r"themeSpacing\(theme\.spacing\.gridSize \* (\d+)\)",
        lambda m: f"themeSpacing({m.group(1)})",
        out,
    )
    # Remove emotion dev-only label property
    out = re.sub(r"^\s+label: '[^']*',\n", "", out, flags=re.M)
    return out


def format_stylex_block(block: str) -> str:
    transformed = quote_stylex_keys(transform_css_block(block))
    return "\n".join("    " + line.rstrip() for line in transformed.strip().splitlines() if line.strip())


def extract_styles(content: str) -> tuple[str, list[tuple[str, str]]] | None:
    extracted = extract_get_styles(content)
    if extracted:
        _, src, keys = extracted
        return src, keys

    m = re.search(
        r"(export default )?(const (get\w*) = \([^)]*\) => \(\{([\s\S]*?)\n\}\);)",
        content,
    )
    if m:
        keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(2))
        if keys:
            return m.group(2), keys

    m = re.search(
        r"export const (get\w*) = \([^)]*\) => \(\{([\s\S]*?)\n\}\);",
        content,
    )
    if m:
        keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(0))
        if keys:
            return m.group(0), keys

    return None


def is_unsafe(keys: list[tuple[str, str]], full_content: str) -> bool:
    joined = full_content + "\n".join(b for _, b in keys)
    return any(marker in joined for marker in UNSAFE_STYLE_MARKERS)


def build_stylex_file(file_path: Path, export: str, keys: list[tuple[str, str]]) -> str:
    lines = [
        "import * as stylex from '@stylexjs/stylex';",
        "",
        "import { grafanaTokens } from '@grafana/ui/unstable';",
        "",
    ]
    if needs_spacing_import(keys):
        lines.append(f"import {{ themeSpacing, themeSpacingShorthand }} from '{spacing_import_path(file_path)}';")
        lines.append("")
    lines.append(f"export const {export} = stylex.create({{")
    for key, block in keys:
        lines.append(f"  {key}: {{")
        lines.append(format_stylex_block(block))
        lines.append("  },")
    lines.append("});")
    lines.append("")
    return "\n".join(lines)


def strip_emotion_imports(text: str) -> str:
    text = re.sub(r"^import \{[^}]*\} from '@emotion/css';\n", "", text, flags=re.M)
    text = re.sub(r"^import \{[^}]*\} from '@emotion/react';\n", "", text, flags=re.M)
    text = re.sub(r"^import \{ type GrafanaTheme2[^}]*\} from '@grafana/data';\n", "", text, flags=re.M)
    text = re.sub(r"^import \{ useStyles2 \} from '@grafana/ui';\n", "", text, flags=re.M)
    text = re.sub(r",\s*useStyles2\b", "", text)
    text = re.sub(r"\buseStyles2,\s*", "", text)
    text = re.sub(r"\{ useStyles2 \}", "", text)
    text = re.sub(r"import \{ \} from '@grafana/ui';\n", "", text)
    return text


def add_stylex_imports(text: str, export: str, stem: str) -> str:
    if "@stylexjs/stylex" not in text:
        needs_merge = "mergeStylexClassName" in text or "clsx(" in text
        header = f"import * as stylex from '@stylexjs/stylex';\n"
        if needs_merge:
            header += "import { mergeStylexClassName } from '@grafana/ui/unstable';\n"
        header += f"import {{ {export} }} from './{stem}.stylex';\n\n"
        text = header + text.lstrip()
    if re.search(r"\bclsx\(", text) and "import clsx" not in text:
        text = "import clsx from 'clsx';\n" + text
    return text


def replace_style_usages(text: str, export: str, keys: list[tuple[str, str]]) -> str:
    text = re.sub(r"^\s*const styles = useStyles2\([^)]+\);\n", "", text, flags=re.M)

    for key, _ in keys:
        text = re.sub(
            rf"className=\{{styles\.{key}\}}",
            f"{{...stylex.props({export}.{key})}}",
            text,
        )
        text = re.sub(
            rf"className=\{{cx\(([^)]*?)styles\.{key}([^)]*?)\)\}}",
            rf"{{...mergeStylexClassName(stylex.props({export}.{key}), clsx(\1\2))}}",
            text,
        )
        text = re.sub(
            rf"\{{\s*\[styles\.{key}\]:",
            rf"{{...stylex.props({export}.{key}), [",
            text,
        )
        text = re.sub(
            rf"clsx\(\s*styles\.{key}\s*,",
            f"mergeStylexClassName(stylex.props({export}.{key}), clsx(",
            text,
        )
        text = re.sub(
            rf"clsx\(\s*([^,]+),\s*styles\.{key}\s*\)",
            rf"mergeStylexClassName(stylex.props({export}.{key}), clsx(\1))",
            text,
        )
        text = re.sub(
            rf"styles\.{key}\s*&&",
            f"!!stylex.props({export}.{key}).className &&",
            text,
        )

    # containerStyles={styles.foo}
    for key, _ in keys:
        text = re.sub(
            rf"containerStyles=\{{styles\.{key}\}}",
            f"containerClassName={{stylex.props({export}.{key}).className ?? undefined}}",
            text,
        )
        text = re.sub(
            rf"containerClassName=\{{styles\.{key}\}}",
            f"containerClassName={{stylex.props({export}.{key}).className ?? undefined}}",
            text,
        )
        text = re.sub(
            rf"buttonProps=\{{\s*className:\s*styles\.{key}\s*\}}",
            f"buttonProps={{{{ className: stylex.props({export}.{key}).className ?? undefined }}}}",
            text,
        )

    if len(keys) == 1 and keys[0][0] == "root":
        text = re.sub(r"className=\{styles\}", f"{{...stylex.props({export}.root)}}", text)

    # Ternary className={a ? styles.x : styles.y}
    for key, _ in keys:
        text = re.sub(
            rf"\? styles\.{key}\s*:",
            f"? ({export}.{key}) :",
            text,
        )
    text = re.sub(
        r"className=\{(\w+) \? (\w+Styles)\.(\w+) : (\2)\.(\w+)\}",
        r"{...stylex.props(\2[\1 ? '\3' : '\5'])}",
        text,
    )

    return text


def migrate_module_styles(file_path: Path, dry_run: bool = False) -> bool:
    content = file_path.read_text()
    if "@emotion/" not in content:
        return False

    keys: list[tuple[str, str]] = []
    for m in re.finditer(r"const (\w+) = css\(\{([\s\S]*?)\}\);", content):
        keys.append((m.group(1), m.group(2)))

    obj = re.search(r"const (\w+) = \{\s*([\s\S]*?)\n\};", content)
    if obj:
        for m in re.finditer(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", obj.group(2)):
            keys.append((m.group(1), m.group(2)))

    fn = re.search(
        r"const (get\w+) = \([^)]*\) =>\s*\n?\s*css\(\{([\s\S]*?)\}\);",
        content,
    )
    if fn:
        keys.append(("root", fn.group(2)))

    sf = re.search(
        r"const getStyles = stylesFactory\(\([^)]*\) => \(\{([\s\S]*?)\}\)\);",
        content,
    )
    if sf:
        for m in re.finditer(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", sf.group(1)):
            keys.append((m.group(1), m.group(2)))

    if not keys:
        return False
    if is_unsafe(keys, content):
        return False

    export = export_name(file_path)
    stylex_src = build_stylex_file(file_path, export, keys)
    new_content = content
    for m in re.finditer(r"const (\w+) = css\(\{[\s\S]*?\}\);\n?", content):
        new_content = new_content.replace(m.group(0), "", 1)
    if obj:
        new_content = new_content.replace(obj.group(0) + "\n", "")
    if fn:
        new_content = new_content.replace(fn.group(0) + "\n", "")

    new_content = strip_emotion_imports(new_content)
    new_content = add_stylex_imports(new_content, export, file_path.stem)
    new_content = re.sub(r"\buseStyles2\(\s*get\w+\s*\)", f"stylex.props({export}.root)", new_content)
    new_content = re.sub(r"\s*const styles = useStyles2\(\s*get\w+\s*\);\n", "\n", new_content)

    for key, _ in keys:
        obj_name = obj.group(1) if obj else None
        if obj_name:
            new_content = new_content.replace(f"{obj_name}.{key}", f"stylex.props({export}.{key})")
        new_content = new_content.replace(f"className={{{key}}}", f"{{...stylex.props({export}.{key})}}")
        new_content = re.sub(
            rf"className=\{{cx\([^)]*{key}[^)]*\)\}}",
            f"{{...stylex.props({export}.{key})}}",
            new_content,
        )

    if fn and "className={styles}" in new_content:
        new_content = new_content.replace("className={styles}", f"{{...stylex.props({export}.root)}}")

    new_content = re.sub(r"\bcx\(", "clsx(", new_content)
    if not dry_run:
        file_path.with_suffix(".stylex.ts").write_text(stylex_src)
        file_path.write_text(new_content)
    print(f"OK module {file_path.resolve().relative_to(ROOT)}")
    return True


def migrate_inline_css(file_path: Path, dry_run: bool = False) -> bool:
    content = file_path.read_text()
    if "@emotion/" not in content:
        return False
    pattern = re.compile(r"css\(\{([\s\S]*?)\}\)")
    matches = list(pattern.finditer(content))
    if not matches:
        return migrate_cx_only(file_path, dry_run)
    keys: list[tuple[str, str]] = []
    for i, m in enumerate(matches):
        keys.append((f"inline{i}", m.group(1)))
    if is_unsafe(keys, content):
        return False
    export = export_name(file_path)
    stylex_src = build_stylex_file(file_path, export, keys)
    new_content = content
    for m in matches:
        new_content = new_content.replace(m.group(0), "__STYLEX_PLACEHOLDER__", 1)
    new_content = strip_emotion_imports(new_content)
    new_content = add_stylex_imports(new_content, export, file_path.stem)
    for i, _ in enumerate(matches):
        key = f"inline{i}"
        new_content = new_content.replace(
            "className={__STYLEX_PLACEHOLDER__}",
            f"{{...stylex.props({export}.{key})}}",
            1,
        )
    if "__STYLEX_PLACEHOLDER__" in new_content:
        return False
    if not dry_run:
        file_path.with_suffix(".stylex.ts").write_text(stylex_src)
        file_path.write_text(new_content)
    print(f"OK inline {file_path.relative_to(ROOT)}")
    return True


def migrate_file(file_path: Path, dry_run: bool = False) -> bool:
    content = file_path.read_text()
    if not re.search(r"@emotion/|useStyles2", content):
        return migrate_cx_only(file_path, dry_run)

    extracted = extract_styles(content)
    if not extracted:
        if migrate_module_styles(file_path, dry_run):
            return True
        return migrate_inline_css(file_path, dry_run)

    get_styles_src, keys = extracted
    if not keys or is_unsafe(keys, content):
        return migrate_cx_only(file_path, dry_run)

    export = export_name(file_path)
    stylex_src = build_stylex_file(file_path, export, keys)
    new_content = content.replace(get_styles_src + "\n", "").replace(get_styles_src, "")
    new_content = strip_emotion_imports(new_content)
    new_content = add_stylex_imports(new_content, export, file_path.stem)
    new_content = re.sub(r"\bcx\(", "clsx(", new_content)
    new_content = replace_style_usages(new_content, export, keys)

    if not dry_run:
        file_path.with_suffix(".stylex.ts").write_text(stylex_src)
        file_path.write_text(new_content)
    print(f"OK {file_path.relative_to(ROOT)}")
    return True


def migrate_cx_only(file_path: Path, dry_run: bool = False) -> bool:
    content = file_path.read_text()
    if "@emotion/css" not in content or "css(" in content:
        return False
    if "cx" not in content:
        return False
    new_content = re.sub(r"^import \{ cx \} from '@emotion/css';\n", "import clsx from 'clsx';\n", content, flags=re.M)
    new_content = re.sub(r"^import \{ css, cx \} from '@emotion/css';\n", "import clsx from 'clsx';\n", new_content, flags=re.M)
    new_content = new_content.replace("cx(", "clsx(")
    if new_content == content:
        return False
    if not dry_run:
        file_path.write_text(new_content)
    print(f"OK cx-only {file_path.relative_to(ROOT)}")
    return True


def migrate_styles_ts(file_path: Path, dry_run: bool = False) -> bool:
    content = file_path.read_text()
    if not re.search(r"@emotion/", content):
        return False

    if "export default getStyles" in content or re.search(r"const getStyles = \(theme", content):
        extracted = extract_styles(content)
        if not extracted or is_unsafe(extracted[1], content):
            return False
        get_styles_src, keys = extracted
        export = export_name(file_path)
        stylex_src = build_stylex_file(file_path, export, keys)
        new_content = content.replace(get_styles_src + "\n", "").replace(get_styles_src, "")
        new_content = strip_emotion_imports(new_content)
        new_content = (
            f"import * as stylex from '@stylexjs/stylex';\n"
            f"import {{ {export} }} from './{file_path.stem}.stylex';\n\n"
            + new_content
        )
        new_content = re.sub(r"export default getStyles;?", f"export default function getStyles() {{ return {export}; }}", new_content)
        if not dry_run:
            file_path.with_suffix(".stylex.ts").write_text(stylex_src)
            file_path.write_text(new_content)
        print(f"OK getStyles styles {file_path.relative_to(ROOT)}")
        return True

    exports = list(re.finditer(r"export const (\w+) = css\(\{([\s\S]*?)\}\);", content))
    if not exports:
        return False

    export = export_name(file_path)
    keys = [(m.group(1), m.group(2)) for m in exports]
    stylex_src = build_stylex_file(file_path, export, keys)
    new_content = strip_emotion_imports(content)
    for m in exports:
        new_content = new_content.replace(m.group(0) + "\n", "")
    new_content = (
        f"import * as stylex from '@stylexjs/stylex';\n"
        f"import {{ {export} }} from './{file_path.stem}.stylex';\n\n"
        + new_content
    )
    for key, _ in keys:
        new_content += f"\nexport const {key} = stylex.props({export}.{key}).className ?? '';\n"

    if not dry_run:
        file_path.with_suffix(".stylex.ts").write_text(stylex_src)
        file_path.write_text(new_content)
    print(f"OK styles.ts {file_path.relative_to(ROOT)}")
    return True


def main() -> None:
    dry = "--dry-run" in sys.argv
    only_remaining = "--remaining" in sys.argv
    count = 0
    files = sorted(PLUGINS.rglob("*.tsx")) + sorted(PLUGINS.rglob("*.ts"))
    for f in files:
        if only_remaining and "@emotion" not in f.read_text():
            continue
        if ".stylex." in f.name or f.name.endswith(".test.ts") or f.name.endswith(".test.tsx"):
            continue
        if f.name == "constants.ts":
            continue
        if f.name == "styles.ts" and migrate_styles_ts(f, dry):
            count += 1
            continue
        if migrate_file(f, dry):
            count += 1
    print(f"Migrated {count} files")


if __name__ == "__main__":
    main()
