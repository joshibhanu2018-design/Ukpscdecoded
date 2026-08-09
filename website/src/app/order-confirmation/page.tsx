'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
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
    return <div className="p-8 text-center">Loading order details...</div>;
  }

  const upiLink = `upi://pay?pa=bhanujoshi1910-1@oksbi&pn=UKPSC%20Decoded&am=${orderData.amount}&cu=INR&tn=Book%20Purchase`;
  const whatsappNumber = '918317390586'; // Your WhatsApp number

  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite-900 to-graphite-950 text-white py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-jade-500 mx-auto mb-4" />
          <h1 className="heading-lg text-white mb-2">Order Confirmed!</h1>
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
              <span className="text-graphite-300">Email:</span>
              <span className="font-semibold text-sm">{orderData.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite-300">Amount:</span>
              <span className="font-semibold text-saffron-400">₹{orderData.amount}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="text-graphite-800 text-sm font-semibold mb-3">Scan to Pay</p>
            <QRCode value={upiLink} size={256} level="H" />
            <p className="text-graphite-600 text-xs mt-3">Scan with Google Pay, PhonePe, or Paytm</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-jade-500/20 border border-jade-500/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-jade-300 mb-2">Payment Instructions:</h3>
          <ol className="text-sm text-graphite-300 space-y-1">
            <li>1. Scan the QR code with your phone</li>
            <li>2. Confirm payment in your UPI app</li>
            <li>3. Send screenshot to WhatsApp</li>
            <li>4. You'll receive order confirmation</li>
          </ol>
        </div>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Payment Screenshot for Order ${orderData.orderId}\n\nName: ${orderData.customerName}\nAmount: ₹${orderData.amount}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg text-center transition-all"
        >
          Send Payment Screenshot via WhatsApp
        </a>
      </div>
    </div>
  );
}
