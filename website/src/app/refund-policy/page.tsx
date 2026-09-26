import type { Metadata } from "next";
import Link from "next/link";
import settings from "@content/settings.json";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund and cancellation policy for UKPSC Decoded courses, test series and mentorship.",
};

export default function RefundPolicyPage() {
  const { email } = settings.footer;
  const { refundDays, refundMaxVideos } = settings.legal;
  return (
    <LegalPage title="Refund & Cancellation Policy">
      <section>
        <h2>Summary</h2>
        <p>
          Digital courses are generally non-refundable. A refund is given only if you ask within{" "}
          <strong>{refundDays} days of purchase</strong> <em>and</em> have watched{" "}
          <strong>fewer than {refundMaxVideos} video lectures</strong> of the course.
        </p>
      </section>

      <section>
        <h2>Eligibility</h2>
        <ul>
          <li>
            <strong>Video courses and bundles:</strong> request within {refundDays} days of purchase, with fewer than {refundMaxVideos}{" "}
            video lectures watched.
          </li>
          <li>
            <strong>Test series only:</strong> request within {refundDays} days of purchase, with fewer than {refundMaxVideos} tests
            attempted.
          </li>
          <li>
            <strong>Mentorship:</strong> request within {refundDays} days of purchase, before your first 1-on-1 session.
          </li>
          <li>
            <strong>Failed or double payments:</strong> if money was deducted but the course was not activated, or you were
            charged twice, the full amount is refunded — no time limit.
          </li>
        </ul>
      </section>

      <section>
        <h2>Not eligible</h2>
        <ul>
          <li>Requests after {refundDays} days, or after the usage limits above.</li>
          <li>Accounts suspended for sharing login access (see our <Link href="/terms">Terms</Link>).</li>
          <li>Change of mind about the exam, schedule changes by the exam body, or results.</li>
        </ul>
      </section>

      <section>
        <h2>How to request</h2>
        <p>
          Email <a href={`mailto:${email}`}>{email}</a> from your registered email with your Razorpay payment ID. We reply within 2
          working days. Approved refunds go back to the original payment method; your bank usually shows them within 5–7
          working days. The course is deactivated when the refund is issued.
        </p>
      </section>

      <section>
        <h2>Printed books</h2>
        <p>
          If a book arrives damaged or the wrong item is delivered, email us with a photo within {refundDays} days of delivery
          for a replacement.
        </p>
      </section>
    </LegalPage>
  );
}
