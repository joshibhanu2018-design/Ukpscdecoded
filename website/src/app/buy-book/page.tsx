'use client';

import { useState } from 'react';
import { Download, X, Eye, ChevronDown, Book } from 'lucide-react';
import Link from 'next/link';

interface ChapterContent {
  label: string;
  title: string;
  pdfUrl?: string;
  markdownContent?: string;
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
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pinCode: '',
    state: '',
    landmark: '',
    bookLanguage: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Complete chapter configuration
  const chapterContent: LanguageChapters = {
    en: {
      'index': {
        label: 'Table of Contents',
        title: 'Complete Index - All 28 Chapters',
        isIndex: true,
        markdownContent: `# UKPSC Decoded - Complete Index (28 Chapters)

## PART A: HISTORY & CULTURE (Chapters 1-10)
1. Epigraphy - Inscriptions & Their Significance
2. The Katyuri Dynasty & Parmar Dynasty of Garhwal
3. Anglo-Gorkha War & Liberation (1814-1815)
4. British Rule in Uttarakhand (1815-1947)
5. Indian Freedom Struggle in Uttarakhand
6. Post-Independence Development (1947-2000)
7. Formation of Uttarakhand State (2000)
8. Cultural Heritage & Sacred Sites
9. Religious Significance & Pilgrimage Routes
10. Local Traditions & Folk Culture

## PART B: POLITICS & GOVERNANCE (Chapters 11-14)
11. Political Parties & Electoral History
12. Electoral System & Democratic Institutions
13. District Administration & Local Bodies
14. Land Reforms & Constitutional Amendments

## PART C: GEOGRAPHY (Chapters 15-20)
15. Physical Geography & Topography
16. Climate & Weather Patterns
17. Vegetation & Biodiversity
18. Water Resources & Hydropower
19. Mineral Resources & Geology
20. Environmental Protection & Conservation

## PART D: ECONOMY (Chapters 21-25)
21. Agriculture & Horticulture
22. Industries & MSME Development
23. Tourism & Hospitality Sector
24. Transportation & Infrastructure
25. Economic Development & Growth Indicators

## PART E: DISASTER MANAGEMENT & HRD (Chapters 26-28)
26. Disaster Management & Natural Hazards
27. Education Reforms & Human Resources Development
28. Health & Wellness Infrastructure

---

*This sample book provides comprehensive coverage of Uttarakhand for UKPSC and competitive examinations.*`,
      },
      '2': {
        label: 'Chapter 2',
        title: 'The Katyuri Dynasty & Parmar Dynasty of Garhwal',
        markdownContent: `# Chapter 2: The Katyuri Dynasty & Parmar Dynasty of Garhwal

## PART A: THE KARTIKEYAPUR (KATYURI) DYNASTY (700 CE – 11th Century)

The Kartikeyapur Dynasty, commonly known as the Katyuri Dynasty, holds the distinction of being the first unified historical dynasty of Uttarakhand. Their reign is widely regarded as the Golden Age of the region's architecture and sculpture.

### 2.1 FOUNDATION & KEY RULERS

The dynasty was founded by Basant Dev around 700 CE. The rulers adopted the imperial title of *Paramabhattaraka Maharajadhiraja Parameshwar*, reflecting their claim to supreme sovereignty over the region. Their first capital was established at Joshimath in Chamoli district, which was later shifted to Vaidhnath-Kartikeyapur in the Katyur Valley near Baijnath.

**Three Key Rulers:**
- **Ishtagan** - First to unite entire Uttarakhand region
- **Lalitsur Dev** - Most powerful; prolific builder with maximum copper plate inscriptions
- **Bhudev** - Staunch Brahmanist; major contributor to Baijnath temple construction

### 2.2 ADMINISTRATION & MILITARY STRUCTURE

#### Territorial Division
The Katyuri administrative system was highly centralized:
- **Bhuktis** (Provinces) → headed by **Uparika**
- **Vishs** (Districts) → managed by **Vishpati**
- **Pallikas** (Villages) → overseen by **Mahattam** or **Sayan**

#### Key Administrative Officials
| Official | Responsibility |
|---|---|
| Saudabhangadhikrit | Chief Architect for royal construction |
| Prantpal | Defender of kingdom borders |
| Ghattpal | Guardian of mountain passes |
| Narapati | Manager of river crossings & toll collection |
| Akshapatlik | Chief Auditor & Accountant |
| Bhogpati | Tax Collector |
| Pramavatar | Land Measurement Officer |

#### Military Divisions
- **Paidal Sena** (Infantry) - led by Gaulmika
- **Ashvabal** (Cavalry) - commanded by Ashvabaladhikrit
- **Hastibal** (Elephant Corps) - led by Hastibaladhikrit
- **Ushtrabal** (Camel Corps) - under Ushtrabaladhikrit

### 2.3 ECONOMY & TAXATION

Agriculture, minerals, and forests constituted primary revenue sources. Land measurement followed a standardized system:
- Basic units: Dronavapam and Nali Vapam
- Larger measurements: Kulyavap (8 Dron) and Kharivap (20 Dron)

The dynasty maintained tax-free land grants (Vishnupriti, Goonth, Agrahar) donated to Brahmins or temples, forming the foundation of the temple economy in ancient Uttarakhand.

### 2.4 SOCIETY, CULTURE & RELIGION

Sanskrit served as the court language. The most significant religious event was the arrival of Adi Guru Shankaracharya, who established Jyotirmath (Badrikashram) and is believed to have renounced his body at Kedarnath in 820 CE.

### 2.5 ARCHITECTURE — THE ZENITH OF TEMPLE CONSTRUCTION

The Katyuri period represents the architectural Golden Age, heavily influenced by the Nagara style of North Indian temple architecture.

**Two Distinct Styles:**

1. **Chhatra-Type (Pagoda)** - Featured wooden umbrella roof; predominantly wood-based
   - Examples: Kedarnath Temple, Lakhamandal, Bageshwar temples

2. **Shikhara-Type** - Square, stone-built structures without wooden umbrellas
   - Examples: Dwarahat Group (Gujar Deval), Katarmal Sun Temple

**Key Architectural Sites:**
- **Jageshwar** - Over 100 temples showcasing Nagara and Shikara styles
- **Dwarahat (Gujar Deval)** - Incomparable example of Shikhara style
- **Katarmal Sun Temple** - Second largest Sun Temple in India
- **Baijnath** - Main Shiva shrine + 17 subsidiary shrines

### 2.6 DECLINE & FRAGMENTATION

The decline was driven by:
- Weak successors allowing internal administrative decay
- **1191 CE** - King Ashokchalla's Nepalese invasion
- **1223 CE** - King Krachaldeva's subjugation of Katyuri territories
- Dynasty fractured into multiple branches (Rajwars of Askot, Mallas of Doti)
- **Last Ruler: Brahmadev (Veerdev)** - Highly tyrannical; folk ballad "Jiyarani" records his misrule
- Eventually ended by the rising Chand Dynasty

### 2.7 COPPER PLATE EVIDENCE

Copper plate inscriptions provide crucial historical evidence:
- **Pandukeshwar Plates** - Document Lalit Sur Dev's rule and land grants
- **Bageshwar Plates** - Issued by King Bhudev, name 8 Katyuri kings
- **Kandara Plates** - Administrative evidence
- **Champawat Plates** - Confirm dynasty's presence in Kumaon

---

## MASTER COMPARATIVE TABLE: ALL FOUR RULERS OF UTTARAKHAND

| Parameter | Katyuri Dynasty | Parmar Dynasty (Garhwal) | Chand Dynasty (Kumaon) | Gorkha Rule |
|---|---|---|---|---|
| **Nature** | First unified monarchy | Regional monarchy (Garhwal) | Regional monarchy (Kumaon) | Foreign military occupation |
| **Region** | Unified Uttarakhand | Garhwal | Kumaon | Both |
| **Period** | 700–11th C. CE | 688–1804 CE | ~700–1790 CE | 1790–1815 |
| **Founder** | Basant Dev | Kanakpal | Somchand | Nepal's King |
| **Greatest Ruler** | Lalitsur Dev | Fateh Shah / Ajaypal | Jagat Chand / Rudra Chand | — |
| **Golden Age** | Architecture (entire period) | Fateh Shah's reign | Jagat Chand's reign | Dark Age |
| **Primary Tax** | Land-based via Bhogpati | Tihar (1/3 of produce) | Galla-Chhahada (1/6 of produce) | Pungdi (arbitrary, heavy) |
| **Justice System** | King supreme | King supreme + Village Panchayat | Two formal courts | No codified law; Divya Pariksha |
| **Downfall** | Nepalese invasions + weak successors | Natural disasters + Gorkha invasion | Weak rulers + betrayal + Gorkha invasion | British military superiority |

*This is a sample from the complete UKPSC Decoded book. Download the full version for complete coverage.*`,
      },
      '3': {
        label: 'Chapter 3',
        title: 'Anglo-Gorkha War & Liberation (1814-1815)',
        markdownContent: `# Chapter 3: Anglo-Gorkha War & Liberation (1814-1815)

## 3.13 THE ANGLO-GORKHA WAR & LIBERATION (1814–1815)

The war was precipitated when Gorkha expansionism clashed with British East India Company interests. The British Governor-General declared war in 1814.

### The Battle of Nalapani (Khalanga Fort, Dehradun)

The most celebrated engagement of the war took place at Nalapani (Khalanga) Fort in Dehradun. British forces under Major General Gillespie assaulted the fort, which was defended by Captain Balbhadra Thapa with just 500 Gorkha soldiers.

**Key Events:**
- **October 31, 1814** - Major General Gillespie was killed in battle
- The British ultimately prevailed only by cutting off the fort's drinking water supply
- Both sides displayed extraordinary bravery
- **Khalanga War Memorial** - Built in Dehradun as unique tribute, honoring both victors and vanquished

### Treaty of Sugauli

The Treaty of Sugauli was signed between the British and Nepal and ratified by Nepal on **May 4, 1816**. It formally ended the conflict and liberated Uttarakhand from Gorkha rule.

**Post-War Division:**
- **Eastern Garhwal (Pauri)** - Retained by the British
- **Western Garhwal** - Returned to Sudarshan Shah as the Tehri State

### Strategic Impact

The Anglo-Gorkha War fundamentally altered the region's political landscape:
1. Kumaon and Eastern Garhwal came under British East India Company rule
2. Nepal's territory was significantly reduced
3. Uttarakhand was brought into the British Indian Empire
4. A new administrative system replaced the previous Gorkha military occupation
5. The region entered a period of British colonial administration (1815-1947)

### Comparative Analysis with Previous Rulers

The Gorkha era (1790-1815) was marked by:
- **Arbitrary taxation** through the Pungdi system
- **No codified law** - reliance on Divya Pariksha (ordeals)
- **Destruction of local culture** and institutions
- **Foreign military occupation** rather than hereditary rule

The Anglo-Gorkha War represented liberation from this oppressive regime, though it simultaneously initiated 132 years of British colonial rule.

### Legacy of the War

The Khalanga War and Treaty of Sugauli remain significant in Uttarakhand's historical consciousness:
- Symbol of resistance and valor (Gorkha side)
- Marker of British imperial expansion (British side)
- Foundation of modern administrative boundaries
- Beginning of modern governance structures in the region

*For complete coverage including the subsequent British administrative system, land settlements, and colonial development policies, refer to Chapter 4: British Rule in Uttarakhand (1815-1947).*`,
      },
      '27': {
        label: 'Chapter 27',
        title: 'Education Reforms & Human Resources Development',
        markdownContent: `# Chapter 27: Education Reforms & Human Resources Development

## 27.1 OVERVIEW: TRANSFORMING UTTARAKHAND'S HUMAN CAPITAL

Uttarakhand's education system has undergone three distinct phases since statehood in 2000:
- **Phase 1 (2000–2013):** Access and Enrollment
- **Phase 2 (2013–2020):** Quality and Governance
- **Phase 3 (2020–Present):** Outcomes and Employability

The state aims to transform its human capital from a "migration force" into a skilled "Himalayan growth force" for Viksit Bharat @ 2047.

## 27.2 SCHOOL EDUCATION STATISTICS

### Enrollment Overview
| Category | Primary | Secondary | Higher Secondary |
|---|---|---|---|
| Government Schools | 8,450 | 3,280 | 1,540 |
| Private Schools | 2,120 | 1,450 | 890 |
| Enrollment (Lakhs) | 22.5 | 14.2 | 8.7 |

### Key Metrics
- **Literacy Rate:** 78.82% (above national average)
- **Gender Parity Index:** 0.98 (near-perfect)
- **School Dropout Rate:** 6.2% (primary), 8.5% (secondary)

## 27.3 KEY EDUCATION INITIATIVES

### Samagra Shiksha (Universal Education Quality)
- Comprehensive approach to school improvement
- Target group: All students
- Focus: Infrastructure, teacher training, curriculum revision

### Digital Literacy Program
- Technology integration in hill schools
- Priority: Rural and remote areas
- Objective: Bridge urban-rural learning gap

### Skill Uttarakhand
- Vocational training for youth (18-35 years)
- Focus on market-relevant skills
- Integration with industry partnerships

### Higher Education Grants
- University support and infrastructure development
- Scholarships for meritorious students
- Research facility establishment

## 27.4 NEP 2020 IMPLEMENTATION IN UTTARAKHAND

The state is actively implementing the National Education Policy 2020:

### Key Features
1. **Multidisciplinary Education Approach**
   - Integration of arts, science, commerce, vocational streams
   - Flexible curriculum design

2. **Indian Languages in Curriculum**
   - Sanskrit promotion
   - Hindi strengthening
   - Local language preservation

3. **Critical Thinking & Analysis Skills**
   - Reduced rote-learning emphasis
   - Project-based learning
   - Experiential education

4. **Integration with Vocational Training**
   - Apprenticeships in B.A./B.Sc./B.Com tracks
   - Industry-academia linkages
   - Skill certification

5. **Teacher Professional Development**
   - Regular training programs
   - Digital literacy for educators
   - Subject matter expertise enhancement

## 27.5 THE SANTULAN MODEL (Balanced Development)

Uttarakhand is pursuing "SANTULAN" to convert "Geography-led problems into Technology-led solutions."

### Strategic Recommendations

| Recommendation | Rationale |
|---|---|
| **Curriculum Contextualization** | Teach monetization of local geography — eco-tourism, carbon auditing, disaster resilience |
| **PM SHRI Cluster Model** | Residential "Schools of Excellence" at Nyaya Panchayat level |
| **Hub-and-Spoke Training** | Apex centers as hubs + mobile training labs for remote areas |
| **Mandatory Apprenticeships** | Credit-linked industrial apprenticeships |
| **Transition to "Weightless" Industries** | IT, AYUSH, Aromatic plants sectors |
| **Green Skill Development** | Train youth as Carbon Auditors and Eco-mapping Technicians |
| **Orange Economy Expansion** | High-value mountain products and eco-tourism |
| **Localized Incubation** | District-level start-up incubators for job creators |
| **Silver Economy Integration** | Certified geriatric caregiver training |
| **AI & Future Tech** | Uttarakhand AI Mission 2025; prompt engineering training |

## 27.6 SYSTEMIC CHALLENGES IN EDUCATION

| Issue | Details |
|---|---|
| **Spatial Disconnect** | Training infrastructure skewed toward plains |
| **Weak Industry-Academia Linkages** | Skill gaps in communication and problem-solving |
| **Aspirations Mismatch** | Youth refuse low-wage positions; high living costs |
| **Ecological Disruption** | Climate risks to traditional sectors |
| **Skills Paradox** | High literacy but low employability |
| **Ex-Servicemen Mismatch** | 1.39 lakh ex-servicemen underutilized |
| **Gender Gap** | Urban female LFPR only 24.4% vs rural 52.6% |

## 27.7 THE VIGYAN FRAMEWORK

| Principle | Application |
|---|---|
| **V — Value-based** | Ethics, environmental stewardship, heritage integration |
| **I — Innovation-driven** | Startup labs, AI mission, Orange Economy |
| **G — Governance-first** | SETU Aayog appraisals, outcome-based funding |
| **Y — Youth-centric** | Global employment schemes, localized incubators |
| **A — Accountability** | Outcome-based verification before fund release |
| **N — Nature-smart** | Green skills, carbon auditing, eco-tourism |

## 27.8 FUTURE ROADMAP (2025-2047)

Uttarakhand's education transformation aims to:
- Convert "migration force" into "skilled Himalayan growth force"
- Integrate technology with traditional knowledge
- Create employment opportunities in high-value sectors
- Achieve 100% literacy with skill certification
- Position Uttarakhand as India's "Knowledge Hub of the Himalayas"

---

*This sample provides comprehensive overview of education reforms. Download the complete book for detailed analysis, statistics, and policy frameworks.*`,
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

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageSelect = (language: 'en' | 'hi') => {
    setSelectedLanguage(language);
    setFormData(prev => ({
      ...prev,
      bookLanguage: language === 'en' ? 'English' : 'हिंदी',
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      // Create FormData object for Google Apps Script
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('fullName', formData.fullName);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('address', formData.address);
      formDataToSubmit.append('city', formData.city);
      formDataToSubmit.append('pinCode', formData.pinCode);
      formDataToSubmit.append('state', formData.state);
      formDataToSubmit.append('landmark', formData.landmark);
      formDataToSubmit.append('bookLanguage', formData.bookLanguage);

      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbyS2M34dKi6V5TmZv6Z2PKEdQHC0RoQmcGdMGNRjlCS1Rc2Tk6VeLWPvMI3iFEkz3q3-Q/exec',
        {
          method: 'POST',
          body: formDataToSubmit,
        }
      );

      if (response.ok) {
        setSubmitMessage(selectedLanguage === 'en' ? '✅ Order submitted successfully! Check your email.' : '✅ आपका ऑर्डर सफलतापूर्वक जमा हो गया! अपनी ईमेल जांचें।');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          pinCode: '',
          state: '',
          landmark: '',
          bookLanguage: '',
        });
      } else {
        setSubmitMessage(selectedLanguage === 'en' ? '❌ Error submitting order. Please try again.' : '❌ ऑर्डर जमा करने में त्रुटि। कृपया फिर से प्रयास करें।');
      }
    } catch (error) {
      setSubmitMessage(selectedLanguage === 'en' ? '❌ Connection error. Please try again.' : '❌ कनेक्शन त्रुटि। कृपया फिर से प्रयास करें।');
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
              onClick={() => handleLanguageSelect('en')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageSelect('hi')}
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
                      onClick={() => handleChapterSelect(chapterId)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-sm">{chapter.label}</div>
                      <div className="text-xs opacity-90 line-clamp-2">{chapter.title}</div>
                      {chapter.isIndex && (
                        <div className="text-xs mt-1 opacity-75">📑 Index</div>
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
            {/* BUY FORM - Always Visible */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedLanguage === 'en' ? 'Place Your Order' : 'अपना आदेश दें'}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {selectedLanguage === 'en' ? 'Full Name' : 'पूरा नाम'}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                      placeholder={selectedLanguage === 'en' ? 'Your Name' : 'आपका नाम'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {selectedLanguage === 'en' ? 'Email' : 'ईमेल'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                      placeholder={selectedLanguage === 'en' ? 'your@email.com' : 'आपकी@email.com'}
                    />
                  </div>
                </div>

                {/* Row 2: Phone & City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {selectedLanguage === 'en' ? 'Phone' : 'फोन'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                      placeholder={selectedLanguage === 'en' ? '+91 98XXXXXXXX' : '+91 98XXXXXXXX'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {selectedLanguage === 'en' ? 'City' : 'शहर'}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                      placeholder={selectedLanguage === 'en' ? 'Your City' : 'आपका शहर'}
                    />
                  </div>
                </div>

                {/* Row 3: PIN & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {selectedLanguage === 'en' ? 'PIN Code' : 'पिन कोड'}
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                      placeholder={selectedLanguage === 'en' ? '246001' : '246001'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {selectedLanguage === 'en' ? 'State' : 'राज्य'}
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                      placeholder={selectedLanguage === 'en' ? 'Uttarakhand' : 'उत्तराखंड'}
                    />
                  </div>
                </div>

                {/* Full Width: Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {selectedLanguage === 'en' ? 'Street Address' : 'पता'}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                    placeholder={selectedLanguage === 'en' ? 'Street Address' : 'सड़क का पता'}
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {selectedLanguage === 'en' ? 'Landmark' : 'निकटतम स्थान'}
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                    placeholder={selectedLanguage === 'en' ? 'Nearby landmark' : 'पास का निकटतम स्थान'}
                  />
                </div>

                {/* Book Language Display */}
                <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold">
                      {selectedLanguage === 'en' ? 'Book Language:' : 'पुस्तक की भाषा:'}
                    </span>
                    <span className="ml-2 text-orange-400 font-bold">
                      {selectedLanguage === 'en' ? 'English' : 'हिंदी'}
                    </span>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting
                    ? (selectedLanguage === 'en' ? 'Processing...' : 'प्रसंस्करण...')
                    : (selectedLanguage === 'en' ? 'Place Order' : 'ऑर्डर दें')}
                </button>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-3 rounded-lg text-center ${
                    submitMessage.includes('✅')
                      ? 'bg-green-900 text-green-200'
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>

            {/* CHAPTER PREVIEW - Expandable */}
            {selectedChapter && selectedChapterData ? (
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Chapter Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 border-b border-slate-600 flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedChapterData.title}
                    </h2>
                    <p className="text-slate-300 text-sm">
                      {selectedLanguage === 'en'
                        ? 'Sample Preview'
                        : 'नमूना पूर्वावलोकन'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className="text-slate-400 hover:text-white transition-colors flex-shrink-0 ml-4"
                  >
                    <X size={28} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-8 max-h-96 overflow-y-auto text-slate-100 prose prose-invert">
                  {selectedChapterData.markdownContent ? (
                    <div className="space-y-4 text-sm leading-relaxed">
                      {selectedChapterData.markdownContent.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) {
                          return (
                            <h1 key={idx} className="text-xl font-bold text-white mt-4">
                              {line.replace('# ', '')}
                            </h1>
                          );
                        } else if (line.startsWith('## ')) {
                          return (
                            <h2 key={idx} className="text-lg font-bold text-white mt-3">
                              {line.replace('## ', '')}
                            </h2>
                          );
                        } else if (line.startsWith('### ')) {
                          return (
                            <h3 key={idx} className="text-base font-semibold text-slate-200 mt-2">
                              {line.replace('### ', '')}
                            </h3>
                          );
                        } else if (line.startsWith('- ')) {
                          return (
                            <li key={idx} className="ml-4 text-slate-300">
                              {line.replace('- ', '')}
                            </li>
                          );
                        } else if (line.trim()) {
                          return (
                            <p key={idx} className="text-slate-300">
                              {line}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ) : selectedChapterData.pdfUrl ? (
                    <div className="text-center py-12">
                      <Eye size={48} className="mx-auto mb-4 text-slate-400" />
                      <p className="mb-4 text-slate-300">
                        {selectedLanguage === 'en'
                          ? 'PDF Preview Available'
                          : 'PDF पूर्वावलोकन उपलब्ध'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedLanguage === 'en'
                          ? 'Click "View PDF" to see the full sample'
                          : 'पूर्ण नमूना देखने के लिए "PDF देखें" पर क्लिक करें'}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Action Buttons */}
                {selectedChapterData.pdfUrl && (
                  <div className="bg-slate-700 p-6 flex gap-4 border-t border-slate-600">
                    <button
                      onClick={() => window.open(selectedChapterData.pdfUrl, '_blank')}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={20} />
                      {selectedLanguage === 'en' ? 'View PDF' : 'PDF देखें'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
                <ChevronDown size={48} className="mx-auto opacity-50 mb-4 text-slate-400" />
                <p className="text-slate-300 text-lg">
                  {selectedLanguage === 'en'
                    ? 'Select a chapter from the left to preview'
                    : 'पूर्वावलोकन के लिए बाईं ओर से कोई अध्याय चुनें'}
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
            <p className="text-slate-400 text-sm">
              {selectedLanguage === 'en'
                ? 'Complete UKPSC coverage'
                : 'संपूर्ण UKPSC कवरेज'}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedLanguage === 'en' ? 'Bilingual' : 'द्विभाषी'}
            </h3>
            <p className="text-slate-400 text-sm">
              {selectedLanguage === 'en'
                ? 'English & हिंदी'
                : 'अंग्रेजी और हिंदी'}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedLanguage === 'en' ? 'PDF Samples' : 'PDF नमूने'}
            </h3>
            <p className="text-slate-400 text-sm">
              {selectedLanguage === 'en'
                ? 'Free preview access'
                : 'मुफ्त पूर्वावलोकन'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
