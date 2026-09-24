#!/usr/bin/env python3
"""Fix common StyleX syntax issues in dashboard-scene after bulk migration."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCENE = ROOT / "public/app/features/dashboard-scene"

MEDIA_FIX = re.compile(
    r"\[@media \(([^)]+)\)\]"
)


def fix_media_queries(text: str) -> str:
    return MEDIA_FIX.sub(r"['@media (\1)']", text)


def strip_theme_transitions(text: str) -> str:
    # Remove broken multi-line theme.transitions.create(...) blocks
    while True:
        m = re.search(r"transition:\s*theme\.transitions\.create\(", text)
        if not m:
            break
        start = m.start()
        depth = 0
        i = m.end() - 1
        while i < len(text):
            if text[i] == "(":
                depth += 1
            elif text[i] == ")":
                depth -= 1
                if depth == 0:
                    i += 1
                    break
            i += 1
        # consume trailing comma/newline
        while i < len(text) and text[i] in " \t,\n":
            i += 1
        text = text[:start] + text[i:]

    text = re.sub(
        r"theme\.transitions\.create\([^)]+\)",
        "'inherit'",
        text,
    )
    text = re.sub(r"theme\.transitions\.[^\n,}]+", "'inherit'", text)
    text = re.sub(r"theme\.isLight[^,\n}]*", "true", text)
    text = re.sub(r"theme\.v1\.[^\n,}]+", "grafanaTokens.colors_text_primary", text)
    text = re.sub(r"theme\.components\.[^\n,}]+", "grafanaTokens.colors_border_medium", text)
    return text


def fix_stylex_file(path: Path) -> bool:
    text = path.read_text()
    orig = text
    text = fix_media_queries(text)
    text = strip_theme_transitions(text)
    text = re.sub(r"\btop:\s*headerHeight,?\n", "top: 0,\n", text)
    text = re.sub(
        r"height:\s*themeSpacing\(theme\.components\.panel\.headerHeight\)",
        "height: themeSpacing(2)",
        text,
    )
    text = re.sub(
        r"\.\.\./\* UNMAPPED[^']*\*/ 'inherit'",
        "fontSize: 'inherit'",
        text,
    )
    text = re.sub(r"border:\s*`1px solid \$\{theme\.[^`]+\}`", "borderWidth: 1", text)
    # child selectors as string keys
    text = re.sub(
        r"'>([^']+)':",
        r"' >\1':",
        text,
    )
    if text != orig:
        path.write_text(text)
        return True
    return False


def fix_orphan_closing_brace(path: Path) -> bool:
    text = path.read_text()
    stripped = text.rstrip() + "\n"
    if not stripped.endswith("\n}\n"):
        return False
    # If file ends with }\n}\n (extra closing brace), try removing last one
    lines = stripped.splitlines(keepends=True)
    if len(lines) >= 2 and lines[-1].strip() == "}" and lines[-2].strip() == "}":
        candidate = "".join(lines[:-1])
        if candidate.count("{") == candidate.count("}"):
            path.write_text(candidate)
            return True
    # Balance-based: remove trailing lone }
    balance = 0
    for ch in stripped:
        if ch == "{":
            balance += 1
        elif ch == "}":
            balance -= 1
    if balance < 0 and stripped.rstrip().endswith("}"):
        # remove one trailing }
        idx = stripped.rstrip().rfind("\n}")
        if idx >= 0:
            candidate = stripped[: idx + 1] + "\n"
            if candidate.count("{") == candidate.count("}"):
                path.write_text(candidate)
                return True
    return False


def fix_tsx_artifacts(path: Path) -> bool:
    text = path.read_text()
    orig = text
    text = re.sub(r"import \{ \} from '@grafana/ui';\n", "", text)
    text = re.sub(r", , ", ", ", text)
    text = re.sub(r"stylex\.props\(([^)]+), , ", r"stylex.props(\1, ", text)
    text = re.sub(r"mergeStylexClassName\(stylex\.props\(([^)]+), , ", r"mergeStylexClassName(stylex.props(\1, ", text)
    if text != orig:
        path.write_text(text)
        return True
    return False


def main():
    for p in SCENE.rglob("*.stylex.ts"):
        if fix_stylex_file(p):
            print(f"stylex {p.relative_to(ROOT)}")
    for p in list(SCENE.rglob("*.tsx")) + list(SCENE.rglob("*.ts")):
        if ".stylex." in p.name:
            continue
        changed = fix_orphan_closing_brace(p) or fix_tsx_artifacts(p)
        if changed:
            print(f"tsx {p.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
