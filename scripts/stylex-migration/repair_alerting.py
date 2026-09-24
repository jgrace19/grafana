#!/usr/bin/env python3
"""Repair partial StyleX migrations under public/app/features/alerting."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ALERTING = ROOT / "public/app/features/alerting"


def repair_tsx(path: Path) -> bool:
    text = path.read_text()
    orig = text

    text = re.sub(r"\n\s*const styles = \(getStyles\);\n", "\n", text)
    text = re.sub(r"\n\s*const styles = \(get\w+\);\n", "\n", text)
    text = re.sub(r"\n\s*const \w+ = \(get\w+\);\n", "\n", text)

    m = re.search(r"from '\./(\w+)\.stylex'", text)
    if m:
        export = m.group(1)[0].lower() + m.group(1)[1:] + "Styles"
        text = re.sub(rf"styles\.(\w+)", rf"{export}.\1", text)
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

    if "stylex.props" in text and "import * as stylex" not in text:
        text = "import * as stylex from '@stylexjs/stylex';\n" + text
    if "mergeStylexClassName(" in text and "@grafana/ui/unstable" not in text:
        text = re.sub(
            r"(^import .*\n)",
            "import { mergeStylexClassName } from '@grafana/ui/unstable';\n\\1",
            text,
            count=1,
        )

    text = re.sub(r"import \{ \} from '@grafana/ui';\n", "", text)

    if text != orig:
        path.write_text(text)
        return True
    return False


def main():
    n = 0
    for f in sorted(ALERTING.rglob("*.tsx")) + sorted(ALERTING.rglob("*.ts")):
        if ".stylex." in f.name:
            continue
        if repair_tsx(f):
            n += 1
            print(f"repaired {f.relative_to(ROOT)}")
    print(f"Repaired {n} files")


if __name__ == "__main__":
    main()
