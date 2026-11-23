import type { Metadata } from "next";
import Link from "next/link";
import ExamGuide, { type Faq, type Fact, type GuideSection } from "@/components/ExamGuide";

/**
 * Free guide: UKPSC Lower PCS 2026 notification, eligibility, pattern, syllabus.
 * Facts checked on 23 Nov 2026 against news reports of UKPSC's advertisement
 * of 6 Nov 2026 (two reports agreeing) and UKPSC's 2026-27 exam calendar.
 * Update this file when UKPSC publishes the admit card, answer key or result.
 */

const PATH = "/ukpsc-lower-pcs-2026";

export const metadata: Metadata = {
  title: "UKPSC Lower PCS 2026: Notification, 54 Posts, Syllabus, Exam Pattern & Date",
  description:
    "UKPSC Lower PCS 2026 in Hindi and English: 54 posts (Nayab Tehsildar, Excise, Supply, Marketing Inspector and more), last date 26 Nov, prelims 27 Dec 2026, 150-question pattern, syllabus, eligibility, fee and mains scheme.",
  keywords: [
    "UKPSC Lower PCS 2026",
    "UKPSC Lower PCS notification 2026",
    "Lower PCS syllabus",
    "UKPSC Lower PCS exam date",
    "UKPSC Lower PCS exam pattern",
    "Nayab Tehsildar Uttarakhand",
    "उत्तराखंड लोअर पीसीएस 2026",
    "लोअर पीसीएस सिलेबस",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: "UKPSC Lower PCS 2026: Notification, Syllabus, Pattern & Exam Date",
    description: "54 posts, prelims 27 Dec 2026 (proposed), 150 questions in 2 hours. Full guide in Hindi and English.",
    url: PATH,
    type: "article",
  },
};

const posts: [string, string, number][] = [
  ["Nayab Tehsildar", "नायब तहसीलदार", 13],
  ["Marketing Inspector", "विपणन निरीक्षक", 20],
  ["Labour Enforcement Officer", "श्रम प्रवर्तन अधिकारी", 5],
  ["Tax Officer, Zila Panchayat", "कर अधिकारी, जिला पंचायत", 5],
  ["Excise Inspector", "आबकारी निरीक्षक", 4],
  ["Cane Development Inspector", "गन्ना विकास निरीक्षक", 4],
  ["Supply Inspector", "पूर्ति निरीक्षक", 2],
  ["Senior Cane Development Inspector", "ज्येष्ठ गन्ना विकास निरीक्षक", 1],
];

const facts: Fact[] = [
  { label: "Exam", labelHi: "परीक्षा", value: "UKPSC Lower Subordinate Services (Lower PCS) 2026", valueHi: "उत्तराखंड सम्मिलित अवर अधीनस्थ सेवा (लोअर पीसीएस) 2026" },
  { label: "Advertisement", labelHi: "विज्ञापन", value: "6 November 2026", valueHi: "6 नवंबर 2026" },
  { label: "Total posts", labelHi: "कुल पद", value: "54 posts in 8 services", valueHi: "8 सेवाओं में 54 पद" },
  { label: "Apply online", labelHi: "ऑनलाइन आवेदन", value: "6 Nov to 26 Nov 2026 (till 11:59 pm)", valueHi: "6 नवंबर से 26 नवंबर 2026 (रात 11:59 तक)" },
  { label: "Correction window", labelHi: "संशोधन विंडो", value: "3 Dec to 12 Dec 2026", valueHi: "3 दिसंबर से 12 दिसंबर 2026" },
  { label: "Prelims date", labelHi: "प्रारंभिक परीक्षा तिथि", value: "Sunday 27 December 2026 (proposed in UKPSC's exam calendar)", valueHi: "रविवार 27 दिसंबर 2026 (UKPSC कैलेंडर में प्रस्तावित)" },
  { label: "Age", labelHi: "आयु", value: "21 to 42 years on 1 July 2026", valueHi: "1 जुलाई 2026 को 21 से 42 वर्ष" },
  { label: "Qualification", labelHi: "योग्यता", value: "Graduation (Agriculture degree for Cane Development Inspector posts)", valueHi: "स्नातक (गन्ना विकास निरीक्षक पदों के लिए कृषि में डिग्री)" },
  { label: "Prelims paper", labelHi: "प्रारंभिक प्रश्नपत्र", value: "150 questions, 150 marks, 2 hours, ¼ negative marking", valueHi: "150 प्रश्न, 150 अंक, 2 घंटे, ¼ ऋणात्मक अंकन" },
];

