import settings from "@content/settings.json";

/**
 * Central lead-capture helper.
 *
 * All lead/interest/contact forms on the site funnel through here so that every
 * submission lands in ONE backend (a Google Sheet, via a Google Apps Script Web
 * App). Set the deployed Web App URL in content/settings.json -> "leadEndpoint"
 * (editable from the CMS under Site Settings).
 *
 * The Apps Script should accept a JSON POST and append a row. Because the request
 * is sent with mode: "no-cors" (so it works from a static site without CORS
 * headers), we cannot read the response — we optimistically treat it as sent.
 *
 * Every payload always includes `email` and `phone` (WhatsApp) plus a `source`
 * so you can tell where the lead came from, and `course` where relevant.
 */
export interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  course?: string;
  source: string;
  [key: string]: unknown;
}

export async function submitLead(data: LeadPayload): Promise<boolean> {
  const endpoint = (settings as { leadEndpoint?: string }).leadEndpoint || "";
  if (!endpoint) {
    // No backend configured yet — log so nothing is silently lost in dev.
    if (typeof window !== "undefined") {
      console.warn("[leads] No leadEndpoint configured in settings.json — lead not stored:", data);
    }
    return false;
  }
  // Automatically record where the lead came from (page path + site host)
  // so a single sheet stays fully segregated by origin/landing page.
  const context =
    typeof window !== "undefined"
      ? { page: window.location.pathname, site: window.location.host, url: window.location.href }
      : {};
  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...context, ...data, submittedAt: new Date().toISOString() }),
    });
    return true;
  } catch {
    return false;
  }
}
