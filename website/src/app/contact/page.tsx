import type { Metadata } from "next";
import Link from "next/link";
import settings from "@content/settings.json";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact UKPSC Decoded for course, payment or account help.",
};

export default function ContactPage() {
  const { email } = settings.footer;
  const { telegram, youtube } = settings.social;
  const { ownerName, address, phone } = settings.legal;
  return (
    <LegalPage title="Contact Us">
      <section>
        <h2>Support</h2>
        <ul>
          <li>
            Email: <a href={`mailto:${email}`}>{email}</a> — we reply within 1–2 working days.
          </li>
          <li>
            Telegram: <a href={telegram} target="_blank" rel="noopener noreferrer">{telegram.replace("https://", "")}</a>
          </li>
          <li>
            YouTube: <a href={youtube} target="_blank" rel="noopener noreferrer">{youtube.replace("https://", "")}</a>
          </li>
          {phone && <li>Phone / WhatsApp: {phone}</li>}
        </ul>
        <p className="mt-2">
          For payment issues, include your Razorpay payment ID. For refunds, see our <Link href="/refund-policy">Refund Policy</Link>.
        </p>
      </section>

      <section>
        <h2>Business details</h2>
        <p>
          UKPSC Decoded, operated by {ownerName}
          {address && (
            <>
              <br />
              {address}
            </>
          )}
        </p>
      </section>
    </LegalPage>
  );
}
