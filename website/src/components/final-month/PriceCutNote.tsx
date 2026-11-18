import { Flame } from "lucide-react";
import T from "@/components/T";
import { daysToExam } from "@/lib/finalMonth";

/**
 * "Prices cut · last days" note beside the Revision / Rank Challenge buy box
 * (18 Nov 2026). Tells worried students that reading the solutions is enough
 * if they can't write every test. Hidden in the app (`web-only`) and after the exam.
 */
export default function PriceCutNote() {
  const days = daysToExam();
  if (days <= 0) return null;
  return (
    <div className="web-only rounded-xl border border-saffron-400/60 bg-saffron-400/10 p-3 text-sm">
      <p className="flex items-start gap-2 font-bold text-saffron-200">
        <Flame className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron-400" aria-hidden />
        <T
          en={<>Prices cut! Last {days} days to finish your revision through tests.</>}
          hi={<>कीमतें घटा दी गई हैं! टेस्ट से रिवीजन पूरा करने के आखिरी {days} दिन।</>}
        />
      </p>
      <p className="mt-1 pl-6 text-graphite-200">
        <T
          en="No time to write every test? Open it, submit, and just read every answer with its explanation. That alone revises Uttarakhand GK, Current Affairs and 6 full mocks."
          hi="हर टेस्ट देने का समय नहीं? टेस्ट खोलें, सबमिट करें और बस हर प्रश्न का उत्तर और व्याख्या पढ़ लीजिए। इतने से ही उत्तराखंड GK, करेंट अफेयर्स और 6 फुल मॉक का रिवीजन हो जाएगा।"
        />
      </p>
    </div>
  );
}
