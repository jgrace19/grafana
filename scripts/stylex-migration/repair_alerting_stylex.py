#!/usr/bin/env python3
"""Fix alerting StyleX migration artifacts."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ALERTING = ROOT / "public/app/features/alerting"


def ensure_stylex_import(path: Path, export: str) -> None:
    text = path.read_text()
    stylex_file = path.with_suffix(".stylex.ts")
    if not stylex_file.exists():
        return
    if f"from './{path.stem}.stylex'" in text:
        return
    block = (
        f"import * as stylex from '@stylexjs/stylex';\n"
        f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
        f"import {{ {export} }} from './{path.stem}.stylex';\n"
    )
    if "import * as stylex" not in text:
        text = re.sub(r"(^import .*\n)", block + r"\1", text, count=1)
    elif f"{export}" not in text:
        text = text.replace(
            "import * as stylex from '@stylexjs/stylex';\n",
            f"import * as stylex from '@stylexjs/stylex';\nimport {{ {export} }} from './{path.stem}.stylex';\n",
        )
    path.write_text(text)


def repair_file(path: Path) -> bool:
    text = path.read_text()
    orig = text
    export = path.stem[0].lower() + path.stem[1:] + "Styles"

    text = re.sub(r"\n\s*const style = useStyles2\([^)]+\);\n", "\n", text)
    text = re.sub(r"\n\s*const styles = useStyles2\([^)]+\);\n", "\n", text)
    text = re.sub(r",?\s*useStyles2,?", "", text)
    text = re.sub(r"\buseStyles2\b", "", text)
    text = re.sub(r"import \{ \} from '@grafana/ui';\n", "", text)
    text = re.sub(r", \} from '@grafana/ui'", " } from '@grafana/ui'", text)

    if path.stem == "DashboardPicker":
        text = text.replace("formStyles.", f"{export}.")
        ensure_stylex_import(path, export)

    stylex_path = path.with_suffix(".stylex.ts")
    if stylex_path.exists() and export not in text and "stylex.props" in text:
        ensure_stylex_import(path, export)
        text = path.read_text()

    # className={stylex.props(...)} is wrong — should spread
    text = re.sub(
        r"className=\{(stylex\.props\([^)]+\))\}",
        r"{...\1}",
        text,
    )
    text = re.sub(
        r"className=\{cx\((stylex\.props\([^)]+\)),",
        r"{...mergeStylexClassName(\1,",
        text,
    )

    text = re.sub(r"\n;\n", "\n", text)

    if text != orig:
        path.write_text(text)
        return True
    return False


def main():
    n = 0
    for f in sorted(ALERTING.rglob("*.tsx")):
        if repair_file(f):
            n += 1
            print(f"fixed {f.relative_to(ROOT)}")
    print(f"fixed {n} files")


if __name__ == "__main__":
    main()
