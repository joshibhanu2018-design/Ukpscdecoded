import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import answerKey from "@content/answerKey.json";
import T from "@/components/T";
import AnswerKeyTool, { type KeyPaper } from "./AnswerKeyTool";

export const metadata: Metadata = {
  alternates: { canonical: "/answer-key" },
  title: "UKPSC Prelims 2026 Answer Key and Score Calculator",
  description:
    "Unofficial answer key for the UKPSC Upper PCS Prelims 2026 (29 November) with a score calculator for every booklet set. Sign up to get the key on WhatsApp on exam evening.",
};

/**
 * Exam-evening page. The key lives in content/answerKey.json: fill the sets,
 * set "published": true, merge. Until then the page only collects names and
 * mobile numbers (Admin → Mock Registrations, source "answer-key").
 */
export default function AnswerKeyPage() {
  const papers = (answerKey.papers as KeyPaper[]).filter((p) => p.questions > 0);
  // Published only when at least one set of one paper is actually filled in.
  const ready = papers.some((p) => Object.values(p.sets).some((s) => s.trim().length > 0));
  const published = answerKey.published === true && ready;

  return (
    <div className="bg-graphite-950 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <KeyRound className="mx-auto h-10 w-10 text-saffron-400" />
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            <T en="UKPSC Prelims 2026 Answer Key" hi="UKPSC प्रीलिम्स 2026 उत्तर कुंजी" />
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-graphite-300 sm:text-base">
            {published ? (
              <T
                en="Pick your booklet set, tap your answers and see your score with negative marking."
                hi="अपना बुकलेट सेट चुनें, अपने उत्तर दबाएं और नेगेटिव मार्किंग के साथ अपना स्कोर देखें।"
              />
            ) : (
              <T
                en="Our answer key and score calculator come here on exam evening, 29 November. Leave your number and we will send it to you."
                hi="हमारी उत्तर कुंजी और स्कोर कैलकुलेटर परीक्षा की शाम, 29 नवंबर को यहीं आएंगे। अपना नंबर दें, हम आपको भेज देंगे।"
              />
            )}
          </p>
        </div>

        <AnswerKeyTool published={published} papers={published ? papers : []} />

        <p className="text-center text-xs text-graphite-400">
          <T
            en="This is an unofficial answer key prepared by UKPSC Decoded. The official key is published by the Commission on psc.uk.gov.in."
            hi="यह UKPSC Decoded द्वारा तैयार अनौपचारिक उत्तर कुंजी है। आधिकारिक उत्तर कुंजी आयोग की वेबसाइट psc.uk.gov.in पर जारी होती है।"
          />
        </p>
      </div>
    </div>
  );
}
