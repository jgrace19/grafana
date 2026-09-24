#!/usr/bin/env python3
"""Finish remaining Emotion → StyleX migrations in explore/dashboard."""
from __future__ import annotations

import re
import sys
from pathlib import Path

from migrate_core import needs_spacing_import, transform_css_block

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / "public/app"
TARGETS = [APP / "features/explore", APP / "features/dashboard"]


def spacing_import(file_path: Path) -> str:
    rel = file_path.parent.relative_to(APP)
    return "../" * len(rel.parts) + "core/stylex/spacing"


def export_name(file_path: Path) -> str:
    b = file_path.stem
    return b[0].lower() + b[1:] + "Styles"


def write_stylex(path: Path, export: str, keys: list[tuple[str, str]]) -> None:
    lines = [
        "import * as stylex from '@stylexjs/stylex';",
        "",
        "import { grafanaTokens } from '@grafana/ui/unstable';",
        "",
    ]
    if needs_spacing_import(keys):
        lines.append(f"import {{ themeSpacing, themeSpacingShorthand }} from '{spacing_import(path)}';")
        lines.append("")
    lines.append(f"export const {export} = stylex.create({{")
    for key, block in keys:
        t = transform_css_block(block)
        ind = "\n".join("    " + ln for ln in t.strip().splitlines())
        lines.append(f"  {key}: {{")
        lines.append(ind)
        lines.append("  },")
    lines.append("});")
    lines.append("")
    path.with_suffix(".stylex.ts").write_text("\n".join(lines))


def ensure_stylex_imports(content: str, file_path: Path, export: str) -> str:
    imp = (
        f"import * as stylex from '@stylexjs/stylex';\n"
        f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
        f"import {{ {export} }} from './{file_path.stem}.stylex';\n"
    )
    if "import * as stylex" not in content:
        m = re.search(r"(^import .*\n)", content, re.M)
        content = (content[: m.start()] + imp + content[m.start() :]) if m else imp + content
    content = re.sub(r"import \{[^}]*\} from '@emotion/css';\n", "", content)
    content = re.sub(r"import \{[^}]*\} from '@emotion/react';\n", "", content)
    return content


