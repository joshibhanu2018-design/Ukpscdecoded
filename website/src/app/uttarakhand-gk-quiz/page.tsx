import type { Metadata } from "next";
import Link from "next/link";
import ExamGuide, { type Faq, type GuideSection } from "@/components/ExamGuide";
import settings from "@content/settings.json";

/** Free practice hub: every free quiz, mock and current-affairs resource on one page. */

const PATH = "/uttarakhand-gk-quiz";

export const metadata: Metadata = {
  title: "Free Uttarakhand GK Quiz, Mock Test & Current Affairs for UKPSC",
  description:
    "Free Uttarakhand GK practice for UKPSC Lower PCS, RO/ARO and UKSSSC: daily PYQ quiz, weekly current affairs, a free 150-question Lower PCS mock with Hindi and English explanations, PYQ tracker and free video lectures.",
  keywords: [
    "Uttarakhand GK quiz",
    "Uttarakhand GK MCQ",
    "UKPSC free mock test",
    "Uttarakhand current affairs",
    "Lower PCS mock test free",
    "उत्तराखंड जीके प्रश्न",
    "उत्तराखंड करंट अफेयर्स",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: "Free Uttarakhand GK Quiz, Mock Test & Current Affairs",
    description: "Daily quiz, weekly current affairs and a free 150-question Lower PCS mock.",
    url: PATH,
  },
};

const sections: GuideSection[] = [
  {
    id: "mock",
    h: "Free Lower PCS mock test",
    hHi: "फ्री लोअर पीसीएस मॉक टेस्ट",
    en: (
      <p>
        150 questions in 2 hours on the Lower PCS and RO/ARO pattern, with explanations in Hindi and English and a report of your weak
        topics. Free for every registered student: <Link href="/lower-pcs" className="text-saffron-300 underline">attempt it here</Link>.
      </p>
    ),
    hi: <p>लोअर पीसीएस और RO/ARO पैटर्न पर 2 घंटे में 150 प्रश्न, हिंदी और अंग्रेज़ी में व्याख्या, कमज़ोर विषयों की रिपोर्ट। हर पंजीकृत छात्र के लिए फ्री।</p>,
  },
  {
    id: "daily",
    h: "Daily quiz and weekly current affairs",
    hHi: "दैनिक क्विज़ और साप्ताहिक समसामयिकी",
    en: (
      <p>
        The <Link href="/current-affairs" className="text-saffron-300 underline">current affairs page</Link> has the week&apos;s important news
        for UKPSC and a daily quiz built from previous year questions. On Telegram we post a daily MCQ:{" "}
        <a href={settings.social.telegram} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
          join here
        </a>
        .
      </p>
    ),
    hi: <p>समसामयिकी पेज पर UKPSC के लिए सप्ताह की ज़रूरी ख़बरें और पिछले प्रश्नों से बना दैनिक क्विज़ है। टेलीग्राम पर रोज़ एक MCQ आता है।</p>,
  },
  {
    id: "pyq",
    h: "Previous year questions, topic by topic",
    hHi: "पिछले वर्ष के प्रश्न, विषयवार",
    en: (
      <p>
        See which Uttarakhand and National topics UKPSC asks most in the <Link href="/pyq-tracker" className="text-saffron-300 underline">PYQ Tracker</Link>,
        and read our <Link href="/ukpsc-previous-year-papers" className="text-saffron-300 underline">previous year papers guide</Link>.
      </p>
    ),
    hi: <p>PYQ ट्रैकर में देखें कि UKPSC उत्तराखंड और राष्ट्रीय विषयों में से कौन से विषय सबसे ज़्यादा पूछता है।</p>,
  },
  {
    id: "videos",
    h: "Free video lectures",
    hHi: "फ्री वीडियो लेक्चर",
    en: (
      <p>
        Uttarakhand GK and strategy lectures from our YouTube channel, sorted by topic, are on the{" "}
        <Link href="/free-content" className="text-saffron-300 underline">free content page</Link>.{" "}
        <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
          Subscribe on YouTube
        </a>{" "}
        for new videos.
      </p>
    ),
    hi: <p>यूट्यूब चैनल के उत्तराखंड GK और रणनीति वाले वीडियो विषयवार फ्री कंटेंट पेज पर हैं।</p>,
  },
];

const faqs: Faq[] = [
  {
    q: "Is the Lower PCS mock test really free?",
    qHi: "क्या लोअर पीसीएस मॉक टेस्ट सच में फ्री है?",
    a: "Yes. Register for free on the website and attempt the full 150-question mock for free, with explanations and analysis.",
    aHi: "हाँ। वेबसाइट पर फ्री रजिस्टर करें और पूरा 150 प्रश्नों का मॉक फ्री में दें, व्याख्या और विश्लेषण के साथ।",
  },
  {
    q: "Is this useful for UKSSSC exams too?",
    qHi: "क्या यह UKSSSC परीक्षाओं के लिए भी उपयोगी है?",
    a: "Yes. Uttarakhand GK and current affairs are asked in UKSSSC exams as well, so the quiz, current affairs and PYQ tracker help there too.",
    aHi: "हाँ। उत्तराखंड GK और समसामयिकी UKSSSC परीक्षाओं में भी पूछे जाते हैं, इसलिए क्विज़, समसामयिकी और PYQ ट्रैकर वहाँ भी काम आते हैं।",
  },
];

export default function FreePracticePage() {
  return (
    <ExamGuide
      path={PATH}
      crumb="Free Uttarakhand GK practice"
      kicker="Free · Hindi + English"
      title="Free Uttarakhand GK Quiz, Mock Test and Current Affairs"
      titleHi="फ्री उत्तराखंड GK क्विज़, मॉक टेस्ट और समसामयिकी"
      intro="All our free practice for UKPSC Lower PCS, RO/ARO and other Uttarakhand exams in one place: a full mock test, a daily quiz, weekly current affairs, past-question analysis and video lectures."
      introHi="UKPSC लोअर पीसीएस, RO/ARO और उत्तराखंड की अन्य परीक्षाओं के लिए हमारा सारा फ्री अभ्यास एक जगह: फुल मॉक टेस्ट, दैनिक क्विज़, साप्ताहिक समसामयिकी, पिछले प्रश्नों का विश्लेषण और वीडियो लेक्चर।"
      updated="23 Nov 2026"
      updatedIso="2026-11-23"
      sections={sections}
      faqs={faqs}
      cta={{
        href: "/lower-pcs",
        label: "See the Lower PCS + RO/ARO course",
        labelHi: "कोर्स देखें",
        text: "Ready for full preparation? 65+ video lessons, 67 tests (10 full-length) and CSAT classes, valid till 30 April 2027.",
        textHi: "पूरी तैयारी चाहिए? 65+ वीडियो, 67 टेस्ट (10 फुल लेंथ) और CSAT क्लास, 30 अप्रैल 2027 तक मान्य।",
      }}
      related={[
        { href: "/ukpsc-lower-pcs-2026", label: "Lower PCS 2026 guide", labelHi: "लोअर पीसीएस 2026 गाइड" },
        { href: "/ukpsc-ro-aro", label: "RO/ARO guide", labelHi: "RO/ARO गाइड" },
        { href: "/buy-book", label: "Uttarakhand Decoded book", labelHi: "उत्तराखंड डिकोडेड पुस्तक" },
        { href: "/bhanu-joshi", label: "About Bhanu Joshi, UKPSC Rank 9", labelHi: "भानु जोशी के बारे में" },
      ]}
    />
  );
}
