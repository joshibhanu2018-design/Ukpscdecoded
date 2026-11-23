import type { Metadata } from "next";
import Link from "next/link";
import ExamGuide, { type Faq, type GuideSection } from "@/components/ExamGuide";

/**
 * Free hub: UKPSC previous year papers. Links to the official UKPSC site for
 * the question papers and answer keys, and to our own free PYQ material.
 * When solved Lower PCS / RO-ARO paper PDFs are ready, add them under "papers".
 */

const PATH = "/ukpsc-previous-year-papers";

export const metadata: Metadata = {
  title: "UKPSC Previous Year Papers: Lower PCS, RO/ARO & Upper PCS PYQ with Analysis",
  description:
    "Where to get UKPSC previous year question papers and answer keys, plus free topic-wise PYQ analysis (Uttarakhand and National), a free 150-question Lower PCS mock and the 2026 prelims answer key. Hindi and English.",
  keywords: [
    "UKPSC previous year papers",
    "UKPSC previous year question paper PDF",
    "UKPSC Lower PCS previous year paper",
    "UKPSC RO ARO previous year paper",
    "UKPSC PYQ",
    "UKPSC answer key",
    "UKPSC पिछले वर्ष के प्रश्न पत्र",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: "UKPSC Previous Year Papers & PYQ Analysis",
    description: "Official papers and answer keys, plus free topic-wise PYQ analysis and mocks.",
    url: PATH,
    type: "article",
  },
};

const sections: GuideSection[] = [
  {
    id: "official",
    h: "Official question papers and answer keys",
    hHi: "आधिकारिक प्रश्नपत्र और उत्तर कुंजी",
    en: (
      <>
        <p>
          UKPSC publishes the answer key of each exam on its website, psc.uk.gov.in, with a short window for objections. Download the
          paper and the final key from there, and solve the paper in 2 hours before you look at the answers.
        </p>
        <p>
          For the 2026 Upper PCS prelims, use our <Link href="/answer-key" className="text-saffron-300 underline">answer key and score calculator</Link>.
        </p>
      </>
    ),
    hi: (
      <p>
        UKPSC हर परीक्षा की उत्तर कुंजी अपनी वेबसाइट psc.uk.gov.in पर आपत्ति के समय के साथ जारी करता है। प्रश्नपत्र और अंतिम उत्तर कुंजी वहीं से लें,
        और उत्तर देखने से पहले प्रश्नपत्र 2 घंटे में हल करें। 2026 अपर पीसीएस प्रारंभिक के लिए हमारा उत्तर कुंजी और स्कोर कैलकुलेटर देखें।
      </p>
    ),
  },
  {
    id: "analysis",
    h: "Topic-wise PYQ analysis (free)",
    hHi: "विषयवार PYQ विश्लेषण (फ्री)",
    en: (
      <>
        <p>
          Reading papers year by year hides the pattern. Our free <Link href="/pyq-tracker" className="text-saffron-300 underline">PYQ Tracker</Link>{" "}
          groups past UKPSC questions by topic for Uttarakhand and National subjects, with a priority tag for each topic and a 60-day plan.
          Uttarakhand and National PYQ tracker PDFs are on the <Link href="/free-content" className="text-saffron-300 underline">free resources</Link> page.
        </p>
      </>
    ),
    hi: (
      <p>
        साल-दर-साल प्रश्नपत्र पढ़ने से पैटर्न नहीं दिखता। हमारा फ्री PYQ ट्रैकर उत्तराखंड और राष्ट्रीय विषयों के पिछले प्रश्नों को विषयवार, प्राथमिकता
        के साथ दिखाता है, और 60 दिन की योजना भी देता है। PDF ट्रैकर फ्री संसाधन पेज पर हैं।
      </p>
    ),
  },
  {
    id: "practice",
    h: "Practise on the Lower PCS pattern",
    hHi: "लोअर पीसीएस पैटर्न पर अभ्यास",
    en: (
      <>
        <p>
          After the past papers, take the <Link href="/lower-pcs" className="text-saffron-300 underline">free Lower PCS mock</Link>: 150 questions
          in 2 hours with explanations in Hindi and English, and a report of your weak topics. It is the same pattern as the RO/ARO prelims.
        </p>
      </>
    ),
    hi: (
      <p>
        पिछले प्रश्नपत्रों के बाद फ्री लोअर पीसीएस मॉक दें: 2 घंटे में 150 प्रश्न, हिंदी और अंग्रेज़ी में व्याख्या, और कमज़ोर विषयों की रिपोर्ट। यही
        पैटर्न RO/ARO प्रारंभिक का भी है।
      </p>
    ),
  },
];

