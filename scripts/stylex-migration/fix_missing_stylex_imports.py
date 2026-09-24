#!/usr/bin/env python3
"""Add missing co-located .stylex imports when StyleProps are used in TSX."""
from __future__ import annotations

import re
from pathlib import Path

COMPONENTS = Path(__file__).resolve().parents[2] / "packages/grafana-ui/src/components"


def fix_file(tsx: Path) -> bool:
    text = tsx.read_text()
    stylex_path = tsx.with_suffix(".stylex.ts")
    if not stylex_path.exists():
        return False
    stylex_src = stylex_path.read_text()
    m = re.search(r"export function (\w+StyleProps)", stylex_src)
    if not m:
        return False
    props_fn = m.group(1)
    if props_fn not in text:
        return False
    if re.search(rf"from '\./{re.escape(tsx.stem)}\.stylex'", text):
        return False
    export_m = re.search(r"export const (\w+) = stylex\.create", stylex_src)
    symbols = [props_fn]
    if export_m and export_m.group(1) in text:
        symbols.insert(0, export_m.group(1))
    imp = f"import {{ {', '.join(symbols)} }} from './{tsx.stem}.stylex';\n"
    text = text.lstrip("\n")
    text = imp + text
    tsx.write_text(text)
    return True


def prune_stylex_imports(path: Path) -> bool:
    text = path.read_text()
    orig = text
    used_css_var = "cssVar(" in text or "cssVarSpacing(" in text
    if not used_css_var:
        text = re.sub(r"import \{ cssVar, cssVarSpacing \} from '[^']+';\n", "", text)
        text = re.sub(r"import \{ cssVar \} from '[^']+';\n", "", text)
    if "spacingToken(" not in text:
        text = re.sub(r"import \{ spacingToken \} from '[^']+';\n", "", text)
    if text != orig:
        path.write_text(text)
        return True
    return False


def main():
    n = sum(1 for p in COMPONENTS.rglob("*.tsx") if fix_file(p))
    m = sum(1 for p in COMPONENTS.rglob("*.stylex.ts") if prune_stylex_imports(p))
    print(f"Fixed TSX imports in {n} files, pruned stylex imports in {m} files")


if __name__ == "__main__":
    main()
