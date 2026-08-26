'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, ShieldCheck, Loader2, Clock, Truck, Zap, CheckCircle2, X, List } from 'lucide-react';
import CountdownBanner from '@/components/CountdownBanner';

const chapterContent = {
  en: {
    1: {
      label: "Chapter 1 — History",
      title: "Epigraphy: Inscriptions & Their Significance",
      content: `## Epigraphy: Inscriptions & Their Significance

Inscriptions are the most reliable primary sources for reconstructing Uttarakhand's ancient political history. They fall into three groups — rock/stone inscriptions, copper-plate land grants, and coins (numismatics).

### Rock Edicts & Stone Inscriptions

| Inscription | Date | Location | Script/Language | Significance |
|---|---|---|---|---|
| Kalsi Rock Edict | 257 BC | Yamuna–Tons confluence, Dehradun | Prakrit / Brahmi | Proves Mauryan suzerainty; mentions 'Pulind' & 'Aparanta' |
| Gopeshwar Trishul | 6th–7th C. | Chamoli | Southern Brahmi | Names 4 Naga kings; 12th C. addition on King Ashokchalla |
| Barahat Trishul | — | Uttarkashi | — | 26-foot high; erected by King Ganeshwar's son, Shri Guha |
| Lakhamandal Inscription | — | Dehradun | — | Princess Ishwara; confirms Yaduvanshi rule; capital Singhpur |
| Baleshwar Temple Inscription | 1223 AD | Champawat | — | Nepalese King Krachaldev; lists 10 subordinate Mandaliks |

### Copper Plate Inscriptions (Tamra Patra)

| Copper Plate | Dynasty | Key Information |
|---|---|---|
| Pandukeshwar Plates | Katyuri | Lalit Sur Dev's rule and land grants |
| Bageshwar Plate (King Bhudev) | Katyuri | Names 8 Katyuri kings |
| Taleshwar Plates (Almora) | Paurava | Sanskrit/Brahmi; names 5 kings; 'Parvatakar / Brahmapur State' (580–680 CE) |

### Numismatics — Coin Summary

| Coin Type | Dynasty/Power | Location Found | Key Features |
|---|---|---|---|
| Amoghbhuti Type | Kuninda | Widespread | Silver + Copper; Goddess + Deer; Brahmi & Kharoshthi |
| Almora Type | Kuninda | Katyur Valley (54 coins) | Names: Aasek, Gomitra, Shivadutt, Hardutt |
| Chatreshwar Type | Kuninda | — | Trident + Deer + Swastika; deity Chatreshwar |
| Kushana Coins | Kushan Empire | Virbhadra, Govishan, Khatima, Muni Ki Reti | Gold (Vashu); 44 coins (Huvishka) |
| Yaudheya Coins | Yaudheya | Jaunsar-Bhabhar, Pauri | Kartikeya motif; "Yaudheya Ganasya Jayah" |

*This is a free sample from Chapter 1. The full guidebook covers every dynasty, tribe and archaeological site with exam-ready tables.*`
    },
    2: {
      label: "Chapter 2 — Ancient Dynasties",
      title: "Katyuri Dynasty: Administrative & Architectural Excellence",
      content: `## Katyuri Dynasty: Administrative Structure & Legacy

### Organizational Hierarchy

The Katyuri administrative system was highly centralized and hierarchical, with the following structure at its apex:

**Regional Division:**
- **Bhukti** (Provinces) → administered by an **Uparika**
- **Visha** (Jurisdictions) → managed by a **Vishpati**  
- **Pallika** (Villages) → overseen by a **Mahattam** or **Sayan**

### Key Administrative Officers

| Official | Responsibility |
|---|---|
| **Saudabhangadhikrita** | Chief architect of royal construction projects |
| **Prantpal** | Defender of kingdom borders |
| **Ghattpal** | Guardian of mountain passes |
| **Narpati** | Manager of river crossings and toll collection |
| **Akshpatlik** | Chief auditor and accountant |
| **Bhogpati** | Tax collector |
| **Bhatt & Char** | Officials responsible for conscripting labor (begar) |
| **Pramavatar** | Land measurement officer |

### Military Organization

The Katyuri army consisted of **four divisions**:
- **Paidal Sena** (Infantry) — led by **Gaulmik**
- **Ashvabal** (Cavalry) — commanded by **Ashvabaladhikrita**
- **Hastibal** (Elephant Corps) — led by **Hastibaldhikrita**
- **Ushtrabal** (Camel Corps) — under **Ushtrabaladhikrita**

---

## Comparative Analysis: Four Rulers of Uttarakhand

| Criteria | Katyuri Dynasty | Parmar Dynasty (Garhwal) | Chand Dynasty (Kumaon) | Gorkha Rule |
|---|---|---|---|---|
| **Nature** | First unified monarchy | Regional monarchy (Garhwal) | Regional monarchy (Kumaon) | Foreign military occupation |
| **Territory** | Unified Uttarakhand | Garhwal only | Kumaon only | Both Kumaon & Garhwal |
| **Period** | 700–11th century CE | 688–1804 CE | ~700–1790 CE | 1790–1815 |
| **Founder** | Basant Dev | Kanakpal | Somchand | Nepal's King (as administrator) |
| **Greatest Ruler** | Lalit Suri Dev | Fateh Shah / Ajay Pal | Jagat Chand / Rudra Chand | — |
| **First Capital** | Joshimath | Chandpur Garhi | Champawat | Almora (Subedar's seat) |
| **Final Capital** | Baijnath | Srinagar | Almora | — |
| **Golden Age** | Entire period (Architecture) | Fateh Shah's reign | Jagat Chand's reign | Dark age |
| **Taxation** | Land-based via Bhogpati | Tihar (1/3 of production) | Galla-Chhahara (1/6 of production) | Pungdi tax (arbitrary, heavy) |
| **Justice System** | King supreme | King supreme; village panchayats → Dewan's court | Two formal courts: Nyowali + Bishtali | No codified law; divine tests (fire trials) |
| **Architecture** | Temple design (Nagar style) | Garhwal painting school (Mola Ram) | Stone carving & naulas (water conservation) | Destruction of local culture |
| **Decline Cause** | Nepali invasions + weak successors | Natural disasters + conspiracies + Gorkha invasions | Weak rulers + Harsh Dev Joshi's betrayal + Gorkha invasions | British military superiority (Anglo-Gorkha War) |

*This is a free sample from Chapter 2. The full guidebook covers administrative hierarchies, military structures, tax systems, and architectural achievements.*`
    },
    3: {
      label: "Chapter 3 — Gorkha War & Liberation",
      title: "Anglo-Gorkha War (1814–1815) & Uttarakhand's Freedom",
      content: `## The Gorkha Conquest & Anglo-Gorkha War (1814–1815)

### Background: Gorkha Expansion & British Response

Gorkha expansion westward collided with British East India Company interests when Gorkha forces, under Nepal's King Girvan Yuddha Bikram Shah, annexed both Kumaon (1790) and Garhwal (1803) territories. The British Governor-General declared war on Gorkha forces in 1814.

### The Battle of Khalanga (Nalapani), Dehradun

**Date:** October 1814  
**Significance:** The most celebrated engagement of the Anglo-Gorkha War

The British Army under **Major General Gillespie** attacked the **Khalanga Fort** (also called Nalapani), defended by **Captain Balhadur Thapa** with only **500 Gorkha soldiers**.

**Key Events:**
- General Gillespie was **killed on October 31, 1814** during direct assault
- British victory achieved only by **cutting off the fort's water supply** — a testament to Gorkha resistance
- Both sides displayed extraordinary valor recognized by the British erection of the **Khalanga War Memorial in Dehradun** — unique in military history for honoring both victors and vanquished

### Treaty of Sugauli (May 4, 1816)

The formal treaty between Britain and Nepal concluded the war. It resulted in territorial reorganization:

| Territory | Outcome |
|---|---|
| **Eastern Garhwal (Pauri)** | Remained under British East India Company |
| **Western Garhwal** | Returned to Sudarshan Shah as Tehri Kingdom |
| **Entire Kumaon** | British annexation (later Kumaon Division) |

This treaty formally liberated Uttarakhand from Gorkha occupation and initiated the British colonial period.

---

## Master Comparative Table: All Four Rulers of Uttarakhand

| Criterion | Katyuri Dynasty | Parmar Dynasty (Garhwal) | Chand Dynasty (Kumaon) | Gorkha Rule |
|---|---|---|---|---|
| **Primary Strength** | Administrative sophistication & unified vision | Military prowess & cultural patronage | Longevity (790 years) & local legitimacy | Military efficiency & rapid conquest |
| **Tax System** | Sophisticated, codified | Simple (tihar) | Detailed (36 codified taxes) | Arbitrary & oppressive (pungdi) |
| **Justice** | Hierarchical (King → Dewan → Village) | King-led with panchayat input | Formal dual courts (Nyowali & Bishtali) | Divine ordeals (fire tests) |
| **Cultural Peak** | Temple architecture (Nagar style) | Garhwal painting (Mola Ram school) | Stone carving & water infrastructure | Cultural destruction |
| **Fall Reason** | External (Nepali invasions) + Internal (weak heirs) | Mixed (natural disasters + conspiracies + Gorkha pressure) | External (Gorkha invasion) + Internal (betrayal by Harsh Dev Joshi) | External (British military superiority) |
| **Legacy** | Architectural monuments (Jageshwar, Baijnath) | Artistic traditions (miniature painting) | Administrative precedent & fort systems | Trauma & institutional collapse |

*This is a free sample from Chapter 3. The full guidebook provides detailed military analysis, biographical accounts of rulers, and strategic assessments of each dynasty's fall.*`
    }
  },
  hi: {
    1: {
      label: "अध्याय 1 — इतिहास",
      title: "प्रागैतिहासिक एवं आद्य-ऐतिहासिक काल, प्राचीन जनजातियाँ तथा प्रारंभिक राजनीतिक शक्तियाँ",
      content: `## विषय-सूची (इंडेक्स)

### भाग A: इतिहास एवं संस्कृति (पेपर V)

| क्र. | अध्याय शीर्षक |
|-----|--------|
| 1 | प्रागैतिहासिक एवं आद्य-ऐतिहासिक काल, प्राचीन जनजातियाँ एवं प्रारंभिक राजनीतिक शक्तियाँ |
| 2 | प्राचीन राजवंश — कार्तिकेयपुर, कत्यूरी एवं परमार |
| 3 | चंद राजवंश एवं गोरखा आक्रमण |
| 4 | उत्तराखंड में ब्रिटिश शासन |
| 5 | टिहरी रियासत |
| 6 | राष्ट्रीय आंदोलन एवं स्वतंत्रता सेनानी |
| 7 | जन-आंदोलन, सामाजिक सुधारक एवं राज्यत्व आंदोलन |
| 8 | उत्तराखंड का समाज — परिवार, विवाह, जाति व्यवस्था |
| 9 | लोक संस्कृति — गीत, नृत्य, कला, वाद्य यंत्र |
| 10 | धार्मिक स्थल, मंदिर, मेले एवं त्योहार |

### भाग B: राजनीति एवं गवर्नेंस (पेपर V)

| क्र. | अध्याय शीर्षक |
|-----|--------|
| 11 | राजनीतिक व्यवस्था — राज्यपाल, मुख्यमंत्री, विधानमंडल, राजनीतिक दल |
| 12 | प्रशासनिक व्यवस्था — शासन संरचना, UKPSC, हाईकोर्ट |
| 13 | स्थानीय स्वशासन — पंचायती राज एवं शहरी निकाय |
| 14 | गुड गवर्नेंस एवं पब्लिक पॉलिसी |

---

### भाग C: भूगोल (पेपर VI)

| क्र. | अध्याय शीर्षक |
|-----|--------|
| 15 | भौतिक भूगोल — भाग 1 (संरचना, जलवायु, नदियाँ) |
| 16 | भौतिक भूगोल — भाग 2 (मृदा, वनस्पति, ग्लेशियर) |
| 17 | संसाधन एवं कृषि |
| 18 | उद्योग, परिवहन एवं ऊर्जा |
| 19 | पर्यटन, राष्ट्रीय उद्यान एवं वन्यजीव |
| 20 | जनसंख्या, प्रवास एवं शहरीकरण |

### भाग D: अर्थव्यवस्था (पेपर VI)

| क्र. | अध्याय शीर्षक |
|-----|--------|
| 21 | अर्थव्यवस्था — विशेषताएँ, GSDP, आय के स्रोत |
| 22 | औद्योगिक विकास एवं MSME |
| 23 | इन्फ्रास्ट्रक्चर |
| 24 | आर्थिक नियोजन, बजट एवं पब्लिक फाइनेंस |
| 25 | प्रमुख आर्थिक समस्याएँ एवं कल्याण कार्यक्रम |

### भाग E: आपदा प्रबंधन एवं HRD (पेपर VI)

| क्र. | अध्याय शीर्षक |
|-----|--------|
| 26 | आपदा प्रबंधन |
| 27 | शिक्षा एवं मानव संसाधन विकास (HRD) |
| 28 | स्वास्थ्य |

---

## 1.1 उत्तराखंड में पाषाण युग

उत्तराखंड के प्रागैतिहासिक काल का पुनर्निर्माण मुख्य रूप से **पाषाण उपकरणों** और **शैलाश्रयों (रॉक शेल्टर)** के माध्यम से किया गया है। अलकनंदा घाटी में डांग और स्वीट जैसे स्थलों पर, पुरातत्वविदों ने हाथ की कुल्हाड़ियाँ, छेदक (चॉपर) और खुरचनी बरामद की हैं — जो उच्च हिमालय में प्रारंभिक मानव निवास की पुष्टि करती हैं।

## 1.2 प्रमुख प्रागैतिहासिक शैल चित्रकला एवं गुफा आश्रय

### A. अल्मोड़ा जनपद — शैल कला का केंद्र

| स्थल | खोजकर्ता | वर्ष | प्रमुख विशेषताएँ |
|---|---|---|---|
| **लाखु उड्यार (गुफा)** | डॉ. एम.पी. जोशी | 1968 | सुयाल नदी पर भदीछीना के निकट डालबंद; नृत्य करते और पशुओं का पीछा करते मानवों का चित्रण; तीन रंग परतें — सफेद (ऊपर), भूरा-लाल/गुलाबी (मध्य), काला (नीचे) |
| **कसार देवी मंदिर** | — | — | कश्यप पर्वत पर स्थित; **14 नर्तकों** का चित्रण |
| **फड़का नौली** | डॉ. यशोधर मठपाल | 1985 | कई महत्वपूर्ण शैलाश्रय |
| **पेटशाला** | डॉ. यशोधर मठपाल | 1989 | शैलाश्रय समूह |
| **फल्सीमा** | — | — | **योग एवं नृत्य** दोनों मुद्राओं में मानवों का अनूठा चित्रण |

### B. चमोली जनपद

राकेश भट्ट द्वारा खोजी गई **ग्वारख्या गुफा**, थराली तहसील के डुगरी गाँव में अलकनंदा नदी के निकट स्थित है। इसमें कुल **41 आकृतियाँ** हैं — 33 मानव और 8 पशु।

### C. उत्तरकाशी जनपद

**हुडली** का शैल कला स्थल उत्तराखंड के अन्य स्थलों से वास्तुशिल्प की दृष्टि से भिन्न है, यहाँ दुर्लभ **नीले रंग** के शैल चित्र मिले हैं।

*यह अध्याय 1 का एक मुक्त नमूना है। संपूर्ण गाइडबुक हर राजवंश, जनजाति और पुरातात्विक स्थल को परीक्षा के लिए तैयार तालिकाओं के साथ कवर करती है।*`
    },
    2: {
      label: "अध्याय 2 — कत्यूरी राजवंश",
      title: "कत्यूरी वंश एवं गढ़वाल का परमार वंश",
      content: `## कार्तिकेयपुर (कत्यूरी) वंश (700 ईस्वी – 11वीं शताब्दी)

कार्तिकेयपुर वंश, जिसे सामान्यतः कत्यूरी वंश के नाम से जाना जाता है, उत्तराखंड का प्रथम एकीकृत ऐतिहासिक वंश होने का गौरव रखता है।

## 2.1 स्थापना एवं प्रमुख शासक

इस वंश की स्थापना लगभग 700 ईस्वी में बसंत देव ने की थी। शासकों ने *परमभट्टारक महाराजाधिराज परमेश्वर* की शाही उपाधि धारण की, जो क्षेत्र पर सर्वोच्च संप्रभुता के उनके दावे को दर्शाती है।

तीन शासक विशेष रूप से उल्लेखनीय हैं:
- **निम्बर वंश के इष्टगण** — संपूर्ण उत्तराखंड क्षेत्र को एकीकृत करने वाले प्रथम शासक
- **ललितसुर देव** — सबसे शक्तिशाली शासक और प्रचुर निर्माणकर्ता
- **भूदेव** — ब्राह्मणवाद के दृढ़ समर्थक और बैजनाथ मंदिर के निर्माणकर्ता

## 2.2 प्रशासन एवं सैन्य संरचना

### क्षेत्रीय विभाजन

कत्यूरी प्रशासनिक व्यवस्था अत्यंत केंद्रीकृत एवं पदानुक्रमिक थी:
- **भुक्तियाँ** (प्रांत) → प्रबंधक: **उपरिक**
- **विषय** (जनपद) → प्रबंधक: **विषपति**
- **पल्लिकाएँ** (गाँव) → प्रमुख: **महत्तम** या **सयान**

### प्रमुख प्रशासनिक अधिकारी

| अधिकारी | जिम्मेदारी |
|---|---|
| **सौदाभंगाधिकृत** | राजकीय निर्माण परियोजनाओं के मुख्य वास्तुकार |
| **प्रांतपाल** | राज्य सीमाओं का रक्षक |
| **घट्टपाल** | पर्वतीय दर्रों का रक्षक |
| **नरपति** | नदी घाटों का प्रबंधक एवं पार-शुल्क वसूल करने वाला |
| **अक्षपटलिक** | मुख्य लेखा परीक्षक |
| **भोगपति** | कर संग्रहकर्ता |
| **भट्ट और चर** | बेगार (जबरन श्रम) निकलवाने के लिए जिम्मेदार |
| **प्रमावतार** | भूमि माप अधिकारी |

### सैन्य विभाजन

कत्यूरी सेना **चार विभागों** में संगठित थी:
- **गौल्मिक** (पैदल सेना)
- **अश्वबलाधिकृत** (घुड़सवार सेना)
- **हस्तिबलाधिकृत** (गज सेना)
- **उष्ट्रबलाधिकृत** (ऊँट सेना)

## 2.3 स्थापत्य कला — मंदिर निर्माण का चरमोत्कर्ष

कत्यूरी काल उत्तराखंड के स्थापत्य स्वर्ण युग का प्रतिनिधित्व करता है।

**प्रमुख स्थापत्य स्थल:**
- **जागेश्वर:** 100 से अधिक मंदिर (नागर और शिखर दोनों शैलियाँ)
- **द्वाराहाट (गुजर देवल):** शिखर शैली का अतुलनीय उदाहरण
- **कटारमल सूर्य मंदिर:** भारत का दूसरा सबसे बड़ा सूर्य मंदिर
- **बैजनाथ:** मुख्य शिव मंदिर के साथ 17 सहायक मंदिर

*यह अध्याय 2 का एक मुक्त नमूना है। संपूर्ण गाइडबुक प्रशासनिक पदानुक्रमों, सैन्य संरचनाओं, कर प्रणालियों और स्थापत्य उपलब्धियों को विस्तार से कवर करती है।*`
    },
    3: {
      label: "अध्याय 3 — चंद राजवंश एवं गोरखा आक्रमण",
      title: "आंग्ल-गोरखा युद्ध एवं उत्तराखंड की मुक्ति (1814–1815)",
      content: `## गोरखा विजय एवं आंग्ल-गोरखा युद्ध (1814–1815)

### पृष्ठभूमि: गोरखा विस्तार एवं ब्रिटिश प्रतिक्रिया

गोरखा विस्तार पश्चिमी दिशा में बढ़ा जब गोरखा बलों ने 1790 में कुमाऊं और 1803 में गढ़वाल को अनेषित किया। ब्रिटिश गवर्नर-जनरल ने 1814 में गोरखा बलों के विरुद्ध युद्ध की घोषणा की।

## 3.1 खलंगा (नालापानी) का युद्ध, देहरादून

**तारीख:** अक्टूबर 1814  
**महत्व:** आंग्ल-गोरखा युद्ध का सबसे प्रसिद्ध संघर्ष

ब्रिटिश सेना **मेजर जनरल गिलेस्पी** के अधीन देहरादून के **खलंगा किले** पर आक्रमण किया, जिसकी रक्षा **कैप्टन बलभद्र थापा** मात्र **500 गोरखा सैनिकों** के साथ कर रहे थे।

### प्रमुख घटनाएँ:

| घटना | तारीख | महत्व |
|---|---|---|
| गिलेस्पी की मृत्यु | 31 अक्टूबर 1814 | युद्ध में सेनापति की मृत्यु |
| किले पर कब्जा | नवंबर 1814 | ब्रिटिश विजय (जल आपूर्ति काटकर) |
| खलंगा स्मारक निर्माण | बाद में | विजेताओं और पराजितों दोनों को सम्मानित करने के लिए अद्वितीय |

गिलेस्पी 31 अक्टूबर 1814 को युद्ध में मारे गए। अंग्रेज अंततः केवल किले की पेयजल आपूर्ति काटकर ही विजयी हुए।

## 3.2 सुगौली की संधि (1816)

अंग्रेजों और नेपाल के बीच **सुगौली संधि** पर हस्ताक्षर हुए, जिसे नेपाल ने **4 मई 1816** को अनुमोदित किया।

### युद्धोत्तर विभाजन:

| क्षेत्र | परिणाम |
|---|---|
| **पूर्वी गढ़वाल (पौड़ी)** | अंग्रेजों के पास रहा |
| **पश्चिमी गढ़वाल** | टेहरी राज्य के रूप में सुदर्शन शाह को लौटा दिया गया |
| **संपूर्ण कुमाऊं** | ब्रिटिश अनेषण (बाद में कुमाऊं डिवीजन) |

---

## 3.3 तुलनात्मक विश्लेषण: उत्तराखंड के चारों शासक

| मानदंड | कत्यूरी वंश | परमार वंश (गढ़वाल) | चंद वंश (कुमाऊं) | गोरखा शासन |
|---|---|---|---|---|
| **प्रकृति** | प्रथम एकीकृत राजतंत्र | क्षेत्रीय राजतंत्र (गढ़वाल) | क्षेत्रीय राजतंत्र (कुमाऊं) | विदेशी सैन्य अधिग्रहण |
| **क्षेत्र** | एकीकृत उत्तराखंड | गढ़वाल | कुमाऊं | कुमाऊं एवं गढ़वाल दोनों |
| **काल** | 700–11वीं शताब्दी ईस्वी | 688–1804 ईस्वी | ~700–1790 ईस्वी | 1790–1815 |
| **संस्थापक** | बसंत देव | कनकपाल | सोमचंद | नेपाल का राजा |
| **स्वर्ण युग** | स्थापत्य कला (संपूर्ण काल) | फतेह शाह का शासनकाल | जगत चंद का शासनकाल | अंधकार युग |
| **कराधान** | भोगपति के माध्यम से | तिहार (उत्पादन का 1/3) | छतीसी (36 संहिताबद्ध कर) | पुंगड़ी कर (मनमाना, भारी) |
| **न्याय व्यवस्था** | राजा सर्वोच्च | राजा सर्वोच्च + गाँव पंचायत | दो औपचारिक न्यायालय | दिव्य परीक्षाएँ |
| **पतन का कारण** | नेपाली आक्रमण + कमजोर उत्तराधिकारी | प्राकृतिक आपदाएँ + षड्यंत्र + गोरखा आक्रमण | कमजोर शासक + हर्षदेव जोशी का विश्वासघात | ब्रिटिश सैन्य श्रेष्ठता |

*यह अध्याय 3 का एक मुक्त नमूना है। संपूर्ण गाइडबुक सैन्य विश्लेषण, जीवनी खाते और प्रत्येक राजवंश के पतन के रणनीतिक आकलन प्रदान करती है।*`
    }
  }
};

