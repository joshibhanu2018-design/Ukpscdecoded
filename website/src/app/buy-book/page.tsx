'use client';

import { useState } from 'react';
import { Download, X, Eye, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface ChapterContent {
  label: string;
  title: string;
  pdfUrl: string;
}

interface ChapterBook {
  [key: string]: ChapterContent;
}

interface LanguageChapters {
  en: ChapterBook;
  hi: ChapterBook;
}

export default function BuyBookPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  // Complete chapter configuration with PDF URLs from public folder
  const chapterContent: LanguageChapters = {
    en: {
      '1': {
        label: 'Chapter 1',
        title: 'Epigraphy - Inscriptions & Their Significance',
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
        title: 'Uttarakhand Economy - MSME & Industrial Development',
        pdfUrl: '/book-samples/english/chapter-21.pdf',
      },
      '27': {
        label: 'Chapter 27',
        title: 'Education Reforms & Human Resources Development',
        pdfUrl: '/book-samples/english/chapter-27.pdf',
      },
    },
    hi: {
      'index': {
        label: 'विषय-सूची',
        title: 'पुस्तक की विषय-सूची (Table of Contents)',
        pdfUrl: '/book-samples/hindi/index.pdf',
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

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
  };

  const openPDF = () => {
    if (selectedChapter) {
      const chapter = currentContent[selectedChapter];
      if (chapter.pdfUrl) {
        window.open(chapter.pdfUrl, '_blank');
      }
    }
  };

  const downloadPDF = () => {
    if (selectedChapter) {
      const chapter = currentContent[selectedChapter];
      if (chapter.pdfUrl) {
        const link = document.createElement('a');
        link.href = chapter.pdfUrl;
        link.download = chapter.label.replace(/\s+/g, '-') + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const selectedChapterData = selectedChapter
    ? currentContent[selectedChapter]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            UKPSC Decoded
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            उत्तराखंड का संपूर्ण अध्ययन पुस्तक
          </p>

          {/* Language Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setSelectedLanguage('en');
                setSelectedChapter(null);
              }}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setSelectedLanguage('hi');
                setSelectedChapter(null);
              }}
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

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapters List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl p-6 sticky top-4 shadow-2xl border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">
                {selectedLanguage === 'en' ? 'Sample Chapters' : 'नमूना अध्याय'}
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {currentChapters.map((chapterId) => {
                  const chapter = currentContent[chapterId];
                  return (
                    <button
                      key={chapterId}
                      onClick={() => handleChapterSelect(chapterId)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        selectedChapter === chapterId
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      <div className="font-semibold">{chapter.label}</div>
                      <div className="text-sm opacity-90 line-clamp-2">{chapter.title}</div>
                    </button>
                  );
                })}
              </div>

              {/* Price Box */}
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <div className="text-white">
                  <div className="text-sm opacity-90">Price</div>
                  <div className="text-3xl font-bold">₹499</div>
                  <div className="text-xs opacity-75">Free Shipping | 4 Days Delivery</div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/order-confirmation">
                <button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                  अभी खरीदें | Buy Now
                </button>
              </Link>
            </div>
          </div>

          {/* Chapter Display */}
          <div className="lg:col-span-2">
            {selectedChapter && selectedChapterData ? (
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Chapter Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 border-b border-slate-600 flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedChapterData.title}
                    </h2>
                    <p className="text-slate-300">
                      {selectedLanguage === 'en'
                        ? 'Preview & Download Sample PDF'
                        : 'नमूना PDF पूर्वावलोकन और डाउनलोड'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X size={28} />
                  </button>
                </div>

                {/* PDF Preview Area */}
                <div className="p-8 min-h-96 flex flex-col items-center justify-center bg-slate-700 text-center">
                  <Eye size={64} className="text-slate-400 mb-4" />
                  <p className="text-slate-300 mb-2 text-lg">
                    {selectedLanguage === 'en'
                      ? 'PDF Preview'
                      : 'PDF पूर्वावलोकन'}
                  </p>
                  <p className="text-slate-400 text-sm mb-6">
                    {selectedLanguage === 'en'
                      ? 'Click "View PDF" to open sample pages in new tab'
                      : 'नमूना पृष्ठ देखने के लिए "PDF देखें" पर क्लिक करें'}
                  </p>
                  <div className="text-slate-400 text-xs">
                    {selectedLanguage === 'en'
                      ? `File: ${selectedChapterData.label.replace(/\s+/g, '-')}.pdf`
                      : `फाइल: ${selectedChapterData.label.replace(/\s+/g, '-')}.pdf`}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-slate-700 p-6 flex gap-4 border-t border-slate-600">
                  <button
                    onClick={openPDF}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={20} />
                    {selectedLanguage === 'en' ? 'View PDF' : 'PDF देखें'}
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    {selectedLanguage === 'en' ? 'Download' : 'डाउनलोड'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
                <ChevronDown size={48} className="mx-auto opacity-50 mb-4 text-slate-400" />
                <p className="text-slate-300 text-lg">
                  {selectedLanguage === 'en'
                    ? 'Select a chapter from the left to view and download sample PDF'
                    : 'नमूना PDF देखने और डाउनलोड करने के लिए बाईं ओर से कोई अध्याय चुनें'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedLanguage === 'en' ? '28 Chapters' : '28 अध्याय'}
            </h3>
            <p className="text-slate-400">
              {selectedLanguage === 'en'
                ? 'Complete coverage of all UKPSC topics'
                : 'सभी UKPSC विषयों का संपूर्ण कवरेज'}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedLanguage === 'en' ? 'Bilingual' : 'द्विभाषी'}
            </h3>
            <p className="text-slate-400">
              {selectedLanguage === 'en'
                ? 'Content in English & हिंदी'
                : 'अंग्रेजी और हिंदी दोनों में'}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedLanguage === 'en' ? 'PDF Access' : 'PDF पहुंच'}
            </h3>
            <p className="text-slate-400">
              {selectedLanguage === 'en'
                ? 'Download sample PDFs instantly'
                : 'तुरंत नमूना PDF डाउनलोड करें'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
