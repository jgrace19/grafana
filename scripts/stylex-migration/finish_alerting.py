#!/usr/bin/env python3
"""Finish alerting StyleX migration: shared styles consumers + straggler patterns."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ALERTING = ROOT / "public/app/features/alerting"

# Run core migrate on remaining
import subprocess

subprocess.run(["python3", str(ROOT / "scripts/stylex-migration/migrate_alerting.py")], check=False)

SHARED_REPLACEMENTS = [
    (
        r"import \{ getNotificationsTextColors \} from '([^']+notifications)';\n",
        r"import * as stylex from '@stylexjs/stylex';\nimport { notificationsStyles } from '\1.stylex';\nimport { AlertState } from 'app/plugins/datasource/alertmanager/types';\n\nconst notificationStateStyle = {\n  [AlertState.Active]: notificationsStyles.AlertState_Active,\n  [AlertState.Suppressed]: notificationsStyles.AlertState_Suppressed,\n  [AlertState.Unprocessed]: notificationsStyles.AlertState_Unprocessed,\n} as const;\n",
    ),
    (r"\s*const textStyles = useStyles2\(getNotificationsTextColors\);\n", "\n"),
    (r"className=\{textStyles\[state as AlertState\]\}", "{...stylex.props(notificationStateStyle[state as AlertState])}"),
    (
        r"import \{ getAlertTableStyles \} from '([^']+table)';\n",
        r"import * as stylex from '@stylexjs/stylex';\nimport { tableStyles } from '\1.stylex';\n",
    ),
    (r"\s*const tableStyles = useStyles2\(getAlertTableStyles\);\n", "\n"),
    (r"className=\{tableStyles\.(\w+)\}", r"{...stylex.props(tableStyles.\1)}"),
    (
        r"import \{ getPaginationStyles \} from '([^']+pagination)';\n",
        r"import * as stylex from '@stylexjs/stylex';\nimport { paginationStyles } from '\1.stylex';\n",
    ),
    (r"\s*const defaultPaginationStyles = useStyles2\(getPaginationStyles\);\n", "\n"),
    (r"\s*const paginationStyles = useStyles2\(getPaginationStyles\);\n", "\n"),
    (r"defaultPaginationStyles", "paginationStyles"),
    (
        r"import \{ getFormStyles \} from '([^']+formStyles)';\n",
        r"import * as stylex from '@stylexjs/stylex';\nimport { formStyles } from '\1.stylex';\n",
    ),
    (r"\s*const formStyles = useStyles2\(getFormStyles\);\n", "\n"),
    (r"\s*const styles = useStyles2\(getFormStyles\);\n", "\n"),
    (r"className=\{formStyles\.(\w+)\}", r"{...stylex.props(formStyles.\1)}"),
    (r"className=\{styles\.(\w+)\}", r"{...stylex.props(formStyles.\1)}"),
    (r"className=\{paginationStyles\}", r"{...stylex.props(paginationStyles.root)}"),
    (r"className=\{defaultPaginationStyles\}", r"{...stylex.props(paginationStyles.root)}"),
]

# Fix formStyles export name
form_stylex = ALERTING / "unified/components/notification-policies/formStyles.stylex.ts"
if form_stylex.exists():
    t = form_stylex.read_text()
    t = t.replace("export const formStylesStyles", "export const formStyles")
    form_stylex.write_text(t)


def migrate_pagination():
    path = ALERTING / "unified/styles/pagination.ts"
    if not path.exists() or "@emotion" not in path.read_text():
        return
    stylex_path = path.with_suffix(".stylex.ts")
    stylex_path.write_text(
        """import * as stylex from '@stylexjs/stylex';

import { themeSpacing, themeSpacingShorthand } from '../stylex/spacing';

export const paginationStyles = stylex.create({
  root: {
    float: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    margin: themeSpacingShorthand(2, 0),
  },
});
"""
    )
    path.unlink()
    print("migrated pagination.ts")


def fix_alert_rule_menu():
    path = ALERTING / "unified/components/rule-viewer/AlertRuleMenu.tsx"
    if not path.exists():
        return
    t = path.read_text()
    t = t.replace(
        "import { type PropsOf } from '@emotion/react';\n",
        "import { type ComponentProps } from 'react';\n",
    )
    t = re.sub(r"PropsOf<(\w+)>", r"ComponentProps<typeof \1>", t)
    path.write_text(t)


def apply_shared_replacements():
    for f in ALERTING.rglob("*.tsx"):
        text = f.read_text()
        orig = text
        for pat, repl in SHARED_REPLACEMENTS:
            text = re.sub(pat, repl, text)
        text = re.sub(r"import \{ useStyles2 \} from '@grafana/ui';\n", "", text)
        text = re.sub(r", useStyles2", "", text)
        text = re.sub(r"useStyles2, ", "", text)
        if text != orig:
            f.write_text(text)
            print(f"updated {f.relative_to(ROOT)}")


def strip_orphan_emotion_imports():
    for f in list(ALERTING.rglob("*.tsx")) + list(ALERTING.rglob("*.ts")):
        if ".stylex." in f.name:
            continue
        text = f.read_text()
        if "@emotion" not in text:
            continue
        if ".stylex" in text or "stylex.props" in text:
            text = re.sub(r"import \{[^}]*\} from '@emotion/css';\n", "", text)
            text = re.sub(r"import \{ type GrafanaTheme2[^}]*\} from '@grafana/data';\n", "", text)
            f.write_text(text)
            print(f"stripped emotion import {f.relative_to(ROOT)}")


migrate_pagination()
fix_alert_rule_menu()
apply_shared_replacements()
subprocess.run(["python3", str(ROOT / "scripts/stylex-migration/migrate_alerting.py")], check=False)
subprocess.run(["python3", str(ROOT / "scripts/stylex-migration/repair_alerting.py")], check=False)
strip_orphan_emotion_imports()

remaining = [
    p for p in ALERTING.rglob("*") if p.suffix in (".ts", ".tsx") and "@emotion" in p.read_text()
]
print(f"Remaining @emotion files: {len(remaining)}")
for p in remaining:
    print(f"  {p.relative_to(ROOT)}")