const tableOfContents = [
  { chapter: 1, title: "Prehistoric & Proto-historic Period, Ancient Tribes & Early Political Powers", pages: "1-20" },
  { chapter: 2, title: "Ancient Dynasties — Kartikeypur, Katyuri & Parmar", pages: "21-40" },
  { chapter: 3, title: "Chand Dynasty & Gorkha Invasion", pages: "41-60" },
  { chapter: 4, title: "British Rule in Uttarakhand", pages: "61-80" },
  { chapter: 5, title: "Tehri Princely State", pages: "81-100" },
  { chapter: 6, title: "National Movement & Freedom Fighters", pages: "101-120" },
  { chapter: 7, title: "People's Movements, Social Reformers & Statehood", pages: "121-140" },
  { chapter: 8, title: "Society of Uttarakhand — Family, Marriage, Caste System", pages: "141-160" },
  { chapter: 9, title: "Folk Culture — Songs, Dance, Art, Instruments", pages: "161-180" },
  { chapter: 10, title: "Religious Places, Temples, Fairs & Festivals", pages: "181-200" },
  { chapter: 11, title: "Political System — Governor, CM, Legislature, Parties", pages: "201-220" },
  { chapter: 12, title: "Administrative System — Govt Structure, UKPSC, High Court", pages: "221-240" },
  { chapter: 13, title: "Local Self-Government — Panchayati Raj & Urban Bodies", pages: "241-260" },
  { chapter: 14, title: "Good Governance & Public Policy", pages: "261-280" },
  { chapter: 15, title: "Physical Geography — Part 1 (Structure, Climate, Rivers)", pages: "281-300" },
  { chapter: 16, title: "Physical Geography — Part 2 (Soils, Vegetation, Glaciers)", pages: "301-320" },
  { chapter: 17, title: "Resources & Agriculture", pages: "321-340" },
  { chapter: 18, title: "Industry, Transport & Energy", pages: "341-360" },
  { chapter: 19, title: "Tourism, National Parks & Wildlife", pages: "361-380" },
  { chapter: 20, title: "Population, Migration & Urbanization", pages: "381-400" },
  { chapter: 21, title: "Economy — Features, GSDP, Income Sources", pages: "401-420" },
  { chapter: 22, title: "Industrial Development & MSME", pages: "421-440" },
  { chapter: 23, title: "Infrastructure", pages: "441-460" },
  { chapter: 24, title: "Economic Planning, Budget & Public Finance", pages: "461-480" },
  { chapter: 25, title: "Major Economic Problems & Welfare Programs", pages: "481-500" },
  { chapter: 26, title: "Disaster Management", pages: "501-520" },
  { chapter: 27, title: "Education & Human Resource Development", pages: "521-540" },
  { chapter: 28, title: "Health", pages: "541-560" },
];

