'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { UPI_ID_GPAY, UPI_ID_PAYTM } from '@/lib/payment';

export default function OrderConfirmationPage() {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('latestOrder');
    if (stored) {
      setOrderData(JSON.parse(stored));
    }
  }, []);

  if (!orderData) {
    return <div className="p-8 text-center text-white">Loading order details...</div>;
  }

  // Google Pay uses the SBI account; Paytm and PhonePe both use the BoB/Paytm account
  const googlePayLink = `tez://upi/pay?pa=${UPI_ID_GPAY}&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const paytmLink = `paytmmp://pay?pa=${UPI_ID_PAYTM}&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const phonepeLink = `phonepe://pay?pa=${UPI_ID_PAYTM}&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const upiLink = `upi://pay?pa=${UPI_ID_GPAY}&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;
  const whatsappNumber = '918317390586';

  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite-900 to-graphite-950 text-white py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-saffron-400 mx-auto mb-4" />
          <h1 className="heading-lg text-white mb-2">⏳ Complete Your Payment</h1>
          <p className="text-graphite-400">Your order is saved. Order ID: {orderData.orderId}</p>
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

        {/* Payment Escalation Guide — try one, then the next */}
        <div className="bg-gradient-to-b from-amber-500/15 to-amber-500/5 border-2 border-amber-500/40 rounded-xl p-4 mb-6">
          <div className="flex justify-center mb-3">
            <span className="inline-block bg-amber-400 text-graphite-900 font-extrabold text-xs px-3 py-1.5 rounded-full uppercase tracking-wide">
              ⚠️ Please try at least 2 payment methods
            </span>
          </div>
          <p className="text-amber-300 font-bold text-center text-sm mb-3">
            If one payment method fails, try the next one below
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400 text-graphite-900 font-bold text-xs flex items-center justify-center">1</span>
              <span className="text-sm text-white">Try <strong>Scan QR Code</strong> above</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400 text-graphite-900 font-bold text-xs flex items-center justify-center">2</span>
              <span className="text-sm text-white">QR not working? Try <strong>Google Pay</strong> button below</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400 text-graphite-900 font-bold text-xs flex items-center justify-center">3</span>
              <span className="text-sm text-white">Still stuck? Try <strong>Paytm</strong> or <strong>PhonePe</strong> — different bank account, often works when others don't</span>
            </div>

            {/* Directly clickable WhatsApp escalation link */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Payment Issue\n\nOrder ID: ${orderData.orderId}\nName: ${orderData.customerName}\nAmount: ₹${orderData.amount}\n\nI've tried multiple payment methods and none are working. Please help.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-red-500/20 border-2 border-red-400/60 rounded-lg px-3 py-3 hover:bg-red-500/30 transition-colors"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-400 text-graphite-900 font-bold text-xs flex items-center justify-center">!</span>
              <span className="text-sm text-white">
                Tried 2+ methods and still failing? <strong className="text-red-200 underline">👉 Click here to contact us on WhatsApp</strong> — we'll help right away
              </span>
            </a>
          </div>
        </div>

        {/* Payment App Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-2">
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

        {/* Fallback note if a payment option fails */}
        <p className="text-xs text-graphite-400 text-center mb-6">
          Reminder: QR + Google Pay use one bank account, Paytm + PhonePe use another — if one is stuck, the other usually isn't.
        </p>

        {/* Big, high-visibility "confirm payment" CTA */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Payment Screenshot\n\nOrder ID: ${orderData.orderId}\nName: ${orderData.customerName}\nAmount: ₹${orderData.amount}\n\nI have completed the payment. Please confirm and send tracking details.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-5 rounded-xl text-center shadow-lg shadow-green-500/30 animate-pulse hover:animate-none transition-all"
        >
          ✅ Done Paying? Click Here to Share Screenshot & Confirm Your Order
        </a>
        <p className="text-center text-graphite-400 text-xs mt-3">
          Your order isn't confirmed until we receive your payment screenshot — please don't skip this step.
        </p>
      </div>
    </div>
  );
}
