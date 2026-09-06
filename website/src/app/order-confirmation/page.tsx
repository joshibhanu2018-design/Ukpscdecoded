'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, MessageCircle } from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || 'UK' + Date.now();
  const customerName = searchParams?.get('name') || 'Valued Customer';
  const customerEmail = searchParams?.get('email') || '';
  const customerPhone = searchParams?.get('phone') || '';
  const paymentId = searchParams?.get('paymentId') || '';
  const language = searchParams?.get('language') || 'English';
  const status = searchParams?.get('status') || 'success';

  const isHindi = language === 'हिंदी';
  const phoneNumber = '918317390586';

  const whatsappMessage = isHindi
    ? `नमस्ते! 👋\n\nमैंने UKPSC Decoded पुस्तक के लिए भुगतान पूरा कर दिया है।\n\nऑर्डर ID: ${orderId}\nनाम: ${customerName}\nभुगतान ID: ${paymentId}\n\nकृपया मेरे आदेश की पुष्टि करें।`
    : `Hi! 👋\n\nI have completed the payment for UKPSC Decoded book.\n\nOrder ID: ${orderId}\nName: ${customerName}\nPayment ID: ${paymentId}\n\nPlease confirm my order.`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {status === 'success' ? (
          <div className="text-center space-y-8">
            {/* SUCCESS CHECKMARK */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center animate-pulse">
                <Check className="w-12 h-12 text-green-400" />
              </div>
            </div>

            {/* SUCCESS HEADING */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {isHindi ? '✅ आदेश सफल!' : '✅ Order Successful!'}
              </h1>
              <p className="text-xl text-graphite-300">
                {isHindi ? 'आपका भुगतान प्राप्त हुआ है' : 'Your payment has been received'}
              </p>
            </div>

            {/* CONFIRMATION MESSAGE */}
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 space-y-4">
              <p className="text-lg text-graphite-100">
                {isHindi
                  ? `धन्यवाद ${customerName} जी! आपके UKPSC Decoded पुस्तक के लिए आदेश सफलतापूर्वक पंजीकृत हो गया है।`
                  : `Thank you ${customerName}! Your order for UKPSC Decoded book has been successfully registered.`}
              </p>
              <div className="bg-graphite-900 rounded-lg p-4 space-y-2 text-left">
                <div>
                  <span className="text-graphite-400">{isHindi ? 'ऑर्डर ID:' : 'Order ID:'}</span>
                  <span className="ml-4 font-bold text-saffron-400">{orderId}</span>
                </div>
                {paymentId && (
                  <div>
                    <span className="text-graphite-400">{isHindi ? 'भुगतान ID:' : 'Payment ID:'}</span>
                    <span className="ml-4 font-bold text-green-400">{paymentId}</span>
                  </div>
                )}
                <div>
                  <span className="text-graphite-400">{isHindi ? 'संपर्क:' : 'Contact:'}</span>
                  <span className="ml-4 font-bold text-blue-400">{customerEmail || customerPhone}</span>
                </div>
              </div>
            </div>

            {/* DELIVERY INFORMATION */}
            <div className="bg-amber-500/20 rounded-xl p-6 border border-amber-500/30">
              <p className="text-base md:text-lg text-amber-100 leading-relaxed">
                {isHindi
                  ? '📦 आपकी पुस्तक 4-5 कार्य दिवसों में आपके पते पर डिलीवर की जाएगी। आप अपने ऑर्डर की ट्रैकिंग जानकारी के लिए व्हाट्सएप के माध्यम से हमसे संपर्क कर सकते हैं।'
                  : '📦 Your book will be delivered to your address within 4-5 working days. You can contact us via WhatsApp for tracking information on your order.'}
              </p>
            </div>

            {/* WHATSAPP CONTACT */}
            <div className="space-y-4">
              <p className="text-graphite-300">
                {isHindi ? 'किसी भी प्रश्न के लिए हमसे संपर्क करें:' : 'Contact us for any queries:'}
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
              >
                <MessageCircle className="w-6 h-6" />
                {isHindi ? 'WhatsApp पर संपर्क करें' : 'Contact on WhatsApp'}
              </a>
            </div>

            {/* THANK YOU */}
            <div className="pt-8 border-t border-graphite-700">
              <p className="text-graphite-300 text-lg">
                {isHindi
                  ? '🙏 UKPSC Decoded को चुनने के लिए धन्यवाद!'
                  : '🙏 Thank you for choosing UKPSC Decoded!'}
              </p>
              <p className="text-graphite-400 text-sm mt-2">
                {isHindi
                  ? 'आपकी सफलता हमारी लक्ष्य है। शुभकामनाएं! 💪'
                  : 'Your success is our goal. Best wishes! 💪'}
              </p>
            </div>

            {/* BACK TO HOME */}
            <div>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all"
              >
                {isHindi ? '← होम पर वापस जाएं' : '← Back to Home'}
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">
              {isHindi ? '⚠️ कुछ गलत हुआ' : '⚠️ Something went wrong'}
            </h1>
            <p className="text-graphite-300">
              {isHindi
                ? 'आपके ऑर्डर को प्रोसेस करने में समस्या आई। कृपया हमसे संपर्क करें।'
                : 'There was an issue processing your order. Please contact us.'}
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 rounded-lg font-bold"
            >
              <MessageCircle className="w-6 h-6" />
              {isHindi ? 'WhatsApp पर संपर्क करें' : 'Contact on WhatsApp'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white flex items-center justify-center">
          <p className="text-2xl">Loading...</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
