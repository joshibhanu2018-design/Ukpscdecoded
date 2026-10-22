"""Flag Negi OCR lines whose distinctive words are not yet in the book: negi_gaps.py <ocr page> [<ocr page> ...]

A line counts as covered when most of its rarer Devanagari words already occur in the Hindi text of
content/*.yaml. Common words (the most frequent words across all OCR pages) are ignored. Printed:
column, coverage share, and the line, for every line below the threshold."""
import collections, glob, os, re, sys

import yaml

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORD = re.compile(r"[ऀ-ॿ]{3,}")
THRESHOLD = 0.6


def book_words():
    words = set()
    for path in glob.glob(os.path.join(HERE, "content", "*.yaml")):
        words.update(WORD.findall(open(path, encoding="utf-8").read()))
    return words


def common_words(limit=350):
    count = collections.Counter()
    for path in glob.glob(os.path.join(HERE, "negi-ocr", "p*.txt")):
        count.update(WORD.findall(open(path, encoding="utf-8").read()))
    return {w for w, _ in count.most_common(limit)}


def main():
    have, common = book_words(), common_words()
    for arg in sys.argv[1:]:
        path = os.path.join(HERE, "negi-ocr", f"p{int(arg):03d}.txt")
        col = "?"
        print(f"######## p{int(arg):03d}")
        for line in open(path, encoding="utf-8").read().split("\n"):
            if line.startswith("=== col"):
                col = line.split()[-1]
                continue
            rare = [w for w in WORD.findall(line) if w not in common]
            if len(rare) < 2:
                continue
            share = sum(w in have for w in rare) / len(rare)
            if share < THRESHOLD:
                print(f"c{col} {share:.1f} | {line.strip()[:150]}")


if __name__ == "__main__":
    main()
