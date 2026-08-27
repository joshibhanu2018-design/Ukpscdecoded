'use client';

import { useState } from 'react';
import { X, Eye, ChevronDown, Book } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  // Chapter content with INDEX FIRST
  const chapterContent: LanguageChapters = {
    en: {
      'index': {
        label: '📑 Table of Contents',
        title: 'Complete Index - All 28 Chapters',
        isIndex: true,
        htmlContent: `
          <div class="space-y-6">
            <h2 class="text-2xl font-bold text-white">UKPSC Decoded - Complete Index (28 Chapters)</h2>
            
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
        htmlContent: `
          <div class="space-y-6 text-slate-300">
            <h2 class="text-2xl font-bold text-white">Chapter 2: The Katyuri Dynasty</h2>
            
            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Foundation & Key Rulers</h3>
              <p>The Kartikeyapur Dynasty, commonly known as the Katyuri Dynasty, holds the distinction of being the first unified historical dynasty of Uttarakhand. Their reign is widely regarded as the Golden Age of the region's architecture and sculpture.</p>
              <p class="mt-3">The dynasty was founded by Basant Dev around 700 CE. The first capital was established at Joshimath in Chamoli district, which was later shifted to Vaidhnath-Kartikeyapur in the Katyur Valley near Baijnath.</p>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Key Rulers</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Ishtagan</strong> - First to unite entire Uttarakhand region</li>
                <li><strong>Lalitsur Dev</strong> - Most powerful; prolific builder with maximum copper plate inscriptions</li>
                <li><strong>Bhudev</strong> - Staunch Brahmanist; major contributor to Baijnath temple</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Administration & Military</h3>
              <table class="w-full text-sm">
                <tr class="bg-slate-700">
                  <th class="border border-slate-600 px-4 py-2 text-left">Official</th>
                  <th class="border border-slate-600 px-4 py-2 text-left">Responsibility</th>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2">Saudabhangadhikrit</td>
                  <td class="border border-slate-600 px-4 py-2">Chief Architect for royal construction</td>
                </tr>
                <tr class="bg-slate-700">
                  <td class="border border-slate-600 px-4 py-2">Prantpal</td>
                  <td class="border border-slate-600 px-4 py-2">Defender of kingdom borders</td>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2">Bhogpati</td>
                  <td class="border border-slate-600 px-4 py-2">Tax Collector</td>
                </tr>
              </table>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Military Organization</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Infantry (Paidal Sena)</strong> - Led by Gaulmika</li>
                <li><strong>Cavalry (Ashvabal)</strong> - Commanded by Ashvabaladhikrit</li>
                <li><strong>Elephant Corps (Hastibal)</strong> - Led by Hastibaladhikrit</li>
                <li><strong>Camel Corps (Ushtrabal)</strong> - Under Ushtrabaladhikrit</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Architecture - Golden Age</h3>
              <p class="mb-3">The Katyuri period represents the architectural Golden Age, heavily influenced by the Nagara style of North Indian temple architecture.</p>
              <p><strong>Key Sites:</strong></p>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Jageshwar</strong> - Over 100 temples showcasing Nagara and Shikara styles</li>
                <li><strong>Dwarahat (Gujar Deval)</strong> - Incomparable example of Shikhara style</li>
                <li><strong>Katarmal Sun Temple</strong> - Second largest Sun Temple in India</li>
                <li><strong>Baijnath</strong> - Main Shiva shrine + 17 subsidiary shrines</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Decline & Fragmentation</h3>
              <p>The decline was driven by weak successors, devastating Nepalese invasions (1191 CE and 1223 CE), and internal administrative decay. The last ruler, Brahmadev, was highly tyrannical. The rising Chand Dynasty eventually ended Katyuri supremacy entirely.</p>
            </div>
          </div>
        `,
      },
      '3': {
        label: 'Chapter 3',
        title: 'Anglo-Gorkha War & Liberation (1814-1815)',
        htmlContent: `
          <div class="space-y-6 text-slate-300">
            <h2 class="text-2xl font-bold text-white">Chapter 3: Anglo-Gorkha War & Liberation</h2>
            
            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">The Battle of Nalapani (Khalanga Fort)</h3>
              <p>The most celebrated engagement of the war took place at Nalapani (Khalanga) Fort in Dehradun. British forces under Major General Gillespie assaulted the fort, which was defended by Captain Balbhadra Thapa with just 500 Gorkha soldiers.</p>
              <p class="mt-3"><strong>Key Events:</strong></p>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>October 31, 1814</strong> - Major General Gillespie was killed in battle</li>
                <li>The British ultimately prevailed by cutting off the fort's drinking water supply</li>
                <li><strong>Khalanga War Memorial</strong> - Built in Dehradun as unique tribute to both sides</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Treaty of Sugauli (1816)</h3>
              <p>The Treaty of Sugauli was signed between the British and Nepal and ratified on <strong>May 4, 1816</strong>. It formally ended the conflict and liberated Uttarakhand from Gorkha rule.</p>
              <table class="w-full text-sm mt-3">
                <tr class="bg-slate-700">
                  <th class="border border-slate-600 px-4 py-2 text-left">Territory</th>
                  <th class="border border-slate-600 px-4 py-2 text-left">Before War</th>
                  <th class="border border-slate-600 px-4 py-2 text-left">After Treaty</th>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2">Kumaon & Eastern Garhwal</td>
                  <td class="border border-slate-600 px-4 py-2">Gorkha controlled</td>
                  <td class="border border-slate-600 px-4 py-2">British East India Company</td>
                </tr>
                <tr class="bg-slate-700">
                  <td class="border border-slate-600 px-4 py-2">Western Garhwal</td>
                  <td class="border border-slate-600 px-4 py-2">Gorkha controlled</td>
                  <td class="border border-slate-600 px-4 py-2">Sudarshan Shah (Tehri State)</td>
                </tr>
              </table>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Strategic Impact</h3>
              <p>The Anglo-Gorkha War fundamentally altered the region's political landscape:</p>
              <ol class="list-decimal list-inside space-y-2 mt-3">
                <li>Kumaon and Eastern Garhwal came under British rule</li>
                <li>Nepal's territory was significantly reduced</li>
                <li>Uttarakhand entered the British Indian Empire</li>
                <li>A new administrative system replaced Gorkha military occupation</li>
                <li>The region entered 132 years of British colonial administration (1815-1947)</li>
              </ol>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Legacy</h3>
              <p>The Khalanga War and Treaty of Sugauli remain significant in Uttarakhand's historical consciousness as symbols of both resistance and the beginning of British imperial expansion.</p>
            </div>
          </div>
        `,
      },
      '27': {
        label: 'Chapter 27',
        title: 'Education Reforms & Human Resources Development',
        htmlContent: `
          <div class="space-y-6 text-slate-300">
            <h2 class="text-2xl font-bold text-white">Chapter 27: Education Reforms & HRD</h2>
            
            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Overview: Three Phases of Development</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Phase 1 (2000–2013):</strong> Access and Enrollment</li>
                <li><strong>Phase 2 (2013–2020):</strong> Quality and Governance</li>
                <li><strong>Phase 3 (2020–Present):</strong> Outcomes and Employability</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">School Education Statistics</h3>
              <table class="w-full text-sm">
                <tr class="bg-slate-700">
                  <th class="border border-slate-600 px-4 py-2 text-left">Category</th>
                  <th class="border border-slate-600 px-4 py-2 text-left">Primary</th>
                  <th class="border border-slate-600 px-4 py-2 text-left">Secondary</th>
                  <th class="border border-slate-600 px-4 py-2 text-left">Higher Sec</th>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2">Government Schools</td>
                  <td class="border border-slate-600 px-4 py-2">8,450</td>
                  <td class="border border-slate-600 px-4 py-2">3,280</td>
                  <td class="border border-slate-600 px-4 py-2">1,540</td>
                </tr>
                <tr class="bg-slate-700">
                  <td class="border border-slate-600 px-4 py-2">Private Schools</td>
                  <td class="border border-slate-600 px-4 py-2">2,120</td>
                  <td class="border border-slate-600 px-4 py-2">1,450</td>
                  <td class="border border-slate-600 px-4 py-2">890</td>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2">Enrollment (Lakhs)</td>
                  <td class="border border-slate-600 px-4 py-2">22.5</td>
                  <td class="border border-slate-600 px-4 py-2">14.2</td>
                  <td class="border border-slate-600 px-4 py-2">8.7</td>
                </tr>
              </table>
              <p class="mt-3"><strong>Key Metrics:</strong> Literacy Rate: 78.82% | Gender Parity: 0.98</p>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Key Education Initiatives</h3>
              <table class="w-full text-sm">
                <tr class="bg-slate-700">
                  <th class="border border-slate-600 px-4 py-2 text-left">Initiative</th>
                  <th class="border border-slate-600 px-4 py-2 text-left">Focus</th>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2"><strong>Samagra Shiksha</strong></td>
                  <td class="border border-slate-600 px-4 py-2">Universal education quality for all students</td>
                </tr>
                <tr class="bg-slate-700">
                  <td class="border border-slate-600 px-4 py-2"><strong>Digital Literacy</strong></td>
                  <td class="border border-slate-600 px-4 py-2">Technology integration in rural areas</td>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2"><strong>Skill Uttarakhand</strong></td>
                  <td class="border border-slate-600 px-4 py-2">Vocational training for youth 18-35</td>
                </tr>
                <tr class="bg-slate-700">
                  <td class="border border-slate-600 px-4 py-2"><strong>Higher Education</strong></td>
                  <td class="border border-slate-600 px-4 py-2">University support and scholarships</td>
                </tr>
              </table>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">NEP 2020 Implementation</h3>
              <p>The state actively implements the National Education Policy 2020 with focus on:</p>
              <ul class="list-disc list-inside space-y-2 mt-3">
                <li>Multidisciplinary education approach</li>
                <li>Indian languages in curriculum (Sanskrit, Hindi)</li>
                <li>Critical thinking and analysis skills</li>
                <li>Integration with vocational training</li>
                <li>Teacher professional development</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">The SANTULAN Model</h3>
              <p>Uttarakhand is pursuing "SANTULAN" to convert "Geography-led problems into Technology-led solutions."</p>
              <p class="mt-3"><strong>Strategic Recommendations:</strong></p>
              <ul class="list-disc list-inside space-y-2">
                <li>Curriculum Contextualization - Teach monetization of local geography</li>
                <li>PM SHRI Cluster Model - Schools of Excellence with smart bus services</li>
                <li>Hub-and-Spoke Training - Apex centers + mobile training labs</li>
                <li>Mandatory Apprenticeships - Industry-academia linkages</li>
                <li>Green Skill Development - Train as Carbon Auditors</li>
                <li>Orange Economy Expansion - High-value mountain products</li>
                <li>Localized Incubation - District-level start-up incubators</li>
                <li>Silver Economy Integration - Geriatric caregiver training</li>
                <li>AI & Future Tech - Uttarakhand AI Mission 2025</li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">The VIGYAN Framework</h3>
              <table class="w-full text-sm">
                <tr class="bg-slate-700">
                  <th class="border border-slate-600 px-4 py-2 text-left">Principle</th>
                  <th class="border border-slate-600 px-4 py-2 text-left">Application</th>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2"><strong>V - Value</strong></td>
                  <td class="border border-slate-600 px-4 py-2">Ethics, environmental stewardship</td>
                </tr>
                <tr class="bg-slate-700">
                  <td class="border border-slate-600 px-4 py-2"><strong>I - Innovation</strong></td>
                  <td class="border border-slate-600 px-4 py-2">Startup labs, AI mission</td>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2"><strong>G - Governance</strong></td>
                  <td class="border border-slate-600 px-4 py-2">SETU Aayog appraisals</td>
                </tr>
                <tr class="bg-slate-700">
                  <td class="border border-slate-600 px-4 py-2"><strong>Y - Youth-centric</strong></td>
                  <td class="border border-slate-600 px-4 py-2">Global schemes, incubators</td>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-4 py-2"><strong>A - Accountability</strong></td>
                  <td class="border border-slate-600 px-4 py-2">Outcome-based funding</td>
                </tr>
                <tr class="bg-slate-700">
                  <td class="border border-slate-600 px-4 py-2"><strong>N - Nature-smart</strong></td>
                  <td class="border border-slate-600 px-4 py-2">Green skills, eco-tourism</td>
                </tr>
              </table>
            </div>

            <div>
              <h3 class="text-xl font-bold text-orange-400 mb-3">Future Roadmap (2025-2047)</h3>
              <p>Uttarakhand's education transformation aims to convert the "migration force" into a skilled "Himalayan growth force" for Viksit Bharat @ 2047, positioning Uttarakhand as India's "Knowledge Hub of the Himalayas."</p>
            </div>
          </div>
        `,
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
      // FIXED: Send as JSON (not FormData) - matches Google Apps Script doPost()
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

      const response = await fetch(
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

      // Redirect to payment
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
      // Still redirect to payment
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Book className="text-orange-500" size={40} />
            UKPSC Decoded
          </h1>
          <p className="text-xl text-slate-300">उत्तराखंड का संपूर्ण अध्ययन पुस्तक</p>

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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Chapters (INDEX FIRST) */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl p-6 sticky top-4 shadow-2xl border border-slate-700 max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">
                {selectedLanguage === 'en' ? 'Chapters' : 'अध्याय'}
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
                    </button>
                  );
                })}
              </div>

              {/* Price */}
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <div className="text-white">
                  <div className="text-sm opacity-90">Price</div>
                  <div className="text-3xl font-bold">₹499</div>
                  <div className="text-xs opacity-75">Free Shipping</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Form + Preview */}
          <div className="lg:col-span-2">
            {/* FORM */}
            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 mb-6">
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

            {/* CHAPTER PREVIEW */}
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
                      <button onClick={() => window.open(selectedChapterData.pdfUrl, '_blank')} className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-bold">
                        👁️ {selectedLanguage === 'en' ? 'View PDF' : 'PDF देखें'}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
