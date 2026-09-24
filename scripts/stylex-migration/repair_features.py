#!/usr/bin/env python3
"""Repair partial StyleX migrations under public/app/features (long tail)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FEATURES = ROOT / "public/app/features"

EXCLUDE_PREFIXES = (
    "alerting/",
    "dashboard-scene/",
    "explore/",
    "dashboard/",
)


def export_from_stylex_import(text: str) -> str | None:
    m = re.search(r"import \{ (\w+) \} from '\./[\w.-]+\.stylex'", text)
    return m.group(1) if m else None


def repair_tsx(path: Path) -> bool:
    text = path.read_text()
    orig = text
    export = export_from_stylex_import(text)
    if not export:
        return False

    text = re.sub(r"\n\s*const styles = \(getStyles\);\n", "\n", text)
    text = re.sub(r"\n\s*const styles = getStyles;\n", "\n", text)
    text = re.sub(r"\n\s*const styles = useStyles2\([^)]+\);\n", "\n", text)

    text = re.sub(r"import \{ \} from '@grafana/ui';\n", "", text)
    text = re.sub(r", \} from '@grafana/ui'", " } from '@grafana/ui'", text)
    text = re.sub(r"\{ Icon, \}", "{ Icon }", text)
    text = re.sub(r"\{ IconButton, \}", "{ IconButton }", text)

    # Broken cx → stylex replacement
    text = re.sub(
        rf"mergeStylexClassName\(stylex\.props\({export}\.(\w+), , {export}\.(\w+)\)",
        rf"mergeStylexClassName(stylex.props({export}.\1, {export}.\2)",
        text,
    )
    text = re.sub(
        rf"stylex\.props\({export}\.(\w+), , {export}\.(\w+)\)",
        rf"stylex.props({export}.\1, {export}.\2)",
        text,
    )
    text = re.sub(
        r"mergeStylexClassName\(stylex\.props\((\w+Styles)\.(\w+), , styles\.(\w+)\)",
        r"mergeStylexClassName(stylex.props(\1.\2, \1.\3)",
        text,
    )
    text = re.sub(
        r"stylex\.props\((\w+Styles)\.(\w+), , styles\.(\w+)\)",
        r"stylex.props(\1.\2, \1.\3)",
        text,
    )
    text = re.sub(
        rf"stylex\.props\({export}\.(\w+), ,\s*",
        rf"stylex.props({export}.\1, ",
        text,
    )

    # styles.key → export.key inside stylex.props / mergeStylexClassName
    text = re.sub(rf"styles\.(\w+)", rf"{export}.\1", text)

    # containerClassName / contentClassName need string class names
    text = re.sub(
        rf"containerClassName=\{{{export}\.(\w+)\}}",
        rf"containerClassName={{mergeStylexClassName(stylex.props({export}.\1), undefined).className}}",
        text,
    )
    text = re.sub(
        rf"contentClassName=\{{{export}\.(\w+)\}}",
        rf"contentClassName={{mergeStylexClassName(stylex.props({export}.\1), undefined).className}}",
        text,
    )

    if "stylex.props" in text and "import * as stylex" not in text:
        text = "import * as stylex from '@stylexjs/stylex';\n" + text
    if "mergeStylexClassName(" in text and "mergeStylexClassName" not in text.split("from '@grafana/ui/unstable'")[0]:
        if "@grafana/ui/unstable" not in text:
            text = re.sub(
                r"(^import .*\n)",
                "import { mergeStylexClassName } from '@grafana/ui/unstable';\n\\1",
                text,
                count=1,
            )

    if text != orig:
        path.write_text(text)
        return True
    return False


def repair_stylex(path: Path) -> bool:
    text = path.read_text()
    if "themeSpacing" not in text or "import { themeSpacing" in text:
        return False
    orig = text
    rel = path.relative_to(FEATURES)
    depth = len(rel.parts)
    spacing_import = "../" * depth + "core/stylex/spacing"
    text = text.replace(
        "import { grafanaTokens } from '@grafana/ui/unstable';",
        "import { grafanaTokens } from '@grafana/ui/unstable';\n\n"
        f"import {{ themeSpacing, themeSpacingShorthand }} from '{spacing_import}';",
    )
    if text != orig:
        path.write_text(text)
        return True
    return False


def main():
    for p in sorted(FEATURES.rglob("*.tsx")) + sorted(FEATURES.rglob("*.ts")):
        rel = p.relative_to(FEATURES).as_posix()
        if any(rel.startswith(ex) for ex in EXCLUDE_PREFIXES):
            continue
        if p.suffix == ".stylex.ts":
            continue
        if repair_tsx(p):
            print(f"repaired tsx {rel}")
    for p in sorted(FEATURES.rglob("*.stylex.ts")):
        rel = p.relative_to(FEATURES).as_posix()
        if any(rel.startswith(ex) for ex in EXCLUDE_PREFIXES):
            continue
        if repair_stylex(p):
            print(f"repaired stylex {rel}")


if __name__ == "__main__":
    main()
