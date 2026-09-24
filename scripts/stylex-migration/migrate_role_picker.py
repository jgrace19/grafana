#!/usr/bin/env python3
"""Migrate RolePicker components from useStyles2(getStyles) to rolePickerStyles."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RP = ROOT / "public/app/core/components/RolePicker"

IMPORT_BLOCK = """import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { rolePickerStyles } from './styles.stylex';
"""

files = list(RP.glob("*.tsx"))

for path in files:
    text = path.read_text()
    if "getStyles" not in text and "useStyles2" not in text and "@emotion" not in text:
        continue
    if path.name == "RolePickerInput.tsx":
        continue  # custom getRolePickerInputStyles

    text = re.sub(r"import \{[^}]*\} from '@emotion/css';\n", "", text)
    text = re.sub(r", useStyles2", "", text)
    text = re.sub(r"useStyles2, ", "", text)
    text = re.sub(r"import \{ getStyles \} from '\./styles';\n", "", text)
    text = re.sub(r"\s*const (?:customStyles|styles) = useStyles2\(getStyles\);\n", "\n", text)

    if "rolePickerStyles" not in text:
        text = re.sub(r"(^import .*\n)", IMPORT_BLOCK + r"\1", text, count=1)

    text = re.sub(r"customStyles\.(\w+)", r"rolePickerStyles.\1", text)
    # className={customStyles.foo} already replaced; fix className={rolePickerStyles.foo}
    text = re.sub(
        r"className=\{(rolePickerStyles\.\w+)\}",
        r"{...stylex.props(\1)}",
        text,
    )
    text = re.sub(r"\{ \[rolePickerStyles\.(\w+)\]: (\w+) \}", r"stylex.props(\2 && rolePickerStyles.\1)", text)

    path.write_text(text)
    print("updated", path.name)
