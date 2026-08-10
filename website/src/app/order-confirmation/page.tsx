'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

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

  const googlePayLink = `tez://upi/pay?pa=bhanujoshi1910-1@oksbi&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const paytmLink = `paytmmp://pay?pa=bhanujoshi1910-1@oksbi&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const phonepeLink = `upi://pay?pa=bhanujoshi1910-1@oksbi&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase&tr=PhonePe`;
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

        {/* Instructions */}
        <div className="bg-jade-500/20 border border-jade-500/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-jade-300 mb-2">Payment Steps:</h3>
          <ol className="text-sm text-graphite-300 space-y-1">
            <li>✓ Scan QR code above, OR</li>
            <li>✓ Click a payment app button below</li>
            <li>✓ Complete payment in your app</li>
            <li>✓ Send screenshot to WhatsApp</li>
          </ol>
        </div>

        {/* Payment App Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-3">
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

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Payment Screenshot\n\nOrder ID: ${orderData.orderId}\nName: ${orderData.customerName}\nAmount: ₹${orderData.amount}\n\nI have completed the payment. Please confirm and send tracking details.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg text-center transition-all"
        >
          📱 Send Payment Screenshot via WhatsApp
        </a>
      </div>
    </div>
  );
}
