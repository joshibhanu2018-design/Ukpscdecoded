import type { Metadata } from "next";
import ExamPage from "@/components/ExamPage";
import WhichOne from "@/components/final-month/WhichOne";
import { getActivePackages } from "@/lib/packages";

export const metadata: Metadata = {
  alternates: { canonical: "/upper-pcs" },
  title: "Upper PCS",
  description: "UKPSC Upper PCS Prelims: test series, revision series, full mocks with live ranks and the video revision program.",
};

/** Upper PCS Prelims 2026 is on 29 Nov; from 30 Nov this page sells the Upper PCS 2027 products (schema-phase47b). */
const PRELIMS_2026_END = new Date("2026-11-29T23:59:59+05:30").getTime();

export default async function UpperPcsPage() {
  const before = Date.now() <= PRELIMS_2026_END;
  const packages = before ? await getActivePackages() : [];
  return (
    <ExamPage
      tab="upper"
      kicker={before ? "UKPSC Upper PCS Prelims · 29 November 2026" : "UKPSC Upper PCS 2027"}
      title="Upper PCS"
      titleHi="अपर PCS"
      intro={
        before ? (
          <>Last days before the 29 November Prelims: revision tests, full mocks with live ranks and the full test series.</>
        ) : (
          <>Start early for Upper PCS 2027: the full test series, the video revision program, or both together.</>
        )
      }
    >
      {before && <WhichOne packages={packages} />}
    </ExamPage>
  );
}