def migrate_file(path: Path) -> bool:
    content = path.read_text()
    if "@emotion" not in content:
        return False

    export = export_name(path)
    keys: list[tuple[str, str]] = []
    remove_chunks: list[str] = []

    # function getX that returns single css({})
    m = re.search(r"function (get\w+)\([^)]*\)\s*\{\s*return css\(\{([\s\S]*?)\}\);\s*\}", content)
    if m:
        keys = [("root", m.group(2))]
        remove_chunks.append(m.group(0))

    # const fooStyles = css({...});
    for m in re.finditer(r"const (\w+) = css\(\{([\s\S]*?)\}\);", content):
        if m.group(1) in ("drawerSlide",):
            continue
        keys.append((m.group(1)[0].lower() + m.group(1)[1:], m.group(2)))
        remove_chunks.append(m.group(0))

    # export const styles = { x: css({}) }
    m = re.search(r"export const styles = \{\s*([\s\S]*?)\n\};", content)
    if m:
        for km in re.finditer(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(1)):
            keys.append((km.group(1), km.group(2)))
        remove_chunks.append(m.group(0))

    # function getLabelStyles
    m = re.search(r"function getLabelStyles\([^)]*\)\s*\{\s*return\s*\{\s*([\s\S]*?)\};\s*\}", content)
    if m:
        for km in re.finditer(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(1)):
            keys.append((km.group(1), km.group(2)))
        remove_chunks.append(m.group(0))

    # stylesFactory without theme
    m = re.search(r"const getStyles = stylesFactory\(\(\)\s*=>\s*\(\{([\s\S]*?)\}\)\);", content)
    if m:
        for km in re.finditer(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(1)):
            keys.append((km.group(1), km.group(2)))
        remove_chunks.append(m.group(0))

    # exported stylesFactory getStyles
    m = re.search(
        r"export const getStyles = stylesFactory\(\(\)\s*=>\s*\{\s*return\s*\{([\s\S]*?)\};\s*\}\);",
        content,
    )
    if m:
        for km in re.finditer(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(1)):
            keys.append((km.group(1), km.group(2)))
        remove_chunks.append(m.group(0))

    # getStyles in TransformationPickerNg at end
    m = re.search(r"const getStyles = \(theme[^)]*\) => \(\{([\s\S]*?)\}\);", content)
    if m and not keys:
        for km in re.finditer(r"(\w+):\s*css\(\{([\s\S]*?)\}\)", m.group(1)):
            keys.append((km.group(1), km.group(2)))
        remove_chunks.append(m.group(0))

    if not keys:
        print(f"SKIP {path.relative_to(ROOT)}")
        return False

    joined = "\n".join(b for _, b in keys)
    if "autoColor(" in joined or "keyframes" in joined:
        print(f"SKIP complex {path.relative_to(ROOT)}")
        return False

    write_stylex(path, export, keys)
    new = content
    for chunk in remove_chunks:
        new = new.replace(chunk + "\n", "").replace(chunk, "")

    new = re.sub(r"\s*const styles = useStyles2\(getLabelStyles\);\n", "\n", new)
    new = re.sub(r"\s*const styles = useStyles2\(getStyles[^)]*\);\n", "\n", new)
    new = re.sub(r"\s*const cardStyles = useStyles2\(getCardStyles\);\n", "\n", new)
    new = re.sub(r"\s*const styles = getStyles\(\);\n", "\n", new)
    new = re.sub(r"\s*const styles = getStyles\([^)]*\);\n", "\n", new)
    new = clean_ui_imports(new)
    new = ensure_stylex_imports(new, path, export)

    for key, _ in keys:
        new = re.sub(rf"className=\{{styles\.{key}\}}", f"{{...stylex.props({export}.{key})}}", new)
        new = re.sub(rf"className=\{{{key}\}}", f"{{...stylex.props({export}.{key})}}", new)
        new = re.sub(
            rf"className=\{{css\(\{{([\s\S]*?)\}}\)\}}",
            f"{{...stylex.props({export}.{key})}}",
            new,
            count=1,
        )
        new = re.sub(rf"modalClass: modalStyles", f"modalClass: mergeStylexClassName(stylex.props({export}.modalStyles), undefined).className", new)
        new = re.sub(rf"className=\{{containerStyles}}", f"{{...stylex.props({export}.containerStyles)}}", new)

    if keys == [("root",)] or (len(keys) == 1 and keys[0][0] == "root"):
        new = re.sub(r"className=\{styles\}", f"{{...stylex.props({export}.root)}}", new)
        new = re.sub(r"className=\{cardStyles\}", f"{{...stylex.props({export}.root)}}", new)

    path.write_text(new)
    print(f"OK {path.relative_to(ROOT)}")
    return True


def clean_ui_imports(content: str) -> str:
    content = re.sub(r"import \{ useStyles2 \} from '@grafana/ui';\n", "", content)
    content = re.sub(r"import \{([^}]*),\s*useStyles2\s*,([^}]*)\} from '@grafana/ui';\n", r"import {\1,\2} from '@grafana/ui';\n", content)
    content = re.sub(r"import \{ useStyles2,\s*([^}]+)\} from '@grafana/ui';\n", r"import { \1 } from '@grafana/ui';\n", content)
    content = re.sub(r"import \{([^}]+),\s*useStyles2\} from '@grafana/ui';\n", r"import { \1 } from '@grafana/ui';\n", content)
    content = re.sub(r"import \{ stylesFactory,([^}]*)\} from '@grafana/ui';\n", r"import {\1} from '@grafana/ui';\n", content)
    content = re.sub(r"import \{([^}]*), stylesFactory\} from '@grafana/ui';\n", r"import {\1} from '@grafana/ui';\n", content)
    content = re.sub(r"import \{ stylesFactory \} from '@grafana/ui';\n", "", content)
    return content


def main():
    n = 0
    for target in TARGETS:
        for f in sorted(target.rglob("*.tsx")) + sorted(target.rglob("*.ts")):
            if ".stylex." in f.name or f.name.endswith(".test.tsx"):
                continue
            if migrate_file(f):
                n += 1
    print(f"Finished {n}")


if __name__ == "__main__":
    main()
