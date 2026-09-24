#!/usr/bin/env python3
"""Finish remaining dashboard-scene StyleX migrations."""
from __future__ import annotations

import re
from pathlib import Path

import importlib.util

ROOT = Path("/workspace")
SCENE = ROOT / "public/app/features/dashboard-scene"

spec = importlib.util.spec_from_file_location(
    "mig", ROOT / "scripts/stylex-migration/migrate_dashboard_scene.py"
)
mig = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mig)


def extract_all_css_keys(content: str) -> list[tuple[str, str]]:
    keys: list[tuple[str, str]] = []
    for m in re.finditer(r"\n\s*(\w+)\s*:\s*css\s*\(\s*\{", content):
        bstart = content.find("{", m.end() - 1)
        bend = mig.find_matching_brace(content, bstart)
        if bend >= 0:
            keys.append((m.group(1), content[bstart + 1 : bend]))
    return keys


def extract_style_fn(content: str) -> tuple[str, str, list[tuple[str, str]]] | None:
    for pat in [
        r"function (get\w+)\([^)]*\)\s*\{",
        r"const (get\w+) = \([^)]*\) => \(\{",
        r"const (get\w+) = \(theme: GrafanaTheme2\) => \{",
    ]:
        m = re.search(pat, content)
        if not m:
            continue
        name = m.group(1)
        if "=>" in content[m.start() : m.end()] and content[m.end() - 1 : m.end()] == "{":
            obj_start = m.end() - 1
        else:
            fn_brace = content.find("{", m.end() - 1)
            fn_end = mig.find_matching_brace(content, fn_brace)
            if fn_end < 0:
                continue
            fn_body = content[m.end() : fn_end]
            ret = re.search(r"return\s*\{", fn_body)
            if not ret:
                continue
            obj_start = m.end() + ret.end() - 1
        obj_end = mig.find_matching_brace(content, obj_start)
        if obj_end < 0:
            continue
        keys = mig.extract_css_props_from_object(content[obj_start + 1 : obj_end])
        if not keys:
            continue
        fn_end = obj_end + 1
        while fn_end < len(content) and content[fn_end] in ")\n\r ;":
            fn_end += 1
        if content[fn_end : fn_end + 1] == "}":
            fn_end += 1
        return content[m.start() : fn_end], name, keys
    return None


def export_name(path: Path) -> str:
    b = path.stem
    return b[0].lower() + b[1:] + "Styles"


def write_stylex_file(file_path: Path, export: str, keys: list[tuple[str, str]]) -> None:
    lines = [
        "import * as stylex from '@stylexjs/stylex';",
        "",
        "import { grafanaTokens } from '@grafana/ui/unstable';",
        "",
    ]
    joined = "\n".join(b for _, b in keys)
    if "themeSpacing" in joined:
        lines.append(
            f"import {{ themeSpacing, themeSpacingShorthand }} from '{mig.spacing_import_path(file_path)}';"
        )
        lines.append("")
    lines.append(f"export const {export} = stylex.create({{")
    for key, block in keys:
        t = mig.transform_css_block(block)
        ind = "\n".join("    " + ln for ln in t.strip().splitlines())
        lines.append(f"  {key}: {{")
        lines.append(ind)
        lines.append("  },")
    lines.append("});")
    lines.append("")
    file_path.with_suffix(".stylex.ts").write_text("\n".join(lines))


