"""Suggest a book chapter for every question not yet cited or disposed, and write
one dump per chapter (data/dumps/<chapter>.txt) to read while writing it.
Routing = bank chapter default + keyword overrides; it is only a starting point,
the chapter writer moves facts where they belong.

    python -I scripts/route.py
"""
import json, os, re, sys
import yaml
sys.path.insert(0, os.path.dirname(__file__))
import check_sources

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEFAULT = {
    "CH00": "misc-symbols", "CH01": "geo-physio", "CH02": "geo-forests", "CH03": "his-ancient",
    "CH04": "his-british", "CH05": "his-statehood", "CH06": "pol-state", "CH07": "geo-population",
    "CH08": "eco-agriculture", "CH09": "eco-economy", "CH10": "eco-schemes", "CH11": "cul-folk",
    "CH12": "cul-temples", "CH13": "eco-industry", "CH14": "misc-education",
}
# (bank chapters it applies to, regex on question + answer, target); first match wins
RULES = [
    ({"CH00", "CH01"}, r"border|district|tehsil|division|latitude|longitude|area of|sq ?km|mandal|block", "geo-intro"),
    ({"CH00", "CH01", "CH13"}, r"earthquake|landslide|flood|cloudburst|disaster|glof|seismic|rainfall|climate|monsoon|radar|sdrf|usdma|avalanche|subsidence|western disturbance|tunnel collapse|silkyara", "geo-climate"),
    ({"CH00", "CH01", "CH13"}, r"mineral|magnesite|limestone|graphite|marble|soapstone|gold|copper|dolomite|baryte|phosphorite|mining|gypsum", "geo-minerals"),
    ({"CH00", "CH13", "CH09", "CH10"}, r"hydro|\bdam\b|\bmw\b|power|energy|solar|electric|barrage|ujvn|thdc|pitkul", "geo-minerals"),
    ({"CH03"}, r"katyur|chand\b|chand |kumaon king|baz bahadur|rudra ?chand|udyot|jagat chand|lakhudiyar|almora (?:was|founded)", "his-katyuri"),
    ({"CH03"}, r"parmar|panwar|pal dynasty|ajay ?pal|kanakpal|garhwal king|52 garh|bawan garh|chandpur garh|devalgarh|srinagar (?:capital|garhwal)|mahipati|prithvipati|rani karnavati|teelu", "his-garhwal"),
    ({"CH04", "CH03", "CH00"}, r"gorkha|gurkha|commissioner|traill|batten|ramsay|sugauli|british rule|settlement|bandobast|east india|tehri (?:state|riyasat|king|princely)|sudarshan shah|kirti shah|narendra shah|manvendra|1815|1857|kalu mehra", "his-british"),
    ({"CH04", "CH00"}, r"coolie|begar|congress|freedom|satyagraha|quit india|salt|non-?cooperation|newspaper|akhbar|shakti|garhwali (?:newspaper|patrika)|kumaon parishad|dola[- ]palki|peshawar|chandra singh|sridev suman|tiladi|praja mandal|azad hind|ina\b", "his-freedom"),
    ({"CH04", "CH05", "CH00"}, r"statehood|separate state|uttarakhand kranti dal|ukd|rampur tiraha|khatima|mussoorie firing|1994|9 november 2000|gairsain|capital", "his-statehood"),
    ({"CH06"}, r"panchayat|municipal|nagar nigam|nagar palika|local bod|commission|lokayukta|public service|election commission|women'?s commission|information commission", "pol-local"),
    ({"CH11"}, r"tribe|tribal|bhotia|bhotiya|jaunsari|tharu|buksa|boksa|raji|van ?raji|jad\b|marchha|johari|shauka", "cul-tribes"),
    ({"CH11", "CH12"}, r"\bmela\b|fair|festival|tyohar|yatra|raj ?jat|kumbh|harela|phool ?dei|ghee sankranti|uttarayani|nanda devi (?:mela|raj)|bagwal|holi|egas|bikhauti", "cul-fairs"),
    ({"CH11", "CH14", "CH00"}, r"dialect|language|bol[iy]|garhwali (?:poet|literature|language)|kumaoni (?:poet|literature|language)|poet|author|wrote|book|novel|poem|literature|proverb|kahawat|gazetteer|sahitya", "cul-language"),
    ({"CH14", "CH00"}, r"sport|games|medal|olympic|cricket|football|hockey|athlete|badminton|boxing|wrestling|khel|mountaineer|everest|national games|stadium|player", "misc-sports"),
    ({"CH14", "CH00", "CH11"}, r"award|padma|samman|ratna|bharat ratna|param ?vir|chakra|first (?:woman|man|indian|person)|born|known as|regiment|army|soldier|gallantry", "misc-people"),
    ({"CH13"}, r"airport|railway|rail|road|highway|ropeway|tunnel|transport|bus|helicopter|heliport|airstrip|seaplane", "eco-industry"),
    ({"CH00"}, r"emblem|symbol|state (?:animal|bird|tree|flower|butterfly|game|instrument|song|fish)|nickname|called the|known as", "misc-symbols"),
]


def route(q):
    text = (q["q_en"] + " " + q["ans_en"]).lower()
    ch = q["ch"]
    if q["sec"] != "UKGK":
        return "misc-current"
    for scope, rx, target in RULES:
        if ch in scope and re.search(rx, text):
            return target
    return DEFAULT.get(ch, "misc-symbols")


def main():
    unplaced, bank, cited, placed = check_sources.main()
    disp = yaml.safe_load(open(os.path.join(HERE, "data", "disposition.yaml"), encoding="utf-8")) or {}
    later = {check_sources.qid("Q:" + k) if not k.startswith(("UKPCS", "GEN")) else k: v.split(":", 1)[1].split()[0]
             for k, v in disp.items() if str(v).startswith("later:")}
    out = {}
    for qid in unplaced:
        out.setdefault(later.get(qid) or route(bank[qid]), []).append(qid)
    d = os.path.join(HERE, "data", "dumps")
    os.makedirs(d, exist_ok=True)
    for f in os.listdir(d):
        os.remove(os.path.join(d, f))
    for chap, ids in sorted(out.items()):
        with open(os.path.join(d, f"{chap}.txt"), "w", encoding="utf-8") as fh:
            for qid in ids:
                q = bank[qid]
                short = qid.replace("UKPCS-UKGK-CH", "")
                one = lambda s, n: re.sub(r"\s+", " ", s)[:n]
                fh.write(f"{short}|{q['use'][0]}| {one(q['q_en'], 420)} => {one(q['ans_en'], 140)} || {one(q['ex_en'], 300)}\n")
        print(f"{chap:16} {len(ids)}")


if __name__ == "__main__":
    main()
