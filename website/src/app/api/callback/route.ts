import { NextRequest, NextResponse } from 'next/server';

/**
 * Decap CMS — GitHub OAuth: Step 2 (Callback)
 *
 * GitHub redirects here with a temporary `code`. We exchange that code for an
 * access token, then hand the token back to the Decap CMS window using the
 * postMessage handshake that Decap expects:
 *
 *   1. This popup posts "authorizing:github" to window.opener
 *   2. The CMS replies (so we learn its exact origin)
 *   3. This popup posts "authorization:github:success:{...}" back to that origin
 *
 * The CMS then stores the token and the dashboard loads.
 */

/** Renders an HTML page that completes the postMessage handshake. */
function renderHandshakePage(
  status: 'success' | 'error',
  payload: Record<string, string>
): NextResponse {
  // Escape `<` so the JSON can never break out of the <script> block.
  const serialized = JSON.stringify(payload).replace(/</g, '\\u003c');
  const message = `authorization:github:${status}:${serialized}`;

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Signing you in&hellip;</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #1a1a1f;
        color: #fff;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        padding: 1.5rem;
      }
      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #3d3d46;
        border-top-color: #f59307;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 1.25rem;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      h1 { font-size: 1.1rem; margin: 0 0 0.5rem; font-weight: 600; }
      p { color: #91919f; margin: 0; font-size: 0.875rem; max-width: 24rem; }
    </style>
  </head>
  <body>
    ${status === 'success' ? '<div class="spinner"></div>' : ''}
    <h1>${status === 'success' ? 'Signed in successfully' : 'Sign-in failed'}</h1>
    <p id="status">
      ${
        status === 'success'
          ? 'Returning you to the Content Manager&hellip;'
          : 'You can close this window and try again.'
      }
    </p>
    <script>
      (function () {
        var message = ${JSON.stringify(message)};

        if (!window.opener) {
          document.getElementById('status').textContent =
            'This window was opened directly. Please start from the /admin page.';
          return;
        }

        function handleMessage(event) {
          window.opener.postMessage(message, event.origin);
          window.removeEventListener('message', handleMessage, false);
          setTimeout(function () { window.close(); }, 800);
        }

        window.addEventListener('message', handleMessage, false);

        // Kick off the handshake — the CMS is listening for this.
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    status: status === 'success' ? 200 : 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const oauthError = request.nextUrl.searchParams.get('error');

  const clientId = process.env.GITHUB_OAUTH_ID;
  const clientSecret = process.env.GITHUB_OAUTH_SECRET;

  // The user clicked "Cancel" on GitHub's authorization screen.
  if (oauthError) {
    return renderHandshakePage('error', {
      error: request.nextUrl.searchParams.get('error_description') || oauthError,
    });
  }

  if (!clientId || !clientSecret) {
    return renderHandshakePage('error', {
      error:
        'GitHub OAuth is not configured. Set GITHUB_OAUTH_ID and GITHUB_OAUTH_SECRET.',
    });
  }

  if (!code) {
    return renderHandshakePage('error', {
      error: 'No authorization code returned from GitHub.',
    });
  }

  // Verify the CSRF state matches what we set in /api/auth.
  const expectedState = request.cookies.get('decap_oauth_state')?.value;
  if (!expectedState || !state || state !== expectedState) {
    return renderHandshakePage('error', {
      error: 'Invalid or expired sign-in request. Please try again.',
    });
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${request.nextUrl.origin}/api/callback`,
      }),
    });

    const data: {
      access_token?: string;
      error?: string;
      error_description?: string;
    } = await tokenRes.json();

    if (!data.access_token) {
      return renderHandshakePage('error', {
        error:
          data.error_description ||
          data.error ||
          'GitHub did not return an access token.',
      });
    }

    const response = renderHandshakePage('success', {
      token: data.access_token,
      provider: 'github',
    });

    // The state cookie has served its purpose.
    response.cookies.set('decap_oauth_state', '', { path: '/', maxAge: 0 });

    return response;
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return renderHandshakePage('error', {
      error: 'Could not reach GitHub to complete sign-in. Please try again.',
    });
  }
}
