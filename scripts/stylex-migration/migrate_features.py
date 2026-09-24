#!/usr/bin/env python3
"""Migrate Emotion styles to StyleX under public/app/features/explore and dashboard."""
from __future__ import annotations

import re
import sys
from pathlib import Path

from migrate_core import extract_get_styles, needs_spacing_import, transform_css_block

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / "public/app"
TARGETS = [
    APP / "features/explore",
    APP / "features/dashboard",
]

STYLE_VAR_NAMES = ("styles", "css", "style", "cardStyles", "pageStyles")
MANUAL_SKIP: set[str] = set()


def stylex_import_depth(file_path: Path) -> str:
    rel = file_path.parent.relative_to(APP)
    depth = len(rel.parts)
    return "../" * depth + "core/stylex/spacing"


def export_name(file_path: Path) -> str:
    base = file_path.stem
    return base[0].lower() + base[1:] + "Styles"


def extract_styles_factory(content: str) -> tuple[str, list[tuple[str, str]]] | None:
    m = re.search(
        r"const getStyles = stylesFactory\(\(theme[^)]*\)\s*=>\s*\(\{([\s\S]*?)\}\)\);",
        content,
    )
    if m:
        keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(1))
        if keys:
            return (m.group(0), keys)
    m = re.search(
        r"const getStyles = stylesFactory\(\(theme[^)]*\)\s*=>\s*\{\s*return\s*\{([\s\S]*?)\};\s*\}\);",
        content,
    )
    if m:
        keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(1))
        if keys:
            return (m.group(0), keys)
    return None


def extract_module_styles(content: str) -> tuple[str, list[tuple[str, str]]] | None:
    m = re.search(r"^const styles = \{\s*([\s\S]*?)\n\};", content, re.M)
    if not m:
        return None
    keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(1))
    if keys:
        return (m.group(0), keys)
    return None


def extract_exported_get_styles(content: str) -> tuple[str, list[tuple[str, str]]] | None:
    m = re.search(r"export const (get\w+) = \(([^)]*)\) => \(\{([\s\S]*?)\}\);", content)
    if not m:
        return None
    keys = re.findall(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(3))
    if keys:
        return (m.group(0), keys)
    return None


def extract_all(content: str) -> tuple[str, list[tuple[str, str]]] | None:
    for fn in (extract_get_styles, extract_styles_factory, extract_exported_get_styles, extract_module_styles):
        if fn is extract_get_styles:
            r = fn(content)
            if r:
                return (r[1], r[2])
        else:
            r = fn(content)
            if r:
                return r
    return None


def clean_ui_imports(content: str) -> str:
    content = re.sub(r"import \{ useStyles2 \} from '@grafana/ui';\n", "", content)
    content = re.sub(
        r"import \{([^}]*),\s*useStyles2\s*,([^}]*)\} from '@grafana/ui';\n",
        r"import {\1,\2} from '@grafana/ui';\n",
        content,
    )
    content = re.sub(
        r"import \{ useStyles2,\s*([^}]+)\} from '@grafana/ui';\n",
        r"import { \1 } from '@grafana/ui';\n",
        content,
    )
    content = re.sub(
        r"import \{([^}]+),\s*useStyles2\} from '@grafana/ui';\n",
        r"import { \1 } from '@grafana/ui';\n",
        content,
    )
    content = re.sub(
        r"import \{ stylesFactory,([^}]*)\} from '@grafana/ui';\n",
        r"import {\1} from '@grafana/ui';\n",
        content,
    )
    content = re.sub(
        r"import \{([^}]*), stylesFactory\} from '@grafana/ui';\n",
        r"import {\1} from '@grafana/ui';\n",
        content,
    )
    content = re.sub(r"import \{ stylesFactory \} from '@grafana/ui';\n", "", content)
    content = re.sub(r"import \{ \} from '@grafana/ui';\n", "", content)
    return content


def remove_style_hooks(content: str) -> str:
    patterns = [
        r"\s*const styles = useStyles2\([^)]*\);\n",
        r"\s*const css = useStyles2\([^)]*\);\n",
        r"\s*const style = useStyles2\([^)]*\);\n",
        r"\s*const cardStyles = useStyles2\([^)]*\);\n",
        r"\s*const styles = getStyles\(\);\n",
        r"\s*const styles = getStyles\(theme\);\n",
        r"\s*const styles = getStyles\(this\.props\.theme\);\n",
        r"\s*const styles = getStyles\(_theme\);\n",
    ]
    for p in patterns:
        content = re.sub(p, "\n", content)
    return content