const sections: GuideSection[] = [
  {
    id: "posts",
    h: "Lower PCS 2026 posts (54)",
    hHi: "लोअर पीसीएस 2026 के पद (54)",
    en: (
      <>
        <p>UKPSC&apos;s advertisement of 6 November 2026 has 54 posts across 8 services:</p>
        <ul className="list-disc space-y-1 pl-5">
          {posts.map(([en, , n]) => (
            <li key={en}>
              {en}: <strong className="text-white">{n}</strong>
            </li>
          ))}
        </ul>
      </>
    ),
    hi: (
      <>
        <p>6 नवंबर 2026 के विज्ञापन में 8 सेवाओं के कुल 54 पद हैं:</p>
        <ul className="list-disc space-y-1 pl-5">
          {posts.map(([en, hi, n]) => (
            <li key={en}>
              {hi}: {n}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "eligibility",
    h: "Eligibility and fee",
    hHi: "पात्रता और शुल्क",
    en: (
      <>
        <p>
          <strong className="text-white">Age:</strong> 21 to 42 years on 1 July 2026, with age relaxation for reserved categories as per
          Uttarakhand government rules.
        </p>
        <p>
          <strong className="text-white">Education:</strong> a bachelor&apos;s degree from a recognised university. The Cane Development
          Inspector posts need a degree in Agriculture. Some posts give preference to Territorial Army service or NCC certificates;
          check the post-wise conditions in the advertisement.
        </p>
        <p>
          <strong className="text-white">Fee:</strong> General, EWS and OBC ₹150 + ₹16.36 processing = ₹166.36. Uttarakhand SC, ST and
          PwD ₹60 + ₹16.36 = ₹76.36.
        </p>
      </>
    ),
    hi: (
      <>
        <p>
          <strong>आयु:</strong> 1 जुलाई 2026 को 21 से 42 वर्ष; आरक्षित वर्गों को उत्तराखंड शासन के नियमों के अनुसार छूट।
        </p>
        <p>
          <strong>शैक्षिक योग्यता:</strong> मान्यता प्राप्त विश्वविद्यालय से स्नातक। गन्ना विकास निरीक्षक पदों के लिए कृषि में डिग्री। कुछ पदों पर
          प्रादेशिक सेना या NCC प्रमाणपत्र को अधिमान; पदवार शर्तें विज्ञापन में देखें।
        </p>
        <p>
          <strong>शुल्क:</strong> सामान्य, EWS और OBC ₹150 + ₹16.36 = ₹166.36। उत्तराखंड के SC, ST और दिव्यांग ₹60 + ₹16.36 = ₹76.36।
        </p>
      </>
    ),
  },
  {
    id: "pattern",
    h: "Exam pattern: prelims, mains and interview",
    hHi: "परीक्षा पैटर्न: प्रारंभिक, मुख्य और साक्षात्कार",
    en: (
      <>
        <p>
          <strong className="text-white">Prelims (objective):</strong> one paper of 150 questions and 150 marks in 2 hours: 100 questions of
          General Studies and 50 of General Aptitude (reasoning and maths). A quarter mark is cut for each wrong answer; a question left
          blank costs nothing.
        </p>
        <p>
          <strong className="text-white">Mains (written):</strong> General Hindi 100 marks, Essay 100 marks, General Studies I 200 marks and
          General Studies II 200 marks: 600 marks in all.
        </p>
        <p>
          <strong className="text-white">Interview:</strong> 75 marks.
        </p>
      </>
    ),
    hi: (
      <>
        <p>
          <strong>प्रारंभिक परीक्षा (वस्तुनिष्ठ):</strong> 2 घंटे में 150 प्रश्न, 150 अंक: 100 प्रश्न सामान्य अध्ययन और 50 सामान्य बुद्धि परीक्षण
          (रीज़निंग और गणित)। हर गलत उत्तर पर ¼ अंक कटेगा; छोड़े गए प्रश्न पर कोई कटौती नहीं।
        </p>
        <p>
          <strong>मुख्य परीक्षा (लिखित):</strong> सामान्य हिंदी 100, निबंध 100, सामान्य अध्ययन I 200 और सामान्य अध्ययन II 200: कुल 600 अंक।
        </p>
        <p>
          <strong>साक्षात्कार:</strong> 75 अंक।
        </p>
      </>
    ),
  },
  {
    id: "syllabus",
    h: "Prelims syllabus",
    hHi: "प्रारंभिक परीक्षा का पाठ्यक्रम",
    en: (
      <>
        <p>
          <strong className="text-white">General Studies (100 questions):</strong>
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>General Science and computer knowledge</li>
          <li>History of India and the freedom movement</li>
          <li>Indian Polity and Economy, including Panchayati Raj</li>
          <li>Geography and demography of India</li>
          <li>Current events</li>
          <li>History and culture of Uttarakhand</li>
          <li>Geography and demography of Uttarakhand</li>
          <li>Economic, political and administrative background of Uttarakhand; its economic and natural resources</li>
        </ul>
        <p>
          <strong className="text-white">General Aptitude (50 questions):</strong> verbal and non-verbal reasoning, number series,
          arithmetical reasoning and similar topics.
        </p>
        <p>
          Topic-wise past questions are in our free <Link href="/pyq-tracker" className="text-saffron-300 underline">PYQ Tracker</Link>.
        </p>
      </>
    ),
    hi: (
      <>
        <p>
          <strong>सामान्य अध्ययन (100 प्रश्न):</strong>
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>सामान्य विज्ञान और कंप्यूटर ज्ञान</li>
          <li>भारत का इतिहास और स्वतंत्रता आंदोलन</li>
          <li>भारतीय राजव्यवस्था और अर्थव्यवस्था, पंचायती राज सहित</li>
          <li>भारत का भूगोल और जनांकिकी</li>
          <li>समसामयिक घटनाएँ</li>
          <li>उत्तराखंड का इतिहास और संस्कृति</li>
          <li>उत्तराखंड का भूगोल और जनांकिकी</li>
          <li>उत्तराखंड की आर्थिक, राजनीतिक और प्रशासनिक पृष्ठभूमि; आर्थिक और प्राकृतिक संसाधन</li>
        </ul>
        <p>
          <strong>सामान्य बुद्धि परीक्षण (50 प्रश्न):</strong> शाब्दिक और अशाब्दिक तर्कशक्ति, संख्या श्रृंखला, अंकगणितीय तर्क आदि।
        </p>
      </>
    ),
  },
  {
    id: "strategy",
    h: "How to prepare in the time left",
    hHi: "बचे हुए समय में तैयारी कैसे करें",
    en: (
      <>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-white">Uttarakhand GK first.</strong> History, culture, geography and economy of Uttarakhand are named
            separately in the syllabus. Revise them from one source again and again.
          </li>
          <li>
            <strong className="text-white">Do not skip General Aptitude.</strong> 50 of the 150 marks come from reasoning and maths, and
            practice improves speed quickly.
          </li>
          <li>
            <strong className="text-white">Solve full 2-hour mocks.</strong> With ¼ negative marking, a few full papers teach you when to
            leave a question.
          </li>
          <li>
            <strong className="text-white">Read past papers.</strong> UKPSC repeats themes; see our{" "}
            <Link href="/ukpsc-previous-year-papers" className="text-saffron-300 underline">
              previous year papers guide
            </Link>
            .
          </li>
        </ul>
        <p>
          Start with the <Link href="/lower-pcs" className="text-saffron-300 underline">free Lower PCS mock test</Link> (150 questions, 2
          hours, explanations in Hindi and English) to see where you stand.
        </p>
      </>
    ),
    hi: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          <strong>पहले उत्तराखंड GK।</strong> पाठ्यक्रम में उत्तराखंड का इतिहास, संस्कृति, भूगोल और अर्थव्यवस्था अलग से दिए गए हैं; एक ही स्रोत से
          बार-बार दोहराएँ।
        </li>
        <li>
          <strong>सामान्य बुद्धि को न छोड़ें।</strong> 150 में से 50 अंक रीज़निंग और गणित से हैं, और अभ्यास से गति जल्दी बढ़ती है।
        </li>
        <li>
          <strong>पूरे 2 घंटे के मॉक हल करें।</strong> ¼ ऋणात्मक अंकन में कब प्रश्न छोड़ना है, यह मॉक से ही आता है।
        </li>
        <li>
          <strong>पिछले वर्ष के प्रश्नपत्र पढ़ें।</strong> UKPSC विषयों को दोहराता है; पहले फ्री लोअर पीसीएस मॉक टेस्ट दें।
        </li>
      </ul>
    ),
  },
];

const faqs: Faq[] = [
  {
    q: "What is the last date to apply for UKPSC Lower PCS 2026?",
    qHi: "UKPSC लोअर पीसीएस 2026 के आवेदन की अंतिम तिथि क्या है?",
    a: "26 November 2026, till 11:59 pm. Corrections to the form can be made from 3 to 12 December 2026.",
    aHi: "26 नवंबर 2026, रात 11:59 तक। फॉर्म में संशोधन 3 से 12 दिसंबर 2026 तक किया जा सकता है।",
  },
  {
    q: "When is the UKPSC Lower PCS 2026 prelims exam?",
    qHi: "UKPSC लोअर पीसीएस 2026 की प्रारंभिक परीक्षा कब है?",
    a: "UKPSC's 2026-27 exam calendar proposes Sunday 27 December 2026. Confirm the date on the admit card.",
    aHi: "UKPSC के 2026-27 परीक्षा कैलेंडर में रविवार 27 दिसंबर 2026 प्रस्तावित है। तिथि प्रवेश पत्र से पुष्टि करें।",
  },
  {
    q: "How many posts are there in UKPSC Lower PCS 2026?",
    qHi: "UKPSC लोअर पीसीएस 2026 में कितने पद हैं?",
    a: "54 posts in 8 services, including 13 Nayab Tehsildar, 20 Marketing Inspector and 4 Excise Inspector posts.",
    aHi: "8 सेवाओं में 54 पद, जिनमें 13 नायब तहसीलदार, 20 विपणन निरीक्षक और 4 आबकारी निरीक्षक के पद हैं।",
  },
  {
    q: "Is there negative marking in the Lower PCS prelims?",
    qHi: "क्या लोअर पीसीएस प्रारंभिक परीक्षा में ऋणात्मक अंकन है?",
    a: "Yes. One quarter of the marks of a question is cut for each wrong answer. There is no penalty for a question left blank.",
    aHi: "हाँ। हर गलत उत्तर पर उस प्रश्न के ¼ अंक कटते हैं। छोड़े गए प्रश्न पर कोई कटौती नहीं।",
  },
  {
    q: "Are the Lower PCS and RO/ARO prelims syllabus the same?",
    qHi: "क्या लोअर पीसीएस और RO/ARO प्रारंभिक का पाठ्यक्रम एक जैसा है?",
    a: "Yes, both prelims have 150 questions in 2 hours: 100 General Studies and 50 General Aptitude. So one preparation covers both exams.",
    aHi: "हाँ, दोनों में 2 घंटे में 150 प्रश्न होते हैं: 100 सामान्य अध्ययन और 50 सामान्य बुद्धि। इसलिए एक तैयारी से दोनों परीक्षाएँ।",
  },
  {
    q: "What is the age limit for UKPSC Lower PCS 2026?",
    qHi: "UKPSC लोअर पीसीएस 2026 की आयु सीमा क्या है?",
    a: "21 to 42 years on 1 July 2026, with relaxation for reserved categories as per Uttarakhand government rules.",
    aHi: "1 जुलाई 2026 को 21 से 42 वर्ष; आरक्षित वर्गों को उत्तराखंड शासन के नियमानुसार छूट।",
  },
];

export default function LowerPcsGuidePage() {
  return (
    <ExamGuide
      path={PATH}
      crumb="UKPSC Lower PCS 2026"
      kicker="Notification · Syllabus · Pattern · Exam date"
      title="UKPSC Lower PCS 2026: Notification, Syllabus and Exam Pattern"
      titleHi="UKPSC लोअर पीसीएस 2026: अधिसूचना, पाठ्यक्रम और परीक्षा पैटर्न"
      intro="Everything about the Uttarakhand Lower PCS 2026 exam on one page: the 54 posts, eligibility, fee, last date, prelims date, exam pattern and syllabus, with a plan for the weeks left."
      introHi="उत्तराखंड लोअर पीसीएस 2026 की पूरी जानकारी एक पेज पर: 54 पद, पात्रता, शुल्क, अंतिम तिथि, प्रारंभिक परीक्षा तिथि, परीक्षा पैटर्न और पाठ्यक्रम, साथ में बचे हुए हफ्तों की रणनीति।"
      updated="23 Nov 2026"
      updatedIso="2026-11-23"
      facts={facts}
      factsNote="Dates and numbers as reported from UKPSC's advertisement of 6 Nov 2026 and its 2026-27 exam calendar. Check the official notice before you apply."
      sections={sections}
      faqs={faqs}
      cta={{
        href: "/lower-pcs",
        label: "Lower PCS + RO/ARO course",
        labelHi: "कोर्स देखें",
        text: "One course for both exams: 65+ video lessons with PDF notes, 67 tests (10 full-length), CSAT classes and 12 CSAT sectional tests, valid till 30 April 2027. Made by Bhanu Joshi, UKPSC Rank 9.",
        textHi: "दोनों परीक्षाओं के लिए एक कोर्स: PDF नोट्स के साथ 65+ वीडियो, 67 टेस्ट (10 फुल लेंथ), CSAT क्लास और 12 CSAT सेक्शनल टेस्ट, 30 अप्रैल 2027 तक मान्य।",
      }}
      related={[
        { href: "/ukpsc-ro-aro", label: "UKPSC RO/ARO exam guide", labelHi: "RO/ARO परीक्षा गाइड" },
        { href: "/ukpsc-previous-year-papers", label: "Previous year papers", labelHi: "पिछले वर्ष के प्रश्नपत्र" },
        { href: "/uttarakhand-gk-quiz", label: "Free Uttarakhand GK practice", labelHi: "फ्री उत्तराखंड GK अभ्यास" },
        { href: "/pyq-tracker", label: "PYQ Tracker", labelHi: "PYQ ट्रैकर" },
      ]}
      sources={[{ href: "https://psc.uk.gov.in", label: "Uttarakhand Public Service Commission (psc.uk.gov.in)", note: "advertisements, admit cards, answer keys, results" }]}
    />
  );
}
