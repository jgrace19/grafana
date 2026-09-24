#!/usr/bin/env python3
"""Migrate public/app/features/alerting Emotion styles to co-located .stylex.ts files."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ALERTING = ROOT / "public/app/features/alerting"
UNIFIED = ALERTING / "unified"

TOKEN_FILE = ROOT / "packages/grafana-ui/src/themes/stylex/tokens.generated.stylex.ts"
TOKEN_KEYS = set(re.findall(r"^\s+([a-zA-Z0-9_]+):", TOKEN_FILE.read_text(), re.M))

COMPONENT_FALLBACKS = {
    "components.input.borderColor": "grafanaTokens.colors_border_medium",
    "components.panel.background": "grafanaTokens.colors_background_secondary",
    "components.height.md": "grafanaTokens.spacing_x4",
}

BREAKPOINT_DOWN = {
    "sm": "@media (max-width: 543.95px)",
    "md": "@media (max-width: 768.95px)",
    "lg": "@media (max-width: 991.95px)",
    "xl": "@media (max-width: 1199.95px)",
}


def theme_path_to_token(path: str) -> str | None:
    key = path.replace("theme.", "").replace(".", "_")
    if key in TOKEN_KEYS:
        return f"grafanaTokens.{key}"
    plain = path.replace("theme.", "")
    if plain in COMPONENT_FALLBACKS:
        return COMPONENT_FALLBACKS[plain]
    return None


def spacing_expr(args: str) -> str:
    parts = [p.strip() for p in args.split(",")]
    if len(parts) == 1:
        return f"themeSpacing({parts[0]})"
    return f"themeSpacingShorthand({', '.join(parts)})"


def transform_css_block(block: str) -> str:
    out = block
    out = re.sub(
        r"theme\.breakpoints\.down\(['\"](\w+)['\"]\)",
        lambda m: BREAKPOINT_DOWN.get(m.group(1), f"@media /* down {m.group(1)} */"),
        out,
    )
    out = re.sub(r"theme\.spacing\(([^)]+)\)", lambda m: spacing_expr(m.group(1)), out)
    out = re.sub(
        r"theme\.typography\.pxToRem\(([^)]+)\)",
        lambda m: f"{float(m.group(1).strip()) * 14 / 16}rem"
        if re.match(r"^[\d.]+$", m.group(1).strip())
        else "'inherit'",
        out,
    )
    out = re.sub(
        r"theme\.((?:colors|typography|shape|zIndex|shadows|components)(?:\.[a-zA-Z0-9_]+)+)",
        lambda m: theme_path_to_token(m.group(0)) or f"/* UNMAPPED {m.group(0)} */ 'inherit'",
        out,
    )
    out = out.replace("'&:hover'", "':hover'")
    out = out.replace("'&:nth-last-child(2)'", "':nth-last-child(2)'")
    out = out.replace("'&:last-child'", "':last-child'")
    out = out.replace("'& > div'", "' > div'")
    out = out.replace("'& > * + *'", "' > * + *'")
    out = out.replace("'&::after'", "'::after'")
    out = out.replace("'&:after'", "'::after'")
    out = out.replace("'&:checked + span'", "':checked + span'")
    return out


def stylex_import_depth(file_path: Path) -> str:
    file_path = file_path.resolve()
    try:
        rel = file_path.relative_to(UNIFIED.resolve())
    except ValueError:
        rel = file_path.relative_to(ALERTING.resolve())
    depth = len(rel.parts) - 1
    if depth == 0:
        return "./stylex/spacing"
    return "../" * depth + "stylex/spacing"


def export_name(file_path: Path) -> str:
    base = file_path.stem
    if base.startswith("get") and base.endswith("Styles"):
        base = base[3:]
        base = base[0].lower() + base[1:] if base else "styles"
    return base[0].lower() + base[1:] + "Styles"


def find_css_entries(body: str) -> list[tuple[str, str]]:
    """Extract key: css({...}) or css(arg, {...}) pairs with balanced braces."""
    entries: list[tuple[str, str]] = []
    i = 0
    while i < len(body):
        m = re.match(r"\s*(?:\[([^\]]+)\]|(\w+))\s*:\s*css\((?:[^,{]+,\s*)?\{", body[i:])
        if not m:
            i += 1
            continue
        key = m.group(1) or m.group(2)
        start = i + m.end() - 1
        depth = 0
        j = start
        while j < len(body):
            if body[j] == "{":
                depth += 1
            elif body[j] == "}":
                depth -= 1
                if depth == 0:
                    inner = body[start + 1 : j]
                    entries.append((key, inner))
                    i = j + 1
                    break
            j += 1
        else:
            break
    return entries


def extract_return_object_from_function(content: str) -> tuple[str, str] | None:
    """Find theme style function and return (full_src, object_body)."""
    for m in re.finditer(r"(?:export )?const (\w+) = \([^)]*\) => \{", content):
        fn_start = m.start()
        brace = m.end() - 1
        depth = 0
        close_brace = None
        for j in range(brace, len(content)):
            if content[j] == "{":
                depth += 1
            elif content[j] == "}":
                depth -= 1
                if depth == 0:
                    close_brace = j
                    break
        if close_brace is None:
            continue
        fn_end = close_brace + 1
        if content[fn_end : fn_end + 1] == ";":
            fn_end += 1
        full = content[fn_start:fn_end]
        body = content[brace + 1 : close_brace]
        ret = re.search(r"return \{([\s\S]*)\};\s*$", body.strip())
        if ret and find_css_entries(ret.group(1)):
            return (full, ret.group(1))
        ret_css = re.search(r"return css\(\{([\s\S]*)\}\);\s*$", body.strip())
        if ret_css:
            return (full, ret_css.group(1))
    for m in re.finditer(r"(?:export )?const (\w+) = \([^)]*\) => \(\{", content):
        start = m.end() - 1
        depth = 0
        for j in range(start, len(content)):
            if content[j] == "{":
                depth += 1
            elif content[j] == "}":
                depth -= 1
                if depth == 0:
                    full = content[m.start() : j + 2]
                    obj = content[start + 1 : j]
                    if find_css_entries(obj):
                        return (full.rstrip(), obj)
                    break
    return None


def extract_styles_block(content: str) -> tuple[str, str, list[tuple[str, str]]] | None:
    fn = extract_return_object_from_function(content)
    if fn:
        full, obj = fn
        keys = find_css_entries(obj)
        if keys:
            if re.search(r"return css\(", full):
                return (full, full, [("root", keys[0][1] if keys else obj)])
            return (full, full, keys)

    # export/get function returning { key: css(...) }
    for m in re.finditer(
        r"(?:export )?const (\w+) = \([^)]*\) => \{\s*return \{([\s\S]*?)\};\s*\};",
        content,
    ):
        keys = find_css_entries(m.group(2))
        if keys:
            return (m.group(0), m.group(0), keys)

    patterns = [
        r"(export const getStyles = \([^)]*\) => \(\{)([\s\S]*?)(\}\);)",
        r"(export const (get\w+) = \([^)]*\) => \(\{)([\s\S]*?)(\}\);)",
        r"(const (get\w*Styles|\w+Styles) = \([^)]*\) => \(\{)([\s\S]*?)(\}\);)",
        r"(const getStyles = \([^)]*\) => \(\{)([\s\S]*?)(\}\);)",
        r"(function getStyles\([^)]*\) \{\s*return \{\s*)([\s\S]*?)(\s*\};\s*\})",
    ]
    for pat in patterns:
        m = re.search(pat, content)
        if not m:
            continue
        full = m.group(0)
        body = m.group(2)
        keys = find_css_entries(body)
        if keys:
            return (full, full, keys)

    # export const getX = (theme) => ({ ... }); with nested css bodies
    m = re.search(r"export const (get\w+) = \([^)]*\) => \(\{", content)
    if m:
        start = m.start()
        brace = content.find("{", m.end() - 1)
        depth = 0
        for j in range(brace, len(content)):
            if content[j] == "{":
                depth += 1
            elif content[j] == "}":
                depth -= 1
                if depth == 0:
                    full = content[start : j + 2] if content[j + 1 : j + 2] == ";" else content[start : j + 1]
                    body = content[brace + 1 : j]
                    keys = find_css_entries(body)
                    if keys:
                        return (full, full, keys)
                    break

    m = re.search(r"className=\{css\(\{([\s\S]*?)\}\)\}", content)
    if m and "@emotion" in content:
        return ("inline", m.group(0), [("root", m.group(1))])

    return None


def clean_imports(text: str) -> str:
    text = re.sub(r"import \{[^}]*\} from '@emotion/css';\n", "", text)
    text = re.sub(r"import \{ type PropsOf \} from '@emotion/react';\n", "import { type ComponentProps } from 'react';\n", text)
    text = re.sub(r"PropsOf<", "ComponentProps<typeof ", text)
    text = re.sub(r"import \{ type GrafanaTheme2[^}]*\} from '@grafana/data';\n", "", text)
    text = re.sub(r"import \{ useStyles2 \} from '@grafana/ui';\n", "", text)
    text = re.sub(r", useStyles2(?=,|\})", "", text)
    text = re.sub(r"useStyles2, ", "", text)
    text = re.sub(r"\{ useStyles2 \}", "", text)
    text = re.sub(r"import \{ \} from '@grafana/ui';\n", "", text)
    text = re.sub(r", \} from '@grafana/ui'", " } from '@grafana/ui'", text)
    text = re.sub(r"\{ ,", "{", text)
    return text


def migrate_file(file_path: Path, dry_run: bool = False) -> bool:
    content = file_path.read_text()
    if not re.search(r"@emotion/|useStyles2|\bcss\(", content):
        return False

    extracted = extract_styles_block(content)
    if not extracted:
        print(f"SKIP (no styles): {file_path.relative_to(ROOT)}")
        return False

    _, block_src, keys = extracted
    if not keys:
        print(f"SKIP (empty): {file_path.relative_to(ROOT)}")
        return False

    export = export_name(file_path)
    stylex_lines = [
        "import * as stylex from '@stylexjs/stylex';",
        "",
        "import { grafanaTokens } from '@grafana/ui/unstable';",
        "",
    ]
    joined = "\n".join(b for _, b in keys)
    if "themeSpacing" in transform_css_block(joined):
        stylex_lines.append(
            f"import {{ themeSpacing, themeSpacingShorthand }} from '{stylex_import_depth(file_path)}';"
        )
        stylex_lines.append("")
    stylex_lines.append(f"export const {export} = stylex.create({{")
    for key, block in keys:
        safe_key = re.sub(r"[^\w]", "_", key)
        if safe_key[0].isdigit():
            safe_key = f"state_{safe_key}"
        transformed = transform_css_block(block)
        indented = "\n".join("    " + line for line in transformed.strip().splitlines())
        stylex_lines.append(f"  {safe_key}: {{")
        stylex_lines.append(indented)
        stylex_lines.append("  },")
    stylex_lines.append("});")
    stylex_lines.append("")

    stylex_path = file_path.with_suffix(".stylex.ts")
    new_content = content

    if block_src != "inline":
        new_content = new_content.replace(block_src + "\n", "")
        new_content = new_content.replace(block_src, "")

    new_content = re.sub(r"\s*const \w+Styles = useStyles2\([^)]+\);\n", "\n", new_content)
    new_content = re.sub(r"\s*const styles = useStyles2\([^)]+\);\n", "\n", new_content)
    new_content = re.sub(r"\s*const tableStyles = useStyles2\([^)]+\);\n", "\n", new_content)
    new_content = re.sub(r"\s*const textStyles = useStyles2\([^)]+\);\n", "\n", new_content)
    new_content = re.sub(r"\s*const formStyles = useStyles2\([^)]+\);\n", "\n", new_content)

    new_content = clean_imports(new_content)

    stylex_import = (
        f"import * as stylex from '@stylexjs/stylex';\n"
        f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
        f"import {{ {export} }} from './{file_path.stem}.stylex';\n"
    )
    if "import * as stylex" not in new_content:
        new_content = re.sub(r"(^import .*\n)", stylex_import + r"\1", new_content, count=1)

    if re.search(r"\bcx\(", new_content) and "import clsx" not in new_content:
        new_content = "import clsx from 'clsx';\n" + new_content

    for key, _ in keys:
        safe_key = re.sub(r"[^\w]", "_", key)
        if safe_key[0].isdigit():
            safe_key = f"state_{safe_key}"

        new_content = re.sub(
            rf"className=\{{styles\.{re.escape(key)}\}}",
            f"{{...stylex.props({export}.{safe_key})}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{styles\.{re.escape(key)}\}}",
            f"{{...stylex.props({export}.{safe_key})}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{cx\(styles\.{re.escape(key)}, className\)\}}",
            f"{{...mergeStylexClassName(stylex.props({export}.{safe_key}), className)}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{cx\(className, styles\.{re.escape(key)}\)\}}",
            f"{{...mergeStylexClassName(stylex.props({export}.{safe_key}), className)}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{useStyles2\(\w+\)\.{re.escape(key)}\}}",
            f"{{...stylex.props({export}.{safe_key})}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{styles\.{re.escape(key)}\}}",
            f"{{...stylex.props({export}.{safe_key})}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{style\.{re.escape(key)}\}}",
            f"{{...stylex.props({export}.{safe_key})}}",
            new_content,
        )

    if block_src == "inline":
        new_content = re.sub(
            r"className=\{css\(\{[\s\S]*?\}\)\}",
            f"{{...stylex.props({export}.root)}}",
            new_content,
            count=1,
        )

    new_content = re.sub(
        r"className=\{cx\(styles\.(\w+), className\)\}",
        lambda m: f"{{...mergeStylexClassName(stylex.props({export}.{m.group(1)}), className)}}",
        new_content,
    )
    new_content = re.sub(
        r"className=\{styles\.(\w+)\}",
        lambda m: f"{{...stylex.props({export}.{m.group(1)})}}",
        new_content,
    )

    if not dry_run:
        stylex_path.write_text("\n".join(stylex_lines))
        file_path.write_text(new_content)

    print(f"OK {file_path.relative_to(ROOT)}")
    return True


def main():
    dry = "--dry-run" in sys.argv
    files = sorted(ALERTING.rglob("*.tsx")) + sorted(ALERTING.rglob("*.ts"))
    count = 0
    for f in files:
        if ".stylex." in f.name or f.name.endswith(".md"):
            continue
        if migrate_file(f, dry_run=dry):
            count += 1
    print(f"Migrated {count} files")


if __name__ == "__main__":
    main()
