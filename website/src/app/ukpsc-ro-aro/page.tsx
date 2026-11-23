import type { Metadata } from "next";
import Link from "next/link";
import ExamGuide, { type Faq, type Fact, type GuideSection } from "@/components/ExamGuide";

/**
 * Free guide: UKPSC RO/ARO (Review Officer / Assistant Review Officer).
 * As of 23 Nov 2026 the 2026 advertisement is not out, so no 2026 dates,
 * posts or fee are given here. Add them when UKPSC publishes the advertisement.
 */

const PATH = "/ukpsc-ro-aro";

export const metadata: Metadata = {
  title: "UKPSC RO/ARO 2026-27: Exam Pattern, Syllabus, Notification & Preparation",
  description:
    "UKPSC Review Officer / Assistant Review Officer (RO/ARO) prelims in Hindi and English: 150 questions in 2 hours, same syllabus as Lower PCS, notification status, previous cycle and how to prepare.",
  keywords: [
    "UKPSC RO ARO",
    "UKPSC RO ARO 2026",
    "UKPSC RO ARO syllabus",
    "UKPSC RO ARO exam pattern",
    "Uttarakhand Review Officer exam",
    "समीक्षा अधिकारी सहायक समीक्षा अधिकारी उत्तराखंड",
    "UKPSC आरओ एआरओ सिलेबस",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: "UKPSC RO/ARO 2026-27: Pattern, Syllabus & Preparation",
    description: "Same prelims syllabus as Lower PCS: 150 questions, 2 hours. Guide in Hindi and English.",
    url: PATH,
    type: "article",
  },
};

const facts: Fact[] = [
  { label: "Exam", labelHi: "परीक्षा", value: "Review Officer / Assistant Review Officer (RO/ARO)", valueHi: "समीक्षा अधिकारी / सहायक समीक्षा अधिकारी" },
  { label: "Conducted by", labelHi: "आयोजक", value: "Uttarakhand Public Service Commission (UKPSC)", valueHi: "उत्तराखंड लोक सेवा आयोग" },
  {
    label: "2026 notification",
    labelHi: "2026 अधिसूचना",
    value: "Not released yet (as of 23 Nov 2026)",
    valueHi: "अभी जारी नहीं (23 नवंबर 2026 तक)",
  },
  { label: "Prelims", labelHi: "प्रारंभिक परीक्षा", value: "Expected in late April 2027; UKPSC will confirm the date", valueHi: "अप्रैल 2027 के अंत में संभावित; तिथि UKPSC घोषित करेगा" },
  { label: "Prelims paper", labelHi: "प्रारंभिक प्रश्नपत्र", value: "150 questions in 2 hours: 100 General Studies + 50 General Aptitude", valueHi: "2 घंटे में 150 प्रश्न: 100 सामान्य अध्ययन + 50 सामान्य बुद्धि" },
  { label: "Same as", labelHi: "किसके समान", value: <Link href="/ukpsc-lower-pcs-2026" className="text-saffron-300 underline">Lower PCS prelims syllabus</Link>, valueHi: "लोअर पीसीएस प्रारंभिक पाठ्यक्रम" },
];

const sections: GuideSection[] = [
  {
    id: "pattern",
    h: "RO/ARO exam pattern",
    hHi: "RO/ARO परीक्षा पैटर्न",
    en: (
      <>
        <p>
          The RO/ARO prelims has the same pattern and syllabus as the Lower PCS prelims: 150 questions in 2 hours, 100 from General
          Studies and 50 from General Aptitude (reasoning and maths), with negative marking for wrong answers.
        </p>
        <p>
          Candidates who clear the prelims write the mains, and the selection also has a typing test. In the 2023 cycle, 2,285
          candidates qualified the prelims for the mains, and UKPSC held a typing test after the mains result.
        </p>
      </>
    ),
    hi: (
      <>
        <p>
          RO/ARO प्रारंभिक परीक्षा का पैटर्न और पाठ्यक्रम लोअर पीसीएस प्रारंभिक जैसा ही है: 2 घंटे में 150 प्रश्न, 100 सामान्य अध्ययन और 50 सामान्य
          बुद्धि (रीज़निंग और गणित), गलत उत्तर पर ऋणात्मक अंकन।
        </p>
        <p>
          प्रारंभिक पास करने वाले मुख्य परीक्षा देते हैं, और चयन में टाइपिंग टेस्ट भी होता है। 2023 की भर्ती में 2,285 अभ्यर्थी मुख्य परीक्षा के लिए
          सफल हुए थे, और मुख्य परिणाम के बाद UKPSC ने टाइपिंग टेस्ट लिया था।
        </p>
      </>
    ),
  },
  {
    id: "syllabus",
    h: "RO/ARO prelims syllabus",
    hHi: "RO/ARO प्रारंभिक पाठ्यक्रम",
    en: (
      <>
        <p>
          General Studies covers Indian history and the freedom movement, Indian polity and economy, geography of India, general science,
          current events, and the history, culture, geography and economy of Uttarakhand. General Aptitude covers reasoning, number series
          and arithmetic.
        </p>
        <p>
          The full topic list is on our <Link href="/ukpsc-lower-pcs-2026#syllabus" className="text-saffron-300 underline">Lower PCS 2026 guide</Link>.
        </p>
      </>
    ),
    hi: (
      <p>
        सामान्य अध्ययन में भारत का इतिहास और स्वतंत्रता आंदोलन, भारतीय राजव्यवस्था और अर्थव्यवस्था, भारत का भूगोल, सामान्य विज्ञान, समसामयिकी
        तथा उत्तराखंड का इतिहास, संस्कृति, भूगोल और अर्थव्यवस्था आते हैं। सामान्य बुद्धि में रीज़निंग, संख्या श्रृंखला और अंकगणित।
      </p>
    ),
  },
  {
    id: "prepare",
    h: "Prepare for Lower PCS and RO/ARO together",
    hHi: "लोअर पीसीएस और RO/ARO की तैयारी साथ में",
    en: (
      <>
        <p>
          Lower PCS prelims comes first (proposed for 27 December 2026), and the RO/ARO prelims is expected in late April 2027. Because the syllabus is the same, everything you prepare for it
          carries straight into RO/ARO. After Lower PCS, spend the extra months on full mocks, General Aptitude speed and Uttarakhand
          current affairs.
        </p>
        <p>
          Practise for free: the <Link href="/lower-pcs" className="text-saffron-300 underline">free Lower PCS mock</Link> follows the same
          150-question pattern.
        </p>
      </>
    ),
    hi: (
      <p>
        पहले लोअर पीसीएस प्रारंभिक (27 दिसंबर 2026 प्रस्तावित) है, और RO/ARO प्रारंभिक अप्रैल 2027 के अंत में संभावित है। पाठ्यक्रम एक होने से उसकी पूरी तैयारी RO/ARO में काम आती है। लोअर पीसीएस के बाद
        के महीनों में फुल मॉक, सामान्य बुद्धि की गति और उत्तराखंड समसामयिकी पर ध्यान दें।
      </p>
    ),
  },
];

