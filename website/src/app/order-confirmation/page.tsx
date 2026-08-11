'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function OrderConfirm() {
  const params = useSearchParams();
  const orderId = params.get('orderId');
  const name = params.get('name');
  const phone = params.get('phone');
  const [showPopup, setShowPopup] = useState(true);

  const screenshotMessage = `Hi, I've completed payment for *Uttarakhand Decoded* book.\n\nOrder ID: ${orderId}\nName: ${name}\nPhone: ${phone}\n\nAttaching my payment screenshot below.`;
  const screenshotUrl = `https://wa.me/918317390586?text=${encodeURIComponent(screenshotMessage)}`;

  const issueMessage = `Hi, I'm facing an issue with my payment for *Uttarakhand Decoded* book.\n\nOrder ID: ${orderId}\nName: ${name}\nPhone: ${phone}\n\nCould you please help me?`;
  const issueUrl = `https://wa.me/918317390586?text=${encodeURIComponent(issueMessage)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite-900 via-graphite-800 to-graphite-950 text-white py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Congratulations Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="w-20 h-20 text-jade-500 mx-auto mb-4 animate-pulse" />
          <h1 className="heading-lg text-white mb-2">🎉 Order Confirmed!</h1>
          <p className="text-graphite-300 text-lg">Your Order ID</p>
          <p className="font-mono font-bold text-saffron-400 text-xl mt-2">{orderId}</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-graphite-300">Recipient Name:</span>
              <span className="font-semibold">{name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-graphite-300">Phone:</span>
              <span className="font-semibold font-mono">{phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-graphite-300">Book Price:</span>
              <span className="font-bold text-saffron-400 text-lg">₹499</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-graphite-300">Shipping:</span>
              <span className="text-jade-400 text-sm">Starts Aug 14</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-jade-500/20 border border-jade-500/50 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-jade-300 mb-3 flex items-center gap-2">
            <span className="text-lg">📋</span> What's Next?
          </h3>
          <ol className="text-sm text-graphite-300 space-y-2">
            <li className="flex gap-2">
              <span className="font-bold text-jade-400">1.</span>
              <span>Complete your UPI payment (if not done yet)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-jade-400">2.</span>
              <span>Take a screenshot showing the payment success & UTR</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-jade-400">3.</span>
              <span>Tap the WhatsApp button below to send it to us</span>
            </li>
          </ol>
        </div>

        {/* Main CTA — Mandatory WhatsApp */}
        <button
          onClick={() => window.open(screenshotUrl, '_blank')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-4 rounded-lg mb-4 transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
        >
          <span className="text-2xl">✓</span>
          Send Payment Screenshot on WhatsApp
        </button>

        <p className="text-center text-xs text-graphite-400 mb-6">
          Your Order ID is already pre-filled so we can match it instantly
        </p>

        {/* Payment Issue Link */}
        <a
          href={issueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-all mb-4"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          Facing Payment Issues?
        </a>

        {/* Info Box */}
        <div className="bg-graphite-800/50 border border-graphite-700 rounded-lg p-4 text-xs text-graphite-400 text-center">
          <p>💚 <strong>Your order is secured.</strong> We'll process it once we receive your payment screenshot on WhatsApp.</p>
          <p className="mt-2">Shipping starts <strong>August 14, 2026</strong></p>
        </div>

        {/* Mandatory WhatsApp Pop-up (appears once on load) */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-graphite-900 border border-jade-500/50 rounded-xl p-6 max-w-sm shadow-2xl">
              <CheckCircle2 className="w-12 h-12 text-jade-500 mx-auto mb-4" />
              <h2 className="font-bold text-lg text-white mb-3 text-center">One Last Step!</h2>
              <p className="text-sm text-graphite-300 mb-4 text-center">
                After you complete your UPI payment, tap below to send your payment screenshot on WhatsApp. 
                <br />
                <br />
                <strong>Your Order ID is already filled in</strong> — we can match it instantly.
              </p>
              <button
                onClick={() => {
                  window.open(screenshotUrl, '_blank');
                  setShowPopup(false);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-2 transition-all"
              >
                📱 Open WhatsApp
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full text-graphite-400 hover:text-graphite-300 text-sm py-2 transition-all"
              >
                I'll do it later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}