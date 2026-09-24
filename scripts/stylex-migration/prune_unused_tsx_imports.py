#!/usr/bin/env python3
"""Remove unused StyleX-related imports from migrated component TSX files."""
from __future__ import annotations

import re
from pathlib import Path

COMPONENTS = Path(__file__).resolve().parents[2] / "packages/grafana-ui/src/components"


def prune_tsx(path: Path) -> bool:
    if not path.with_suffix(".stylex.ts").exists():
        return False
    text = path.read_text()
    orig = text

    if "stylex.props(" not in text and "stylex.create(" not in text:
        text = re.sub(r"import \* as stylex from '@stylexjs/stylex';\n", "", text)
    if "mergeStylexClassName(" not in text:
        text = re.sub(
            r"import \{ mergeStylexClassName \} from '[^']+mergeClassNames';\n",
            "",
            text,
        )
    for m in re.finditer(r"import \{([^}]+)\} from '\./[^']+\.stylex';", text):
        symbols = [s.strip() for s in m.group(1).split(",")]
        kept = [s for s in symbols if re.search(rf"\b{s}\b", text.replace(m.group(0), ""))]
        if not kept:
            text = text.replace(m.group(0) + "\n", "")
        elif kept != symbols:
            text = text.replace(m.group(0), f"import {{ {', '.join(kept)} }} from './{path.stem}.stylex'")
    if text != orig:
        path.write_text(text)
        return True
    return False


def main():
    n = sum(1 for p in COMPONENTS.rglob("*.tsx") if prune_tsx(p))
    print(f"Pruned {n} TSX files")


if __name__ == "__main__":
    main()
