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
    <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://www.ukpscdecoded.in"}/test-platform" style="background: #f59307; color: #1a1a1f; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 14px;">
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
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.ukpscdecoded.in"}/test-platform`,
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

export type OfferEmail = { to: string; name: string; unsubscribeUrl: string };
export type OfferDetails = { code: string; percentOff: number; expiresAt: string };

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function offerDeadline(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function offerSubject(o: OfferDetails): string {
  return `${o.percentOff}% off every course & test series — ends ${offerDeadline(o.expiresAt)} | UKPSC Decoded`;
}

export function buildOfferHtml(o: OfferDetails, r: Pick<OfferEmail, "name" | "unsubscribeUrl">): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ukpscdecoded.in";
  const first = escapeHtml(r.name.split(" ")[0] || "");
  const deadline = offerDeadline(o.expiresAt);
  const button = (href: string, label: string, primary: boolean) =>
    `<a href="${base}${href}" style="display:inline-block;margin:4px;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;${
      primary ? "background:#f59307;color:#1a1a1f;" : "background:#ffffff;color:#1a1a1f;border:1px solid #d6d3d1;"
    }">${label}</a>`;

  return `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px 22px; color: #1a1a1f; line-height: 1.6; font-size: 14px;">
  <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;color:#b45309;font-weight:bold;">UKPSC DECODED</p>
  <h2 style="margin:0 0 14px;font-size:22px;">${first ? `${first}, ` : ""}${o.percentOff}% off — ends ${deadline}</h2>
  <p style="margin:0 0 12px;">
    UKPSC 2026 की तैयारी में सबसे बड़ा फ़र्क़ सही दिशा से आता है — क्या पढ़ना है, कितना पढ़ना है, और परीक्षा जैसा अभ्यास।
    ${deadline} तक हर कोर्स और टेस्ट सीरीज़ पर <b>${o.percentOff}% की छूट</b>।
  </p>
  <p style="margin:0 0 16px;">
    The biggest difference in UKPSC preparation is direction: what to study, how much, and practice in the real exam pattern.
    Until ${deadline}, get <b>${o.percentOff}% off every course and test series</b>.
  </p>
  <div style="margin:20px 0;padding:18px;border:2px dashed #f59307;border-radius:10px;text-align:center;background:#fffbeb;">
    <div style="font-size:12px;color:#555;">Your code / आपका कोड</div>
    <div style="font-size:28px;font-weight:bold;letter-spacing:3px;margin:4px 0;">${escapeHtml(o.code)}</div>
    <div style="font-size:12px;color:#b45309;">Valid till ${deadline} · one use per student</div>
  </div>
  <ul style="margin:0 0 16px;padding-left:18px;">
    <li><b>Test Series</b> — full mocks in the real pattern, Hindi + English, detailed solutions and weak-topic analysis.</li>
    <li><b>Crash Course</b> — video lectures, live sessions and PDF notes, including complete Uttarakhand GK.</li>
    <li><b>Complete Prelims Pack</b> — crash course + test series together, our best value.</li>
  </ul>
  <p style="text-align:center;margin:22px 0;">
    ${button("/courses", "View courses / कोर्स देखें", true)}
    ${button("/test-series", "View test series", false)}
  </p>
  <p style="margin:0 0 12px;font-size:13px;color:#555;">
    How to use: open any course or test series → Buy → the code is already filled in at checkout (or type it in the coupon box).
    <br/>कैसे इस्तेमाल करें: कोई भी कोर्स चुनें → Buy → चेकआउट पर कोड अपने-आप लग जाएगा।
  </p>
  <p style="margin:0 0 20px;font-size:13px;color:#555;">Questions? Reply on Telegram: t.me/ukpscdecoded</p>
  <p style="margin:0;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:12px;">
    You got this email because you have an account on www.ukpscdecoded.in.
    <a href="${r.unsubscribeUrl}" style="color:#999;">Unsubscribe from offers</a>
  </p>
</div>`.trim();
}

function buildOfferText(o: OfferDetails, r: Pick<OfferEmail, "name" | "unsubscribeUrl">): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ukpscdecoded.in";
  return [
    `${r.name.split(" ")[0] || "Hello"}, ${o.percentOff}% off every UKPSC Decoded course and test series until ${offerDeadline(o.expiresAt)}.`,
    `${offerDeadline(o.expiresAt)} तक हर कोर्स और टेस्ट सीरीज़ पर ${o.percentOff}% की छूट।`,
    "",
    `Code: ${o.code} (valid till ${offerDeadline(o.expiresAt)}, one use per student)`,
    "",
    `Courses: ${base}/courses`,
    `Test series: ${base}/test-series`,
    "",
    `Unsubscribe from offers: ${r.unsubscribeUrl}`,
  ].join("\n");
}

/** Sends up to 100 offer emails in one Resend batch call. Returns the addresses that were accepted. */
export async function sendOfferBatch(o: OfferDetails, recipients: OfferEmail[]): Promise<{ sent: string[]; error: string | null }> {
  const resend = getClient();
  if (!resend) return { sent: [], error: "RESEND_API_KEY is not set." };
  if (recipients.length === 0) return { sent: [], error: null };

  try {
    const { error } = await resend.batch.send(
      recipients.slice(0, 100).map((r) => ({
        from: FROM,
        to: r.to,
        subject: offerSubject(o),
        html: buildOfferHtml(o, r),
        text: buildOfferText(o, r),
        headers: {
          "List-Unsubscribe": `<${r.unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }))
    );
    if (error) {
      console.error("[email] Resend failed to send offer batch:", describeResendError(error));
      const e = describeResendError(error) as { message?: unknown };
      return { sent: [], error: typeof e?.message === "string" ? e.message : "Resend rejected the batch." };
    }
    return { sent: recipients.slice(0, 100).map((r) => r.to), error: null };
  } catch (err) {
    console.error("[email] Unexpected error sending offer batch:", err);
    return { sent: [], error: "Unexpected error while sending." };
  }
}
