import { cleanPhone, PHONE_RE } from "./phone";

/**
 * WhatsApp template messages through AiSensy (WhatsApp Business API).
 *
 * Nothing is sent unless AISENSY_API_KEY is set in Vercel AND the env var
 * naming the AiSensy "API campaign" for that message is set too:
 *   AISENSY_CAMPAIGN_PAYMENT   payment received  (params: name, course name)
 *   AISENSY_CAMPAIGN_MOCK_DAY  mock opens today  (params: name, mock name)
 *   AISENSY_CAMPAIGN_OTP       login code        (param: the 6-digit code; an
 *                              "Authentication" template with a copy-code button)
 * Each campaign points at a template approved by WhatsApp; the template
 * texts to submit are in docs/WHATSAPP_AUTOMATION.md.
 * Never throws: a failed message must not break a payment or a cron run.
 */
const ENDPOINT = "https://backend.aisensy.com/campaign/t1/api/v2";

export type WhatsAppCampaign = "payment" | "mock_day" | "otp";

const CAMPAIGN_ENV: Record<WhatsAppCampaign, string> = {
  payment: "AISENSY_CAMPAIGN_PAYMENT",
  mock_day: "AISENSY_CAMPAIGN_MOCK_DAY",
  otp: "AISENSY_CAMPAIGN_OTP",
};

export function whatsappCampaignName(campaign: WhatsAppCampaign): string | null {
  if (!process.env.AISENSY_API_KEY) return null;
  return process.env[CAMPAIGN_ENV[campaign]]?.trim() || null;
}

export async function sendWhatsApp(
  campaign: WhatsAppCampaign,
  to: { phone: string | null | undefined; name: string | null | undefined },
  templateParams: string[],
  /** Extra fields AiSensy needs for some templates (the copy-code button of a login-code template). */
  extra: Record<string, unknown> = {}
): Promise<boolean> {
  const campaignName = whatsappCampaignName(campaign);
  if (!campaignName) return false;
  const phone = cleanPhone(to.phone ?? "");
  if (!PHONE_RE.test(phone)) return false;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: process.env.AISENSY_API_KEY,
        campaignName,
        destination: `91${phone}`,
        userName: to.name?.trim() || "Student",
        source: "website",
        templateParams,
        ...extra,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[whatsapp] ${campaign} failed: HTTP ${res.status} ${(await res.text().catch(() => "")).slice(0, 200)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[whatsapp] ${campaign} failed:`, err instanceof Error ? err.message : err);
    return false;
  }
}

/** True when login by WhatsApp code is switched on (AISENSY_API_KEY + AISENSY_CAMPAIGN_OTP). */
export function whatsappLoginEnabled(): boolean {
  return whatsappCampaignName("otp") !== null;
}

/**
 * Sends a login code on WhatsApp. WhatsApp "Authentication" templates carry
 * the code twice: in the message body and in the copy-code button.
 */
export function sendWhatsAppLoginCode(phone: string, code: string): Promise<boolean> {
  return sendWhatsApp("otp", { phone, name: "Student" }, [code], {
    buttons: [{ type: "button", sub_type: "url", index: 0, parameters: [{ type: "text", text: code }] }],
  });
}