function BuyBookContent() {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [showTOC, setShowTOC] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', bookLanguage: 'English',
  });
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ ...form, orderId: newOrderId, amount: 499 }),
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

  const selectedChapterData = selectedChapter && chapterContent[selectedLanguage][selectedChapter as keyof typeof chapterContent.en];

  return (
    <div className="min-h-screen bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900 text-white">
      <CountdownBanner deadline="2026-08-31T23:59:59+05:30" headline="Early-Bird Launch Offer" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Offer Banner */}
        <div className="mb-8 bg-gradient-to-r from-saffron-600 to-saffron-500 rounded-2xl p-6 sm:p-8 border-2 border-saffron-400">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">📕 Decode Uttarakhand</h1>
              <p className="text-xl mb-2">The Complete Guidebook</p>
              <p className="text-saffron-100 mb-4">India's only single-volume guidebook covering all topics for UKPSC PCS, Lower PCS, RO/ARO, and UKSSSC exams.</p>
              <div className="flex items-center gap-4">
                <span className="text-xl line-through">₹599</span>
                <span className="text-4xl font-bold">₹499</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><Truck className="w-5 h-5" /><span>✅ Free Shipping Across India</span></div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><Clock className="w-5 h-5" /><span>✅ Fast Delivery (within a week)</span></div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg"><Zap className="w-5 h-5" /><span>✅ 28 Chapters, 560+ Pages</span></div>
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-graphite-700/50 rounded-full p-1">
            <button onClick={() => { setSelectedLanguage('en'); setSelectedChapter(null); }} className={`px-6 py-2 rounded-full font-semibold ${selectedLanguage === 'en' ? 'bg-saffron-500 text-white' : 'text-graphite-300'}`}>📕 English</button>
            <button onClick={() => { setSelectedLanguage('hi'); setSelectedChapter(null); }} className={`px-6 py-2 rounded-full font-semibold ${selectedLanguage === 'hi' ? 'bg-indigo-500 text-white' : 'text-graphite-300'}`}>📗 हिंदी</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* TABLE OF CONTENTS */}
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><List className="w-5 h-5" />Table of Contents — 28 Chapters</h3>
                <button onClick={() => setShowTOC(!showTOC)} className="bg-saffron-500 hover:bg-saffron-600 px-4 py-2 rounded-lg text-sm font-bold">
                  {showTOC ? 'Hide' : 'View All'}
                </button>
              </div>
              
              {showTOC && (
                <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {tableOfContents.map((ch, i) => (
                    <div key={i} className="bg-graphite-700/30 rounded-lg p-3 text-sm border border-graphite-600">
                      <p className="font-bold text-saffron-400">Ch {ch.chapter}</p>
                      <p className="text-graphite-200">{ch.title}</p>
                      <p className="text-graphite-500 text-xs mt-1">Pages {ch.pages}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WHAT'S INCLUDED */}
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0" /><p className="text-sm">Complete Paper V + Paper VI coverage</p></div>
                <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0" /><p className="text-sm">2026 Edition — Latest syllabus aligned</p></div>
                <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0" /><p className="text-sm">Current Affairs Capsule (up to June 2026)</p></div>
                <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0" /><p className="text-sm">Economic Survey & Budget 2026-27</p></div>
                <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0" /><p className="text-sm">28 Chapters with tables & comparisons</p></div>
                <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-jade-400 flex-shrink-0" /><p className="text-sm">Exam-ready format for Prelims + Mains</p></div>
              </div>
            </div>

            {/* FREE SAMPLE */}
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" />{selectedLanguage === 'en' ? 'Read Free Sample Pages' : 'मुक्त नमूना पृष्ठ पढ़ें'}</h3>
              <p className="text-graphite-300 mb-6">{selectedLanguage === 'en' ? 'See the quality and depth before you buy — real pages from four key sections, in the same table-driven format as the book.' : 'खरीदने से पहले गुणवत्ता और गहराई देखें — चार मुख्य अनुभागों से वास्तविक पृष्ठ, किताब के समान तालिका-संचालित प्रारूप में।'}</p>
              
              <div className="space-y-3">
                {selectedLanguage === 'en' ? (
                  <>
                    <button onClick={() => setSelectedChapter(1)} className="w-full text-left bg-gradient-to-r from-saffron-600/20 to-saffron-500/20 rounded-lg p-4 hover:from-saffron-600/40 hover:to-saffron-500/40 border border-saffron-500/50 transition">
                      <h4 className="font-bold text-saffron-400">✓ Chapter 1 — History: Epigraphy & Inscriptions</h4>
                      <p className="text-graphite-400 text-sm mt-1">Real tables showing rock edicts, copper plates, and numismatics with exam-ready formatting</p>
                    </button>
                    <button onClick={() => setSelectedChapter(2)} className="w-full text-left bg-gradient-to-r from-jade-600/20 to-jade-500/20 rounded-lg p-4 hover:from-jade-600/40 hover:to-jade-500/40 border border-jade-500/50 transition">
                      <h4 className="font-bold text-jade-400">✓ Chapter 2 — Katyuri Dynasty: Administration & Architecture</h4>
                      <p className="text-graphite-400 text-sm mt-1">Administrative hierarchy, military structure, and architectural achievements with detailed tables</p>
                    </button>
                    <button onClick={() => setSelectedChapter(3)} className="w-full text-left bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-lg p-4 hover:from-blue-600/40 hover:to-blue-500/40 border border-blue-500/50 transition">
                      <h4 className="font-bold text-blue-400">✓ Chapter 3 — Chand Dynasty: Gorkha War & Liberation (1814–1815)</h4>
                      <p className="text-graphite-400 text-sm mt-1">Battle of Khalanga, Treaty of Sugauli, and comparative analysis of all four rulers</p>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setSelectedChapter(1)} className="w-full text-left bg-gradient-to-r from-saffron-600/20 to-saffron-500/20 rounded-lg p-4 hover:from-saffron-600/40 hover:to-saffron-500/40 border border-saffron-500/50 transition">
                      <h4 className="font-bold text-saffron-400">✓ अध्याय 1 — इतिहास: प्रागैतिहासिक काल एवं विषय-सूची</h4>
                      <p className="text-graphite-400 text-sm mt-1">शैल चित्रकला, गुफा आश्रय, और पुरातात्विक साक्ष्य परीक्षा-तैयार तालिकाओं के साथ</p>
                    </button>
                    <button onClick={() => setSelectedChapter(2)} className="w-full text-left bg-gradient-to-r from-jade-600/20 to-jade-500/20 rounded-lg p-4 hover:from-jade-600/40 hover:to-jade-500/40 border border-jade-500/50 transition">
                      <h4 className="font-bold text-jade-400">✓ अध्याय 2 — कत्यूरी वंश: प्रशासन एवं सैन्य संरचना</h4>
                      <p className="text-graphite-400 text-sm mt-1">प्रशासनिक पदानुक्रम, सैन्य विभाग, और स्थापत्य कला विस्तृत तालिकाओं के साथ</p>
                    </button>
                    <button onClick={() => setSelectedChapter(3)} className="w-full text-left bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-lg p-4 hover:from-blue-600/40 hover:to-blue-500/40 border border-blue-500/50 transition">
                      <h4 className="font-bold text-blue-400">✓ अध्याय 3 — आंग्ल-गोरखा युद्ध एवं मुक्ति (1814–1815)</h4>
                      <p className="text-graphite-400 text-sm mt-1">खलंगा युद्ध, सुगौली संधि, और चारों शासकों का तुलनात्मक विश्लेषण</p>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="lg:col-span-1">
            <div className="bg-graphite-800/50 rounded-2xl p-8 border border-graphite-700/50 sticky top-24 h-fit">
              <h2 className="text-2xl font-bold mb-6 text-center">Order Now</h2>
              <div className="mb-6 text-center">
                <p className="text-4xl font-bold text-saffron-400">₹499</p>
                <p className="text-graphite-400 text-sm mt-2">Limited early-bird price</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <select name="bookLanguage" value={form.bookLanguage} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm">
                  <option value="English">📕 English Edition</option>
                  <option value="हिंदी">📗 हिंदी संस्करण</option>
                </select>
                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} required rows={2} className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <input type="text" name="pincode" placeholder="PIN" value={form.pincode} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm" />
                <select name="state" value={form.state} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-graphite-700 border border-graphite-600 text-white text-sm">
                  <option value="">Select State</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Other">Other</option>
                </select>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing</> : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN MODAL */}
      {selectedChapter && selectedChapterData && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-graphite-800 w-full sm:max-w-4xl sm:rounded-2xl border border-graphite-700 min-h-screen sm:min-h-auto flex flex-col my-auto">
            {/* HEADER */}
            <div className="sticky top-0 bg-graphite-900 border-b border-graphite-700 px-6 py-4 flex justify-between items-center z-10">
              <div className="flex-1">
                <p className="text-sm text-saffron-400">{selectedChapterData.label}</p>
                <h3 className="text-xl font-bold">{selectedChapterData.title}</h3>
              </div>
              <button onClick={() => setSelectedChapter(null)} className="flex-shrink-0 text-graphite-400 hover:text-white bg-graphite-700 rounded-lg p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* CONTENT - MARKDOWN RENDERED */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-graphite-100 leading-relaxed prose-invert max-w-none prose">
              <div className="space-y-4">
                {selectedChapterData.content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('##')) {
                    return <h2 key={i} className="text-2xl font-bold mt-6 mb-4 text-white">{paragraph.replace(/^#{1,2}\s/, '')}</h2>;
                  } else if (paragraph.startsWith('###')) {
                    return <h3 key={i} className="text-xl font-bold mt-5 mb-3 text-saffron-400">{paragraph.replace(/^###\s/, '')}</h3>;
                  } else if (paragraph.startsWith('|')) {
                    const lines = paragraph.split('\n').filter(line => line.trim());
                    if (lines.length < 2) return null;
                    
                    const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
                    const rows = lines.slice(2).map(line => 
                      line.split('|').map(cell => cell.trim()).filter(Boolean)
                    );
                    
                    return (
                      <div key={i} className="overflow-x-auto my-4">
                        <table className="w-full border-collapse border border-graphite-600">
                          <thead>
                            <tr className="bg-graphite-700">
                              {headers.map((h, j) => (
                                <th key={j} className="border border-graphite-600 px-3 py-2 text-left font-bold text-saffron-300">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, j) => (
                              <tr key={j} className={j % 2 === 0 ? 'bg-graphite-800' : 'bg-graphite-700/50'}>
                                {row.map((cell, k) => (
                                  <td key={k} className="border border-graphite-600 px-3 py-2 text-sm">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  } else if (paragraph.startsWith('- ')) {
                    return <li key={i} className="ml-6 mb-2">{paragraph.replace(/^-\s/, '')}</li>;
                  } else if (paragraph.startsWith('*')) {
                    return <em key={i} className="block italic text-graphite-400 mt-4">{paragraph.replace(/\*/g, '')}</em>;
                  } else if (paragraph.trim()) {
                    return <p key={i} className="text-graphite-200 leading-relaxed">{paragraph}</p>;
                  }
                  return null;
                })}
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
