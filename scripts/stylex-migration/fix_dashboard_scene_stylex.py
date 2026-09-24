#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCENE = ROOT / "public/app/features/dashboard-scene"


def spacing_import_path(file_path: Path) -> str:
    rel = file_path.parent.relative_to(SCENE)
    depth = len(rel.parts)
    return "../" * (depth + 2) + "core/stylex/spacing"


def fix_stylex(path: Path) -> bool:
    text = path.read_text()
    orig = text
    if "themeSpacing" in text and "import { themeSpacing" not in text:
        text = text.replace(
            "import { grafanaTokens } from '@grafana/ui/unstable';",
            "import { grafanaTokens } from '@grafana/ui/unstable';\n\n"
            f"import {{ themeSpacing, themeSpacingShorthand }} from '{spacing_import_path(path)}';",
        )
    # Remove invalid spread remnants
    text = text.replace("...grafanaTokens.", "grafanaTokens.")
    while "css({" in text:
        import re

        text = re.sub(r"css\(\{([\s\S]*?)\}\)", r"{\1}", text, count=1)
    path.write_text(text)
    return text != orig


def fix_tsx(path: Path) -> bool:
    text = path.read_text()
    orig = text
    text = text.replace(", } from '@grafana/ui'", " } from '@grafana/ui'")
    text = text.replace("{,", "{")
    text = text.replace(",,", ",")
    if text != orig:
        path.write_text(text)
        return True
    return False


def main():
    for p in SCENE.rglob("*.stylex.ts"):
        if fix_stylex(p):
            print("fixed", p.relative_to(ROOT))
    for p in SCENE.rglob("*.tsx"):
        fix_tsx(p)


if __name__ == "__main__":
    main()
