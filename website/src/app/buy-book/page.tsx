'use client';

import { useState } from 'react';
import { X, Eye, ChevronDown, Book } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ChapterContent {
  label: string;
  title: string;
  htmlContent?: string;
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
  const [selectedChapter, setSelectedChapter] = useState<string>('index');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    landmark: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const chapterContent: LanguageChapters = {
    en: {
      'index': {
        label: '📑 Table of Contents',
        title: 'Complete Index - All 28 Chapters',
        isIndex: true,
        htmlContent: `
          <div class="space-y-6">
            <h2 class="text-2xl font-bold text-white">UTTARAKHAND Decoded - Complete Index (28 Chapters)</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART A: HISTORY & CULTURE (Chapters 1-10)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300">
                  <li>Epigraphy - Inscriptions & Their Significance</li>
                  <li>The Katyuri Dynasty & Parmar Dynasty of Garhwal</li>
                  <li>Anglo-Gorkha War & Liberation (1814-1815)</li>
                  <li>British Rule in Uttarakhand (1815-1947)</li>
                  <li>Indian Freedom Struggle in Uttarakhand</li>
                  <li>Post-Independence Development (1947-2000)</li>
                  <li>Formation of Uttarakhand State (2000)</li>
                  <li>Cultural Heritage & Sacred Sites</li>
                  <li>Religious Significance & Pilgrimage Routes</li>
                  <li>Local Traditions & Folk Culture</li>
                </ol>
              </div>
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART B: POLITICS & GOVERNANCE (Chapters 11-14)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300" start="11">
                  <li>Political Parties & Electoral History</li>
                  <li>Electoral System & Democratic Institutions</li>
                  <li>District Administration & Local Bodies</li>
                  <li>Land Reforms & Constitutional Amendments</li>
                </ol>
              </div>
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART C: GEOGRAPHY (Chapters 15-20)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300" start="15">
                  <li>Physical Geography & Topography</li>
                  <li>Climate & Weather Patterns</li>
                  <li>Vegetation & Biodiversity</li>
                  <li>Water Resources & Hydropower</li>
                  <li>Mineral Resources & Geology</li>
                  <li>Environmental Protection & Conservation</li>
                </ol>
              </div>
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART D: ECONOMY (Chapters 21-25)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300" start="21">
                  <li>Agriculture & Horticulture</li>
                  <li>Industries & MSME Development</li>
                  <li>Tourism & Hospitality Sector</li>
                  <li>Transportation & Infrastructure</li>
                  <li>Economic Development & Growth Indicators</li>
                </ol>
              </div>
              <div>
                <h3 class="text-xl font-bold text-orange-400 mb-3">PART E: DISASTER MANAGEMENT & HRD (Chapters 26-28)</h3>
                <ol class="list-decimal list-inside space-y-2 text-slate-300" start="26">
                  <li>Disaster Management & Natural Hazards</li>
                  <li>Education Reforms & Human Resources Development</li>
                  <li>Health & Wellness Infrastructure</li>
                </ol>
              </div>
            </div>
          </div>
        `,
      },
      '2': {
        label: 'Chapter 2',
        title: 'The Katyuri Dynasty & Parmar Dynasty of Garhwal',
        htmlContent: `<div class="space-y-6 text-slate-300 text-sm"><h2 class="text-2xl font-bold text-white">Chapter 2: The Katyuri Dynasty & Parmar Dynasty of Garhwal</h2><p>Sample chapter content...</p></div>`,
      },
      '3': {
        label: 'Chapter 3',
        title: 'Gorkha Rule & Anglo-Gorkha War (1790-1815)',
        htmlContent: `<div class="space-y-6 text-slate-300 text-sm"><h2 class="text-2xl font-bold text-white">Chapter 3: Gorkha Rule & Anglo-Gorkha War</h2><p>Sample chapter content...</p></div>`,
      },
      '4': {
        label: 'Chapter 4',
        title: 'British Rule in Uttarakhand (1815-1947)',
        htmlContent: `<div class="space-y-6 text-slate-300 text-sm"><h2 class="text-2xl font-bold text-white">Chapter 4: British Rule in Uttarakhand (1815–1947)</h2><p>Sample chapter content...</p></div>`,
      },
      '27': {
        label: 'Chapter 27',
        title: 'Education Reforms & HRD - Labour & Skills',
        htmlContent: `<div class="space-y-6 text-slate-300 text-sm"><h2 class="text-2xl font-bold text-white">Chapter 27: Education & HRD</h2><p>Sample chapter content...</p></div>`,
      },
    },
    hi: {
      'index': {
        label: '📑 विषय-सूची',
        title: 'संपूर्ण विषय-सूची - सभी 28 अध्याय',
        isIndex: true,
        pdfUrl: '/book-samples/hindi/Hindi%20book%20index.pdf',
      },
      '2': {
        label: 'अध्याय 2',
        title: 'कत्यूरी वंश',
        pdfUrl: '/book-samples/hindi/Chapter 2 sample.pdf',
      },
      '3': {
        label: 'अध्याय 3',
        title: 'गोरखा शासन',
        pdfUrl: '/book-samples/hindi/Chapter 3.pdf',
      },
      '4': {
        label: 'अध्याय 4',
        title: 'ब्रिटिश शासन',
        pdfUrl: '/book-samples/hindi/Chapter 4.pdf',
      },
      '9': {
        label: 'अध्याय 9',
        title: 'धार्मिक महत्व',
        pdfUrl: '/book-samples/hindi/Chapter 9.pdf',
      },
      '11': {
        label: 'अध्याय 11',
        title: 'राजनीतिक दल',
        pdfUrl: '/book-samples/hindi/Chapter 11.pdf',
      },
      '19': {
        label: 'अध्याय 19',
        title: 'खनिज संसाधन',
        pdfUrl: '/book-samples/hindi/Chapter 19.pdf',
      },
      '25': {
        label: 'अध्याय 25',
        title: 'आर्थिक विकास',
        pdfUrl: '/book-samples/hindi/Chapter 25.pdf',
      },
      '27': {
        label: 'अध्याय 27',
        title: 'शिक्षा सुधार',
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
    setSelectedChapter('index');
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

    try {
      const payload = {
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        city: formData.city || '',
        pincode: formData.pincode || '',
        state: formData.state || '',
        landmark: formData.landmark || '',
        language: selectedLanguage === 'en' ? 'English' : 'हिंदी',
      };

      await fetch(
        'https://script.google.com/macros/s/AKfycbyS2M34dKi6V5TmZv6Z2PKEdQHC0RoQmcGdMGNRjlCS1Rc2Tk6VeLWPvMI3iFEkz3q3-Q/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        }
      );

      const orderId = 'UK' + Date.now();
      const params = new URLSearchParams({
        orderId: orderId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        language: selectedLanguage === 'en' ? 'English' : 'हिंदी',
      });

      router.push(`/order-confirmation?${params.toString()}`);
    } catch (error) {
      console.error('Form submission error:', error);
      const orderId = 'UK' + Date.now();
      const params = new URLSearchParams({
        orderId: orderId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        language: selectedLanguage === 'en' ? 'English' : 'हिंदी',
      });
      router.push(`/order-confirmation?${params.toString()}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedChapterData = selectedChapter ? currentContent[selectedChapter] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Book className="text-orange-500" size={40} />
            UTTARAKHAND Decoded
          </h1>
          <p className="text-xl text-slate-300">उत्तराखंड का संपूर्ण अध्ययन पुस्तक</p>

          {/* LARGE LANGUAGE TOGGLE */}
          <div className="flex justify-center gap-6 mt-8 mb-8">
            <button onClick={() => handleLanguageChange('en')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${selectedLanguage === 'en' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              🇬🇧 ENGLISH
            </button>
            <button onClick={() => handleLanguageChange('hi')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${selectedLanguage === 'hi' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              🇮🇳 हिंदी
            </button>
          </div>

          {/* BOOK COVER DISPLAY - NEW SECTION */}
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-sm">
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 p-4 hover:shadow-3xl transition-shadow">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-900">
                  <Image
                    src={selectedLanguage === 'en' ? '/ENGLISH COVER FULL FRONT AND BACK.png' : '/HINDI COVER FULL FRONT AND BACK.png'}
                    alt={selectedLanguage === 'en' ? 'UTTARAKHAND Decoded - English Edition' : 'UTTARAKHAND Decoded - Hindi Edition'}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-sm">{selectedLanguage === 'en' ? '🇬🇧 English Edition' : '🇮🇳 हिंदी संस्करण'}</p>
                  <p className="text-white font-bold mt-2">UTTARAKHAND Decoded</p>
                  <p className="text-orange-400 font-bold mt-1">₹499</p>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK INDEX BUTTON */}
          <button onClick={() => setSelectedChapter('index')} className="inline-block px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-lg font-bold text-sm hover:shadow-lg transition-all">
            📑 {selectedLanguage === 'en' ? 'VIEW FULL INDEX' : 'पूरी विषय-सूची देखें'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl p-6 sticky top-4 shadow-2xl border border-slate-700 max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">{selectedLanguage === 'en' ? 'Chapters' : 'अध्याय'}</h2>
              <div className="space-y-2">
                {currentChapters.map((chapterId) => {
                  const chapter = currentContent[chapterId];
                  const isSelected = selectedChapter === chapterId;
                  return (
                    <button key={chapterId} onClick={() => setSelectedChapter(chapterId)} className={`w-full text-left p-4 rounded-lg transition-all ${isSelected ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                      <div className="font-semibold text-sm">{chapter.label}</div>
                      <div className="text-xs opacity-90 line-clamp-2">{chapter.title}</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <div className="text-white">
                  <div className="text-sm opacity-90">Price</div>
                  <div className="text-3xl font-bold">₹499</div>
                  <div className="text-xs opacity-75">Free Shipping</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedChapterData ? (
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 border-b border-slate-600 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedChapterData.title}</h2>
                    <p className="text-slate-300 text-sm mt-2">{selectedChapterData.isIndex ? (selectedLanguage === 'en' ? '📑 Index' : '📑 विषय-सूची') : (selectedLanguage === 'en' ? '📄 Sample' : '📄 नमूना')}</p>
                  </div>
                  <button onClick={() => setSelectedChapter('')} className="text-slate-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 max-h-96 overflow-y-auto">
                  {selectedChapterData.htmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedChapterData.htmlContent }} />
                  ) : selectedChapterData.pdfUrl ? (
                    <div className="text-center py-12">
                      <Eye size={56} className="text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-6">{selectedLanguage === 'en' ? 'PDF Preview' : 'PDF पूर्वावलोकन'}</p>
                      <button onClick={() => window.open(selectedChapterData.pdfUrl, '_blank')} className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-bold">👁️ {selectedLanguage === 'en' ? 'View PDF' : 'PDF देखें'}</button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
                <ChevronDown size={48} className="mx-auto opacity-50 mb-4 text-slate-400" />
                <p className="text-slate-300 text-lg">{selectedLanguage === 'en' ? 'Select a chapter from the left to view sample' : 'नमूना देखने के लिए बाईं ओर से कोई अध्याय चुनें'}</p>
              </div>
            )}

            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
              <h2 className="text-3xl font-bold text-white mb-8">📦 {selectedLanguage === 'en' ? 'Place Order' : 'आदेश दें'}</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder={selectedLanguage === 'en' ? 'Full Name' : 'पूरा नाम'} value={formData.name} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="tel" name="phone" placeholder={selectedLanguage === 'en' ? 'Phone' : 'फोन'} value={formData.phone} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                  <input type="text" name="city" placeholder={selectedLanguage === 'en' ? 'City' : 'शहर'} value={formData.city} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="pincode" placeholder={selectedLanguage === 'en' ? 'PIN' : 'पिन'} value={formData.pincode} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                  <input type="text" name="state" placeholder={selectedLanguage === 'en' ? 'State' : 'राज्य'} value={formData.state} onChange={handleFormChange} required className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                </div>
                <textarea name="address" placeholder={selectedLanguage === 'en' ? 'Address' : 'पता'} rows={3} value={formData.address} onChange={handleFormChange} required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none"></textarea>
                <input type="text" name="landmark" placeholder={selectedLanguage === 'en' ? 'Landmark' : 'निकटतम स्थान'} value={formData.landmark} onChange={handleFormChange} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 outline-none" />
                <div className="p-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg border-l-4 border-orange-500">
                  <span className="text-slate-300">{selectedLanguage === 'en' ? 'Book: ' : 'पुस्तक: '}</span>
                  <span className="text-orange-400 font-bold">{selectedLanguage === 'en' ? '📖 English' : '📖 हिंदी'}</span>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl disabled:opacity-50">
                  {submitting ? '⏳ Processing...' : '💳 Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}