"""Add facts to a chapter section from a batch file: add_fact.py <batch.yaml>

The batch file is a YAML list of {chapter, section, en, hi, src}. `section` is a substring of the section's
English heading (h: {en: ...}). Each fact is appended to the section's last block when that block is a
`facts:` list, otherwise a new `facts:` block is added at the end of the section. The chapter files keep
their hand-written layout (text insertion, not a YAML re-dump), and each changed file is re-parsed."""
import json, os, sys

import yaml

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def q(text):
    return json.dumps(text, ensure_ascii=False)


def add(lines, section, en, hi, src):
    start = next((i for i, l in enumerate(lines) if l.startswith("- h:") and section in l), None)
    if start is None:
        raise SystemExit(f"section not found: {section}")
    end = next((i for i in range(start + 1, len(lines)) if lines[i].startswith("- h:")), len(lines))
    while end > start and not lines[end - 1].strip():
        end -= 1
    block = max(i for i in range(start, end) if lines[i].startswith("  - ") or lines[i].startswith("  blocks:"))
    item = [f"    - en: {q(en)}", f"      hi: {q(hi)}", f"      src: {q(src)}"]
    if lines[block].startswith("  - facts:"):
        lines[end:end] = item
    else:
        lines[end:end] = ["  - facts:"] + item


def main():
    batch = yaml.safe_load(open(sys.argv[1], encoding="utf-8"))
    files = {}
    for f in batch:
        path = os.path.join(HERE, "content", f"{f['chapter']}.yaml")
        lines = files.setdefault(path, open(path, encoding="utf-8").read().split("\n"))
        add(lines, f["section"], f["en"], f["hi"], f["src"])
    for path, lines in files.items():
        text = "\n".join(lines)
        yaml.safe_load(text)
        open(path, "w", encoding="utf-8", newline="\n").write(text)
        print(f"{os.path.basename(path)}: ok")


if __name__ == "__main__":
    main()
