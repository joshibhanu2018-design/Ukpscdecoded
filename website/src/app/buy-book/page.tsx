'use client';

import { useState } from 'react';
import { Download, X, Eye, ChevronDown, Book } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChapterContent {
  label: string;
  title: string;
  pdfUrl?: string;
  isIndex?: boolean;
}

interface ChapterBook {
  [key: string]: ChapterContent;
}

interface LanguageChapters {
  en: ChapterBook;
  hi: ChapterBook;
}

export default function BuyBookPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [selectedChapter, setSelectedChapter] = useState<string>('index'); // Default to index
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pinCode: '',
    state: '',
    landmark: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Chapter configuration - INDEX FIRST
  const chapterContent: LanguageChapters = {
    en: {
      'index': {
        label: 'Table of Contents',
        title: 'Complete Index - All 28 Chapters',
        isIndex: true,
        pdfUrl: '/book-samples/english/index.pdf',
      },
      '1': {
        label: 'Chapter 1',
        title: 'Epigraphy - Inscriptions & Significance',
        pdfUrl: '/book-samples/english/chapter-1.pdf',
      },
      '2': {
        label: 'Chapter 2',
        title: 'Katyuri Dynasty - Administrative Excellence',
        pdfUrl: '/book-samples/english/chapter-2.pdf',
      },
      '3': {
        label: 'Chapter 3',
        title: 'Anglo-Gorkha War 1814-1815',
        pdfUrl: '/book-samples/english/chapter-3.pdf',
      },
      '21': {
        label: 'Chapter 21',
        title: 'MSME & Industrial Development',
        pdfUrl: '/book-samples/english/chapter-21.pdf',
      },
      '27': {
        label: 'Chapter 27',
        title: 'Education Reforms & HRD',
        pdfUrl: '/book-samples/english/chapter-27.pdf',
      },
    },
    hi: {
      'index': {
        label: 'विषय-सूची',
        title: 'संपूर्ण विषय-सूची - सभी 28 अध्याय',
        isIndex: true,
        pdfUrl: '/book-samples/hindi/Hindi%20book%20index.pdf',
      },
      '2': {
        label: 'अध्याय 2',
        title: 'कत्यूरी वंश - Katyuri Dynasty',
        pdfUrl: '/book-samples/hindi/Chapter 2 sample.pdf',
      },
      '3': {
        label: 'अध्याय 3',
        title: 'आंग्ल-गोरखा युद्ध - Anglo-Gorkha War',
        pdfUrl: '/book-samples/hindi/Chapter 3.pdf',
      },
      '4': {
        label: 'अध्याय 4',
        title: 'ब्रिटिश शासन - British Raj',
        pdfUrl: '/book-samples/hindi/Chapter 4.pdf',
      },
      '9': {
        label: 'अध्याय 9',
        title: 'धार्मिक महत्व - Religious Significance',
        pdfUrl: '/book-samples/hindi/Chapter 9.pdf',
      },
      '11': {
        label: 'अध्याय 11',
        title: 'राजनीतिक दल - Political Parties',
        pdfUrl: '/book-samples/hindi/Chapter 11.pdf',
      },
      '19': {
        label: 'अध्याय 19',
        title: 'खनिज संसाधन - Mineral Resources',
        pdfUrl: '/book-samples/hindi/Chapter 19.pdf',
      },
      '25': {
        label: 'अध्याय 25',
        title: 'आर्थिक विकास - Economic Development',
        pdfUrl: '/book-samples/hindi/Chapter 25.pdf',
      },
      '27': {
        label: 'अध्याय 27',
        title: 'शिक्षा सुधार - Education Reforms',
        pdfUrl: '/book-samples/hindi/27 chapter education .pdf',
      },
    },
  };

  const englishChapters = Object.keys(chapterContent.en);
  const hindiChapters = Object.keys(chapterContent.hi);
  const currentChapters = selectedLanguage === 'en' ? englishChapters : hindiChapters;
  const currentContent = chapterContent[selectedLanguage];

  const handleLanguageChange = (language: 'en' | 'hi') => {
    setSelectedLanguage(language);
    setSelectedChapter('index'); // Reset to index when language changes
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      // Prepare data for Google Sheet
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('pinCode', formData.pinCode);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('landmark', formData.landmark);
      formDataToSend.append('language', selectedLanguage === 'en' ? 'English' : 'हिंदी');

      // Submit to Google Apps Script
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbyS2M34dKi6V5TmZv6Z2PKEdQHC0RoQmcGdMGNRjlCS1Rc2Tk6VeLWPvMI3iFEkz3q3-Q/exec',
        {
          method: 'POST',
          body: formDataToSend,
          mode: 'no-cors',
        }
      );

      // Redirect to payment page regardless of response (Google Apps Script CORS)
      const orderId = 'UK' + Date.now();
      const params = new URLSearchParams({
        orderId: orderId,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        language: selectedLanguage === 'en' ? 'English' : 'हिंदी',
      });

      router.push(`/order-confirmation?${params.toString()}`);
    } catch (error) {
      setSubmitMessage(selectedLanguage === 'en' 
        ? '❌ Error. Redirecting to payment...' 
        : '❌ त्रुटि। भुगतान पृष्ठ पर जा रहे हैं...'
      );
      
      // Redirect anyway after error
      setTimeout(() => {
        const orderId = 'UK' + Date.now();
        const params = new URLSearchParams({
          orderId: orderId,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          language: selectedLanguage === 'en' ? 'English' : 'हिंदी',
        });
        router.push(`/order-confirmation?${params.toString()}`);
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedChapterData = selectedChapter
    ? currentContent[selectedChapter]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Book className="text-orange-500" size={40} />
            UKPSC Decoded
          </h1>
          <p className="text-xl text-slate-300">
            उत्तराखंड का संपूर्ण अध्ययन पुस्तक
          </p>

          {/* Language Toggle */}
          <div className="flex justify-center gap-4 mt-8 mb-8">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                selectedLanguage === 'hi'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Chapters List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl p-6 sticky top-4 shadow-2xl border border-slate-700 max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">
                {selectedLanguage === 'en' ? 'Sample Chapters' : 'नमूना अध्याय'}
              </h2>
              <div className="space-y-2">
                {currentChapters.map((chapterId) => {
                  const chapter = currentContent[chapterId];
                  const isSelected = selectedChapter === chapterId;
                  return (
                    <button
                      key={chapterId}
                      onClick={() => setSelectedChapter(chapterId)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-sm">{chapter.label}</div>
                      <div className="text-xs opacity-90 line-clamp-2">{chapter.title}</div>
                      {chapter.isIndex && (
                        <div className="text-xs mt-1 opacity-75">📑 {selectedLanguage === 'en' ? 'Index' : 'विषय-सूची'}</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Price Box */}
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <div className="text-white">
                  <div className="text-sm opacity-90">Price</div>
                  <div className="text-3xl font-bold">₹499</div>
                  <div className="text-xs opacity-75">Free Shipping | 4 Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Form + Chapter Preview */}
          <div className="lg:col-span-2">
            {/* BUY FORM - Always Visible & Bigger */}
            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 mb-6">
              <h2 className="text-3xl font-bold text-white mb-8">
                {selectedLanguage === 'en' ? '📦 Place Your Order' : '📦 अपना आदेश दें'}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      {selectedLanguage === 'en' ? 'Full Name *' : 'पूरा नाम *'}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition"
                      placeholder={selectedLanguage === 'en' ? 'Your Name' : 'आपका नाम'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      {selectedLanguage === 'en' ? 'Email *' : 'ईमेल *'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      {selectedLanguage === 'en' ? 'Phone *' : 'फोन *'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition"
                      placeholder="+91 98XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      {selectedLanguage === 'en' ? 'City *' : 'शहर *'}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition"
                      placeholder={selectedLanguage === 'en' ? 'City' : 'शहर'}
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      {selectedLanguage === 'en' ? 'PIN Code *' : 'पिन कोड *'}
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition"
                      placeholder="246001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      {selectedLanguage === 'en' ? 'State *' : 'राज्य *'}
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition"
                      placeholder={selectedLanguage === 'en' ? 'Uttarakhand' : 'उत्तराखंड'}
                    />
                  </div>
                </div>

                {/* Full Width: Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    {selectedLanguage === 'en' ? 'Street Address *' : 'पता *'}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition"
                    placeholder={selectedLanguage === 'en' ? 'Complete street address' : 'पूरा पता'}
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    {selectedLanguage === 'en' ? 'Landmark' : 'निकटतम स्थान'}
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition"
                    placeholder={selectedLanguage === 'en' ? 'Nearby landmark' : 'निकटतम स्थान'}
                  />
                </div>

                {/* Book Language Display */}
                <div className="p-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg border-l-4 border-orange-500">
                  <p className="text-sm text-slate-200">
                    <span className="font-semibold">
                      {selectedLanguage === 'en' ? 'Book Language:' : 'पुस्तक की भाषा:'}
                    </span>
                    <span className="ml-3 text-orange-400 font-bold text-lg">
                      {selectedLanguage === 'en' ? '📖 English' : '📖 हिंदी'}
                    </span>
                  </p>
                </div>

                {/* Submit Button - BIGGER */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {submitting
                    ? (selectedLanguage === 'en' ? '⏳ Processing...' : '⏳ प्रसंस्करण...')
                    : (selectedLanguage === 'en' ? '💳 Proceed to Payment' : '💳 भुगतान करें')}
                </button>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-3 rounded-lg text-center text-sm ${
                    submitMessage.includes('✅')
                      ? 'bg-green-900 text-green-200'
                      : 'bg-orange-900 text-orange-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>

            {/* CHAPTER PREVIEW - Below Form */}
            {selectedChapterData ? (
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Chapter Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 border-b border-slate-600 flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedChapterData.title}
                    </h2>
                    <p className="text-slate-300 text-sm">
                      {selectedChapterData.isIndex 
                        ? (selectedLanguage === 'en' ? '📑 Complete Index' : '📑 संपूर्ण विषय-सूची')
                        : (selectedLanguage === 'en' ? '📄 Sample Preview' : '📄 नमूना पूर्वावलोकन')
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedChapter('')}
                    className="text-slate-400 hover:text-white transition-colors ml-4"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content Area - PDF Viewer */}
                <div className="p-8 text-center min-h-96 flex flex-col items-center justify-center bg-slate-700">
                  <Eye size={56} className="text-slate-400 mb-4" />
                  <p className="text-slate-300 mb-4 text-lg font-semibold">
                    {selectedLanguage === 'en' ? 'PDF Preview' : 'PDF पूर्वावलोकन'}
                  </p>
                  <p className="text-slate-400 text-sm mb-6">
                    {selectedLanguage === 'en'
                      ? 'Click "View PDF" below to see 2-3 sample pages'
                      : '2-3 नमूना पृष्ठ देखने के लिए नीचे "PDF देखें" पर क्लिक करें'}
                  </p>
                </div>

                {/* View Button */}
                <div className="bg-slate-700 p-6 border-t border-slate-600">
                  <button
                    onClick={() => window.open(selectedChapterData.pdfUrl, '_blank')}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-3"
                  >
                    <Eye size={22} />
                    {selectedLanguage === 'en' ? '👁️ View PDF' : '👁️ PDF देखें'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
