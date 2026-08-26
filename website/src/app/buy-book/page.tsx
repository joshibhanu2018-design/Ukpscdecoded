'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, ShieldCheck, Loader2, Clock, Truck, Zap, CheckCircle2, X, List } from 'lucide-react';
import CountdownBanner from '@/components/CountdownBanner';

// YOUR EXACT CONTENT - NOT PLACEHOLDER
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
    21: {
      label: "Chapter 21 — Economy",
      title: "The Uttarakhand Economic Model",
      content: `## The Uttarakhand Economic Model

Since its formation on 9 November 2000, Uttarakhand's economy has undergone a **26-fold transformation** — from a subsistence "Money Order Economy" to a diversified Himalayan growth model driven by manufacturing, tourism and services.

### Key Characteristics

1. **Service-sector dominance**: over 50% of GSDP from the tertiary sector.
2. **Manufacturing corridor**: concentrated in the Haridwar–US Nagar–Dehradun (SIDCUL) belt.
3. **Primary-sector crisis**: agriculture is under 10% of GSDP but employs ~58% of the rural workforce.
4. **Per capita income**: consistently above the national average.
5. **Environmental innovation**: First state globally to index Gross Environmental Product (GEP).

### GSDP at Current Prices

| Year | GSDP (₹ Thousand Crore) | Growth (%) |
|---|---|---|
| 2000-01 | ~14.79 | — |
| 2021-22 | 254.00 | 8.19% |
| 2023-24 | 346.20 | 7.58% |
| 2025-26 (Projected) | 381.89 | 7.23% |

### Per Capita Income (PCI)

| Year | Uttarakhand PCI (₹) | National PCI (₹) |
|---|---|---|
| 2023-24 | 2,60,201 | — |
| 2025-26 (Est.) | 2,73,921 | 2,19,575 |

### Sectoral Contribution to GSDP (2025-26)

| Sector | Contribution (%) | Growth (%) |
|---|---|---|
| Primary | 9.59% | 2.06% |
| Secondary | 39.95% | 7.98% |
| Tertiary | 50.46% | 11.11% |

*This is a free sample from Chapter 21. The full book covers the budget, SANTULAN / GYAN frameworks, reforms and schemes.*`
    },
    16: {
      label: "Geography — Natural Vegetation",
      title: "Natural Vegetation — Altitudinal Zonation",
      content: `## Geography: Natural Vegetation — Altitudinal Zonation

Uttarakhand's forests change with altitude, forming five distinct zones from the tropical foothills to the alpine meadows.

### Five Altitude Zones

| Zone | Altitude | Forest Type | Key Species |
|---|---|---|---|
| Tropical | Below 1,000m | Moist/Dry Deciduous (Terai-Bhabar) | Sal (dominant), Khair, Shisham, Haldu, Bamboo |
| Subtropical | 1,000–2,000m | Coniferous (Pine forests) | Chir Pine (Pinus roxburghii) — near-total dominance |
| Temperate | 2,000–3,000m | Moist Evergreen + Coniferous | Banj/Moru/Kharsu Oak, Deodar, Buransh, Cypress |
| Sub-Alpine | 3,000–3,600m | High-level forests | Birch (Bhojpatra), Silver Fir, Juniper, Willow |
| Alpine | Above 3,600m | Tundra → Perpetual ice | Bugyals: grasses, mosses, lichens, Blue Poppy, Brahma Kamal |

Vegetation ceases entirely in the perpetually frozen zone above 4,800 m.

### ISFR 2023 (18th Report) — Key Data

Total forest cover is **24,303.83 sq. km — 45.44%** of the state's area. Very Dense Forest rose by 211.57 sq. km, while Moderately Dense Forest fell by 250.42 sq. km — a "hollowing out" of the middle canopy.

### Species Dominance (ISFR 2023)

| Rank | By Volume (%) | By Number (RFA) |
|---|---|---|
| 1st | Chir Pine (28.72%) | Chir Pine (1,93,883) |
| 2nd | Sal (18.71%) | Banj Oak (1,57,597) |
| 3rd | Banj Oak (8.29%) | Sal (90,283) |

*This is a free sample from the Geography section (Chapter 16). The full book also covers soils, glaciers, lakes and climate change — plus the Pirul Paradox and fire vulnerability.*`
    },
    27: {
      label: "Chapter 27 - Education",
      title: "Issues in Education Sector",
      content: `## Education System Problems and Challenges

The "Himalayan distance penalty" and mass out-migration (Palayan) have created deep structural bottlenecks that make Uttarakhand's education challenges fundamentally different from plain-area states.

### Master Problem Table

| Problem | Nature | Scale / Data |
|---|---|---|
| Ghost Teachers | Teachers appointed to remote schools live in plains; sub-let duties to unqualified locals | Severe governance failure; "No work-No pay" policy introduced |
| Single-Digit Enrollments | Mass migration emptied hill primary schools | 826+ schools permanently closed over 5 years; 2,655 schools run on single teacher |
| Single Teacher Schools | Critical shortage of educators in remote areas | 2,655 primary schools; 28,000+ students pedagogically vulnerable |
| Stalled School Mergers | "Cluster Schools" policy announced but infrastructure within 5-10 km stalled | Terrain difficulties and administrative delays |
| Human-Wildlife Conflict | Wildlife attacks disrupt children's schooling in rural areas | Critical need for transport support and closer schooling |
| Topographical Accessibility | Plain-area population thresholds fail to account for "distance penalty" | Strong demand for hill-specific norms |
| Contractualization | Increasing contractual teachers and Class IV workers | Impacts job security and institutional stability |
| RTE Implementation Gaps | Delayed payments, "neighborhood tracking" difficulties in sparse habitations | Private schools face long delays in per-child reimbursements |
| Infrastructure Deficits | Many schools lack safe drinking water, functional girls' toilets, boundary walls | "PEVD Paradox" (Planning-Execution-Verification-Delivery failure) |
| Learning Poverty | Rote-based curriculum; students not trained in local value chains | Despite high literacy, employability remains low |
| Emerging Social Threats | Rising drug/alcohol usage among youth | Threatens to derail demographic dividend |
| Budget Surrenders | Departments return unspent allocations while infrastructure gaps persist | ₹2,366 crore returned by departments |

### The "Ghost Teacher" Phenomenon

The "Ghost Teacher" phenomenon involves teachers appointed to remote hill schools who live in the plains and sub-let their duties to unqualified locals for a fraction of their salary, severely compromising education quality in remote areas. Tech-driven reforms now require geo-fenced, biometric attendance via the Apni Sarkar portal, with salary linked to physical presence at school coordinates. The "No work-No pay" policy makes salary strictly conditional on verified attendance.

*This is a free sample from Chapter 27. The full book covers all education challenges, HRD initiatives, and strategic reforms.*`
    }
  }
};

