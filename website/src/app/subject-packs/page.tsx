import type { Metadata } from "next";
import ExamPage from "@/components/ExamPage";

export const metadata: Metadata = {
  alternates: { canonical: "/subject-packs" },
  title: "Subject Packs: CSAT, Uttarakhand GK, Current Affairs",
  description:
    "Take one part on its own for any UKPSC exam: CSAT (General Aptitude), the Uttarakhand GK Pack or Current Affairs 2026.",
};

export default function SubjectPacksPage() {
  return (
    <ExamPage
      tab="individual"
      kicker="For every UKPSC exam"
      title="Subject Packs"
      titleHi="विषय पैक"
      intro={<>Only need one part? CSAT, Uttarakhand GK or Current Affairs on their own, for Lower PCS, RO/ARO, TRI and Upper PCS.</>}
    />
  );
}
