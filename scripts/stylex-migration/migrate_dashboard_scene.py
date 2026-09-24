#!/usr/bin/env python3
"""Migrate public/app/features/dashboard-scene Emotion → StyleX."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCENE = ROOT / "public/app/features/dashboard-scene"

TOKEN_FILE = ROOT / "packages/grafana-ui/src/themes/stylex/tokens.generated.stylex.ts"
TOKEN_KEYS = set(re.findall(r"^\s+([a-zA-Z0-9_]+):", TOKEN_FILE.read_text(), re.M))

BREAKPOINT_DOWN = {
    "sm": "@media (max-width: 543.95px)",
    "md": "@media (max-width: 768.95px)",
    "lg": "@media (max-width: 991.95px)",
    "xl": "@media (max-width: 1199.95px)",
}
BREAKPOINT_UP = {
    "sm": "@media (min-width: 544px)",
    "md": "@media (min-width: 769px)",
    "lg": "@media (min-width: 992px)",
    "xl": "@media (min-width: 1200px)",
}
MOTION_PREF = "'@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)'"
MOTION_NO_PREF = "'@media (prefers-reduced-motion: no-preference)'"


def theme_path_to_token(path: str) -> str | None:
    key = path.replace("theme.", "").replace(".", "_")
    if key in TOKEN_KEYS:
        return f"grafanaTokens.{key}"
    return None


def spacing_expr(args: str) -> str:
    parts = [p.strip() for p in args.split(",")]
    if len(parts) == 1:
        p = parts[0]
        if re.match(r"^['\"`]", p):
            return p
        return f"themeSpacing({p})"
    return f"themeSpacingShorthand({', '.join(parts)})"


def transform_css_block(block: str) -> str:
    out = block
    out = re.sub(
        r"theme\.breakpoints\.down\(['\"](\w+)['\"]\)",
        lambda m: BREAKPOINT_DOWN.get(m.group(1), f"@media /* down {m.group(1)} */"),
        out,
    )
    out = re.sub(
        r"theme\.breakpoints\.up\(['\"](\w+)['\"]\)",
        lambda m: BREAKPOINT_UP.get(m.group(1), f"@media /* up {m.group(1)} */"),
        out,
    )
    out = re.sub(
        r"theme\.transitions\.handleMotion\('no-preference',\s*'reduce'\)",
        MOTION_PREF,
        out,
    )
    out = re.sub(
        r"theme\.transitions\.handleMotion\('no-preference'\)",
        MOTION_NO_PREF,
        out,
    )
    out = re.sub(
        r"theme\.transitions\.create\(\[([^\]]+)\],\s*\{[^}]*duration:\s*theme\.transitions\.duration\.(\w+)[^}]*\}\)",
        lambda m: f"transition: {m.group(1)} /* duration.{m.group(2)} */",
        out,
    )
    out = re.sub(r"theme\.spacing\(([^)]+)\)", lambda m: spacing_expr(m.group(1)), out)
    out = re.sub(
        r"theme\.typography\.pxToRem\(([^)]+)\)",
        lambda m: f"{float(m.group(1).strip()) * 14 / 16}rem"
        if re.match(r"^[\d.]+$", m.group(1).strip())
        else "'inherit'",
        out,
    )
    out = re.sub(
        r"theme\.((?:colors|typography|shape|zIndex|shadows)(?:\.[a-zA-Z0-9_]+)+)",
        lambda m: theme_path_to_token(m.group(0)) or f"grafanaTokens.colors_text_primary",
        out,
    )
    for old, new in [
        ("'&:hover'", "':hover'"),
        ("'&:focus-within'", "':focus-within'"),
        ("'&:active'", "':active'"),
        ("'&::before'", "'::before'"),
        ("'&::after'", "'::after'"),
        ("'&:before'", "'::before'"),
        ("'&:after'", "'::after'"),
        ("'& > div'", "' > div'"),
        ("'& :has(> ul)'", "' :has(> ul)'"),
        ("'&:hover,:focus-within'", "':hover,:focus-within'"),
    ]:
        out = out.replace(old, new)
    out = re.sub(r"\.\.\.[^,\n]+", "", out)
    return out


def spacing_import_path(file_path: Path) -> str:
    rel = file_path.parent.relative_to(SCENE)
    depth = len(rel.parts)
    return "../" * (depth + 2) + "core/stylex/spacing"


def export_name(file_path: Path) -> str:
    base = file_path.stem
    if base == "styles":
        return "styles"
    return base[0].lower() + base[1:] + "Styles"


def _skip_string(s: str, i: int, quote: str) -> int:
    i += 1
    while i < len(s):
        if quote == "`" and s[i : i + 2] == "${":
            i += 2
            depth = 1
            while i < len(s) and depth > 0:
                ch = s[i]
                if ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                elif ch in ("'", '"', "`"):
                    i = _skip_string(s, i, ch)
                    continue
                i += 1
            continue
        if s[i] == "\\":
            i += 2
            continue
        if s[i] == quote:
            return i
        i += 1
    return i


def find_matching_brace(s: str, start: int) -> int:
    depth = 0
    i = start
    while i < len(s):
        c = s[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i
        elif c in ("'", '"', "`"):
            i = _skip_string(s, i, c)
        i += 1
    return -1


def extract_css_props_from_object(body: str) -> list[tuple[str, str]]:
    """Extract key: css({...}) from object body."""
    results: list[tuple[str, str]] = []
    i = 0
    while i < len(body):
        m = re.match(r"\s*(\w+)\s*:\s*css\s*\(\s*\{", body[i:])
        if not m:
            i += 1
            continue
        key = m.group(1)
        brace_start = i + m.end() - 1
        brace_end = find_matching_brace(body, brace_start)
        if brace_end < 0:
            break
        inner = body[brace_start + 1 : brace_end]
        results.append((key, inner))
        i = brace_end + 1
        if i < len(body) and body[i] == ")":
            i += 1
    return results


def extract_all_style_functions(content: str) -> list[tuple[str, str, list[tuple[str, str]]]]:
    """Find get*Styles functions and return (full_src, name, keys)."""
    found: list[tuple[str, str, list[tuple[str, str]]]] = []

    patterns = [
        r"(export )?(?:const|function) (get\w+)\s*=\s*\([^)]*\)\s*=>\s*\(\{",
        r"(export )?function (get\w+)\s*\([^)]*\)\s*\{\s*return\s*\{",
        r"(export )?const (get\w+)\s*=\s*\([^)]*\)\s*=>\s*\{\s*return\s*\{",
        r"(export )?(?:const|function) (getDraggableListStyles)\s*\(",
    ]

    for pat in patterns:
        for m in re.finditer(pat, content):
            name = m.group(2)
            start = m.start()
            # find object start (return { ... } or => ({ ... }))
            tail = content[m.end() :]
            if tail.lstrip().startswith("return"):
                ret = re.search(r"return\s*\{", tail)
                if not ret:
                    continue
                obj_start = m.end() + ret.end() - 1
            elif content[m.end() - 1 : m.end()] == "{":
                obj_start = m.end() - 1
            elif tail.lstrip().startswith("{"):
                obj_start = m.end() + len(tail) - len(tail.lstrip())
            else:
                continue
            if obj_start < 0:
                continue
            obj_end = find_matching_brace(content, obj_start)
            if obj_end < 0:
                continue
            body = content[obj_start + 1 : obj_end]
            keys = extract_css_props_from_object(body)
            if not keys:
                continue
            # extend to closing }; of function
            end = obj_end + 1
            while end < len(content) and content[end] in ")\n\r ;":
                end += 1
            full = content[start:end]
            if any(f[1] == name for f in found):
                continue
            found.append((full, name, keys))

    return found


def extract_module_css(content: str) -> list[tuple[str, str, str]]:
    results = []
    for m in re.finditer(r"^(export )?const (\w+) = css\(\{", content, re.MULTILINE):
        brace_start = content.find("{", m.end() - 1)
        brace_end = find_matching_brace(content, brace_start)
        if brace_end < 0:
            continue
        inner = content[brace_start + 1 : brace_end]
        full = content[m.start() : brace_end + 2]
        results.append((m.group(2), full, inner))
    return results


def extract_keyframes(content: str) -> list[tuple[str, str, str]]:
    results = []
    for m in re.finditer(r"^(export )?const (\w+) = keyframes\(\{", content, re.MULTILINE):
        brace_start = content.find("{", m.end() - 1)
        brace_end = find_matching_brace(content, brace_start)
        if brace_end < 0:
            continue
        inner = content[brace_start + 1 : brace_end]
        full = content[m.start() : brace_end + 2]
        results.append((m.group(2), full, inner))
    return results


def has_dynamic_css(block: str) -> bool:
    # Skip blocks that reference other css class names or non-theme runtime variables.
    if re.search(r"\$\{hoverActions\}", block):
        return True
    if "getGhostCardVisuals" in block:
        return True
    if re.search(r"\.\$\{", block):
        return True
    return False


def migrate_file(file_path: Path, dry_run: bool = False) -> bool:
    content = file_path.read_text()
    if "@emotion/" not in content:
        return False

    style_fns = extract_all_style_functions(content)
    module_css = extract_module_css(content)
    kf_list = extract_keyframes(content)

    all_keys: list[tuple[str, str]] = []
    remove_chunks: list[str] = []

    for full, _, keys in style_fns:
        for k, b in keys:
            if has_dynamic_css(b):
                print(f"SKIP dynamic block in {file_path.name}: {k}")
                return False
        all_keys.extend(keys)
        remove_chunks.append(full)

    for name, full, inner in module_css:
        if has_dynamic_css(inner):
            print(f"SKIP dynamic module css {name} in {file_path.name}")
            return False
        all_keys.append((name, inner))
        remove_chunks.append(full)

    if not all_keys and not kf_list:
        print(f"SKIP (no styles): {file_path.relative_to(ROOT)}")
        return False

    export = export_name(file_path)
    if not dry_run:
        lines = [
            "import * as stylex from '@stylexjs/stylex';",
            "",
            "import { grafanaTokens } from '@grafana/ui/unstable';",
            "",
        ]
        joined = "\n".join(b for _, b in all_keys)
        if "themeSpacing" in joined:
            lines.append(f"import {{ themeSpacing, themeSpacingShorthand }} from '{spacing_import_path(file_path)}';")
            lines.append("")

        for kf_name, _, kf_body in kf_list:
            t = transform_css_block(kf_body)
            ind = "\n".join("  " + ln for ln in t.strip().splitlines())
            lines.append(f"const {kf_name} = stylex.keyframes({{")
            lines.append(ind)
            lines.append("});")
            lines.append("")

        lines.append(f"export const {export} = stylex.create({{")
        for key, block in all_keys:
            t = transform_css_block(block)
            ind = "\n".join("    " + ln for ln in t.strip().splitlines())
            lines.append(f"  {key}: {{")
            lines.append(ind)
            lines.append("  },")
        lines.append("});")
        lines.append("")
        file_path.with_suffix(".stylex.ts").write_text("\n".join(lines))

    new_content = content
    for chunk in remove_chunks:
        new_content = new_content.replace(chunk, "")

    for _, full, _ in kf_list:
        new_content = new_content.replace(full, "")

    new_content = re.sub(r"^import \{[^}]*\} from '@emotion/css';\n", "", new_content, flags=re.MULTILINE)
    new_content = re.sub(r"^import \{[^}]*\} from '@emotion/react';\n", "", new_content, flags=re.MULTILINE)
    new_content = re.sub(r"^import \{ type GrafanaTheme2[^}]*\} from '@grafana/data';\n", "", new_content, flags=re.MULTILINE)

    new_content = re.sub(r"^\s*const styles = useStyles2\([^)]+\);\n", "\n", new_content, flags=re.MULTILINE)
    new_content = re.sub(
        r"^import \{([^}]*)\buseStyles2\b,?([^}]*)\} from '@grafana/ui';\n",
        lambda m: ""
        if not m.group(1).strip().strip(",") and not m.group(2).strip().strip(",")
        else "import {"
        + ", ".join(x.strip() for x in (m.group(1) + "," + m.group(2)).split(",") if x.strip() and x.strip() != "useStyles2")
        + "} from '@grafana/ui';\n",
        new_content,
        flags=re.MULTILINE,
    )

    if "import * as stylex" not in new_content:
        imp = (
            f"import * as stylex from '@stylexjs/stylex';\n"
            f"import {{ mergeStylexClassName }} from '@grafana/ui/unstable';\n"
            f"import {{ {export} }} from './{file_path.stem}.stylex';\n"
        )
        new_content = imp + new_content

    if re.search(r"\bcx\(", new_content) and "import clsx" not in new_content:
        new_content = "import clsx from 'clsx';\n" + new_content

    for key, _ in all_keys:
        new_content = re.sub(
            rf"className=\{{styles\.{key}\}}",
            rf"{{...stylex.props({export}.{key})}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{cx\(styles\.{key},\s*([^)]+)\)\}}",
            rf"{{...mergeStylexClassName(stylex.props({export}.{key}), clsx(\1))}}",
            new_content,
        )
        new_content = re.sub(
            rf"className=\{{cx\(([^,]+),\s*styles\.{key}\)\}}",
            rf"{{...mergeStylexClassName(stylex.props({export}.{key}), clsx(\1))}}",
            new_content,
        )
        new_content = re.sub(
            rf"\{{\.\.\.stylex\.props\({export}\.{key}\)\}}",
            rf"{{...stylex.props({export}.{key})}}",
            new_content,
        )
        new_content = re.sub(
            rf"containerClassName=\{{styles\.{key}\}}",
            rf"containerClassName={{stylex.props({export}.{key}).className}}",
            new_content,
        )
        for var_name, _, _ in module_css:
            new_content = re.sub(
                rf"className=\{{{var_name}\}}",
                rf"{{...stylex.props({export}.{var_name})}}",
                new_content,
            )
            new_content = re.sub(
                rf"className=\{{cx\({var_name},\s*([^)]+)\)\}}",
                rf"{{...mergeStylexClassName(stylex.props({export}.{var_name}), clsx(\1))}}",
                new_content,
            )

    if not dry_run:
        file_path.write_text(new_content)
    print(f"OK {file_path.relative_to(ROOT)} ({len(all_keys)} keys)")
    return True


def main():
    dry = "--dry-run" in sys.argv
    files = sorted(SCENE.rglob("*.tsx")) + sorted(SCENE.rglob("*.ts"))
    ok = skip = 0
    for f in files:
        if ".stylex." in f.name or f.name.endswith(".test.ts") or f.name.endswith(".test.tsx"):
            continue
        if migrate_file(f, dry_run=dry):
            ok += 1
        else:
            skip += 1
    print(f"Migrated {ok}, skipped {skip}")


if __name__ == "__main__":
    main()
