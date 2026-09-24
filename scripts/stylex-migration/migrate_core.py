#!/usr/bin/env python3
"""Migrate public/app/core Emotion styles to co-located .stylex.ts files."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CORE = ROOT / "public/app/core"

SPACING_TOKENS = {
    0: "spacing_x0",
    0.25: "spacing_x0_25",
    0.5: "spacing_x0_5",
    1: "spacing_x1",
    1.5: "spacing_x1_5",
    2: "spacing_x2",
    2.5: "spacing_x2_5",
    3: "spacing_x3",
    4: "spacing_x4",
    5: "spacing_x5",
    6: "spacing_x6",
    8: "spacing_x8",
    10: "spacing_x10",
}

TOKEN_FILE = ROOT / "packages/grafana-ui/src/themes/stylex/tokens.generated.stylex.ts"
TOKEN_KEYS = set(re.findall(r"^\s+([a-zA-Z0-9_]+):", TOKEN_FILE.read_text(), re.M))

COMPONENT_FALLBACKS = {
    "components.input.borderColor": "grafanaTokens.colors_border_medium",
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
        p = parts[0]
        if re.match(r"^['\"]", p):
            return p
        return f"themeSpacing({p})"
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
        lambda m: f"{float(m.group(1).strip()) * 14 / 16}rem" if re.match(r"^[\d.]+$", m.group(1).strip()) else "'inherit'",
        out,
    )
    out = re.sub(
        r"theme\.((?:colors|typography|shape|zIndex|shadows)(?:\.[a-zA-Z0-9_]+)+)",
        lambda m: theme_path_to_token(m.group(0)) or f"/* UNMAPPED {m.group(0)} */ 'inherit'",
        out,
    )
    # Emotion nested selectors -> StyleX
    out = out.replace("'&:hover'", "':hover'")
    out = out.replace("'&:nth-last-child(2)'", "':nth-last-child(2)'")
    out = out.replace("'&:last-child'", "':last-child'")
    out = out.replace("'& > div'", "' > div'")
    out = out.replace("'& > div'", "' > div'")
    out = out.replace("'&::after'", "'::after'")
    out = out.replace("'&:after'", "'::after'")
    out = out.replace("'&:checked + span'", "':checked + span'")
    return out


def stylex_import_depth(file_path: Path) -> str:
    rel = file_path.relative_to(CORE)
    depth = len(rel.parts) - 1
    if depth == 0:
        return "./stylex/spacing"
    return "../" * depth + "stylex/spacing"


def export_name(file_path: Path) -> str:
    base = file_path.stem
    return base[0].lower() + base[1:] + "Styles"


def extract_get_styles(content: str) -> tuple[str, str, list[tuple[str, str]]] | None:
    # export const getStyles in utils.ts
    m = re.search(
        r"export const getStyles = \(\) => \{\s*return \{\s*([\s\S]*?)\s*\};\s*\};",
        content,
    )
    if m:
        body = m.group(1)
        keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", body)
        return ("export const getStyles", m.group(0), keys)

    m = re.search(
        r"function getStyles\([^)]*\)\s*\{\s*return\s*\{([\s\S]*?)\};\s*\}",
        content,
    )
    if m:
        body = m.group(1)
        keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", body)
        return ("function getStyles", m.group(0), keys)

    m = re.search(
        r"const (get\w*Styles) = \(([^)]*)\) =>(?:\s*\{\s*return\s*\{([\s\S]*?)\};\s*\}|\s*\(?\s*\{([\s\S]*?)\n\}\)?;)",
        content,
    )
    if m:
        name = m.group(1)
        body = m.group(3) or m.group(4)
        if body:
            keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", body)
            return (f"const {name}", m.group(0), keys)

    m = re.search(
        r"const getStyles = \(([^)]*)\) =>(?:\s*\(?\s*\{([\s\S]*?)\n\}\)?;|\s*(css\(\{[\s\S]*?\}\));)",
        content,
    )
    if not m:
        return None
    params = m.group(1)
    if m.group(2):
        body = m.group(2)
        keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", body)
        return (f"const getStyles = ({params})", m.group(0), keys)
    if m.group(3):
        inner = re.search(r"css\(\{([\s\S]*?)\}\)", m.group(3))
        if inner:
            return (f"const getStyles = ({params})", m.group(0), [("root", inner.group(1))])
    return None


def needs_spacing_import(blocks: list[tuple[str, str]]) -> bool:
    joined = "\n".join(b for _, b in blocks)
    return "themeSpacing" in joined


def migrate_tsx(file_path: Path, dry_run: bool = False) -> bool:
    content = file_path.read_text()
    if not re.search(r"@emotion/|useStyles2", content):
        return False

    extracted = extract_get_styles(content)
    if not extracted:
        print(f"SKIP (no getStyles): {file_path.relative_to(ROOT)}")
        return False

    _, get_styles_src, keys = extracted
    if not keys:
        print(f"SKIP (empty styles): {file_path.relative_to(ROOT)}")
        return False

    export = export_name(file_path)
    stylex_lines = ["import * as stylex from '@stylexjs/stylex';", "", "import { grafanaTokens } from '@grafana/ui/unstable';", ""]
    if needs_spacing_import(keys):
        stylex_lines.append(f"import {{ themeSpacing, themeSpacingShorthand }} from '{stylex_import_depth(file_path)}';")
        stylex_lines.append("")
    stylex_lines.append(f"export const {export} = stylex.create({{")
    for key, block in keys:
        transformed = transform_css_block(block)
        indented = "\n".join("    " + line for line in transformed.strip().splitlines())
        stylex_lines.append(f"  {key}: {{")
        stylex_lines.append(indented)
        stylex_lines.append("  },")
    stylex_lines.append("});")
    stylex_lines.append("")

    stylex_path = file_path.with_suffix(".stylex.ts")
    new_content = content

    # Remove getStyles
    new_content = new_content.replace(get_styles_src + "\n", "")
    new_content = new_content.replace(get_styles_src, "")

    # Remove emotion / useStyles2 imports
    new_content = re.sub(r"import \{[^}]*\} from '@emotion/css';\n", "", new_content)
    new_content = re.sub(r"import \{[^}]*\} from '@emotion/react';\n", "", new_content)
    new_content = re.sub(r"import \{ type GrafanaTheme2[^}]*\} from '@grafana/data';\n", "", new_content)
    new_content = re.sub(r"\buseStyles2,?\s*", "", new_content)
    new_content = re.sub(r",?\s*useStyles2\b", "", new_content)
    new_content = re.sub(r"import \{ useStyles2 \} from '@grafana/ui';\n", "", new_content)

    # Add imports after first import block
    stylex_import = (
        f"import * as stylex from '@stylexjs/stylex';\n"
        f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
        f"import {{ {export} }} from './{file_path.stem}.stylex';\n"
    )
    if "mergeStylexClassName" not in new_content:
        new_content = re.sub(r"(^import .*\n)", stylex_import + r"\1", new_content, count=1)

    if re.search(r"\bcx\(", new_content) and "import clsx" not in new_content:
        new_content = "import clsx from 'clsx';\n" + new_content

    # Remove useStyles2 calls
    new_content = re.sub(r"\s*const styles = useStyles2\(\w+[^)]*\);\n", "\n", new_content)
    new_content = re.sub(r"\s*const styles = useStyles2\(getStyles[^)]*\);\n", "\n", new_content)
    new_content = re.sub(r"\s*const styles = useStyles2\(getStyles\);\n", "\n", new_content)

    for key, _ in keys:
        new_content = re.sub(
            rf"className=\{{styles\.{key}\}}",
            f"{{...stylex.props({export}.{key})}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{cx\(([^)]*?)styles\.{key}([^)]*?)\)\}}",
            rf"{{...mergeStylexClassName(stylex.props({export}.{key}, \1\2), undefined)}}",
            new_content,
        )

    if keys == [("root",)] or (len(keys) == 1 and keys[0][0] == "root"):
        new_content = re.sub(
            r"className=\{styles\}",
            f"{{...stylex.props({export}.root)}}",
            new_content,
        )

    # utils.ts export getStyles used externally - update to export stylex
    if file_path.name == "utils.ts" and "getStyles" in content:
        new_content = new_content.replace("export const getStyles", f"// migrated to {export}\nexport const getStyles")

    if not dry_run:
        stylex_path.write_text("\n".join(stylex_lines))
        file_path.write_text(new_content)

    print(f"OK {file_path.relative_to(ROOT)}")
    return True


def main():
    dry = "--dry-run" in sys.argv
    files = sorted(CORE.rglob("*.tsx")) + sorted(CORE.rglob("*.ts"))
    count = 0
    for f in files:
        if f.suffix == ".stylex.ts" or f.name.endswith(".stylex.ts"):
            continue
        if migrate_tsx(f, dry_run=dry):
            count += 1
    print(f"Migrated {count} files")


if __name__ == "__main__":
    main()