def apply(path: Path) -> bool:
    content = path.read_text()
    if "@emotion/" not in content:
        return False
    extracted = extract_style_fn(content)
    if extracted:
        chunk, fn_name, keys = extracted
    else:
        keys = extract_all_css_keys(content)
        if not keys:
            print(f"SKIP {path.relative_to(SCENE)}")
            return False
        fn_name = "getStyles"
        chunk = ""
        m = re.search(r"function getStyles\([\s\S]*", content)
        if m:
            chunk = content[m.start() :]
            # trim to closing brace of function
            fb = content.find("{", m.end() - 1)
            fe = mig.find_matching_brace(content, fb)
            if fe >= 0:
                chunk = content[m.start() : fe + 1]
    if not extracted and not chunk:
        print(f"SKIP {path.relative_to(SCENE)}")
        return False
    if extracted:
        chunk, fn_name, keys = extracted
    export = export_name(path)
    write_stylex_file(path, export, keys)
    new = content.replace(chunk, "")
    new = re.sub(r"^import \{[^}]*\} from '@emotion/css';\n", "", new, flags=re.M)
    new = re.sub(r"^import \{ type GrafanaTheme2[^}]*\} from '@grafana/data';\n", "", new, flags=re.M)
    new = re.sub(rf"\s*const styles = useStyles2\({fn_name}\);\n", "\n", new)
    new = re.sub(r"\s*const styles = useStyles2\(getStyles\);\n", "\n", new)
    new = re.sub(r"\s*const hoverActions = css\(\{[\s\S]*?\}\);\n", "\n", new)
    new = re.sub(
        r"^import \{([^}]*)\buseStyles2\b,?([^}]*)\} from '@grafana/ui';\n",
        lambda m: ""
        if not re.sub(r"useStyles2,?\s*", "", m.group(1) + m.group(2)).strip().strip(",")
        else "import {"
        + ", ".join(
            x.strip()
            for x in re.sub(r"\buseStyles2,?\s*", "", m.group(1) + "," + m.group(2)).split(",")
            if x.strip()
        )
        + "} from '@grafana/ui';\n",
        new,
        flags=re.M,
    )
    if "import * as stylex" not in new:
        new = (
            f"import * as stylex from '@stylexjs/stylex';\n"
            f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
            f"import {{ {export} }} from './{path.stem}.stylex';\n"
            + new
        )
    if re.search(r"\bcx\(", new) and "import clsx" not in new:
        new = "import clsx from 'clsx';\n" + new
    for key, _ in keys:
        new = re.sub(
            rf"className=\{{styles\.{key}\}}",
            rf"{{...stylex.props({export}.{key})}}",
            new,
        )
        new = re.sub(
            rf"className=\{{cx\(styles\.{key},\s*([^)]+)\)\}}",
            rf"{{...mergeStylexClassName(stylex.props({export}.{key}), clsx(\1))}}",
            new,
        )
    path.write_text(new)
    print(f"OK {path.relative_to(SCENE)} ({len(keys)})")
    return True


def migrate_solo_logo():
    path = SCENE / "solo/SoloPanelPageLogo.tsx"
    content = path.read_text()
    export = "soloPanelPageLogoStyles"
    write_stylex_file(
        path,
        export,
        [
            (
                "logoContainer",
                """
      position: 'absolute',
      opacity: 0.9,
      pointerEvents: 'none',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      lineHeight: 1.2,
    """,
            ),
            ("logoHidden", "opacity: 0,"),
            ("text", "lineHeight: 1.2, display: 'block',"),
            ("logo", "display: 'block', flexShrink: 0,"),
        ],
    )
    chunk = re.search(r"const getStyles = \(theme: GrafanaTheme2\) => \{[\s\S]*?\};", content)
    if chunk:
        content = content.replace(chunk.group(0), "")
    content = re.sub(r"^import \{[^}]*\} from '@emotion/css';\n", "", content, flags=re.M)
    content = re.sub(r"^import \{ type GrafanaTheme2[^}]*\} from '@grafana/data';\n", "", content, flags=re.M)
    content = re.sub(r"\s*const styles = useStyles2\(getStyles\);\n", "\n", content)
    content = re.sub(r", useStyles2", "", content)
    content = re.sub(r"useStyles2, ", "", content)
    if "import * as stylex" not in content:
        content = (
            f"import clsx from 'clsx';\n"
            f"import * as stylex from '@stylexjs/stylex';\n"
            f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
            f"import {{ {export} }} from './SoloPanelPageLogo.stylex';\n"
            + content
        )
    content = content.replace(
        "className={cx(styles.logoContainer, isHovered && styles.logoHidden)}",
        f"{{...mergeStylexClassName(stylex.props({export}.logoContainer), clsx(isHovered && stylex.props({export}.logoHidden).className))}}",
    )
    content = content.replace("className={styles.text}", f"{{...stylex.props({export}.text)}}")
    content = content.replace("className={styles.logo}", f"{{...stylex.props({export}.logo)}}")
    path.write_text(content)
    print("OK solo/SoloPanelPageLogo.tsx")


def main():
    files = [
        "panel-edit/PanelEditNext/QueryEditor/Footer/QueryEditorFooter.tsx",
        "panel-edit/PanelEditNext/QueryEditor/Sidebar/Cards/SidebarCard.tsx",
    ]
    for f in files:
        apply(SCENE / f)


if __name__ == "__main__":
    main()
