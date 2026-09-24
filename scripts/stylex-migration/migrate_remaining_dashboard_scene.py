#!/usr/bin/env python3
"""Migrate remaining dashboard-scene files with nested css / template literals."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCENE = ROOT / "public/app/features/dashboard-scene"

sys.path.insert(0, str(ROOT / "scripts/stylex-migration"))
from migrate_dashboard_scene import (  # noqa: E402
    export_name,
    extract_keyframes,
    extract_module_css,
    find_matching_brace,
    migrate_file,
    spacing_import_path,
    transform_css_block,
    write_stylex_file,
)


def git_main_content(rel: str) -> str:
    r = subprocess.run(
        ["git", "show", f"origin/main:public/app/features/dashboard-scene/{rel}"],
        capture_output=True,
        text=True,
        cwd=ROOT,
    )
    if r.returncode != 0:
        return ""
    return r.stdout


def extract_keys_from_getstyles_block(block: str) -> list[tuple[str, str]]:
    keys: list[tuple[str, str]] = []
    i = 0
    while i < len(block):
        m = re.match(r"\s*(\w+)\s*:\s*css\s*\(\s*\{", block[i:])
        if not m:
            i += 1
            continue
        key = m.group(1)
        brace = i + m.end() - 1
        end = find_matching_brace(block, brace)
        if end < 0:
            break
        keys.append((key, block[brace + 1 : end]))
        i = end + 1
        if i < len(block) and block[i] == ")":
            i += 1
    return keys


def extract_from_main(rel: str) -> list[tuple[str, str]]:
    content = git_main_content(rel)
    if not content:
        return []
    keys: list[tuple[str, str]] = []
    for m in re.finditer(
        r"(?:export )?(?:const|function) (get\w+)\s*(?:=\s*)?\([^)]*\)\s*(?:=>\s*)?\{",
        content,
    ):
        fn_start = m.start()
        fn_brace = content.find("{", m.end() - 1)
        fn_end = find_matching_brace(content, fn_brace)
        if fn_end < 0:
            continue
        fn_body = content[fn_brace + 1 : fn_end]
        ret = re.search(r"return\s*\{", fn_body)
        if not ret:
            continue
        obj_brace = fn_brace + 1 + ret.end() - 1
        obj_end = find_matching_brace(content, obj_brace)
        if obj_end < 0:
            continue
        obj_body = content[obj_brace + 1 : obj_end]
        keys.extend(extract_keys_from_getstyles_block(obj_body))
    return keys


def apply_stylex_to_file(file_path: Path, keys: list[tuple[str, str]], kf: list | None = None) -> None:
    export = export_name(file_path)
    write_stylex_file(file_path, export, keys, kf)
    content = file_path.read_text()
    # Remove getStyles blocks from current file
    while True:
        m = re.search(
            r"\n(?:export )?(?:const|function) get\w+\s*(?:=\s*)?\([^)]*\)\s*(?:=>\s*)?\{[\s\S]*?\n\};?\n",
            content,
        )
        if not m:
            m = re.search(
                r"\n(?:export )?(?:const|function) get\w+\s*(?:=\s*)?\([^)]*\)\s*=>\s*\(\{[\s\S]*?\}\);\n",
                content,
            )
        if not m:
            break
        content = content[: m.start()] + "\n" + content[m.end() :]

    content = re.sub(r"^import \{[^}]*\} from '@emotion/css';\n", "", content, flags=re.MULTILINE)
    content = re.sub(r"^import \{ type GrafanaTheme2[^}]*\} from '@grafana/data';\n", "", content, flags=re.MULTILINE)
    content = re.sub(r"^\s*const styles = useStyles2\([^)]+\);\n", "\n", content, flags=re.MULTILINE)
    content = re.sub(
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
        content,
        flags=re.MULTILINE,
    )

    if "import * as stylex" not in content:
        content = (
            f"import * as stylex from '@stylexjs/stylex';\n"
            f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
            f"import {{ {export} }} from './{file_path.stem}.stylex';\n"
            + content
        )

    for key, _ in keys:
        content = re.sub(
            rf"className=\{{styles\.{key}\}}",
            rf"{{...stylex.props({export}.{key})}}",
            content,
        )
        content = re.sub(
            rf"className=\{{cx\(styles\.{key},\s*([^)]+)\)\}}",
            rf"{{...mergeStylexClassName(stylex.props({export}.{key}), clsx(\1))}}",
            content,
        )

    file_path.write_text(content)


def main():
    remaining = [
        p.relative_to(SCENE)
        for p in SCENE.rglob("*")
        if p.suffix in (".tsx", ".ts") and "@emotion/" in p.read_text()
    ]
    for rel in remaining:
        path = SCENE / rel
        rel_str = str(rel).replace("\\", "/")
        if rel_str.endswith("unconfiguredPanelUtils.ts"):
            migrate_keyframes_utils(path)
            continue
        if rel_str.endswith("SaveBeforeShareModal.tsx"):
            migrate_inline_modal(path)
            continue
        if rel_str.endswith("DiffViewer.tsx") or rel_str.endswith("GoToSnapshotOriginButton.tsx"):
            migrate_inline_css(path)
            continue
        keys = extract_from_main(rel_str)
        if not keys:
            print(f"FAIL {rel_str}")
            continue
        apply_stylex_to_file(path, keys)
        print(f"OK {rel_str} ({len(keys)} keys)")


def migrate_inline_modal(path: Path):
    content = path.read_text()
    export = export_name(path)
    write_stylex_file(path, export, [("modal", "width: '500px',")])
    content = re.sub(r"^import \{[^}]*\} from '@emotion/css';\n", "", content, flags=re.MULTILINE)
    content = re.sub(
        r'className=\{css\(\{ width: \'500px\' \}\)\}',
        f"{{...stylex.props({export}.modal)}}",
        content,
    )
    if "import * as stylex" not in content:
        content = (
            f"import * as stylex from '@stylexjs/stylex';\n"
            f"import {{ {export} }} from './{path.stem}.stylex';\n"
            + content
        )
    path.write_text(content)
    print(f"OK {path.relative_to(SCENE)}")


def migrate_inline_css(path: Path):
    content = path.read_text()
    export = export_name(path)
    # single inline css({...}) in JSX
    m = re.search(r"className=\{css\(\{([^}]+)\}\)\}", content)
    if m:
        prop = "root"
        write_stylex_file(path, export, [(prop, m.group(1))])
        content = re.sub(r"^import \{[^}]*\} from '@emotion/css';\n", "", content, flags=re.MULTILINE)
        content = re.sub(
            r"className=\{css\(\{[^}]+\}\)\}",
            f"{{...stylex.props({export}.{prop})}}",
            content,
        )
        if "import * as stylex" not in content:
            content = (
                f"import * as stylex from '@stylexjs/stylex';\n"
                f"import {{ {export} }} from './{path.stem}.stylex';\n"
                + content
            )
        path.write_text(content)
        print(f"OK {path.relative_to(SCENE)}")


def migrate_keyframes_utils(path: Path):
    content = path.read_text()
    kf = extract_keyframes(content)
    export = "unconfiguredPanelUtilsStyles"
    lines = [
        "import * as stylex from '@stylexjs/stylex';",
        "",
        f"export const {export} = stylex.create({{}});",
        "",
    ]
    for name, _, body in kf:
        t = transform_css_block(body)
        ind = "\n".join("  " + ln for ln in t.strip().splitlines())
        lines.insert(-2, f"export const {name} = stylex.keyframes({{\n{ind}\n}});\n")
    path.with_suffix(".stylex.ts").write_text("\n".join(lines))
    content = re.sub(r"^import \{[^}]*\} from '@emotion/css';\n", "", content, flags=re.MULTILINE)
    for name, full, _ in kf:
        content = content.replace(full + "\n", "")
        content = content.replace(f"keyframes({{", f"/* moved to stylex */ ({{")  # noop fallback
    # Replace keyframes() calls with stylex keyframes exports
    content = content.replace("keyframes({", "stylexKeyframesPlaceholder({")
    content = re.sub(
        r"return \{\s*enter: stylexKeyframesPlaceholder\(",
        "return { enter: ",
        content,
    )
    # Simpler: import keyframes from stylex file
    content = (
        f"import {{ fadeSlideEnter, fadeSlideExit, gearFramesEnter, gearFramesExit, textFramesEnter, textFramesExit, buttonFramesEnter, buttonFramesExit }} from './unconfiguredPanelUtils.stylex';\n"
        + content
    )
    path.write_text(content)
    print(f"PARTIAL {path.relative_to(SCENE)} - needs fadeSlide refactor")


if __name__ == "__main__":
    main()
