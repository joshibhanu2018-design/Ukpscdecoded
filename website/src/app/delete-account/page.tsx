import type { Metadata } from "next";
import settings from "@content/settings.json";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "/delete-account" },
  title: "Delete Your Account",
  description: "How to delete your UKPSC Decoded account and personal data (website and Android app).",
};

export default function DeleteAccountPage() {
  const { email } = settings.footer;
  const subject = encodeURIComponent("Delete my UKPSC Decoded account");
  const body = encodeURIComponent("Please delete my UKPSC Decoded account and personal data.\n\nRegistered email: ");
  return (
    <LegalPage title="Delete Your Account">
      <section>
        <p>
          This page explains how to delete your UKPSC Decoded account. It applies to the website (www.ukpscdecoded.in) and the
          UKPSC Decoded Android app, which use the same account.
        </p>
      </section>

      <section>
        <h2>How to request deletion</h2>
        <ul>
          <li>
            Email <a href={`mailto:${email}?subject=${subject}&body=${body}`}>{email}</a> from the email address you log in
            with, with the subject &quot;Delete my UKPSC Decoded account&quot;.
          </li>
          <li>We confirm the request by email and delete the account within 7 working days.</li>
        </ul>
        <p className="mt-2">
          <a href={`mailto:${email}?subject=${subject}&body=${body}`}>Send a deletion request</a>
        </p>
      </section>

      <section>
        <h2>What is deleted</h2>
        <ul>
          <li>Your name, email address and mobile number.</li>
          <li>Test answers, scores, analysis, XP and streaks, tags and notes.</li>
          <li>Mentorship bookings, video progress and login sessions.</li>
        </ul>
      </section>

      <section>
        <h2>What is kept, and for how long</h2>
        <ul>
          <li>
            Payment and invoice records (order ID, amount, date, payment ID) are kept for as long as Indian tax and accounting
            law requires. They are not used for anything else.
          </li>
        </ul>
      </section>

      <section>
        <h2>Please note</h2>
        <p>
          Deleting your account ends access to every course, test series and e-book you bought, and cannot be undone. Refunds
          follow the <a href="/refund-policy">Refund Policy</a>. To delete only some data instead of the whole account, email us
          and say what you want removed. See also the <a href="/privacy">Privacy Policy</a>.
        </p>
      </section>
    </LegalPage>
  );
}
