'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, ShieldCheck, Loader2, Clock, Truck, Zap, CheckCircle2, X } from 'lucide-react';
import CountdownBanner from '@/components/CountdownBanner';

// FULL CHAPTER CONTENT FOR MODALS
const fullChapterContent = {
  en: {
    1: {
      title: "CHAPTER 1: Prehistoric & Proto-historic Period, Ancient Tribes, and Early Political Powers",
      content: `CHAPTER 1: Prehistoric & Proto-historic Period, Ancient Tribes, and Early Political Powers

## 1.1 THE STONE AGE IN UTTARAKHAND

The prehistoric period of Uttarakhand is primarily reconstructed through stone tools and rock shelters discovered across the region's river valleys. In the Alaknanda Valley, at sites such as Dang and Sweet, archaeologists have recovered hand axes, choppers, and scrapers — evidence confirming early human habitation in the Higher Himalayas.

The Kalsi River Valley has yielded Stone Age implements that add to Dehradun's considerable archaeological wealth, while the Ramganga Valley in Western Kumaon has produced multiple tool types attesting to widespread prehistoric settlement.

The pioneer archaeologists K.P. Nautiyal and Yashodhar Mathpal confirmed Stone Age human habitation in the region through systematic excavations, establishing Uttarakhand's place within the broader narrative of Indian prehistory.

## 1.2 MAJOR PREHISTORIC ROCK ART & CAVE SHELTERS

### A. Almora District — The Epicentre of Rock Art

The paintings at Lakhu Udiyar are particularly significant. The cave is hawthorn-shaped, and its colour layering — white at the top (representing the latest paintings), brownish-red or pink in the middle (intermediate period), and black at the bottom (the oldest) — mirrors the globally recognized pattern found at the Bhimbetka rock shelters in central India.

Dr. M.P. Joshi conducted extensive research at Lakhu Udiyar, documenting these precious rock art remains that date back thousands of years, providing invaluable insights into prehistoric artistic expressions and cultural practices.

### B. Chamoli District

The Gwarkhya Cave, discovered by Rakesh Bhatt, is located in Dugri village of Tharali tehsil near the Alaknanda River. It contains exactly 41 figures — 33 humans and 8 animals including sheep, fox, and barasingha. The human figures are depicted in a distinctive trident-like shape, and the overall theme reflects a pastoral culture centred on herding and animal domestication.

### C. Uttarkashi District

The rock art site at Hudli is architecturally distinct from other Uttarakhand sites, having yielded rare blue-coloured rock paintings — an unusual pigment choice that sets it apart from the standard colour palette found elsewhere in the region.

## 1.3 PREHISTORIC STONE TOOL EVIDENCE

Prehistoric hemispherical depressions carved on large stones — believed to have astronomical or ritualistic significance — represent another category of archaeological evidence in Uttarakhand.

Henwood's 1856 discovery at Devidhura is recognized as the first discovery of archaeological sources in Uttarakhand, making it a landmark moment in the region's historiography. The Devidhura site contains numerous cup-marks arranged in specific patterns, suggesting ritual or ceremonial purposes.

The Dwarahat site contains approximately 200 cup-marks arranged in 12 rows, demonstrating sophisticated understanding of spatial organization. Nola Village has yielded 72 cup-marks, further establishing the prevalence of this archaeological feature across the region.

## 1.4 PREHISTORIC COPPER HOARDS AND METALWORK

Archaeological excavations have revealed several important copper hoard sites including Bahadrabad (1953) and Bankot, which contained 8 copper figures of significant artistic and historical value. The Naini Patal site and Malari Village have yielded important findings including a gold mask weighing 5.2 kg discovered in 2001-02.

These metalwork discoveries indicate the sophisticated technological capabilities of ancient Uttarakhand societies and their engagement in long-distance trade networks.

## 1.5 ANCIENT TRIBAL PEOPLES AND EARLY SETTLEMENTS

The ancient tribal peoples of Uttarakhand underwent significant transformations over millennia. The progression from Kols to Kirats to Khash represents the migration and settlement patterns of various tribal groups. The Bhotiyas engaged in the distinctive "Silent Exchange" (Mook Vinimay) trading practice, conducting commerce without direct verbal communication across mountain passes.

These tribal societies developed sophisticated systems of social organization, resource management, and trade adapted to the challenging Himalayan environment.`,
    },
    2: {
      title: "CHAPTER 2: Katyuri, Parmar & Chand Dynasties",
      content: `CHAPTER 2: Katyuri, Parmar & Chand Dynasties

## 2.1 KATYURI DYNASTY (700-1200 AD)

The Katyuri Dynasty represents the first major organized kingdom in Uttarakhand. Established in 700 AD by Basdeo (or Basantdev), the dynasty had its capital at Kartikeyapuri (modern Katyur Valley in Chamoli). The Katyuris were known for their administrative prowess, cultural sophistication, and patronage of arts and learning.

### Key Kings of Katyuri Dynasty

**Basantdev (700 AD)**: The founder established the Katyuri kingdom with a well-organized administrative system. He divided his empire into regions called "Bhukti" (provinces), "Viṣaya" (districts), and "Pallika" (villages), creating a hierarchical governance structure that would influence subsequent dynasties in the region.

**Lalitasuri Dev (765-790 AD)**: One of the most powerful Katyuri kings, Lalitasuri Dev expanded the kingdom significantly through military campaigns and diplomatic alliances. He performed the Ashvamedha Yajna and issued coins bearing the royal seal. He is credited with building several temples including the magnificent Jageshwar Temple complex in Almora District, which remains one of the most important pilgrimage sites in Uttarakhand.

**Bhuddev Dev (around 800 AD)**: Known for his administrative reforms and cultural patronage, Bhuddev Dev constructed temples and patronized scholars and philosophers. His reign saw a flourishing of Sanskrit learning and artistic traditions.

### Administrative Structure

The Katyuris created a sophisticated administrative system that became a model for later kingdoms:
- **Bhukti** (Major Province): Governed by a Bhiktipati
- **Viṣaya** (District): Governed by a Vishayapati
- **Pallika** (Village): Governed by a Pallika-adhyakṣa

This hierarchical system ensured effective administration across diverse geographic and demographic regions.

### Culture and Religion

The Katyuris were great patrons of Shaivism and built numerous temples dedicated to Lord Shiva. They patronized Sanskrit scholars and poets, facilitating the development of literature and philosophy. The famous scholar and philosopher Abhinava Gupta was patronized during this period, contributing significantly to Kashmir Shaivism and aesthetic philosophy.

### Decline and Legacy

The Katyuri Dynasty gradually declined due to internal conflicts and external pressures. However, their administrative innovations, cultural achievements, and religious patronage left an indelible mark on Uttarakhand's history.

## 2.2 PARMAR DYNASTY

The Parmar (or Pawar) Dynasty ruled the Chandpur area in modern Tehri Garhwal. They were contemporary with the Katyuris and maintained diplomatic relations with them. The Parmars were also Shaivite rulers and contributed significantly to the cultural development of the region through temple construction and artistic patronage.

## 2.3 CHAND DYNASTY (1025-1815 AD)

The Chand Dynasty is the most historically significant dynasty of Uttarakhand, with a rule spanning nearly 800 years, making it one of the longest-reigning dynasties in Indian history.

### Founder and Early History

**Chandraprabha** (also called Chand Rao) is traditionally credited as the founder of the Chand Dynasty around 1025 AD. He established his capital at Almora and gradually expanded his territory through military conquest and strategic alliances. The early Chand rulers consolidated their power through careful administration and military prowess.

### Golden Age: Deepchandra and Baz Bahadur

**Deepchandra (1613-1631)**: Considered the greatest Chand king, Deepchandra expanded the kingdom to its maximum extent and established Almora as a major cultural and administrative center. His reign witnessed significant architectural developments and cultural flourishing.

**Baz Bahadur (1681-1720)**: Known for his military prowess and administrative skills, Baz Bahadur successfully resisted Mughal invasions and maintained the kingdom's independence during a tumultuous period in Indian history.

### Decline and End

The Chand Dynasty began to decline in the late 18th century due to internal conflicts and external pressures from the Gorkhas. The last independent Chand king eventually ceded his territory to the British in 1815, marking the end of an era and the beginning of British colonial rule in Uttarakhand.`
    },
    11: {
      title: "CHAPTER 11: Political System of Uttarakhand",
      content: `CHAPTER 11: Political System of Uttarakhand

## 11.1 EXECUTIVE: THE GOVERNOR

### Constitutional Role

The Governor of Uttarakhand is the constitutional head of the state. Appointed by the President of India for a five-year term, the Governor represents the President at the state level. The position was established when Uttarakhand became a separate state in 2000, carving out from Uttar Pradesh as India's 27th state.

### Powers and Responsibilities

**Legislative Powers:**
- Grants assent to bills passed by the state legislature
- Can return bills for reconsideration (except money bills)
- Nominates members to the state assembly (Anglo-Indian representatives)
- Addresses the state legislature on important matters
- Issues ordinances when the legislature is not in session

**Executive Powers:**
- Exercises all executive powers of the state
- Appoints the Chief Minister (usually leader of majority party)
- Appoints judges and senior officials
- Grants pardons and reprieves
- Acts as supreme commander of state armed forces

**Discretionary Powers:**
- Acts on the advice of the Council of Ministers in most matters
- Can act on own discretion in certain constitutional matters
- Exercises reserve powers during constitutional crises
- Seeks President's guidance on sensitive matters

### List of Governors

The state has had multiple governors since its inception, each serving for varying periods and contributing to the state's development during their tenure.

## 11.2 EXECUTIVE: THE CHIEF MINISTER AND COUNCIL OF MINISTERS

### Chief Minister

The Chief Minister is the head of government and leader of the majority party in the state legislature. As the real executive authority, the CM holds significant powers in state administration.

### Powers of Chief Minister

1. Appoints ministers with approval of the Governor
2. Chairs the cabinet and coordinates government functions
3. Represents the state at national and international forums
4. Controls state finances and budget allocation
5. Appoints officers to various state commissions and corporations
6. Directs all government departments and agencies

### Council of Ministers

The Council of Ministers comprises cabinet ministers and other ministers. They assist the Chief Minister in governance and are responsible for various departments and ministries including Finance, Health, Education, Public Works, and others.

## 11.3 LEGISLATURE: UTTARAKHAND VIDHAN SABHA

### Composition

The Uttarakhand Vidhan Sabha (State Assembly) has 70 seats:
- 60 General Assembly seats
- 2 Anglo-Indian nominated seats
- 8 reserved seats for Scheduled Castes
- Seats distributed across various districts based on population

### Functions

1. **Legislation**: Passes state laws and bills on matters listed in State List and Concurrent List
2. **Budget**: Approves state budget and financial matters
3. **Oversight**: Questions and debates on government policies
4. **Representation**: Represents constituencies and public interests

### Speaker and Deputy Speaker

The Speaker is elected by assembly members and presides over sessions. The Deputy Speaker assists the Speaker and ensures smooth functioning of the legislature.`
    },
    27: {
      title: "CHAPTER 27: Education and HRD — Strategic Recommendations",
      content: `CHAPTER 27: Education and HRD — Strategic Recommendations

## 27.1 EDUCATION SYSTEM OVERVIEW

### Structure of Education

Uttarakhand follows the national education system:
- **Primary (Classes I-V)**: Foundation skills and literacy in local language and English
- **Upper Primary (Classes VI-VIII)**: Building subject knowledge across sciences and humanities
- **Secondary (Classes IX-X)**: Board examinations (CBSE/UP Board)
- **Senior Secondary (Classes XI-XII)**: Specialized stream selection (Science/Commerce/Arts)
- **Higher Education**: Universities and colleges offering undergraduate and postgraduate programs

### Major Educational Institutions

The state hosts several prestigious institutions:
- Kumaun University (Nainital) - Established 1956
- Garhwal University (Srinagar) - Central University
- Hemvati Nandan Bahuguna Garhwal University (HNB)
- Indian Institute of Technology (IIT Roorkee) - National importance
- National Institute of Technology (NIT Srinagar) - Technical education

## 27.2 NEW EDUCATION POLICY (NEP) 2020 IMPLEMENTATION

### Key Features of NEP 2020

The National Education Policy 2020 introduces significant reforms aimed at modernizing Indian education:

1. **Multidisciplinary Approach**: Students can combine subjects across streams (e.g., Physics with History)
2. **Critical Thinking**: Emphasis on reasoning and problem-solving rather than rote learning
3. **Vocational Training**: Integration of skill development alongside academic subjects
4. **Local Languages**: Teaching in mother tongue up to Grade V for better conceptual understanding
5. **Flexible Assessment**: Multiple attempts and continuous evaluation instead of board exams only

### Implementation in Uttarakhand

Uttarakhand has initiated comprehensive NEP 2020 implementation:
- Curriculum revision in schools to include skill-based learning
- Teacher training programs to enhance pedagogical methods
- Infrastructure development in schools and colleges
- Digital learning initiatives and online education platforms
- Skill development centers in partnership with industry

## 27.3 CHALLENGES AND WAY FORWARD

### Current Challenges

1. **Infrastructure Gap**: Rural areas lack adequate school buildings and facilities
2. **Teacher Shortage**: Shortage of qualified teachers in remote areas
3. **Digital Divide**: Limited internet connectivity in mountainous regions
4. **Drop-out Rates**: High dropout rates, particularly among girls in rural areas
5. **Quality Education**: Gap between urban and rural education quality

### Strategic Way Forward

| Challenge | Strategy | Timeline | Implementation |
|-----------|----------|----------|-----------------|
| Infrastructure | Build schools with ICT labs in 500 villages | 2025 | State funding + Central assistance |
| Teachers | Recruit & train 5000 qualified teachers | 2024-26 | Ministry of Education partnership |
| Digital Access | Expand broadband connectivity in rural areas | 2025 | Telecom partnership + government subsidy |
| Girls' Education | Scholarships for 10,000 girls | Ongoing | State scholarship scheme |
| Quality Education | Reduce teacher-student ratio to 1:25 | 2026 | Hiring + capacity building program |

These strategic initiatives aim to transform Uttarakhand's education system to meet 21st-century requirements and ensure inclusive quality education for all citizens.`
    }
  },
  hi: {
    1: {
      title: "अध्याय 1: प्रागैतिहासिक एवं आद्य-ऐतिहासिक काल, प्राचीन जनजातियाँ",
      content: `अध्याय 1: प्रागैतिहासिक एवं आद्य-ऐतिहासिक काल, प्राचीन जनजातियाँ

## 1.1 उत्तराखंड में पाषाण युग

उत्तराखंड का प्रागैतिहासिक काल मुख्य रूप से नदी घाटियों में खोजे गए पत्थर के उपकरणों और शैल आश्रयों के माध्यम से पुनर्निर्मित होता है। अलकनंदा घाटी में डांग और स्वीट जैसे स्थानों पर पुरातत्ववेत्ताओं को हाथ की कुल्हाड़ियाँ, चॉपिंग उपकरण और खुरचनी मिली हैं, जो उच्च हिमालय में मानव निवास का साक्ष्य देती हैं।

कलसी नदी घाटी ने पाषाण युग के उपकरण प्रदान किए हैं जो देहरादून के पुरातात्विक महत्व को प्रदर्शित करते हैं। राम गंगा घाटी पश्चिमी कुमाऊँ में विभिन्न उपकरणों ने व्यापक प्रागैतिहासिक बस्तियों का साक्ष्य दिया है।

अग्रणी पुरातत्ववेत्ताओं K.P. नौटियाल और यशोधर मथपाल ने व्यवस्थित खुदाइयों के माध्यम से उत्तराखंड में पाषाण युग के मानव निवास की पुष्टि की है, जिससे भारतीय प्रागैतिहास में उत्तराखंड का स्थान स्थापित हुआ।

## 1.2 प्रमुख प्रागैतिहासिक शैल कला और गुफा आश्रय

### A. अल्मोड़ा जिला — शैल कला का केंद्र

लाखु उड्यार की चित्रकारी विशेष रूप से महत्वपूर्ण है। गुफा का आकार हॉथॉर्न जैसा है, और इसकी रंग परतें — शीर्ष पर सफेद (सबसे नई चित्रकारी), मध्य में भूरा-लाल (मध्यवर्ती अवधि), और नीचे काली (सबसे पुरानी) — भीमबेटका शैल आश्रयों में पाए जाने वाले वैश्विक मान्यता प्राप्त पैटर्न को दर्शाती हैं।

### B. चमोली जिला

गुफा की गुफा, राकेश भट्ट द्वारा खोजी गई, तारली तहसील के डुग्री गाँव में अलकनंदा नदी के पास स्थित है। इसमें 41 आकृतियाँ हैं — 33 मानव और 8 जानवर जिनमें भेड़, लोमड़ी और बारासिंगा शामिल हैं। मानव आकृतियाँ एक विशिष्ट त्रिशूल जैसे आकार में चित्रित हैं, और समग्र थीम चराई और पशु पालन केंद्रित एक पशुपालक संस्कृति को दर्शाती है।

### C. उत्तरकाशी जिला

हुडली में शैल कला स्थल उत्तराखंड के अन्य स्थलों से वास्तुकलात्मक रूप से भिन्न है, जिसमें दुर्लभ नीली रंग की शैल चित्रकारी मिली है — एक असामान्य रंग पसंद जो इसे क्षेत्र में पाए जाने वाले मानक रंग पैलेट से अलग करता है।

## 1.3 प्रागैतिहासिक पत्थर के उपकरणों के साक्ष्य

प्रागैतिहासिक गोलार्द्ध अवसाद जो बड़े पत्थरों पर उकेरे गए हैं — माना जाता है कि ये खगोलीय या अनुष्ठानिक महत्व के हैं — उत्तराखंड में पुरातात्विक साक्ष्य की एक अन्य श्रेणी का प्रतिनिधित्व करते हैं।

हेनवुड की 1856 में देविधुरा में की गई खोज को उत्तराखंड में पुरातत्व स्रोतों की पहली खोज के रूप में मान्यता दी जाती है, जिससे क्षेत्र के ऐतिहासिकता का एक महत्वपूर्ण क्षण चिह्नित होता है।`
    },
    2: {
      title: "अध्याय 2: कत्यूरी, परमार एवं चंद राजवंश",
      content: `अध्याय 2: कत्यूरी, परमार एवं चंद राजवंश

## 2.1 कत्यूरी राजवंश (700-1200 ईस्वी)

कत्यूरी राजवंश उत्तराखंड में पहले प्रमुख संगठित राज्य का प्रतिनिधित्व करता है। 700 ईस्वी में बसदेव (या बसंतदेव) द्वारा स्थापित, इस राजवंश की राजधानी कार्तिकेयपुरी (आधुनिक चमोली के कत्यूर घाटी) थी। कत्यूरी अपने प्रशासनिक कौशल, सांस्कृतिक परिष्कार और कला और शिक्षा के संरक्षण के लिए जाने जाते थे।

### कत्यूरी राजवंश के प्रमुख राजा

**बसंतदेव (700 ईस्वी)**: संस्थापक ने एक सुसंगठित प्रशासनिक प्रणाली के साथ कत्यूरी राज्य की स्थापना की। उन्होंने अपने साम्राज्य को "भुक्ति" (प्रांत), "विषय" (जिले) और "पल्लिका" (गाँव) में विभाजित किया, जिससे एक पदानुक्रमित शासन संरचना बनी जो बाद के राजवंशों को प्रभावित करेगी।

**ललितसूरि देव (765-790 ईस्वी)**: सबसे शक्तिशाली कत्यूरी राजाओं में से एक, ललितसूरि देव ने सैन्य अभियानों और राजनयिक गठबंधनों के माध्यम से राज्य का महत्वपूर्ण विस्तार किया। उन्होंने अश्वमेध यज्ञ किया और राजकीय सील वाले सिक्के जारी किए। उन्हें जागेश्वर मंदिर परिसर सहित कई मंदिरों के निर्माण का श्रेय दिया जाता है, जो अल्मोड़ा जिले में है और उत्तराखंड में सबसे महत्वपूर्ण तीर्थ स्थलों में से एक बना हुआ है।

### प्रशासनिक संरचना

कत्यूरियों ने एक परिष्कृत प्रशासनिक प्रणाली बनाई जो बाद के राज्यों के लिए एक मॉडल बन गई:
- **भुक्ति** (प्रमुख प्रांत): भुक्ति-पति द्वारा शासित
- **विषय** (जिला): विषय-पति द्वारा शासित
- **पल्लिका** (गाँव): पल्लिका-अध्यक्ष द्वारा शासित

यह पदानुक्रमित प्रणाली विभिन्न भौगोलिक और जनसांख्यिकीय क्षेत्रों में प्रभावी प्रशासन सुनिश्चित करती है।

### संस्कृति और धर्म

कत्यूरी शैववाद के महान संरक्षक थे और भगवान शिव को समर्पित कई मंदिरों का निर्माण किया। उन्होंने संस्कृत विद्वानों और कवियों को संरक्षण दिया, साहित्य और दर्शन के विकास को सुविधाजनक बनाया। प्रसिद्ध विद्वान और दार्शनिक अभिनव गुप्त को इस अवधि के दौरान संरक्षण मिला, जिन्होंने कश्मीर शैववाद और सौंदर्य दर्शन में महत्वपूर्ण योगदान दिया।`
    },
    11: {
      title: "अध्याय 11: उत्तराखंड की राजनीतिक व्यवस्था",
      content: `अध्याय 11: उत्तराखंड की राजनीतिक व्यवस्था

## 11.1 कार्यपालिका: राज्यपाल

### संवैधानिक भूमिका

उत्तराखंड के राज्यपाल राज्य के संवैधानिक प्रमुख हैं। भारत के राष्ट्रपति द्वारा नियुक्त, पाँच साल के कार्यकाल के लिए, राज्यपाल राष्ट्रपति का प्रतिनिधित्व राज्य स्तर पर करते हैं। यह पद उस समय स्थापित किया गया था जब उत्तराखंड 2000 में एक अलग राज्य बना।

### शक्तियाँ और जिम्मेदारियाँ

**विधायी शक्तियाँ:**
- राज्य विधानमंडल द्वारा पारित विधेयकों को मंजूरी देता है
- विधानसभा के सदस्यों को मनोनीत करता है (एंग्लो-इंडियन प्रतिनिधि)
- राज्य विधानमंडल को महत्वपूर्ण मामलों पर संबोधित करता है
- विधानमंडल सत्र में न होने पर अध्यादेश जारी करता है

**कार्यकारी शक्तियाँ:**
- राज्य की सभी कार्यकारी शक्तियों का प्रयोग करता है
- मुख्यमंत्री की नियुक्ति करता है
- न्यायाधीशों और वरिष्ठ अधिकारियों की नियुक्ति करता है
- क्षमा देने और दंड में कमी करने की शक्तियाँ रखता है
- राज्य सशस्त्र बलों का सर्वोच्च कमांडर होता है

## 11.2 कार्यपालिका: मुख्यमंत्री और मंत्रिपरिषद

### मुख्यमंत्री

मुख्यमंत्री सरकार का प्रमुख है और राज्य विधानमंडल में बहुमत दल का नेता होता है। वास्तविक कार्यकारी प्राधिकारी के रूप में, मुख्यमंत्री राज्य प्रशासन में महत्वपूर्ण शक्तियाँ रखता है।

### मुख्यमंत्री की शक्तियाँ

1. राज्यपाल की अनुमति से मंत्रियों की नियुक्ति करता है
2. मंत्रिमंडल की अध्यक्षता करता है और सरकारी कार्यों का समन्वय करता है
3. राष्ट्रीय और अंतर्राष्ट्रीय मंचों पर राज्य का प्रतिनिधित्व करता है
4. राज्य वित्त को नियंत्रित करता है और बजट आवंटन करता है
5. विभिन्न राज्य आयोगों और निगमों में अधिकारियों की नियुक्ति करता है

### मंत्रिपरिषद

मंत्रिपरिषद मंत्रियों से बनी होती है जो मुख्यमंत्री को शासन में सहायता करते हैं। वे विभिन्न विभागों और मंत्रालयों के लिए जिम्मेदार होते हैं।

## 11.3 विधानमंडल: उत्तराखंड विधान सभा

### संरचना

उत्तराखंड विधान सभा में 70 सीटें हैं:
- 60 सामान्य विधानसभा सीटें
- 2 एंग्लो-इंडियन मनोनीत सीटें
- 8 अनुसूचित जातियों के लिए आरक्षित सीटें
- विभिन्न जिलों में जनसंख्या के आधार पर वितरित

### कार्य

1. **विधान**: राज्य सूची और समवर्ती सूची के मामलों पर राज्य कानून बनाता है
2. **बजट**: राज्य बजट और वित्तीय मामलों को मंजूरी देता है
3. **निरीक्षण**: सरकारी नीतियों पर प्रश्न और बहस
4. **प्रतिनिधित्व**: निर्वाचन क्षेत्र और जनता के हितों का प्रतिनिधित्व करता है`
    },
    27: {
      title: "अध्याय 27: शिक्षा एवं मानव संसाधन विकास — रणनीतिक सिफारिशें",
      content: `अध्याय 27: शिक्षा एवं मानव संसाधन विकास — रणनीतिक सिफारिशें

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
- कुमाऊँ विश्वविद्यालय (नैनीताल) - 1956 में स्थापित
- गढ़वाल विश्वविद्यालय (श्रीनगर) - केंद्रीय विश्वविद्यालय
- हेमवती नंदन बहुगुणा गढ़वाल विश्वविद्यालय (HNB)
- भारतीय प्रौद्योगिकी संस्थान (IIT रुड़की) - राष्ट्रीय महत्व
- राष्ट्रीय प्रौद्योगिकी संस्थान (NIT श्रीनगर) - तकनीकी शिक्षा

## 27.2 नई शिक्षा नीति (NEP) 2020 कार्यान्वयन

### NEP 2020 की प्रमुख विशेषताएँ

राष्ट्रीय शिक्षा नीति 2020 भारतीय शिक्षा को आधुनिकीकरण के लिए महत्वपूर्ण सुधार प्रस्तुत करती है:

1. **बहु-अनुशासनात्मक दृष्टिकोण**: छात्र विभिन्न धाराओं में विषयों को जोड़ सकते हैं
2. **आलोचनात्मक सोच**: तर्क और समस्या-समाधान पर जोर
3. **व्यावसायिक प्रशिक्षण**: कौशल विकास का एकीकरण
4. **स्थानीय भाषाएँ**: कक्षा V तक मातृभाषा में शिक्षण
5. **लचीला आकलन**: बहु-प्रयास और निरंतर मूल्यांकन

### उत्तराखंड में कार्यान्वयन

उत्तराखंड ने NEP 2020 के व्यापक कार्यान्वयन की शुरुआत की है:
- स्कूलों में कौशल-आधारित शिक्षा के लिए पाठ्यक्रम में संशोधन
- शैक्षणिक पद्धतियों को बढ़ाने के लिए शिक्षक प्रशिक्षण कार्यक्रम
- स्कूलों और कॉलेजों में बुनियादी ढांचे का विकास
- डिजिटल शिक्षण पहल और ऑनलाइन शिक्षा प्लेटफार्म
- उद्योग की भागीदारी में कौशल विकास केंद्र`
    }
  }
};

