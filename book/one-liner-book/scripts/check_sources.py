"""Check source tags and coverage.

    python -I scripts/check_sources.py [chapter-id ...]

- every Q: tag must name a real question in data/uk_questions.jsonl
- every question must end up somewhere: cited by a fact (content/*.yaml) or
  listed in data/disposition.yaml (to-verify / dropped with a reason /
  assigned to a chapter not written yet). Prints what is still unplaced.
"""
import collections, glob, json, os, re, sys
import yaml

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def qid(tag):
    t = tag[2:]
    return f"UKPCS-UKGK-CH{t}" if re.fullmatch(r"\d\d-\d{4}", t) else t


def walk(node, out):
    if isinstance(node, dict):
        if "src" in node:
            out.extend(str(node["src"]).split())
        for v in node.values():
            walk(v, out)
    elif isinstance(node, list):
        for v in node:
            walk(v, out)


def main():
    bank = {json.loads(l)["id"]: json.loads(l) for l in open(os.path.join(HERE, "data", "uk_questions.jsonl"), encoding="utf-8")}
    only = set(sys.argv[1:])
    cited = collections.defaultdict(set)
    bad = []
    for f in sorted(glob.glob(os.path.join(HERE, "content", "*.yaml"))):
        ch = yaml.safe_load(open(f, encoding="utf-8"))
        if only and ch["id"] not in only:
            continue
        tags = []
        walk(ch, tags)
        for t in tags:
            if t.startswith("Q:"):
                q = qid(t)
                (cited[q].add(ch["id"]) if q in bank else bad.append((ch["id"], t)))
            elif not re.fullmatch(r"N:\d+", t):
                bad.append((ch["id"], t))
    disp_file = os.path.join(HERE, "data", "disposition.yaml")
    disp = (yaml.safe_load(open(disp_file, encoding="utf-8")) or {}) if os.path.exists(disp_file) else {}
    # "later: <chapter>" entries are handed on, not placed: they still count as unplaced
    placed = {qid("Q:" + k) if not k.startswith(("UKPCS", "GEN")) else k: v for k, v in disp.items()
              if not str(v).startswith("later:")}
    print(f"bank questions: {len(bank)}; cited: {len(cited)}; in disposition: {len(placed)}")
    for c, t in bad:
        print("BAD TAG", c, t)
    unplaced = [q for q in bank if q not in cited and q not in placed]
    by_ch = collections.Counter(bank[q]["ch"] or bank[q]["sec"] for q in unplaced)
    print("unplaced:", len(unplaced), dict(sorted(by_ch.items())))
    return unplaced, bank, cited, placed


if __name__ == "__main__":
    main()
