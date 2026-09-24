#!/usr/bin/env python3
from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
COMP = ROOT / "packages/grafana-ui/src/components"


def main():
    # Tab.stylex is hand-maintained (see migrate run after this script if reset)
    fixes = [
        (COMP / "Tags/TagList.tsx", r"export const TagList = attachSkeleton\(TagListComponent, TagListSkeleton\);\n\n\);\n\n;\n", "export const TagList = attachSkeleton(TagListComponent, TagListSkeleton);\n"),
        (COMP / "Tabs/TabsBar.tsx", r"\}\);\n\n\);\n\nTabsBar", "});\n\nTabsBar"),
        (COMP / "DataLinks/DataLinksInlineEditor/DataLinksInlineEditor.tsx", r"</DataLinksInlineEditorBase>\n", "</DataLinksInlineEditorBase>\n);\n"),
        (COMP / "SecretInput/SecretInput.tsx", r"  </Stack>\n", "  </Stack>\n);\n"),
    ]
    for path, pat, repl in fixes:
        if path.exists():
            t = path.read_text()
            if pat.startswith("export"):
                t2 = re.sub(pat, repl, t)
            else:
                t2 = t.replace(pat, repl) if pat in t else re.sub(pat, repl, t)
            if t2 != t:
                path.write_text(t2)
                print("fixed", path.relative_to(COMP))

    for p in COMP.rglob("*.tsx"):
        t = p.read_text()
        o = t
        t = re.sub(r"(export const \w+ = attachSkeleton\([^)]+\);\n)\n\);\n(?:;\n)?\Z", r"\1", t)
        t = re.sub(r"(\];\n)\n\);\n(\n//)", r"\1\2", t)
        t = re.sub(r"(displayName = '[^']+';\n)\n\);\n\Z", r"\1", t)
        t = re.sub(r"\nexport ;\n", "\n", t)
        if t != o:
            p.write_text(t)
            print("cleaned", p.relative_to(COMP))

    for cell in ["AutoCell", "DataLinksCell", "MarkdownCell", "PillCell", "SparklineCell"]:
        p = COMP / "Table/TableNG/Cells" / f"{cell}.tsx"
        if p.exists() and not p.read_text().rstrip().endswith(");"):
            p.write_text(p.read_text().rstrip() + "\n);\n")
            print("closed", cell)

    subprocess.run(["git", "checkout", "origin/cursor/stylex-migration-ac1d", "--", "packages/grafana-ui/src/components/Forms/RadioButtonGroup/RadioButton.tsx"], cwd=ROOT, check=True)
    stylex = COMP / "Forms/RadioButtonGroup/RadioButton.stylex.ts"
    if stylex.exists():
        stylex.unlink()


if __name__ == "__main__":
    main()
