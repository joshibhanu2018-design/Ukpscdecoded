'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  ShieldCheck,
  Loader2,
  Clock,
  Truck,
  Zap,
  CheckCircle2,
  X,
} from 'lucide-react';
import CountdownBanner from '@/components/CountdownBanner';

// Sample chapter content (first 3 pages / ~1500 words from each chapter)
const chapterContent = {
  en: {
    1: `# CHAPTER 1: Prehistoric & Proto-historic Period, Ancient Tribes, and Early Political Powers

## 1.1 THE STONE AGE IN UTTARAKHAND

The prehistoric period of Uttarakhand is primarily reconstructed through stone tools and rock shelters discovered across the region's river valleys. In the Alaknanda Valley, at sites such as Dang and Sweet, archaeologists have recovered hand axes, choppers, and scrapers — evidence confirming early human habitation in the Higher Himalayas. The Kalsi River Valley has yielded Stone Age implements that add to Dehradun's considerable archaeological wealth, while the Ramganga Valley in Western Kumaon has produced multiple tool types attesting to widespread prehistoric settlement.

The pioneer archaeologists K.P. Nautiyal and Yashodhar Mathpal confirmed Stone Age human habitation in the region through systematic excavations, establishing Uttarakhand's place within the broader narrative of Indian prehistory.

## 1.2 MAJOR PREHISTORIC ROCK ART & CAVE SHELTERS

### A. Almora District — The Epicentre of Rock Art

The paintings at Lakhu Udiyar are particularly significant. The cave is hawthorn-shaped, and its colour layering — white at the top (representing the latest paintings), brownish-red or pink in the middle (intermediate period), and black at the bottom (the oldest) — mirrors the globally recognized pattern found at the Bhimbetka rock shelters in central India.

### B. Chamoli District

The Gwarkhya Cave, discovered by Rakesh Bhatt, is located in Dugri village of Tharali tehsil near the Alaknanda River. It contains exactly 41 figures — 33 humans and 8 animals including sheep, fox, and barasingha. The human figures are depicted in a distinctive trident-like shape, and the overall theme reflects a pastoral culture centred on herding.

### C. Uttarkashi District

The rock art site at Hudli is architecturally distinct from other Uttarakhand sites, having yielded rare blue-coloured rock paintings — an unusual pigment choice that sets it apart from the standard colour palette found elsewhere in the region.

## 1.3 MORTAR-LIKE PITS (CUP-MARKS / OKHLIS)

Prehistoric hemispherical depressions carved on large stones — believed to have astronomical or ritualistic significance — represent another category of archaeological evidence in Uttarakhand. Henwood's 1856 discovery at Devidhura is recognized as the first discovery of archaeological sources in Uttarakhand, making it a landmark moment in the region's historiography.`,
    2: `# CHAPTER 2: Katyuri, Parmar & Chand Dynasties

## 2.1 KATYURI DYNASTY (700-1200 AD)

The Katyuri Dynasty represents the first major organized kingdom in Uttarakhand. Established in 700 AD by Basdeo (or Basantdev), the dynasty had its capital at Kartikeyapuri (modern Katyur Valley in Chamoli). The Katyuris were known for their administrative prowess and cultural sophistication.

### Key Kings of Katyuri Dynasty

**Basantdev (700 AD)**: The founder established the Katyuri kingdom with a well-organized administrative system. He divided his empire into regions called "Bhukti" (provinces), "Viṣaya" (districts), and "Pallika" (villages).

**Lalitasuri Dev (765-790 AD)**: One of the most powerful Katyuri kings, Lalitasuri Dev expanded the kingdom significantly. He performed the Ashvamedha Yajna and issued coins. He is credited with building several temples including the Jageshwar Temple complex.

**Bhuddev Dev (around 800 AD)**: Known for his administrative reforms and cultural patronage. He constructed temples and patronized scholars and philosophers.

### Administrative Structure

The Katyuris created a sophisticated administrative system:
- **Bhukti** (Major Province): Governed by a Bhiktipati
- **Viṣaya** (District): Governed by a Vishayapati
- **Pallika** (Village): Governed by a Pallika-adhyakṣa

This system influenced later kingdoms in the region.

### Culture and Religion

The Katyuris were great patrons of Shaivism. They built numerous Shiva temples, particularly the famous Jageshwar Temple complex in Almora District. They also patronized Sanskrit scholars and poets. The famous poet and philosopher Abhinava Gupta was patronized during this period.

## 2.2 PARMAR DYNASTY

The Parmar (or Pawar) Dynasty ruled the Chandpur area (modern Tehri Garhwal). They were contemporary with the Katyuris and maintained diplomatic relations with them. The Parmars were also Shaivite rulers and contributed to the cultural development of the region.

## 2.3 CHAND DYNASTY (1025-1815 AD)

The Chand Dynasty is the most historically significant dynasty of Uttarakhand, with a rule spanning nearly 800 years.

### Founder and Early History

**Chandraprabha** (also called Chand Rao) is traditionally credited as the founder of the Chand Dynasty around 1025 AD. He established his capital at Almora and gradually expanded his territory.

### Golden Age: Deepchandra and Baz Bahadur

**Deepchandra (1613-1631)**: Considered the greatest Chand king, Deepchandra expanded the kingdom to its maximum extent and established Almora as a major cultural center.

**Baz Bahadur (1681-1720)**: Known for his military prowess and administrative skills, Baz Bahadur resisted Mughal invasions and maintained the kingdom's independence.

### Decline and End

The Chand Dynasty began to decline in the late 18th century due to internal conflicts and external pressures from the Gorkhas. The last independent Chand king ceded his territory to the British in 1815.`,
    11: `# CHAPTER 11: Political System of Uttarakhand

## 11.1 EXECUTIVE: THE GOVERNOR

### Constitutional Role

The Governor of Uttarakhand is the constitutional head of the state. Appointed by the President of India for a five-year term, the Governor represents the President at the state level. The position was established when Uttarakhand became a separate state in 2000.

### Powers and Responsibilities

**Legislative Powers:**
- Grants assent to bills passed by the state legislature
- Can return bills for reconsideration (except money bills)
- Nominates members to the state assembly
- Addresses the state legislature

**Executive Powers:**
- Exercises all executive powers of the state
- Appoints the Chief Minister (usually leader of majority party)
- Appoints judges and officials
- Grants pardons and reprieves

**Discretionary Powers:**
- Acts on the advice of the Council of Ministers in most matters
- Can act on own discretion in certain constitutional matters
- Exercises reserve powers during constitutional crises

### List of Governors

The state has had multiple governors since its inception, each serving for varying periods. Notable governors include those who have managed constitutional crises and ensured smooth transitions.

## 11.2 EXECUTIVE: THE CHIEF MINISTER AND COUNCIL OF MINISTERS

### Chief Minister

The Chief Minister is the head of government and leader of the majority party in the state legislature. As the real executive authority, the CM holds significant powers in state administration.

### Powers of Chief Minister

1. Appoints ministers with approval of the Governor
2. Chairs the cabinet and coordinates government functions
3. Represents the state at national and international forums
4. Controls state finances and budget allocation
5. Appoints officers to various state commissions and corporations

### Council of Ministers

The Council of Ministers comprises cabinet ministers and other ministers. They assist the Chief Minister in governance and are responsible for various departments and ministries.

## 11.3 LEGISLATURE: UTTARAKHAND VIDHAN SABHA

### Composition

The Uttarakhand Vidhan Sabha (State Assembly) has 70 seats:
- 60 General Assembly seats
- 2 Anglo-Indian nominated seats
- 8 reserved seats for Scheduled Castes
- Seats distributed across various districts

### Functions

1. Legislation: Passes state laws and bills
2. Budget: Approves state budget and financial matters
3. Oversight: Questions and debates on government policies
4. Representation: Represents constituencies and public interests

### Speaker and Deputy Speaker

The Speaker is elected by assembly members and presides over sessions. The Deputy Speaker assists the Speaker and ensures smooth functioning of the legislature.`,
    27: `# CHAPTER 27: Education and HRD — Strategic Recommendations

## 27.1 EDUCATION SYSTEM OVERVIEW

### Structure of Education

Uttarakhand follows the national education system:
- **Primary (Classes I-V)**: Foundation skills and literacy
- **Upper Primary (Classes VI-VIII)**: Building subject knowledge
- **Secondary (Classes IX-X)**: Board examinations (CBSE/UP Board)
- **Senior Secondary (Classes XI-XII)**: Specialized stream selection
- **Higher Education**: Universities and colleges

### Major Educational Institutions

The state hosts several prestigious institutions:
- Kumaun University (Nainital)
- Garhwal University (Srinagar)
- Hemvati Nandan Bahuguna Garhwal University
- Indian Institute of Technology (IIT Roorkee)
- National Institute of Technology (NIT Srinagar)

## 27.2 NEW EDUCATION POLICY (NEP) 2020 IMPLEMENTATION

### Key Features of NEP 2020

The National Education Policy 2020 introduces significant reforms:

1. **Multidisciplinary Approach**: Students can combine subjects across streams
2. **Critical Thinking**: Emphasis on reasoning and problem-solving
3. **Vocational Training**: Integration of skill development
4. **Local Languages**: Teaching in mother tongue up to Grade V
5. **Flexible Assessment**: Multiple attempts and continuous evaluation

### Implementation in Uttarakhand

Uttarakhand has initiated NEP 2020 implementation:
- Curriculum revision in schools
- Teacher training programs
- Infrastructure development
- Digital learning initiatives
- Skill development centers

## 27.3 CHALLENGES AND WAY FORWARD

### Current Challenges

1. **Infrastructure Gap**: Rural areas lack adequate school buildings and facilities
2. **Teacher Shortage**: Shortage of qualified teachers in remote areas
3. **Digital Divide**: Limited internet connectivity in mountainous regions
4. **Drop-out Rates**: High dropout rates, particularly among girls
5. **Quality Education**: Gap between urban and rural education quality

### Way Forward Table

| Challenge | Strategy | Timeline | Implementation |
|-----------|----------|----------|-----------------|
| Infrastructure | Build schools with ICT labs | 2025 | State funding |
| Teachers | Recruit & train 5000 teachers | 2024-26 | Ministry of Education |
| Digital Access | Expand broadband in 500 villages | 2025 | Telecom partnership |
| Girls' Education | Scholarships for 10000 girls | Ongoing | State scholarship |
| Quality Education | Teacher-student ratio 1:25 | 2026 | Hiring program |

These strategic initiatives aim to transform Uttarakhand's education system to meet 21st-century requirements and ensure inclusive quality education for all.`,
  },
  hi: {
    1: `# अध्याय 1: प्रागैतिहासिक एवं आद्य-ऐतिहासिक काल, प्राचीन जनजातियाँ

## 1.1 उत्तराखंड में पाषाण युग

उत्तराखंड का प्रागैतिहासिक काल मुख्य रूप से नदी घाटियों में खोजे गए पत्थर के उपकरणों और शैल आश्रयों के माध्यम से पुनर्निर्मित होता है। अलकनंदा घाटी में डांग और स्वीट जैसे स्थानों पर पुरातत्ववेत्ताओं को हाथ की कुल्हाड़ियाँ, चॉपिंग उपकरण और खुरचनी मिली हैं, जो उच्च हिमालय में मानव निवास का साक्ष्य देती हैं। कलसी नदी घाटी ने पाषाण युग के उपकरण प्रदान किए हैं।

अग्रणी पुरातत्ववेत्ताओं K.P. नौटियाल और यशोधर मथपाल ने व्यवस्थित खुदाइयों के माध्यम से उत्तराखंड में पाषाण युग के मानव निवास की पुष्टि की है।

## 1.2 प्रमुख प्रागैतिहासिक शैल कला और गुफा आश्रय

### A. अल्मोड़ा जिला — शैल कला का केंद्र

लाखु उड्यार की चित्रकारी विशेष रूप से महत्वपूर्ण है। गुफा का आकार हॉथॉर्न जैसा है, और इसकी रंग परतें — शीर्ष पर सफेद (सबसे नई चित्रकारी), मध्य में भूरा-लाल (मध्यवर्ती अवधि), और नीचे काली (सबसे पुरानी) — भीमबेटका शैल आश्रयों में पाए जाने वाले वैश्विक मान्यता प्राप्त पैटर्न को दर्शाती हैं।

### B. चमोली जिला

गुफा की गुफा, राकेश भट्ट द्वारा खोजी गई, तारली तहसील के डुग्री गाँव में अलकनंदा नदी के पास स्थित है। इसमें 41 आकृतियाँ हैं — 33 मानव और 8 जानवर जिनमें भेड़, लोमड़ी और बारासिंगा शामिल हैं।

### C. उत्तरकाशी जिला

हुडली में शैल कला स्थल उत्तराखंड के अन्य स्थलों से वास्तुकलात्मक रूप से भिन्न है, जिसमें दुर्लभ नीली रंग की शैल चित्रकारी मिली है।

## 1.3 गर्त जैसे गड्ढे (कप-मार्क्स / ओखली)

प्रागैतिहासिक गोलार्द्ध अवसाद जो बड़े पत्थरों पर उकेरे गए हैं — माना जाता है कि ये खगोलीय या अनुष्ठानिक महत्व के हैं — उत्तराखंड में पुरातात्विक साक्ष्य की एक अन्य श्रेणी का प्रतिनिधित्व करते हैं। हेनवुड की 1856 में देविधुरा में की गई खोज को उत्तराखंड में पुरातत्व स्रोतों की पहली खोज के रूप में मान्यता दी जाती है।`,
    2: `# अध्याय 2: कत्यूरी, परमार एवं चंद राजवंश

## 2.1 कत्यूरी राजवंश (700-1200 ईस्वी)

कत्यूरी राजवंश उत्तराखंड में पहले प्रमुख संगठित राज्य का प्रतिनिधित्व करता है। 700 ईस्वी में बसदेव (या बसंतदेव) द्वारा स्थापित, इस राजवंश की राजधानी कार्तिकेयपुरी (आधुनिक चमोली के कत्यूर घाटी) थी। कत्यूरी अपने प्रशासनिक कौशल और सांस्कृतिक परिष्कार के लिए जाने जाते थे।

### कत्यूरी राजवंश के प्रमुख राजा

**बसंतदेव (700 ईस्वी)**: संस्थापक ने एक सुसंगठित प्रशासनिक प्रणाली के साथ कत्यूरी राज्य की स्थापना की। उन्होंने अपने साम्राज्य को "भुक्ति" (प्रांत), "विषय" (जिले) और "पल्लिका" (गाँव) में विभाजित किया।

**ललितसूरि देव (765-790 ईस्वी)**: सबसे शक्तिशाली कत्यूरी राजाओं में से एक, ललितसूरि देव ने राज्य का महत्वपूर्ण विस्तार किया। उन्होंने अश्वमेध यज्ञ किया और सिक्के जारी किए। उन्हें जागेश्वर मंदिर परिसर सहित कई मंदिरों के निर्माण का श्रेय दिया जाता है।

### प्रशासनिक संरचना

कत्यूरियों ने एक परिष्कृत प्रशासनिक प्रणाली बनाई:
- **भुक्ति** (प्रमुख प्रांत): भुक्ति-पति द्वारा शासित
- **विषय** (जिला): विषय-पति द्वारा शासित
- **पल्लिका** (गाँव): पल्लिका-अध्यक्ष द्वारा शासित

यह प्रणाली बाद में क्षेत्र के राज्यों को प्रभावित करती है।

## 2.2 परमार राजवंश

परमार (या पवार) राजवंश चंदपुर क्षेत्र (आधुनिक टेहरी गढ़वाल) पर शासन करता था। वे कत्यूरियों के समकालीन थे और उनके साथ राजनयिक संबंध बनाए रखते थे।

## 2.3 चंद राजवंश (1025-1815 ईस्वी)

चंद राजवंश उत्तराखंड का सबसे ऐतिहासिक रूप से महत्वपूर्ण राजवंश है, जिसका शासन लगभग 800 वर्षों तक चला।`,
    11: `# अध्याय 11: उत्तराखंड की राजनीतिक व्यवस्था

## 11.1 कार्यपालिका: राज्यपाल

### संवैधानिक भूमिका

उत्तराखंड के राज्यपाल राज्य के संवैधानिक प्रमुख हैं। भारत के राष्ट्रपति द्वारा नियुक्त, पाँच साल के कार्यकाल के लिए, राज्यपाल राष्ट्रपति का प्रतिनिधित्व करते हैं।

### शक्तियाँ और जिम्मेदारियाँ

**विधायी शक्तियाँ:**
- राज्य विधानमंडल द्वारा पारित विधेयकों को मंजूरी देता है
- विधानसभा के सदस्यों को मनोनीत करता है
- राज्य विधानमंडल को संबोधित करता है

**कार्यकारी शक्तियाँ:**
- राज्य की सभी कार्यकारी शक्तियों का प्रयोग करता है
- मुख्यमंत्री की नियुक्ति करता है
- न्यायाधीशों और अधिकारियों की नियुक्ति करता है

## 11.2 कार्यपालिका: मुख्यमंत्री और मंत्रिपरिषद

### मुख्यमंत्री

मुख्यमंत्री सरकार का प्रमुख है और राज्य विधानमंडल में बहुमत दल का नेता है।

### मुख्यमंत्री की शक्तियाँ

1. राज्यपाल की अनुमति से मंत्रियों की नियुक्ति करता है
2. मंत्रिमंडल की अध्यक्षता करता है
3. राज्य का राष्ट्रीय और अंतर्राष्ट्रीय मंचों पर प्रतिनिधित्व करता है
4. राज्य वित्त को नियंत्रित करता है

## 11.3 विधानमंडल: उत्तराखंड विधान सभा

### संरचना

उत्तराखंड विधान सभा में 70 सीटें हैं:
- 60 सामान्य विधानसभा सीटें
- 2 एंग्लो-इंडियन मनोनीत सीटें
- 8 अनुसूचित जातियों के लिए आरक्षित सीटें`,
    27: `# अध्याय 27: शिक्षा एवं मानव संसाधन विकास — रणनीतिक सिफारिशें

## 27.1 शिक्षा प्रणाली अवलोकन

### शिक्षा की संरचना

उत्तराखंड राष्ट्रीय शिक्षा प्रणाली का अनुसरण करता है:
- **प्राथमिक (कक्षा I-V)**: मूल कौशल और साक्षरता
- **उच्च प्राथमिक (कक्षा VI-VIII)**: विषय ज्ञान का निर्माण
- **माध्यमिक (कक्षा IX-X)**: बोर्ड परीक्षाएं (CBSE/UP Board)
- **उच्च माध्यमिक (कक्षा XI-XII)**: विशेषीकृत धारा चयन
- **उच्च शिक्षा**: विश्वविद्यालय और कॉलेज

### प्रमुख शैक्षणिक संस्थान

राज्य कई प्रतिष्ठित संस्थानों की मेजबानी करता है:
- कुमाऊँ विश्वविद्यालय (नैनीताल)
- गढ़वाल विश्वविद्यालय (श्रीनगर)
- हेमवती नंदन बहुगुणा गढ़वाल विश्वविद्यालय
- भारतीय प्रौद्योगिकी संस्थान (IIT रुड़की)
- राष्ट्रीय प्रौद्योगिकी संस्थान (NIT श्रीनगर)

## 27.2 नई शिक्षा नीति (NEP) 2020 कार्यान्वयन

### NEP 2020 की प्रमुख विशेषताएँ

राष्ट्रीय शिक्षा नीति 2020 महत्वपूर्ण सुधार प्रस्तुत करती है:

1. **बहु-अनुशासनात्मक दृष्टिकोण**: छात्र विभिन्न धाराओं में विषयों को जोड़ सकते हैं
2. **आलोचनात्मक सोच**: तर्क और समस्या-समाधान पर जोर
3. **व्यावसायिक प्रशिक्षण**: कौशल विकास का एकीकरण
4. **स्थानीय भाषाएँ**: कक्षा V तक मातृभाषा में शिक्षण
5. **लचीला आकलन**: बहु-प्रयास और निरंतर मूल्यांकन

## 27.3 चुनौतियाँ और आगे का रास्ता

### वर्तमान चुनौतियाँ

1. **बुनियादी ढांचा अंतराल**: ग्रामीण क्षेत्रों में अपर्याप्त स्कूल भवन
2. **शिक्षक की कमी**: दूरवर्ती क्षेत्रों में योग्य शिक्षकों की कमी
3. **डिजिटल विभाजन**: पहाड़ी क्षेत्रों में सीमित इंटरनेट कनेक्टिविटी
4. **ड्रॉपआउट दर**: उच्च ड्रॉपआउट दर, विशेष रूप से लड़कियों में
5. **गुणवत्तापूर्ण शिक्षा**: शहरी और ग्रामीण शिक्षा में अंतराल

### आगे का रास्ता तालिका

| चुनौती | रणनीति | समय सीमा | कार्यान्वयन |
|--------|---------|----------|------------|
| बुनियादी ढांचा | ICT लैब के साथ स्कूल बनाएं | 2025 | राज्य वित्त |
| शिक्षक | 5000 शिक्षकों की भर्ती करें | 2024-26 | शिक्षा मंत्रालय |
| डिजिटल पहुंच | 500 गाँवों में ब्रॉडबैंड | 2025 | टेलीकॉम भागीदारी |
| लड़कियों की शिक्षा | 10,000 लड़कियों के लिए छात्रवृत्ति | चलमान | राज्य छात्रवृत्ति |
| गुणवत्तापूर्ण शिक्षा | शिक्षक-छात्र अनुपात 1:25 | 2026 | भर्ती कार्यक्रम |`,
  }
};

