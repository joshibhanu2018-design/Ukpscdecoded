import { Resend } from "resend";

const FROM = "UKPSC Decoded <noreply@send.ukpscdecoded.in>";

let client: Resend | null = null;

// Resend's SDK error objects don't serialize usefully through plain
// console.error/JSON.stringify (logs as `{}`) — pull out the fields we
// actually want to see.
function describeResendError(error: unknown): unknown {
  if (error && typeof error === "object") {
    const e = error as { statusCode?: unknown; name?: unknown; message?: unknown };
    return { statusCode: e.statusCode, name: e.name, message: e.message };
  }
  return error;
}

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set — emails will not be sent. Add it to .env.local.");
    return null;
  }
  if (!client) client = new Resend(apiKey);
  return client;
}

function buildResetHtml(resetUrl: string): string {
  return `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1f;">
  <h2 style="margin: 0 0 16px; font-size: 20px; color: #1a1a1f;">पासवर्ड रीसेट करें / Reset Your Password</h2>
  <p style="margin: 0 0 16px; line-height: 1.6; font-size: 14px;">
    आपके UKPSC Decoded खाते के लिए पासवर्ड रीसेट का अनुरोध प्राप्त हुआ है।<br />
    We received a request to reset your UKPSC Decoded account password.
  </p>
  <p style="text-align: center; margin: 32px 0;">
    <a href="${resetUrl}" style="background: #f59307; color: #1a1a1f; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 14px;">
      पासवर्ड रीसेट करें / Reset Password
    </a>
  </p>
  <p style="margin: 0 0 16px; font-size: 13px; color: #555555;">
    यह लिंक 1 घंटे के लिए मान्य है। / This link is valid for 1 hour.
  </p>
  <p style="margin: 0; font-size: 12px; color: #888888;">
    यदि आपने यह अनुरोध नहीं किया, तो इस ईमेल को अनदेखा करें। / If you did not request this, ignore this email.
  </p>
</div>`.trim();
}

function buildResetText(resetUrl: string): string {
  return [
    "पासवर्ड रीसेट करें / Reset Your Password",
    "",
    "आपके UKPSC Decoded खाते के लिए पासवर्ड रीसेट का अनुरोध प्राप्त हुआ है।",
    "We received a request to reset your UKPSC Decoded account password.",
    "",
    `${resetUrl}`,
    "",
    "यह लिंक 1 घंटे के लिए मान्य है। / This link is valid for 1 hour.",
    "यदि आपने यह अनुरोध नहीं किया, तो इस ईमेल को अनदेखा करें। / If you did not request this, ignore this email.",
  ].join("\n");
}

/**
 * Sends the password reset email. Returns false (never throws) on any
 * failure — missing API key, Resend error, network error — so callers can
 * always respond to the client with the same generic message regardless
 * of whether the email actually went out.
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: "Reset your UKPSC Decoded password / अपना पासवर्ड रीसेट करें",
      html: buildResetHtml(resetUrl),
      text: buildResetText(resetUrl),
    });

    if (error) {
      console.error("[email] Resend failed to send password reset email:", describeResendError(error));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Unexpected error sending password reset email:", err);
    return false;
  }
}

function buildReceiptHtml(opts: { packageName: string; amountLabel: string; paymentId: string }): string {
  return `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1f;">
  <h2 style="margin: 0 0 16px; font-size: 20px; color: #1a1a1f;">भुगतान की पुष्टि / Payment Confirmation</h2>
  <p style="margin: 0 0 16px; line-height: 1.6; font-size: 14px;">
    आपका भुगतान सफल रहा और आपका पैकेज सक्रिय कर दिया गया है।<br />
    Your payment was successful and your package has been activated.
  </p>
  <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
    <tr>
      <td style="padding: 8px 0; color: #555555;">पैकेज / Package</td>
      <td style="padding: 8px 0; text-align: right; font-weight: bold;">${opts.packageName}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #555555; border-top: 1px solid #eeeeee;">राशि / Amount</td>
      <td style="padding: 8px 0; text-align: right; font-weight: bold; border-top: 1px solid #eeeeee;">${opts.amountLabel}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #555555; border-top: 1px solid #eeeeee;">भुगतान आईडी / Payment ID</td>
      <td style="padding: 8px 0; text-align: right; font-size: 12px; border-top: 1px solid #eeeeee;">${opts.paymentId}</td>
    </tr>
  </table>
  <p style="text-align: center; margin: 32px 0;">
    <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://ukpscdecoded.in"}/test-platform" style="background: #f59307; color: #1a1a1f; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 14px;">
      डैशबोर्ड पर जाएं / Go to Dashboard
    </a>
  </p>
  <p style="margin: 0; font-size: 12px; color: #888888;">
    कोई सवाल? हमसे Telegram पर संपर्क करें। / Questions? Reach us on Telegram.
  </p>
</div>`.trim();
}

function buildReceiptText(opts: { packageName: string; amountLabel: string; paymentId: string }): string {
  return [
    "भुगतान की पुष्टि / Payment Confirmation",
    "",
    "आपका भुगतान सफल रहा और आपका पैकेज सक्रिय कर दिया गया है।",
    "Your payment was successful and your package has been activated.",
    "",
    `Package: ${opts.packageName}`,
    `Amount: ${opts.amountLabel}`,
    `Payment ID: ${opts.paymentId}`,
    "",
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://ukpscdecoded.in"}/test-platform`,
  ].join("\n");
}

/** Sends the purchase receipt email. Returns false (never throws) on any failure. */
export async function sendReceiptEmail(
  to: string,
  opts: { packageName: string; amountPaise: number; paymentId: string }
): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  const amountLabel = `₹${(opts.amountPaise / 100).toLocaleString("en-IN")}`;
  const emailOpts = { packageName: opts.packageName, amountLabel, paymentId: opts.paymentId };

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `Payment received for ${opts.packageName} / भुगतान प्राप्त हुआ`,
      html: buildReceiptHtml(emailOpts),
      text: buildReceiptText(emailOpts),
    });

    if (error) {
      console.error("[email] Resend failed to send receipt email:", describeResendError(error));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Unexpected error sending receipt email:", err);
    return false;
  }
}

/** Sends the daily backup email with CSV attachments. Returns false (never throws) on any failure. */
export async function sendBackupEmail(
  to: string,
  opts: { dateLabel: string; attachments: { filename: string; csv: string }[]; counts: Record<string, number> }
): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  const summary = Object.entries(opts.counts)
    .map(([name, count]) => `${name}: ${count} rows`)
    .join("\n");

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `UKPSC Decoded daily backup — ${opts.dateLabel}`,
      text: `Daily backup for ${opts.dateLabel}\n\n${summary}\n\nAttached as CSV. Passwords are never included.`,
      attachments: opts.attachments.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.csv, "utf8"),
        contentType: "text/csv",
      })),
    });

    if (error) {
      console.error("[email] Resend failed to send backup email:", describeResendError(error));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Unexpected error sending backup email:", err);
    return false;
  }
}
