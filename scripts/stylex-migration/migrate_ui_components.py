#!/usr/bin/env python3
"""Migrate @grafana/ui components from Emotion useStyles2 patterns to StyleX."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
COMPONENTS = ROOT / "packages/grafana-ui/src/components"

SKIP_FILES = {
    "ThemeDemos/EmotionPerfTest.tsx",
    "Forms/Label.tsx",
    "transitions/FadeTransition.tsx",
    "transitions/SlideOutTransition.tsx",
    "Icon/Icon.tsx",
}

SKIP_SUFFIX = (".story.tsx", ".mdx", ".test.tsx", ".stylex.ts")

# Migrated manually or need custom helpers
SKIP_MANUAL = {
    "Card/Card.tsx",
    "Card/CardContainer.tsx",
    "Button/Button.tsx",
    "Layout/Box/Box.tsx",
    "Layout/Grid/Grid.tsx",
    "Layout/Stack/Stack.tsx",
    "Layout/utils/responsiveness.tsx",
    "Input/Input.tsx",
    "Slider/Slider.tsx",
    "Slider/RangeSlider.tsx",
    "Select/SelectContainer.tsx",
    "Select/InputControl.tsx",
    "Select/IndicatorsContainer.tsx",
    "Select/SelectMenu.tsx",
    "Select/ValueContainer.tsx",
    "Combobox/Combobox.tsx",
    "Combobox/MultiCombobox.tsx",
    "Combobox/ComboboxList.tsx",
    "BarGauge/BarGauge.tsx",
    "BigValue/BigValue.tsx",
}

UNSAFE_IN_BLOCK = [
    "keyframes",
    "css([",
    "Object.fromEntries",
    "Array.from",
    "stylesFactory",
    "tinycolor",
    "getIntermediateValue",
    "theme.visualization",
    "theme.colors.getContrast",
]


def themes_rel(file_path: Path) -> str:
    rel = file_path.relative_to(COMPONENTS)
    depth = len(rel.parts) - 1
    return "../" * (depth + 1) + "themes/stylex/"


def export_name(file_path: Path) -> str:
    base = file_path.stem
    return base[0].lower() + base[1:] + "Styles"


def style_props_fn(file_path: Path) -> str:
    base = file_path.stem
    return base[0].lower() + base[1:] + "StyleProps"


def spacing_expr(args: str) -> str:
    parts = [p.strip() for p in args.split(",")]
    if len(parts) == 1:
        p = parts[0]
        if re.match(r"^['\"]", p):
            return p
        return f"spacingToken({p})"
    return f"cssVarSpacing({', '.join(parts)})"


def transform_css_block(block: str) -> str:
    out = block
    out = re.sub(
        r"theme\.breakpoints\.down\(['\"](\w+)['\"]\)",
        lambda m: f"'@media (max-width: 543.95px)'",
        out,
    )
    out = re.sub(r"theme\.spacing\(([^)]+)\)", lambda m: spacing_expr(m.group(1)), out)
    out = re.sub(
        r"theme\.colors\.emphasize\(([^,]+),\s*([^)]+)\)",
        lambda m: f"color-mix(in srgb, {m.group(1).strip()} calc(100% + {m.group(2).strip()} * 100%), white)",
        out,
    )
    out = re.sub(r"theme\.colors\.([\w.]+)", lambda m: f"cssVar('colors.{m.group(1)}')", out)
    out = re.sub(r"theme\.shape\.([\w.]+)", lambda m: f"cssVar('shape.{m.group(1)}')", out)
    out = re.sub(r"theme\.typography\.([\w.]+)", lambda m: f"cssVar('typography.{m.group(1)}')", out)
    out = re.sub(r"theme\.shadows\.([\w.]+)", lambda m: f"cssVar('shadows.{m.group(1)}')", out)
    out = re.sub(r"theme\.zIndex\.([\w.]+)", lambda m: f"cssVar('zIndex.{m.group(1)}')", out)
    out = re.sub(
        r"theme\.transitions\.duration\.([\w.]+)",
        lambda m: f"cssVar('transitions.duration.{m.group(1)}')",
        out,
    )
    out = re.sub(
        r"\.\.\.getFocusStyles\(theme\)",
        "outline: '2px dotted transparent', outlineOffset: '2px', boxShadow: `0 0 0 2px ${cssVar('colors.background.canvas')}, 0 0 0px 4px ${cssVar('colors.primary.main')}`",
        out,
    )
    out = re.sub(
        r"getFocusStyles\(theme\)",
        "outline: '2px dotted transparent', outlineOffset: '2px', boxShadow: `0 0 0 2px ${cssVar('colors.background.canvas')}, 0 0 0px 4px ${cssVar('colors.primary.main')}`",
        out,
    )
    replacements = [
        ("'&:hover'", "':hover'"),
        ("'&:focus'", "':focus'"),
        ("'&:focus-visible'", "':focus-visible'"),
        ("'&:active'", "':active'"),
        ("'&:disabled'", "':disabled'"),
        ("'&:nth-last-child(2)'", "':nth-last-child(2)'"),
        ("'&:last-child'", "':last-child'"),
        ("'&:first-child'", "':first-child'"),
        ("'& > div'", "' > div'"),
        ("'& > img'", "' > img'"),
        ("'&::after'", "'::after'"),
        ("'&:after'", "'::after'"),
        ("'&::before'", "'::before'"),
        ("'&:before'", "'::before'"),
        ("'& input[readonly]'", "' input[readonly]'"),
        ("'&:empty'", "':empty'"),
        ("'&:checked + span'", "':checked + span'"),
        ("'> img'", "' > img'"),
        ("'& svg'", "' svg'"),
        ("'& path'", "' path'"),
    ]
    for a, b in replacements:
        out = out.replace(a, b)
    out = re.sub(
        r"\[theme\.transitions\.handleMotion\([^)]+\)\]:",
        "'@media (prefers-reduced-motion: no-preference)':",
        out,
    )
    out = re.sub(
        r"transition:\s*theme\.transitions\.create\(\[([^\]]+)\],\s*\{[^}]+\}\),?",
        lambda m: f"transitionProperty: {m.group(1)}, transitionDuration: cssVar('transitions.duration.short'),",
        out,
    )
    out = re.sub(r"\.\.\.\([^)]+\)", "/* dynamic spread removed */", out)
    out = re.sub(r"\.\.\.\(\s*![^)]+\)", "/* conditional spread removed */", out)
    out = re.sub(
        r"`([^`]*)\$\{theme\.colors\.([\w.]+)\}([^`]*)`",
        lambda m: f"`{m.group(1)}${{cssVar('colors.{m.group(2)}')}}{m.group(3)}`",
        out,
    )
    out = re.sub(
        r"`([^`]*)\$\{theme\.spacing\(([^)]+)\)\}([^`]*)`",
        lambda m: f"`{m.group(1)}${{{spacing_expr(m.group(2))}}}{m.group(3)}`",
        out,
    )
    return out


def extract_css_keys(body: str) -> list[tuple[str, str]]:
    keys: list[tuple[str, str]] = []
    pos = 0
    while pos < len(body):
        m = re.search(r"(\w+):\s*css\(\s*\{", body[pos:])
        if not m:
            break
        key = m.group(1)
        brace_start = pos + m.end() - 1
        depth = 0
        j = brace_start
        while j < len(body):
            ch = body[j]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        inner = body[brace_start + 1 : j]
        keys.append((key, inner))
        pos = j + 1
    return keys


def extract_style_functions(content: str) -> list[tuple[str, list[tuple[str, str]]]]:
    results: list[tuple[str, list[tuple[str, str]]]] = []
    for m in re.finditer(
        r"(export const get\w+Styles|const get\w+Styles|const getStyles)\s*=\s*\([^)]*\)\s*(?:=>|:)\s*(?:\(\s*)?\{",
        content,
    ):
        fn_start = m.start()
        fn_name = m.group(1)
        brace = content.find("{", m.end() - 1)
        depth = 0
        j = brace
        while j < len(content):
            if content[j] == "{":
                depth += 1
            elif content[j] == "}":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        full = content[fn_start : j + 1]
        body = content[brace + 1 : j]
        keys = extract_css_keys(body)
        if keys:
            results.append((full, keys))
    return results


def migrate_tsx(file_path: Path, dry_run: bool = False) -> bool:
    rel = file_path.relative_to(COMPONENTS)
    if str(rel) in SKIP_FILES or str(rel) in SKIP_MANUAL or rel.name.endswith(SKIP_SUFFIX):
        return False

    content = file_path.read_text()
    if not re.search(r"@emotion/", content):
        return False
    if not re.search(r"useStyles2\(", content) and not re.search(
        r"const get\w+Styles = \(theme", content
    ):
        return False

    style_fns = extract_style_functions(content)
    if not style_fns:
        return False

    all_keys: list[tuple[str, str]] = []
    for _, keys in style_fns:
        all_keys.extend(keys)

    joined = "\n".join(b for _, b in all_keys)
    if any(marker in joined or marker in content for marker in UNSAFE_IN_BLOCK):
        return False

    export = export_name(file_path)
    props_fn = style_props_fn(file_path)
    themes = themes_rel(file_path)

    transformed_blocks = [transform_css_block(b) for _, b in all_keys]
    if any("theme." in t or "getFocusStyles" in t for t in transformed_blocks):
        return False

    stylex_lines = [
        "import * as stylex from '@stylexjs/stylex';",
        "",
        f"import {{ cssVar, cssVarSpacing }} from '{themes}cssVar';",
        f"import {{ spacingToken }} from '{themes}spacingTokens';",
        "",
        f"export const {export} = stylex.create({{",
    ]
    seen_keys: set[str] = set()
    for (key, _), transformed in zip(all_keys, transformed_blocks, strict=True):
        if key in seen_keys:
            continue
        seen_keys.add(key)
        indented = "\n".join("    " + line for line in transformed.strip().splitlines())
        stylex_lines.append(f"  {key}: {{")
        stylex_lines.append(indented)
        stylex_lines.append("  },")
    stylex_lines.append("});")
    stylex_lines.append("")
    stylex_lines.append(f"export function {props_fn}(key: keyof typeof {export}) {{")
    stylex_lines.append(f"  return stylex.props({export}[key]);")
    stylex_lines.append("}")
    stylex_lines.append("")

    stylex_path = file_path.with_suffix(".stylex.ts")
    new_content = content

    for full, _ in style_fns:
        new_content = new_content.replace(full + "\n", "")
        new_content = new_content.replace(full, "")

    new_content = re.sub(
        r"const get\w*Styles = \(theme[^)]*\) => \(\{[\s\S]*?\}\);\n?",
        "",
        new_content,
    )

    new_content = re.sub(r"import \{[^}]*\} from '@emotion/css';\n", "", new_content)
    new_content = re.sub(r"import \{[^}]*\} from '@emotion/react';\n", "", new_content)
    new_content = re.sub(r"import \{ type GrafanaTheme2[^}]*\} from '@grafana/data';\n", "", new_content)
    new_content = re.sub(r"import \{[^}]*getFocusStyles[^}]*\} from '[^']+mixins';\n", "", new_content)

    stylex_import = (
        f"import * as stylex from '@stylexjs/stylex';\n\n"
        f"import {{ mergeStylexClassName }} from '{themes}mergeClassNames';\n"
        f"import {{ {export}, {props_fn} }} from './{file_path.stem}.stylex';\n\n"
    )
    if "@stylexjs/stylex" not in new_content:
        new_content = re.sub(r"(^import .*\n)", stylex_import + r"\1", new_content, count=1)

    new_content = re.sub(r"import \{\s*useStyles2\s*\} from '[^']+ThemeContext';\n", "", new_content)
    new_content = re.sub(
        r"import \{\s*useStyles2,\s*useTheme2\s*\} from '[^']+ThemeContext';\n",
        lambda m: "import { useTheme2 } from '../../themes/ThemeContext';\n",
        new_content,
    )
    new_content = re.sub(r"\s*const styles = useStyles2\([^)]+\);\n", "\n", new_content)
    new_content = re.sub(r"\s*const \{([^}]+)\} = useStyles2\([^)]+\);\n", "\n", new_content)

    for key in seen_keys:
        new_content = re.sub(rf"\bstyles\.{key}\b", f"{props_fn}('{key}')", new_content)
        new_content = re.sub(
            rf"className=\{{{props_fn}\('{key}'\)\}}",
            f"{{...{props_fn}('{key}')}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{cx\({props_fn}\('{key}'\),\s*className\)\}}",
            f"{{...mergeStylexClassName({props_fn}('{key}'), className)}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{cx\(className,\s*{props_fn}\('{key}'\)\)\}}",
            f"{{...mergeStylexClassName({props_fn}('{key}'), className)}}",
            new_content,
        )
        new_content = re.sub(
            rf"mergeStylexClassName\(\[{props_fn}\('{key}'\), className\]\)",
            f"mergeStylexClassName({props_fn}('{key}'), className)",
            new_content,
        )

    if re.search(r"\bcx\(", new_content) and "from 'clsx'" not in new_content:
        new_content = "import clsx from 'clsx';\n" + new_content
    if re.search(r"\bcx\(", new_content):
        new_content = re.sub(r"\bcx\(", "clsx(", new_content)
    new_content = re.sub(r"import \{ css, cx \} from '@emotion/css';\n", "", new_content)
    new_content = re.sub(r"import \{ cx, css \} from '@emotion/css';\n", "", new_content)
    new_content = re.sub(r"import \{ cx \} from '@emotion/css';\n", "", new_content)

    if not dry_run:
        stylex_path.write_text("\n".join(stylex_lines))
        file_path.write_text(new_content)

    print(f"OK {rel}")
    return True


def main():
    dry = "--dry-run" in sys.argv
    files = sorted(COMPONENTS.rglob("*.tsx"))
    count = 0
    for f in files:
        if migrate_tsx(f, dry_run=dry):
            count += 1
    print(f"Migrated {count} files")


if __name__ == "__main__":
    main()