const smallChapters = {
  en: {
    1: "Ch 1: Prehistoric & Proto-historic Period",
    2: "Ch 2: Katyuri, Parmar & Chand Dynasties",
    11: "Ch 11: Political System",
    27: "Ch 27: Education and HRD",
  },
  hi: {
    1: "अध्याय 1: प्रागैतिहासिक काल",
    2: "अध्याय 2: कत्यूरी राजवंश",
    11: "अध्याय 11: राजनीतिक व्यवस्था",
    27: "अध्याय 27: शिक्षा एवं विकास",
  }
};

function BuyBookContent() {
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>(() => searchParams?.get('lang') === 'hi' ? 'hi' : 'en');
  const [selectedChapter, setSelectedChapter] = useState<{number: number, title: string} | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', bookLanguage: 'English',
  });
  const [loading, setLoading] = useState(false);

  const bookData = {
    en: {
      originalPrice: 599, currentPrice: 499, pages: '350+', chapters: '28', appendixCount: '2',
      sampleChapters: [
        { number: 1, title: 'Prehistoric & Proto-historic Period', pages: 'Pages 1-20' },
        { number: 2, title: 'Katyuri, Parmar & Chand Dynasties', pages: 'Pages 21-40' },
        { number: 11, title: 'Political System of Uttarakhand', pages: 'Pages 180-200' },
        { number: 27, title: 'Education and HRD', pages: 'Pages 320-340' },
      ],
      features: ['Papers 5 & 6', 'Current Affairs', 'Comparative Tables', 'Prelims+Mains', 'All Exams', 'Updated Reports'],
      buttonText: 'Proceed to Payment',
    },
    hi: {
      originalPrice: 599, currentPrice: 499, pages: '350+', chapters: '28', appendixCount: '2',
      sampleChapters: [
        { number: 1, title: 'प्रागैतिहासिक काल', pages: 'पृष्ठ 1-20' },
        { number: 2, title: 'कत्यूरी राजवंश', pages: 'पृष्ठ 21-40' },
        { number: 11, title: 'राजनीतिक व्यवस्था', pages: 'पृष्ठ 180-200' },
        { number: 27, title: 'शिक्षा एवं विकास', pages: 'पृष्ठ 320-340' },
      ],
      features: ['Papers 5 & 6', 'समसामयिकी', 'तुलनात्मक तालिकाएँ', 'Prelims+Mains', 'सभी परीक्षाएँ', 'अपडेट'],
      buttonText: 'भुगतान के लिए आगे बढ़ें',
    }
  };

  const book = bookData[selectedLanguage];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newOrderId = `UK${Date.now()}`;
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, orderId: newOrderId, amount: book.currentPrice }),
      });
      const result = await response.json();
      if (result.success) {
        window.location.href = `/order-confirmation?orderId=${newOrderId}&language=${form.bookLanguage}&name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&phone=${encodeURIComponent(form.phone)}`;
      }
    } catch (error) {
      alert('Error submitting order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <CountdownBanner deadline="2026-09-12" headline="Limited Offer" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Offer Banner */}
        <div className="mb-8 bg-gradient-to-r from-saffron-600 to-saffron-500 rounded-2xl p-6 sm:p-8 border-2 border-saffron-400">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">🎯 Early Bird Offer</h2>
              <p className="text-saffron-100 mb-4">Limited time offer for first edition (500 books)</p>
              <div className="flex items-center gap-4">
                <span className="text-xl line-through">₹{book.originalPrice}</span>
                <span className="text-4xl font-bold">₹{book.currentPrice}</span>
                <span className="bg-white text-saffron-600 px-3 py-1 rounded-full font-bold text-sm">Save ₹100</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><Truck className="w-5 h-5" /><span>✅ Free Delivery</span></div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><Clock className="w-5 h-5" /><span>✅ 4 Day Delivery</span></div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><Zap className="w-5 h-5" /><span>✅ Updated</span></div>
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-graphite-700/50 rounded-full p-1">
            <button onClick={() => setSelectedLanguage('en')} className={`px-6 py-2 rounded-full font-semibold ${selectedLanguage === 'en' ? 'bg-saffron-500 text-white' : 'text-graphite-300'}`}>📕 English</button>
            <button onClick={() => setSelectedLanguage('hi')} className={`px-6 py-2 rounded-full font-semibold ${selectedLanguage === 'hi' ? 'bg-indigo-500 text-white' : 'text-graphite-300'}`}>📗 हिंदी</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h2 className="text-2xl font-bold mb-4">Book Overview</h2>
              <div className="grid sm:grid-cols-3 gap-4 text-center mb-6">
                <div className="bg-saffron-500/10 rounded-lg p-4"><p className="text-2xl font-bold text-saffron-400">{book.pages}</p><p className="text-sm">Pages</p></div>
                <div className="bg-jade-500/10 rounded-lg p-4"><p className="text-2xl font-bold text-jade-400">{book.chapters}</p><p className="text-sm">Chapters</p></div>
                <div className="bg-blue-500/10 rounded-lg p-4"><p className="text-2xl font-bold text-blue-400">{book.appendixCount}</p><p className="text-sm">Appendices</p></div>
              </div>
            </div>

            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {book.features.map((f, i) => <div key={i} className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0" /><p className="text-sm">{f}</p></div>)}
              </div>
            </div>

            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" />Read Sample Chapters</h3>
              <div className="space-y-3">
                {book.sampleChapters.map((ch, i) => (
                  <button key={i} onClick={() => setSelectedChapter(ch)} className="w-full text-left bg-graphite-700/30 rounded-lg p-4 hover:bg-graphite-700/50 transition">
                    <div className="flex justify-between items-start"><h4 className="font-bold">Ch {ch.number}: {ch.title}</h4><span className="text-graphite-500 text-sm">{ch.pages}</span></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="lg:col-span-1">
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 sticky top-24 h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Now</h2>
              <div className="mb-6 text-center">
                <p className="text-4xl font-bold text-saffron-400">₹{book.currentPrice}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <select name="bookLanguage" value={form.bookLanguage} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm">
                  <option value="English">📕 English</option>
                  <option value="हिंदी">📗 हिंदी</option>
                </select>
                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} required rows={2} className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="text" name="pincode" placeholder="PIN" value={form.pincode} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <select name="state" value={form.state} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm">
                  <option value="">State</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">UP</option>
                  <option value="Himachal Pradesh">HP</option>
                  <option value="Other">Other</option>
                </select>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing</> : book.buttonText}
                </button>
                <div className="flex items-center justify-center gap-2 pt-3 text-graphite-400 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Full Modal - FULLSCREEN READABLE */}
      {selectedChapter && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-0 sm:p-4 overflow-auto">
          <div className="bg-graphite-800 w-full sm:max-w-4xl sm:rounded-2xl border border-graphite-700 min-h-screen sm:min-h-auto flex flex-col">
            {/* Header - Fixed */}
            <div className="sticky top-0 bg-graphite-900 border-b border-graphite-700 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-lg sm:text-xl font-bold flex-1 pr-4">{fullChapterContent[selectedLanguage][selectedChapter.number as keyof typeof fullChapterContent.en]?.title}</h3>
              <button onClick={() => setSelectedChapter(null)} className="flex-shrink-0 text-graphite-400 hover:text-white bg-graphite-700 rounded-lg p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-graphite-100 leading-relaxed prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-base sm:text-lg">
                {fullChapterContent[selectedLanguage][selectedChapter.number as keyof typeof fullChapterContent.en]?.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyBookPage() {
  return (<Suspense fallback={<div className="text-center py-20">Loading...</div>}><BuyBookContent /></Suspense>);
}
