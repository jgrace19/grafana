#!/usr/bin/env python3
"""Repair StyleX migrations under public/app/plugins."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PLUGINS = ROOT / "public/app/plugins"
APP = ROOT / "public/app"


def spacing_import_path(file_path: Path) -> str:
    rel = file_path.relative_to(APP)
    depth = len(rel.parts) - 1
    return "../" * depth + "core/stylex/spacing"


def repair_stylex(path: Path) -> bool:
    text = path.read_text()
    orig = text
    text = re.sub(
        r"^\s*\[@media([^\]]+)\]:",
        lambda m: f"    '@media{m.group(1)}':",
        text,
        flags=re.M,
    )
    if "themeSpacing" in text and "import { themeSpacing" not in text:
        text = text.replace(
            "import { grafanaTokens } from '@grafana/ui/unstable';",
            "import { grafanaTokens } from '@grafana/ui/unstable';\n\n"
            f"import {{ themeSpacing, themeSpacingShorthand }} from '{spacing_import_path(path)}';",
        )
    if text != orig:
        path.write_text(text)
        return True
    return False


def main() -> None:
    for p in PLUGINS.rglob("*.stylex.ts"):
        if repair_stylex(p):
            print(f"repaired {p.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