const faqs: Faq[] = [
  {
    q: "Where can I download UKPSC previous year question papers?",
    qHi: "UKPSC के पिछले वर्ष के प्रश्नपत्र कहाँ से डाउनलोड करें?",
    a: "From the official UKPSC website, psc.uk.gov.in, where the commission publishes answer keys after each exam. Our free PYQ Tracker groups the questions by topic.",
    aHi: "UKPSC की आधिकारिक वेबसाइट psc.uk.gov.in से, जहाँ आयोग हर परीक्षा के बाद उत्तर कुंजी जारी करता है। हमारा फ्री PYQ ट्रैकर प्रश्नों को विषयवार दिखाता है।",
  },
  {
    q: "Are UKPSC previous year questions repeated?",
    qHi: "क्या UKPSC के पिछले प्रश्न दोहराए जाते हैं?",
    a: "Topics come back often, especially in Uttarakhand GK. Use the PYQ Tracker to see which topics are asked most and revise those first.",
    aHi: "विषय अक्सर दोहराए जाते हैं, ख़ासकर उत्तराखंड GK में। PYQ ट्रैकर से देखें कौन से विषय सबसे ज़्यादा पूछे गए, और पहले उन्हें दोहराएँ।",
  },
];

export default function PreviousPapersPage() {
  return (
    <ExamGuide
      path={PATH}
      crumb="UKPSC previous year papers"
      kicker="Lower PCS · RO/ARO · Upper PCS"
      title="UKPSC Previous Year Papers and PYQ Analysis"
      titleHi="UKPSC पिछले वर्ष के प्रश्नपत्र और PYQ विश्लेषण"
      intro="Where to get the official UKPSC papers and answer keys, how to use them, and free topic-wise analysis of past questions for Lower PCS, RO/ARO and Upper PCS."
      introHi="UKPSC के आधिकारिक प्रश्नपत्र और उत्तर कुंजी कहाँ मिलेंगी, उनका सही उपयोग कैसे करें, और लोअर पीसीएस, RO/ARO व अपर पीसीएस के पिछले प्रश्नों का फ्री विषयवार विश्लेषण।"
      updated="23 Nov 2026"
      updatedIso="2026-11-23"
      sections={sections}
      faqs={faqs}
      cta={{
        href: "/lower-pcs",
        label: "Lower PCS + RO/ARO course",
        labelHi: "कोर्स देखें",
        text: "Want every topic covered with PYQ-based notes and 67 tests? See the Lower PCS + RO/ARO course by Bhanu Joshi, UKPSC Rank 9.",
        textHi: "PYQ आधारित नोट्स और 67 टेस्ट के साथ पूरी तैयारी चाहिए? भानु जोशी (UKPSC रैंक 9) का लोअर पीसीएस + RO/ARO कोर्स देखें।",
      }}
      related={[
        { href: "/ukpsc-lower-pcs-2026", label: "Lower PCS 2026 guide", labelHi: "लोअर पीसीएस 2026 गाइड" },
        { href: "/ukpsc-ro-aro", label: "RO/ARO guide", labelHi: "RO/ARO गाइड" },
        { href: "/pyq-tracker", label: "PYQ Tracker", labelHi: "PYQ ट्रैकर" },
        { href: "/uttarakhand-gk-quiz", label: "Free Uttarakhand GK practice", labelHi: "फ्री उत्तराखंड GK अभ्यास" },
      ]}
      sources={[{ href: "https://psc.uk.gov.in", label: "Uttarakhand Public Service Commission (psc.uk.gov.in)", note: "papers, answer keys, results" }]}
    />
  );
}
