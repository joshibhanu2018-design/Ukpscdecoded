import type { Metadata } from "next";
import ExamPage from "@/components/ExamPage";

export const metadata: Metadata = {
  alternates: { canonical: "/solo-packs" },
  title: "Solo Packs: Uttarakhand GK, CSAT, Current Affairs",
  description:
    "Take one part on its own for any UKPSC exam: Uttarakhand Intensive Test Series, CSAT Test Series, Current Affairs Test Series, the Uttarakhand GK Pack, CSAT or Current Affairs 2026.",
};

export default function SoloPacksPage() {
  return (
    <ExamPage
      tab="individual"
      kicker="For every UKPSC exam"
      title="Solo Packs"
      titleHi="सोलो पैक"
      intro={
        <>
          Only need one part? Uttarakhand GK, CSAT or Current Affairs on their own (as a test series, or with videos), for Lower PCS,
          RO/ARO, TRI and Upper PCS.
        </>
      }
    />
  );
}
