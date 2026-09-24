#!/usr/bin/env python3
"""Repair partial StyleX migrations under public/app/core."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CORE = ROOT / "public/app/core"


def repair_tsx(path: Path) -> bool:
    text = path.read_text()
    orig = text

    text = re.sub(r"\n\s*const styles = \(getStyles\);\n", "\n", text)
    text = re.sub(r"import \{ \} from '@grafana/ui';\n", "", text)
    text = re.sub(r", \} from '@grafana/ui'", " } from '@grafana/ui'", text)
    text = re.sub(r"\{ Icon, \}", "{ Icon }", text)
    text = re.sub(r"\{ IconButton, \}", "{ IconButton }", text)

    # Broken cx replacement: stylex.props(X, , styles.Y)
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

    # Remaining styles.foo -> need manual export name guess
    m = re.search(r"from '\./(\w+)\.stylex'", text)
    if m:
        export = m.group(1)[0].lower() + m.group(1)[1:] + "Styles"
        text = re.sub(rf"styles\.(\w+)", rf"{export}.\1", text)
        text = re.sub(
            rf"\.\.\.stylex\.props\({export}\.(\w+)\)",
            rf"...stylex.props({export}.\1)",
            text,
        )

    # Add stylex import if stylex.props used but no import
    if "stylex.props" in text and "import * as stylex" not in text:
        text = "import * as stylex from '@stylexjs/stylex';\n" + text
    if "mergeStylexClassName" in text and "mergeStylexClassName" not in text.split("import")[0]:
        pass
    if "mergeStylexClassName(" in text and "@grafana/ui/unstable" not in text:
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
    if "themeSpacing" not in text:
        return False
    orig = text
    if "from '" in text and "themeSpacing" in text and "import { themeSpacing" not in text:
        rel = path.relative_to(CORE)
        depth = len(rel.parts) - 1
        spacing_import = "./stylex/spacing" if depth == 0 else "../" * depth + "stylex/spacing"
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
    for p in CORE.rglob("*.tsx"):
        if repair_tsx(p):
            print(f"repaired tsx {p.relative_to(ROOT)}")
    for p in CORE.rglob("*.stylex.ts"):
        if repair_stylex(p):
            print(f"repaired stylex {p.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