const tableOfContents = [
  { chapter: 1, title: "Prehistoric & Proto-historic Period, Ancient Tribes & Early Political Powers", pages: "1-20" },
  { chapter: 2, title: "Ancient Dynasties — Kartikeyapur, Katyuri & Parmar", pages: "21-40" },
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

  const selectedChapterData = selectedChapter && chapterContent.en[selectedChapter as keyof typeof chapterContent.en];

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
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" />Read Free Sample Pages</h3>
              <p className="text-graphite-300 mb-6">See the quality and depth before you buy — real pages from four key sections, in the same table-driven format as the book.</p>
              
              <div className="space-y-3">
                <button onClick={() => setSelectedChapter(1)} className="w-full text-left bg-gradient-to-r from-saffron-600/20 to-saffron-500/20 rounded-lg p-4 hover:from-saffron-600/40 hover:to-saffron-500/40 border border-saffron-500/50 transition">
                  <h4 className="font-bold text-saffron-400">✓ Chapter 1 — History: Epigraphy & Inscriptions</h4>
                  <p className="text-graphite-400 text-sm mt-1">Real tables showing rock edicts, copper plates, and numismatics with exam-ready formatting</p>
                </button>

                <button onClick={() => setSelectedChapter(21)} className="w-full text-left bg-gradient-to-r from-jade-600/20 to-jade-500/20 rounded-lg p-4 hover:from-jade-600/40 hover:to-jade-500/40 border border-jade-500/50 transition">
                  <h4 className="font-bold text-jade-400">✓ Chapter 21 — Economy: The Uttarakhand Economic Model</h4>
                  <p className="text-graphite-400 text-sm mt-1">GSDP tables, per capita income comparisons, sectoral contributions with growth rates</p>
                </button>

                <button onClick={() => setSelectedChapter(16)} className="w-full text-left bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-lg p-4 hover:from-blue-600/40 hover:to-blue-500/40 border border-blue-500/50 transition">
                  <h4 className="font-bold text-blue-400">✓ Chapter 16 — Geography: Natural Vegetation & Altitudinal Zonation</h4>
                  <p className="text-graphite-400 text-sm mt-1">Forest zones, ISFR data, species dominance with altitude tables</p>
                </button>

                <button onClick={() => setSelectedChapter(27)} className="w-full text-left bg-gradient-to-r from-purple-600/20 to-purple-500/20 rounded-lg p-4 hover:from-purple-600/40 hover:to-purple-500/40 border border-purple-500/50 transition">
                  <h4 className="font-bold text-purple-400">✓ Chapter 27 — Education: Issues in Education Sector</h4>
                  <p className="text-graphite-400 text-sm mt-1">Master problem table with scale/data, ghost teacher phenomenon analysis</p>
                </button>
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

      {/* FULLSCREEN MODAL - PROPERLY FORMATTED */}
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
                    // Render table
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
                  } else if (paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.') || paragraph.startsWith('5.')) {
                    // List item
                    return <li key={i} className="ml-6 mb-2">{paragraph.replace(/^[0-9]+\.\s/, '')}</li>;
                  } else if (paragraph.startsWith('*')) {
                    return <em key={i} className="block italic text-graphite-400 mt-4">{paragraph.replace(/\*/g, '')}</em>;
                  } else {
                    return <p key={i} className="text-graphite-200 leading-relaxed">{paragraph}</p>;
                  }
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
