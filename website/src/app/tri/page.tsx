import type { Metadata } from "next";
import Link from "next/link";
import ExamPage from "@/components/ExamPage";

export const metadata: Metadata = {
  alternates: { canonical: "/tri" },
  title: "TRI (Tax & Revenue Inspector) 2027",
  description:
    "UKPSC Tax & Revenue Inspector exam, 15 Jan 2027: the TRI Add-on covers the GS topics beyond Lower PCS (urbanization, agriculture, statistics & graphs, environment, sports) with 3 TRI pattern mocks.",
};

export default function TriPage() {
  return (
    <ExamPage
      tab="tri"
      kicker="UKPSC TRI · 15 January 2027"
      title="Tax & Revenue Inspector (TRI)"
      intro={
        <>
          Most of TRI General Studies is the Lower PCS syllabus. The <strong className="text-white">TRI Add-on</strong> adds
          only what Lower PCS doesn&apos;t cover, plus 3 mocks on the TRI pattern. General Hindi is not included.
        </>
      }
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 text-sm leading-relaxed text-graphite-200">
        <p className="font-semibold text-white">Which one do I need?</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Preparing for Lower PCS too: take the <strong className="text-white">3-Exam Complete</strong> (Lower PCS + RO/ARO + TRI).
          </li>
          <li>
            Already have the{" "}
            <Link href="/lower-pcs" className="text-saffron-300 underline underline-offset-2">
              Lower PCS course
            </Link>{" "}
            or an Upper PCS course: the TRI Add-on alone is enough.
          </li>
        </ul>
      </div>
    </ExamPage>
  );
}