const faqs: Faq[] = [
  {
    q: "Is the UKPSC RO/ARO 2026 notification out?",
    qHi: "क्या UKPSC RO/ARO 2026 की अधिसूचना आ गई है?",
    a: "Not yet, as of 23 November 2026. This page will be updated when UKPSC publishes the advertisement on psc.uk.gov.in.",
    aHi: "23 नवंबर 2026 तक नहीं। UKPSC द्वारा psc.uk.gov.in पर विज्ञापन जारी होते ही यह पेज अपडेट होगा।",
  },
  {
    q: "Is the RO/ARO syllabus the same as Lower PCS?",
    qHi: "क्या RO/ARO का पाठ्यक्रम लोअर पीसीएस जैसा है?",
    a: "Yes, for the prelims: 150 questions in 2 hours, 100 General Studies and 50 General Aptitude. One preparation covers both exams.",
    aHi: "हाँ, प्रारंभिक परीक्षा के लिए: 2 घंटे में 150 प्रश्न, 100 सामान्य अध्ययन और 50 सामान्य बुद्धि। एक तैयारी से दोनों परीक्षाएँ।",
  },
  {
    q: "Is there a typing test for UKPSC RO/ARO?",
    qHi: "क्या UKPSC RO/ARO में टाइपिंग टेस्ट होता है?",
    a: "Yes. In the 2023 cycle UKPSC held a typing test after the mains result. Check the exact speed rule in the new advertisement.",
    aHi: "हाँ। 2023 की भर्ती में मुख्य परिणाम के बाद टाइपिंग टेस्ट हुआ था। गति का नियम नए विज्ञापन में देखें।",
  },
];

export default function RoAroGuidePage() {
  return (
    <ExamGuide
      path={PATH}
      crumb="UKPSC RO/ARO"
      kicker="Review Officer · Assistant Review Officer"
      title="UKPSC RO/ARO 2026-27: Exam Pattern, Syllabus and Preparation"
      titleHi="UKPSC RO/ARO 2026-27: परीक्षा पैटर्न, पाठ्यक्रम और तैयारी"
      intro="The UKPSC Review Officer and Assistant Review Officer prelims has the same syllabus as Lower PCS. Here is the pattern, the notification status and how to prepare for both exams together."
      introHi="UKPSC समीक्षा अधिकारी और सहायक समीक्षा अधिकारी प्रारंभिक परीक्षा का पाठ्यक्रम लोअर पीसीएस जैसा है। यहाँ पैटर्न, अधिसूचना की स्थिति और दोनों परीक्षाओं की साथ तैयारी का तरीका है।"
      updated="23 Nov 2026"
      updatedIso="2026-11-23"
      facts={facts}
      sections={sections}
      faqs={faqs}
      cta={{
        href: "/lower-pcs",
        label: "Lower PCS + RO/ARO course",
        labelHi: "कोर्स देखें",
        text: "One course, two exams: 65+ video lessons with PDF notes, 67 tests (10 full-length), CSAT classes and 12 CSAT sectional tests, valid till 30 April 2027.",
        textHi: "एक कोर्स, दो परीक्षाएँ: PDF नोट्स के साथ 65+ वीडियो, 67 टेस्ट (10 फुल लेंथ), CSAT क्लास और 12 CSAT सेक्शनल टेस्ट, 30 अप्रैल 2027 तक मान्य।",
      }}
      related={[
        { href: "/ukpsc-lower-pcs-2026", label: "UKPSC Lower PCS 2026 guide", labelHi: "लोअर पीसीएस 2026 गाइड" },
        { href: "/ukpsc-previous-year-papers", label: "Previous year papers", labelHi: "पिछले वर्ष के प्रश्नपत्र" },
        { href: "/uttarakhand-gk-quiz", label: "Free Uttarakhand GK practice", labelHi: "फ्री उत्तराखंड GK अभ्यास" },
        { href: "/current-affairs", label: "Daily current affairs", labelHi: "दैनिक समसामयिकी" },
      ]}
      sources={[{ href: "https://psc.uk.gov.in", label: "Uttarakhand Public Service Commission (psc.uk.gov.in)", note: "advertisements and results" }]}
    />
  );
}
