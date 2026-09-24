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

type ReceiptRow = { packageName: string; originalLabel: string; discountLabel: string | null; amountLabel: string; paymentId: string };

function buildReceiptHtml(opts: ReceiptRow): string {
  const discountRow = opts.discountLabel
    ? `<tr>
      <td style="padding: 8px 0; color: #555555; border-top: 1px solid #eeeeee;">छूट / Discount</td>
      <td style="padding: 8px 0; text-align: right; color: #0b9163; border-top: 1px solid #eeeeee;">-${opts.discountLabel}</td>
    </tr>`
    : "";

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
      <td style="padding: 8px 0; color: #555555; border-top: 1px solid #eeeeee;">मूल्य / Price</td>
      <td style="padding: 8px 0; text-align: right; border-top: 1px solid #eeeeee;">${opts.originalLabel}</td>
    </tr>
    ${discountRow}
    <tr>
      <td style="padding: 8px 0; color: #555555; border-top: 1px solid #eeeeee;">कुल भुगतान / Total Paid</td>
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

function buildReceiptText(opts: ReceiptRow): string {
  return [
    "भुगतान की पुष्टि / Payment Confirmation",
    "",
    "आपका भुगतान सफल रहा और आपका पैकेज सक्रिय कर दिया गया है।",
    "Your payment was successful and your package has been activated.",
    "",
    `Package: ${opts.packageName}`,
    `Price: ${opts.originalLabel}`,
    ...(opts.discountLabel ? [`Discount: -${opts.discountLabel}`] : []),
    `Total Paid: ${opts.amountLabel}`,
    `Payment ID: ${opts.paymentId}`,
    "",
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://ukpscdecoded.in"}/test-platform`,
  ].join("\n");
}

/** Sends the purchase receipt email, showing original price / discount / final amount. Returns false (never throws) on any failure. */
export async function sendReceiptEmail(
  to: string,
  opts: { packageName: string; amountPaise: number; originalAmountPaise: number; discountAmountPaise: number; paymentId: string }
): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  const rupees = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
  const emailOpts: ReceiptRow = {
    packageName: opts.packageName,
    originalLabel: rupees(opts.originalAmountPaise),
    discountLabel: opts.discountAmountPaise > 0 ? rupees(opts.discountAmountPaise) : null,
    amountLabel: rupees(opts.amountPaise),
    paymentId: opts.paymentId,
  };

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

function buildLoginCodeHtml(code: string): string {
  return `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1f;">
  <h2 style="margin: 0 0 16px; font-size: 20px; color: #1a1a1f;">आपका लॉगिन कोड / Your login code</h2>
  <p style="margin: 0 0 16px; line-height: 1.6; font-size: 14px;">
    UKPSC Decoded में लॉग इन करने के लिए यह कोड दर्ज करें।<br />
    Enter this code to log in to UKPSC Decoded.
  </p>
  <p style="text-align: center; margin: 28px 0; font-size: 34px; font-weight: bold; letter-spacing: 10px; color: #1a1a1f;">${code}</p>
  <p style="margin: 0 0 16px; font-size: 13px; color: #555555;">
    यह कोड 10 मिनट के लिए मान्य है। इसे किसी के साथ साझा न करें।<br />
    This code is valid for 10 minutes. Never share it with anyone.
  </p>
  <p style="margin: 0; font-size: 12px; color: #888888;">
    यदि आपने यह अनुरोध नहीं किया, तो इस ईमेल को अनदेखा करें। / If you did not request this, ignore this email.
  </p>
</div>`.trim();
}

/** Returns false on any failure (missing key, Resend error) — callers decide what to tell the user. */
export async function sendLoginCodeEmail(to: string, code: string): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `${code} — UKPSC Decoded लॉगिन कोड / login code`,
      html: buildLoginCodeHtml(code),
      text: [
        "आपका लॉगिन कोड / Your login code",
        "",
        code,
        "",
        "यह कोड 10 मिनट के लिए मान्य है। / This code is valid for 10 minutes.",
        "इसे किसी के साथ साझा न करें। / Never share it with anyone.",
        "यदि आपने यह अनुरोध नहीं किया, तो इस ईमेल को अनदेखा करें। / If you did not request this, ignore this email.",
      ].join("\n"),
    });

    if (error) {
      console.error("[email] Resend failed to send login code:", describeResendError(error));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Unexpected error sending login code:", err);
    return false;
  }
}
