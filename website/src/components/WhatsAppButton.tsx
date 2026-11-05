"use client";

import { usePathname } from "next/navigation";

// The AiSensy (WhatsApp Business API) number. Chats started here land in AiSensy Live Chat.
const WHATSAPP_NUMBER = "918368457598";

// Not during a running test, at payment, or in the admin pages.
const HIDDEN_PREFIXES = ["/test-platform/attempts", "/test-platform/tests/", "/test-platform/admin", "/checkout"];

/**
 * Floating "Chat with us" button (bottom-right). Opens WhatsApp with a ready-made
 * message that also says which page the visitor was on.
 * Plain link to wa.me: no third-party script, so the site stays fast.
 */
export default function WhatsAppButton() {
  const pathname = usePathname() ?? "/";
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const text = `Hi UKPSC Decoded, I have a question about UKPSC preparation / your courses. (Page: ${pathname})`;
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 z-30 flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 sm:right-6 sm:h-12 sm:w-auto sm:px-5 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 [@media(display-mode:standalone)]:bottom-[calc(5rem+env(safe-area-inset-bottom,0px))]"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7 fill-current sm:h-6 sm:w-6">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.21 4.24-9.45 9.46-9.45 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.69c0 5.21-4.24 9.45-9.44 9.45zm8.04-17.49A11.3 11.3 0 0 0 12.04.67C5.77.67.67 5.77.67 12.04c0 2 .52 3.96 1.52 5.68L.57 23.33l5.74-1.5a11.33 11.33 0 0 0 5.73 1.46c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04z" />
      </svg>
      <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
    </a>
  );
}