def replace_classnames(content: str, export: str, keys: list[tuple[str, str]]) -> str:
    for key, _ in keys:
        for var in STYLE_VAR_NAMES:
            content = re.sub(
                rf"className=\{{{var}\.{key}\}}",
                f"{{...stylex.props({export}.{key})}}",
                content,
            )
            content = re.sub(
                rf"className=\{{cx\(([^)]*?){var}\.{key}([^)]*?)\)\}}",
                rf"{{...mergeStylexClassName(stylex.props({export}.{key}, \1\2), undefined)}}",
                content,
            )
            content = re.sub(
                rf"className=\{{clsx\(([^)]*?){var}\.{key}([^)]*?)\)\}}",
                rf"{{...mergeStylexClassName(stylex.props({export}.{key}, \1\2), undefined)}}",
                content,
            )
        content = re.sub(
            rf"\bstyles\.{key}\b",
            f"mergeStylexClassName(stylex.props({export}.{key}), undefined).className",
            content,
        )
    return content


def migrate_tsx(file_path: Path, dry_run: bool = False) -> bool:
    content = file_path.read_text()
    if not re.search(r"@emotion/|useStyles2|stylesFactory", content):
        return False
    if file_path.name in MANUAL_SKIP:
        print(f"SKIP (manual list): {file_path.relative_to(ROOT)}")
        return False

    extracted = extract_all(content)
    if not extracted:
        print(f"SKIP (no getStyles): {file_path.relative_to(ROOT)}")
        return False

    get_styles_src, keys = extracted
    if not keys:
        print(f"SKIP (empty): {file_path.relative_to(ROOT)}")
        return False

    joined = "\n".join(b for _, b in keys)
    if "keyframes" in joined and "css({" not in joined:
        print(f"SKIP (keyframes): {file_path.relative_to(ROOT)}")
        return False
    if file_path.name == "getCardStyles.ts":
        print(f"SKIP (compat export): {file_path.relative_to(ROOT)}")
        return False

    export = export_name(file_path)
    stylex_lines = [
        "import * as stylex from '@stylexjs/stylex';",
        "",
        "import { grafanaTokens } from '@grafana/ui/unstable';",
        "",
    ]
    if needs_spacing_import(keys):
        stylex_lines.append(
            f"import {{ themeSpacing, themeSpacingShorthand }} from '{stylex_import_depth(file_path)}';"
        )
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

    new_content = content.replace(get_styles_src + "\n", "").replace(get_styles_src, "")
    new_content = remove_style_hooks(new_content)

    new_content = re.sub(r"import \{[^}]*\} from '@emotion/css';\n", "", new_content)
    new_content = re.sub(r"import \{[^}]*\} from '@emotion/react';\n", "", new_content)
    new_content = re.sub(
        r"import \{ type GrafanaTheme2(?:,[^}]*)? \} from '@grafana/data';\n", "", new_content
    )
    new_content = clean_ui_imports(new_content)

    uses_cx = "cx(" in new_content
    stylex_import = (
        f"import * as stylex from '@stylexjs/stylex';\n"
        f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
        f"import {{ {export} }} from './{file_path.stem}.stylex';\n"
    )
    if "import * as stylex" not in new_content:
        m = re.search(r"(^import .*\n)", new_content, re.M)
        if m:
            new_content = new_content[: m.start()] + stylex_import + new_content[m.start() :]
        else:
            new_content = stylex_import + new_content

    if uses_cx and "import clsx" not in new_content:
        new_content = "import clsx from 'clsx';\n" + new_content
        new_content = new_content.replace("cx(", "clsx(")

    new_content = replace_classnames(new_content, export, keys)

    if not dry_run:
        file_path.with_suffix(".stylex.ts").write_text("\n".join(stylex_lines))
        file_path.write_text(new_content)

    print(f"OK {file_path.relative_to(ROOT)}")
    return True


def main():
    dry = "--dry-run" in sys.argv
    count = 0
    for target in TARGETS:
        for f in sorted(target.rglob("*.tsx")) + sorted(target.rglob("*.ts")):
            if ".stylex." in f.name or f.name.endswith(".test.tsx") or f.name.endswith(".test.ts"):
                continue
            if migrate_tsx(f, dry_run=dry):
                count += 1
    print(f"Migrated {count} files")


if __name__ == "__main__":
    main()
