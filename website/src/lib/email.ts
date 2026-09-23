import { Resend } from "resend";

const FROM = "UKPSC Decoded <noreply@send.ukpscdecoded.in>";

let client: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[email] RESEND_API_KEY is not set — password reset emails will not be sent. Add it to .env.local."
    );
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
      console.error("[email] Resend failed to send password reset email:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Unexpected error sending password reset email:", err);
    return false;
  }
}
