// Server-side relay: website -> this route -> Google Apps Script -> Orders Sheet
// Running on the server avoids all browser CORS problems with script.google.com.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ORDERS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzBqI-RudL7s4H1oDedmLzgAeBsimEm0gt6WJyOPVzivTCjYxjtLAFgMsp-W3pmPaKTkA/exec';

async function sendToSheet(payload: Record<string, unknown>) {
  const res = await fetch(ORDERS_SCRIPT_URL, {
    method: 'POST',
    // text/plain keeps Apps Script happy; body is still JSON and is read via e.postData.contents
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
    cache: 'no-store',
  });
  const text = await res.text();
  return { httpStatus: res.status, text };
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  let lastError = '';
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { httpStatus, text } = await sendToSheet(payload);
      if (httpStatus === 200 && text.includes('success')) {
        return Response.json({ ok: true, attempt });
      }
      lastError = `HTTP ${httpStatus}: ${text.slice(0, 300)}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
    console.error(`[log-book-order] attempt ${attempt} failed:`, lastError);
    await new Promise((r) => setTimeout(r, 800 * attempt));
  }

  // Full order details in Vercel logs as a last-resort backup
  console.error('[log-book-order] FAILED TO RECORD ORDER:', JSON.stringify(payload));
  return Response.json({ ok: false, error: lastError }, { status: 502 });
}
