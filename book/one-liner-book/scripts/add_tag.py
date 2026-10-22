"""Append source tags to an already-written fact: add_tag.py <chapter> "<text in the fact>" Q:04-0446 [Q:...]

Finds the first line of content/<chapter>.yaml containing the text, then the first src: "..." at or
after it (same item), and appends the tags that are not there yet. Used when a later chapter's
question repeats a fact that an earlier chapter already prints."""
import os, re, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
chapter, needle, tags = sys.argv[1], sys.argv[2], sys.argv[3:]
path = os.path.join(HERE, "content", f"{chapter}.yaml")
lines = open(path, encoding="utf-8").read().split("\n")
start = next((i for i, l in enumerate(lines) if needle in l), None)
if start is None:
    sys.exit(f"not found in {chapter}: {needle}")
for i in range(start, min(start + 8, len(lines))):
    m = re.search(r'src: "([^"]*)"', lines[i])
    if m:
        have = m.group(1).split()
        new = have + [t for t in tags if t not in have]
        lines[i] = lines[i][:m.start(1)] + " ".join(new) + lines[i][m.end(1):]
        open(path, "w", encoding="utf-8", newline="\n").write("\n".join(lines))
        print(f"{chapter}:{i + 1} +{len(new) - len(have)}")
        break
else:
    sys.exit(f"no src near: {needle}")
