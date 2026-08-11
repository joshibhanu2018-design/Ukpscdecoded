'use client';

import { useEffect, useState, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmationPage() {
  const [orderData, setOrderData] = useState<any>(null);
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('latestOrder');
    if (stored) {
      setOrderData(JSON.parse(stored));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!screenshot) {
      setFormError('Please upload your payment screenshot.');
      return;
    }
    if (!utr.trim()) {
      setFormError('Please enter the Reference/UTR number from your payment screen.');
      return;
    }

    setSubmitting(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(screenshot);
      });

      const res = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          name: orderData.customerName,
          email: orderData.customerEmail,
          phone: orderData.customerPhone,
          amount: orderData.amount,
          utr: utr.trim().toUpperCase(),
          screenshotBase64: base64,
          screenshotFileName: screenshot.name,
        }),
      });

      if (res.ok) {
        setConfirmed(true);
      } else {
        setFormError('Something went wrong saving your confirmation. Please try again, or message us on WhatsApp below.');
      }
    } catch {
      setFormError('Network error. Please try again, or message us on WhatsApp below.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderData) {
    return <div className="p-8 text-center text-white">Loading order details...</div>;
  }

  const googlePayLink = `tez://upi/pay?pa=bhanujoshi1910-1@oksbi&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const paytmLink = `paytmmp://pay?pa=bhanujoshi1910-1@oksbi&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const phonepeLink = `phonepe://pay?pa=bhanujoshi1910-1@oksbi&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const upiLink = `upi://pay?pa=bhanujoshi1910-1@oksbi&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;
  const whatsappNumber = '918317390586';

  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite-900 to-graphite-950 text-white py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-jade-500 mx-auto mb-4" />
          <h1 className="heading-lg text-white mb-2">Order Confirmed! 🎉</h1>
          <p className="text-graphite-400">Order ID: {orderData.orderId}</p>
        </div>

        {/* Order Details */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-8">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-graphite-300">Name:</span>
              <span className="font-semibold">{orderData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite-300">Phone:</span>
              <span className="font-semibold">{orderData.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite-300">Amount:</span>
              <span className="font-semibold text-saffron-400">₹{orderData.amount}</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="text-graphite-800 text-sm font-semibold mb-4">Scan to Pay Instantly</p>
            <img
              src={qrCodeUrl}
              alt="UPI Payment QR Code"
              className="w-full rounded-lg"
            />
            <p className="text-graphite-600 text-xs mt-3">Works with Google Pay, PhonePe, Paytm</p>
          </div>
        </div>

        {confirmed ? (
          /* Confirmed State */
          <div className="bg-jade-500/20 border border-jade-500/50 rounded-xl p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-jade-400 mx-auto mb-3" />
            <h3 className="font-semibold text-jade-300 text-lg mb-2">Payment Confirmation Received!</h3>
            <p className="text-sm text-graphite-300">
              We've recorded your payment details. Your book ships starting{' '}
              <strong>Friday, 14th August</strong> and arrives within a week after that.
              You'll get an update on email.
            </p>
          </div>
        ) : (
          <>
            {/* Instructions */}
            <div className="bg-jade-500/20 border border-jade-500/50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-jade-300 mb-2">Payment Steps:</h3>
              <ol className="text-sm text-graphite-300 space-y-1">
                <li>✓ Scan QR code above, OR</li>
                <li>✓ Click a payment app button below</li>
                <li>✓ Complete payment in your app</li>
                <li>✓ Come back here and confirm below</li>
              </ol>
            </div>

            {/* Payment App Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <a
                href={googlePayLink}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-center text-sm"
              >
                Google Pay
              </a>
              <a
                href={paytmLink}
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg text-center text-sm"
              >
                Paytm
              </a>
              <a
                href={phonepeLink}
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg text-center text-sm"
              >
                PhonePe
              </a>
            </div>

            {/* Mandatory Confirmation Form */}
            <form onSubmit={handleConfirmPayment} className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-white text-lg">Confirm Your Payment</h3>

              <div>
                <label className="block text-sm font-medium text-graphite-300 mb-1">
                  Payment Screenshot (Required)
                </label>
                <p className="text-xs text-graphite-400 mb-2">
                  Screenshot your payment success screen — make sure the Reference/UTR number is visible before closing the app.
                </p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center cursor-pointer hover:border-jade-400 transition"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {screenshotPreview ? (
                    <img src={screenshotPreview} alt="Screenshot preview" className="max-h-40 mx-auto rounded" />
                  ) : (
                    <p className="text-sm text-graphite-300">📤 Tap to upload screenshot</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-graphite-300 mb-1">
                  Reference / UTR Number (Required)
                </label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g., 003969145613"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-graphite-500 text-sm outline-none focus:border-jade-400"
                />
              </div>

              {formError && (
                <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3">
                  <p className="text-sm text-red-300">{formError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-jade-500 hover:bg-jade-600 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {submitting ? 'Submitting...' : '✓ Confirm Payment'}
              </button>
            </form>

            {/* WhatsApp Backup */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Facing an issue confirming my payment.\n\nOrder ID: ${orderData.orderId}\nName: ${orderData.customerName}\nAmount: ₹${orderData.amount}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-graphite-400 hover:text-graphite-200 text-sm mt-4"
            >
              💬 Facing an issue? Message us on WhatsApp
            </a>
          </>
        )}
      </div>
    </div>
  );
}