function BuyBookContent() {
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>(() => {
    const lang = searchParams?.get('lang');
    return lang === 'hi' ? 'hi' : 'en';
  });

  const [selectedChapter, setSelectedChapter] = useState<{number: number, title: string} | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    language: selectedLanguage === 'hi' ? 'हिंदी' : 'English',
  });
  const [loading, setLoading] = useState(false);

  const bookData = {
    en: {
      title: 'Uttarakhand Decoded',
      subtitle: 'Complete Exam Preparation for All UKPSC Exams',
      pages: '350+',
      chapters: '28',
      appendixCount: '2',
      originalPrice: 599,
      currentPrice: 499,
      description: 'The only comprehensive book you need for complete Uttarakhand syllabus with General Studies Paper 5 and Paper 6 coverage for UKPSC Upper and Lower Exams, RO, ARO, and UKSSSC. This book covers both Prelims and Mains examinations with integrated current affairs, comparative tables, latest reports, budget analysis, and complete civil service coverage for all exams. The most updated book in the market, relevant for your examination by eliminating redundant content and bringing the best compilation in 350+ pages.',
      sampleChapters: [
        { number: 1, title: 'Prehistoric & Proto-historic Period, Ancient Tribes, and Early Political Powers', pages: 'Pages 1-20' },
        { number: 2, title: 'Katyuri, Parmar & Chand Dynasties', pages: 'Pages 21-40' },
        { number: 11, title: 'Political System of Uttarakhand', pages: 'Pages 180-200' },
        { number: 27, title: 'Education and HRD — Strategic Recommendations', pages: 'Pages 320-340' },
      ],
      appendixList: [
        { number: 'A', title: 'Current Affairs Capsule (2024-2026)', topics: 'Recent Events, Policy Changes, Government Initiatives, Latest Updates' },
      ],
      features: [
        'Comprehensive Papers 5 & 6 coverage',
        'Integrated current affairs',
        'Comparative tables & latest data',
        'Prelims + Mains preparation',
        'All exam types (UKPSC, RO, ARO, UKSSSC)',
        'Updated budget & reports',
        'Non-redundant, focused content',
      ],
      buttonText: 'Proceed to Payment',
      formTitle: 'Place Your Order',
      editionLabel: 'Choose Book Edition',
      nameLabel: 'Full Name',
      emailLabel: 'Email',
      phoneLabel: 'Phone Number',
      addressLabel: 'Address',
      cityLabel: 'City',
      pincodeLabel: 'PIN Code',
      stateLabel: 'Select State',
      secureText: 'Secure Payment',
      deliveryText: 'Delivery in 4 days',
      readSample: 'Read Free Sample Chapters',
      whatIncluded: 'What\'s Included',
      bookOverview: 'Book Overview',
      appendicesTitle: 'Appendices',
      earliestBird: 'Early Bird Offer',
      limitedOffer: 'Limited time offer for first edition',
      save: 'Save',
      freeDelivery: 'Free Delivery',
      deliveryDays: 'Delivery in 4 Days',
      mostUpdated: 'Most Updated Content',
      oneTimePayment: 'One-time payment',
    },
    hi: {
      title: 'उत्तराखंड डिकोडेड',
      subtitle: 'सभी UKPSC परीक्षाओं के लिए संपूर्ण तैयारी',
      pages: '350+',
      chapters: '28',
      appendixCount: '2',
      originalPrice: 599,
      currentPrice: 499,
      description: 'यह एकमात्र व्यापक किताब है जो उत्तराखंड के पूरे पाठ्यक्रम के लिए आवश्यक है। UKPSC Upper और Lower Exams, RO, ARO और UKSSSC के लिए General Studies Paper 5 और Paper 6 का संपूर्ण कवरेज। यह किताब Prelims और Mains दोनों परीक्षाओं को कवर करती है जिसमें Integrated Current Affairs, तुलनात्मक तालिकाएँ, नवीनतम रिपोर्ट, बजट विश्लेषण और सभी परीक्षाओं के लिए संपूर्ण Civil Service कवरेज है।',
      sampleChapters: [
        { number: 1, title: 'प्रागैतिहासिक एवं आद्य-ऐतिहासिक काल', pages: 'पृष्ठ 1-20' },
        { number: 2, title: 'कत्यूरी, परमार एवं चंद राजवंश', pages: 'पृष्ठ 21-40' },
        { number: 11, title: 'उत्तराखंड की राजनीतिक व्यवस्था', pages: 'पृष्ठ 180-200' },
        { number: 27, title: 'शिक्षा एवं मानव संसाधन विकास', pages: 'पृष्ठ 320-340' },
      ],
      appendixList: [
        { number: 'A', title: 'समसामयिकी कैप्सूल (2024-2026)', topics: 'हाल की घटनाएँ, नीति परिवर्तन, सरकारी पहल' },
      ],
      features: [
        'Papers 5 & 6 का व्यापक कवरेज',
        'Integrated समसामयिकी',
        'तुलनात्मक तालिकाएँ और नवीनतम डेटा',
        'Prelims + Mains तैयारी',
        'सभी परीक्षा प्रकार (UKPSC, RO, ARO, UKSSSC)',
        'अपडेट किया गया बजट और रिपोर्ट',
        'गैर-अनावश्यक, केंद्रित सामग्री',
      ],
      buttonText: 'भुगतान के लिए आगे बढ़ें',
      formTitle: 'आपकी प्रति के लिए आदेश दें',
      editionLabel: 'किताब का संस्करण चुनें',
      nameLabel: 'पूरा नाम',
      emailLabel: 'ईमेल',
      phoneLabel: 'फोन नंबर',
      addressLabel: 'पता',
      cityLabel: 'शहर',
      pincodeLabel: 'पिन कोड',
      stateLabel: 'राज्य चुनें',
      secureText: 'सुरक्षित भुगतान',
      deliveryText: '4 दिन में डिलीवरी',
      readSample: 'मुफ्त नमूना अध्याय पढ़ें',
      whatIncluded: 'क्या शामिल है',
      bookOverview: 'किताब का अवलोकन',
      appendicesTitle: 'परिशिष्ट',
      earliestBird: 'अर्ली बर्ड ऑफर',
      limitedOffer: 'पहले संस्करण के लिए सीमित समय की पेशकश',
      save: 'बचाएं',
      freeDelivery: 'मुफ्त डिलीवरी',
      deliveryDays: '4 दिन में डिलीवरी',
      mostUpdated: 'सबसे अपडेट की गई सामग्री',
      oneTimePayment: 'एकमुश्त भुगतान',
    }
  };

  const book = bookData[selectedLanguage];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (lang: 'English' | 'हिंदी') => {
    setForm(prev => ({ ...prev, language: lang }));
    setSelectedLanguage(lang === 'हिंदी' ? 'hi' : 'en');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newOrderId = `UK${Date.now()}`;
      const orderData = {
        ...form,
        orderId: newOrderId,
        amount: book.currentPrice,
      };

      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (result.success) {
        window.location.href = `/order-confirmation?orderId=${newOrderId}&language=${form.language}`;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <CountdownBanner deadline="2026-09-12" headline="Limited Offer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Early Bird Offer Banner */}
        <div className="mb-8 bg-gradient-to-r from-saffron-600 to-saffron-500 rounded-2xl p-6 sm:p-8 border-2 border-saffron-400">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">🎯 {book.earliestBird}</h2>
              <p className="text-saffron-100 mb-4">{book.limitedOffer} (500 किताबें)</p>
              <div className="flex items-center gap-4">
                <span className="text-xl line-through text-saffron-200">₹{book.originalPrice}</span>
                <span className="text-4xl font-bold text-white">₹{book.currentPrice}</span>
                <span className="bg-white text-saffron-600 px-3 py-1 rounded-full font-bold text-sm">{book.save} ₹{book.originalPrice - book.currentPrice}</span>
              </div>
            </div>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <Truck className="w-5 h-5 flex-shrink-0" />
                <span>✅ {book.freeDelivery}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span>✅ {book.deliveryDays}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                <Zap className="w-5 h-5 flex-shrink-0" />
                <span>✅ {book.mostUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-graphite-700/50 rounded-full p-1">
            <button
              onClick={() => { setSelectedLanguage('en'); setForm(prev => ({ ...prev, language: 'English' })); }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedLanguage === 'en' ? 'bg-saffron-500 text-white shadow-lg' : 'text-graphite-300 hover:text-white'
              }`}
            >
              📕 English
            </button>
            <button
              onClick={() => { setSelectedLanguage('hi'); setForm(prev => ({ ...prev, language: 'हिंदी' })); }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedLanguage === 'hi' ? 'bg-indigo-500 text-white shadow-lg' : 'text-graphite-300 hover:text-white'
              }`}
            >
              📗 हिंदी
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: Book Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Book Introduction */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4">{book.bookOverview}</h2>
              <p className="text-graphite-200 leading-relaxed mb-6">{book.description}</p>
              
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="bg-saffron-500/10 rounded-lg p-4">
                  <p className="text-2xl sm:text-3xl font-bold text-saffron-400">{book.pages}</p>
                  <p className="text-sm text-graphite-400">{selectedLanguage === 'en' ? 'Pages' : 'पृष्ठ'}</p>
                </div>
                <div className="bg-jade-500/10 rounded-lg p-4">
                  <p className="text-2xl sm:text-3xl font-bold text-jade-400">{book.chapters}</p>
                  <p className="text-sm text-graphite-400">{selectedLanguage === 'en' ? 'Chapters' : 'अध्याय'}</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400">{book.appendixCount}</p>
                  <p className="text-sm text-graphite-400">{selectedLanguage === 'en' ? 'Appendices' : 'परिशिष्ट'}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur">
              <h3 className="text-xl font-bold mb-4">{book.whatIncluded}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {book.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0 mt-0.5" />
                    <p className="text-graphite-200 text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Chapters */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {book.readSample}
              </h3>
              <div className="space-y-3">
                {book.sampleChapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedChapter(ch)}
                    className="w-full text-left bg-graphite-700/30 rounded-lg p-4 hover:bg-graphite-700/50 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white">{selectedLanguage === 'en' ? 'Chapter' : 'अध्याय'} {ch.number}: {ch.title}</h4>
                      <span className="text-graphite-500 text-sm whitespace-nowrap ml-2">{ch.pages}</span>
                    </div>
                    <p className="text-graphite-300 text-sm">{selectedLanguage === 'en' ? 'Click to read' : 'पढ़ने के लिए क्लिक करें'}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Appendices */}
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur">
              <h3 className="text-xl font-bold mb-4">{book.appendicesTitle}</h3>
              <div className="space-y-3">
                {book.appendixList.map((app, idx) => (
                  <div key={idx} className="bg-graphite-700/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-1">{selectedLanguage === 'en' ? 'Appendix' : 'परिशिष्ट'} {app.number}: {app.title}</h4>
                    <p className="text-graphite-300 text-sm">{app.topics}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-graphite-800/50 rounded-2xl p-6 sm:p-8 border border-graphite-700/50 backdrop-blur sticky top-24 h-fit">
              <h2 className="text-2xl font-bold mb-4">{book.formTitle}</h2>

              <div className="mb-6 text-center">
                <p className="text-4xl font-bold text-saffron-400">₹{book.currentPrice}</p>
                <p className="text-graphite-400 text-sm">{book.oneTimePayment}</p>
                <p className="text-jade-400 text-xs mt-2">✅ {book.deliveryText}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">{book.editionLabel}</label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 rounded-lg border border-graphite-600 cursor-pointer hover:bg-graphite-700/30">
                      <input type="radio" value="English" checked={form.language === 'English'} onChange={() => handleLanguageChange('English')} className="w-4 h-4" />
                      <span className="ml-3 text-sm">📕 English Edition</span>
                    </label>
                    <label className="flex items-center p-3 rounded-lg border border-graphite-600 cursor-pointer hover:bg-graphite-700/30">
                      <input type="radio" value="हिंदी" checked={form.language === 'हिंदी'} onChange={() => handleLanguageChange('हिंदी')} className="w-4 h-4" />
                      <span className="ml-3 text-sm">📗 हिंदी संस्करण</span>
                    </label>
                  </div>
                </div>

                <input type="text" name="name" placeholder={book.nameLabel} value={form.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500" />
                <input type="email" name="email" placeholder={book.emailLabel} value={form.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500" />
                <input type="tel" name="phone" placeholder={book.phoneLabel} value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500" />
                <textarea name="address" placeholder={book.addressLabel} value={form.address} onChange={handleChange} required rows={2} className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500" />
                <input type="text" name="city" placeholder={book.cityLabel} value={form.city} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500" />
                <input type="text" name="pincode" placeholder={book.pincodeLabel} value={form.pincode} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white placeholder-graphite-500 text-sm focus:outline-none focus:border-saffron-500" />
                <select name="state" value={form.state} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm focus:outline-none focus:border-saffron-500">
                  <option value="">{book.stateLabel}</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Other">Other</option>
                </select>

                <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold text-lg transition-all bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {selectedLanguage === 'hi' ? 'प्रसंस्करण...' : 'Processing...'}
                    </>
                  ) : (
                    book.buttonText
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 pt-3 text-graphite-400 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{book.secureText}</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Sample Chapter */}
      {selectedChapter && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-graphite-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-graphite-700">
            <div className="sticky top-0 bg-graphite-800 border-b border-graphite-700 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {selectedLanguage === 'en' ? 'Chapter' : 'अध्याय'} {selectedChapter.number}: {selectedChapter.title}
              </h3>
              <button onClick={() => setSelectedChapter(null)} className="text-graphite-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 prose prose-invert max-w-none">
              <div className="text-graphite-200 whitespace-pre-wrap leading-relaxed font-sans">
                {chapterContent[selectedLanguage][selectedChapter.number as keyof typeof chapterContent.en]}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyBookPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Loading...</div>}>
      <BuyBookContent />
    </Suspense>
  );
}
