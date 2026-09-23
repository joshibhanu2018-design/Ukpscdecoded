import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for UKPSC Decoded test series, crash course and combo packages.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="heading-lg mb-2 text-graphite-900">
        नियम व शर्तें <span className="text-graphite-500">/ Terms of Service</span>
      </h1>
      <p className="mb-10 text-sm text-graphite-500">Last updated: September 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-graphite-700">
        <section>
          <h2 className="mb-2 text-lg font-bold text-graphite-900">
            खाता साझा करना / Account Sharing
          </h2>
          <p>
            Each test series, crash course or combo package is licensed to one student for their own
            use. Sharing your login credentials or account access with anyone else is not permitted.
          </p>
          <p className="mt-2 font-medium text-graphite-900">
            Accounts found to be shared will be suspended, and no refund will be issued for the
            remaining access period.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-graphite-900">Payments &amp; Refunds</h2>
          <p>
            Payments are processed securely via Razorpay. Once a package is activated on your
            account, it is considered delivered — digital access purchases are generally
            non-refundable, except where required by law or at our discretion for a genuine
            technical failure on our end.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-graphite-900">Access Validity</h2>
          <p>
            Each package&apos;s access period is shown on its listing at the time of purchase. Access
            ends automatically at the stated expiry date regardless of how much of the package was
            used.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-graphite-900">Contact</h2>
          <p>
            Questions about these terms, a payment, or your account can be sent to us on{" "}
            <a
              href="https://t.me/ukpscdecoded"
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron-600 underline hover:text-saffron-700"
            >
              Telegram
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
