import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

/**
 * Decap CMS — GitHub OAuth: Step 1 (Authorize)
 *
 * The CMS opens this endpoint in a popup window. We generate a CSRF `state`
 * value, store it in a short-lived httpOnly cookie, then redirect the user to
 * GitHub's authorization screen.
 *
 * GitHub sends the user back to /api/callback once they approve.
 *
 * Required environment variables:
 *   GITHUB_OAUTH_ID     — OAuth App Client ID
 *   GITHUB_OAUTH_SECRET — OAuth App Client Secret (used in /api/callback)
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_ID;

  if (!clientId) {
    return new NextResponse(
      'GitHub OAuth is not configured. Set GITHUB_OAUTH_ID and GITHUB_OAUTH_SECRET in your environment variables.',
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }

  // Build the redirect URI from the incoming request so this works on
  // localhost, Vercel preview deployments, and the production domain alike.
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/callback`;

  // CSRF protection: random state echoed back by GitHub and verified in callback.
  const state = randomBytes(16).toString('hex');

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  // `repo` scope is required so the CMS can commit content to the repository.
  authorizeUrl.searchParams.set('scope', 'repo,user');
  authorizeUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizeUrl.toString());

  response.cookies.set('decap_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
