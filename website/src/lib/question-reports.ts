/** Why a student thinks a question is wrong (question_reports.reason). */
export const REPORT_REASONS = ["wrong_answer", "wrong_question", "translation", "typo", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABEL: Record<ReportReason, { hi: string; en: string }> = {
  wrong_answer: { hi: "उत्तर गलत है", en: "Answer key is wrong" },
  wrong_question: { hi: "प्रश्न/विकल्प गलत", en: "Question or options wrong" },
  translation: { hi: "हिंदी/अंग्रेज़ी अलग", en: "Hindi and English differ" },
  typo: { hi: "टाइपिंग की गलती", en: "Typo" },
  other: { hi: "अन्य", en: "Other" },
};
