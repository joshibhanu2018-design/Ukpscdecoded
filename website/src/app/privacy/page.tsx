import type { Metadata } from "next";
import settings from "@content/settings.json";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How UKPSC Decoded collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
  const { email } = settings.footer;
  const { ownerName } = settings.legal;
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <p>
          UKPSC Decoded (&quot;we&quot;), operated by {ownerName}, respects your privacy. This policy explains what we collect when you
          use this website and app, and how we use it.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li><strong>Account:</strong> your name and email address (used to log in with a one-time code).</li>
          <li><strong>Checkout:</strong> your mobile number and order details.</li>
          <li>
            <strong>Payments:</strong> handled by Razorpay. We never see or store your card, UPI or bank details — only the
            payment ID and status.
          </li>
          <li>
            <strong>Learning data:</strong> test answers, scores, time taken, tags you add (sureness, error type), mentorship
            bookings and notes, and videos watched.
          </li>
          <li>
            <strong>Technical:</strong> a login cookie, your device/browser type for the 2-device limit, and your IP address for
            security rate limits. Your language choice is stored on your own device.
          </li>
        </ul>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To give you access to what you bought and to run tests, results and analysis.</li>
          <li>To send login codes, receipts and important course updates by email.</li>
          <li>For mentorship students: your mentor reviews your test performance to plan sessions.</li>
          <li>To prevent account sharing and misuse.</li>
        </ul>
        <p className="mt-2">We do not sell your data or share it for advertising.</p>
      </section>

      <section>
        <h2>Who processes it for us</h2>
        <p>
          Supabase (database), Vercel (website hosting), Razorpay (payments), Resend (email) and our video host. Each only
          receives what it needs to provide its service.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          While your account is active and for up to 3 years after your last course expires, or longer where tax and accounting
          law requires us to keep payment records.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete your personal data, or withdraw consent, by emailing{" "}
          <a href={`mailto:${email}`}>{email}</a> from your registered email. We respond within 7 working days. Deleting your
          account ends access to purchased courses. This policy follows India&apos;s Digital Personal Data Protection Act, 2023
          and the IT Rules, 2011.
        </p>
      </section>

      <section>
        <h2>Grievance officer</h2>
        <p>
          {ownerName} — <a href={`mailto:${email}`}>{email}</a>
        </p>
      </section>
    </LegalPage>
  );
}
