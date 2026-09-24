#!/usr/bin/env python3
"""Repair dashboard-scene StyleX migration artifacts."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCENE = ROOT / "public/app/features/dashboard-scene"


def spacing_import_path(file_path: Path) -> str:
    rel = file_path.parent.relative_to(SCENE)
    depth = len(rel.parts)
    return "../" * (depth + 2) + "core/stylex/spacing"


def unwrap_css_in_stylex(text: str) -> str:
    while True:
        new = re.sub(
            r"css\(\{([\s\S]*?)\}\)",
            r"{\1}",
            text,
            count=1,
        )
        if new == text:
            break
        text = new
    return text


def repair_stylex_file(path: Path) -> bool:
    text = path.read_text()
    orig = text
    text = unwrap_css_in_stylex(text)
    if "themeSpacing" in text and "from '" in text and "themeSpacing" not in text.split("stylex.create")[0]:
        if "import { themeSpacing" not in text:
            spacing = spacing_import_path(path)
            text = text.replace(
                "import { grafanaTokens } from '@grafana/ui/unstable';",
                "import { grafanaTokens } from '@grafana/ui/unstable';\n\n"
                f"import {{ themeSpacing, themeSpacingShorthand }} from '{spacing}';",
            )
    if text != orig:
        path.write_text(text)
        return True
    return False


def remove_orphan_get_styles(content: str) -> str:
    # Remove trailing get*Styles blocks that still use css(
    pattern = re.compile(
        r"\n(?:export )?(?:const|function) get\w*Styles?\s*=\s*\([^)]*\)\s*=>\s*\(\{[\s\S]*?css\([\s\S]*?\}\);\s*\n?",
        re.MULTILINE,
    )
    prev = None
    while prev != content:
        prev = content
        content = pattern.sub("\n", content)
    # Also remove blocks with return { ... css
    pattern2 = re.compile(
        r"\n(?:export )?(?:const|function) get\w*Styles?\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?return\s*\{[\s\S]*?css\([\s\S]*?\};\s*\n?\};?\s*\n?",
        re.MULTILINE,
    )
    prev = None
    while prev != content:
        prev = content
        content = pattern2.sub("\n", content)
    return content


def repair_tsx(path: Path) -> bool:
    text = path.read_text()
    orig = text

    text = re.sub(r"\n\s*const styles = \(get\w+\);\n", "\n", text)
    text = re.sub(r"\n\s*const styles = \(get\w+,\s*[^)]+\);\n", "\n", text)
    text = remove_orphan_get_styles(text)

    # Fix empty useStyles2 removal in imports
    text = re.sub(r",\s*\} from '@grafana/ui'", " } from '@grafana/ui'", text)
    text = re.sub(r"\{\s*,", "{", text)
    text = re.sub(r",\s*,", ",", text)

    # styles.foo remaining -> use stylex import
    m = re.search(r"from '\./(\w+)\.stylex'", text)
    if m:
        export = m.group(1)[0].lower() + m.group(1)[1:] + "Styles"
        if export == "stylesStyles":
            export = "styles"
        text = re.sub(rf"\bstyles\.(\w+)", rf"{export}.\1", text)
        text = re.sub(
            rf"className=\{{{export}\.(\w+)\}}",
            rf"{{...stylex.props({export}.\1)}}",
            text,
        )
        text = re.sub(
            rf"containerClassName=\{{{export}\.(\w+)\}}",
            rf"containerClassName={{stylex.props({export}.\1).className}}",
            text,
        )

    if text != orig:
        path.write_text(text)
        return True
    return False


def main():
    for p in SCENE.rglob("*.stylex.ts"):
        if repair_stylex_file(p):
            print(f"stylex {p.relative_to(ROOT)}")
    for p in list(SCENE.rglob("*.tsx")) + list(SCENE.rglob("*.ts")):
        if ".stylex." in p.name or p.name.endswith(".test.ts"):
            continue
        if repair_tsx(p):
            print(f"tsx {p.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
