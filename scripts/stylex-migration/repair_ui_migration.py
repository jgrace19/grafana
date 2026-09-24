#!/usr/bin/env python3
"""Fix StyleX syntax in co-located .stylex.ts files after automated migration."""
from __future__ import annotations

import re
from pathlib import Path

COMPONENTS = Path(__file__).resolve().parents[2] / "packages/grafana-ui/src/components"


def repair_stylex(path: Path) -> bool:
    text = path.read_text()
    orig = text
    text = re.sub(
        r"transitionProperty: ((?:'[^']+'(?:, )?)+), transitionDuration:",
        lambda m: f"transitionProperty: [{m.group(1)}], transitionDuration:",
        text,
    )
    text = re.sub(
        r"('(?:&:[^']+|[^']+)': )outline:",
        r"\1{ outline:",
        text,
    )
    text = re.sub(
        r"(boxShadow: `0 0 0 2px \$\{cssVar\('colors\.background\.canvas'\)\}, 0 0 0px 4px \$\{cssVar\('colors\.primary\.main'\)\}`),(\n\s*\})",
        r"\1 },\2",
        text,
    )
    if text != orig:
        path.write_text(text)
        return True
    return False


def main():
    n = sum(1 for p in COMPONENTS.rglob("*.stylex.ts") if repair_stylex(p))
    print(f"Repaired {n} files")


if __name__ == "__main__":
    main()
