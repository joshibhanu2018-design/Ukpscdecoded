'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Copy, Check, MessageCircle, ArrowDown, AlertCircle } from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const orderId = searchParams?.get('orderId') || 'UK' + Date.now();
  const customerName = searchParams?.get('name') || 'Student';
  const customerEmail = searchParams?.get('email') || '';
  const customerPhone = searchParams?.get('phone') || '';
  const language = searchParams?.get('language') || 'English';
  const bookEdition = language === 'हिंदी' ? 'हिंदी संस्करण' : 'English Edition';

  const isHindi = language === 'हिंदी';
  const upiId = '9632662418@ptyes';
  const amount = 499;
  const phoneNumber = '918317390586';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paytmLink = `paytm://pay?pa=${upiId}&pn=UKPSC&am=${amount}&tn=Book`;
  const upiLink = `upi://pay?pa=${upiId}&pn=UKPSC&am=${amount}&tn=Book`;

  const whatsappMessage = isHindi
    ? `नमस्ते 👋\n\nमैंने अपना भुगतान पूरा कर दिया है।\n\nनाम: ${customerName}\nफोन: ${customerPhone}\nऑर्डर ID: ${orderId}\nकिताब संस्करण: ${bookEdition}\n\nकृपया मेरा स्क्रीनशॉट संलग्न देखें।`
    : `Hi 👋\n\nI have completed my payment.\n\nName: ${customerName}\nPhone: ${customerPhone}\nOrder ID: ${orderId}\nBook Edition: ${bookEdition}\n\nPlease find my screenshot attached.`;

  const paymentIssueMessage = isHindi
    ? `नमस्ते, मुझे भुगतान में समस्या आ रही है। क्या आप मेरी मदद कर सकते हैं?`
    : `Hi, I'm facing a payment issue. Can you help me?`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const paymentIssueLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(paymentIssueMessage)}`;

  const handlePaymentClick = (appLink: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = appLink;
    setTimeout(() => {
      if (!document.hidden) {
        window.location.href = upiLink;
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{isHindi ? '2 सरल चरण' : '2 Simple Steps'}</h1>
          <p className="text-xl text-graphite-300">{isHindi ? 'भुगतान पूरा करें और WhatsApp पर हमें स्क्रीनशॉट भेजें' : 'Complete the Payment and Send us a Screenshot on WhatsApp'}</p>
        </div>

        {/* STEP 1 - PAYMENT */}
        <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center font-bold text-sm">1</div>{isHindi ? 'भुगतान पूरा करें' : 'Complete Payment'}</h2>

          {/* COPY UPI - PRIMARY METHOD */}
          <div className="bg-gradient-to-r from-saffron-600/30 to-saffron-500/30 rounded-xl p-6 mb-8 border-2 border-saffron-500">
            <p className="text-sm text-saffron-300 mb-3 font-semibold">{isHindi ? '⭐ प्राथमिक विधि: UPI ID कॉपी करें' : '⭐ PRIMARY METHOD: Copy UPI ID'}</p>
            <div className="flex items-center gap-3 bg-graphite-900 rounded-lg p-4">
              <code className="text-2xl font-bold text-saffron-400 flex-1 break-all">{upiId}</code>
              <button onClick={copyToClipboard} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 rounded-lg font-bold whitespace-nowrap">
                {copied ? (<><Check className="w-5 h-5" />{isHindi ? 'किया' : 'Copied'}</>) : (<><Copy className="w-5 h-5" />{isHindi ? 'कॉपी' : 'Copy'}</>)}
              </button>
            </div>
            <p className="text-sm text-saffron-200 mt-3">{isHindi ? '💡 UPI ID को कॉपी करें और अपने किसी भी UPI ऐप में पेस्ट करें' : '💡 Copy UPI ID and paste in any UPI app'}</p>
          </div>

          {/* QR CODE */}
          <div className="bg-white rounded-lg p-6 mb-8 flex justify-center">
            <div className="text-center">
              <p className="text-graphite-800 font-bold mb-4">{isHindi ? 'या QR कोड स्कैन करें' : 'Or Scan QR Code'}</p>
              <img 
                src="https://lh3.googleusercontent.com/d/1XRZxaaYIu50JOMpddgu_EFq5ibVQoJF2?raw=true" 
                alt="UPI QR Code" 
                className="w-56 h-56 mx-auto"
              />
              <p className="text-graphite-600 text-sm mt-3">Bank of Baroda - 9632662418@ptyes</p>
            </div>
          </div>

          {/* PAYTM BUTTON - HIGHLIGHTED */}
          <div className="bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 rounded-xl p-4 mb-6 border-2 border-cyan-500">
            <button 
              onClick={handlePaymentClick(paytmLink)} 
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              {isHindi ? 'Paytm ऐप खोलें' : 'Open Paytm App'}
            </button>
            <p className="text-cyan-200 text-sm mt-2 text-center">{isHindi ? '✅ Paytm है सबसे तेज़' : '✅ Paytm is fastest'}</p>
          </div>
        </div>

        <div className="flex justify-center mb-8"><ArrowDown className="w-8 h-8 text-saffron-400 animate-bounce" /></div>

        {/* STEP 2 - WHATSAPP */}
        <div className="bg-green-900/30 rounded-2xl p-8 border-2 border-green-600/50 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-sm">2</div>{isHindi ? 'WhatsApp पर भेजें' : 'Send on WhatsApp'}</h2>
          <p className="text-graphite-300 mb-6 text-lg">{isHindi ? '📸 अपना भुगतान स्क्रीनशॉट WhatsApp पर हमें भेजें।' : '📸 Send your payment screenshot to us on WhatsApp.'}</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-6 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-xl"
          >
            <MessageCircle className="w-8 h-8" />
            {isHindi ? 'WhatsApp पर संदेश भेजें' : 'Send Message on WhatsApp'}
          </a>
          <p className="text-green-200 text-sm mt-4 text-center">{isHindi ? '✅ हम तुरंत आपकी सहायता करेंगे' : '✅ We will assist you immediately'}</p>
        </div>

        {/* PAYMENT ISSUE HELP */}
        <div className="bg-orange-900/30 rounded-xl p-6 border-2 border-orange-600/50 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-bold text-orange-300 mb-3">{isHindi ? 'भुगतान में समस्या आ रही है?' : 'Facing Payment Issues?'}</p>
              <a
                href={paymentIssueLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-bold text-white"
              >
                <MessageCircle className="w-4 h-4" />
                {isHindi ? 'हमसे WhatsApp पर संपर्क करें' : 'Contact Us on WhatsApp'}
              </a>
            </div>
          </div>
        </div>

        {/* ORDER DETAILS */}
        <div className="bg-graphite-800/50 rounded-lg p-6 border border-graphite-700/50 text-center">
          <p className="text-graphite-400 mb-2">{isHindi ? 'ऑर्डर ID' : 'Order ID'}</p>
          <p className="text-2xl font-bold text-saffron-400 mb-4">{orderId}</p>
          <p className="text-graphite-300">₹{amount} • {isHindi ? '4 दिन में डिलीवरी' : '4 Day Delivery'} • {bookEdition}</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (<Suspense fallback={<div className="text-center py-20">Loading...</div>}><OrderConfirmationContent /></Suspense>);
}
