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

  // Chapter content with INDEX FIRST and EXACT content
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
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 2: The Katyuri Dynasty</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">2.1 FOUNDATION & KEY RULERS</h3>
              <p class="mb-3">The Kartikeyapur Dynasty, commonly known as the Katyuri Dynasty, holds the distinction of being the first unified historical dynasty of Uttarakhand. Their reign is widely regarded as the Golden Age of the region's architecture and sculpture.</p>
              <p class="mb-3">The dynasty was founded by <strong>Basant Dev around 700 CE</strong>. The rulers adopted the imperial title of <em>Paramabhattaraka Maharajadhiraja Parameshwar</em>, reflecting their claim to supreme sovereignty over the region. Their first capital was established at <strong>Joshimath</strong> in Chamoli district, which was later shifted to <strong>Vaidhnath-Kartikeyapur</strong> in the Katyur Valley near Baijnath by Subhikshraj Dev.</p>
              
              <h4 class="font-bold text-white mt-4 mb-2">Three Key Rulers:</h4>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Ishtagan</strong> - Of the Nimbar Dynasty; first to unite entire Uttarakhand region; Shaivite ruler and true unifier</li>
                <li><strong>Lalitsur Dev</strong> - Most powerful ruler and prolific builder; described as Varaha (boar) incarnation who uplifted the earth</li>
                <li><strong>Bhudev</strong> - Staunch supporter of Brahmanism; major contributor to Baijnath temple</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">2.2 ADMINISTRATION & MILITARY STRUCTURE</h3>
              
              <h4 class="font-bold text-white mt-4 mb-2">Territorial Division</h4>
              <p class="mb-3">Highly centralized and hierarchical system:</p>
              <ul class="list-disc list-inside space-y-2 mb-4">
                <li><strong>Bhuktis</strong> (Provinces) - headed by Uparika</li>
                <li><strong>Vishs</strong> (Districts) - managed by Vishpati</li>
                <li><strong>Pallikas</strong> (Villages) - headed by Mahattam or Sayan</li>
              </ul>

              <h4 class="font-bold text-white mt-4 mb-2">Key Administrative Officials</h4>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <thead>
                  <tr class="bg-slate-700">
                    <th class="border border-slate-600 px-3 py-2 text-left">Official</th>
                    <th class="border border-slate-600 px-3 py-2 text-left">Responsibility</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Saudabhangadhikrit</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Chief Architect for state construction</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Prantpal</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Protector of state borders</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Ghattapal</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Protector of mountain passes</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Narapati</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Manager of river ghats & taxes</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Akshapatlik</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Chief Auditor</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Bhogpati</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Tax Collector</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Pramavatar</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Land Measurement Officer</td>
                  </tr>
                </tbody>
              </table>

              <h4 class="font-bold text-white mt-4 mb-2">Military Divisions (4 Corps)</h4>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <thead>
                  <tr class="bg-slate-700">
                    <th class="border border-slate-600 px-3 py-2 text-left">Corps</th>
                    <th class="border border-slate-600 px-3 py-2 text-left">Commander</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Infantry</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Gaulmika</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Cavalry</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Ashvabaladhikrit</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Elephant Corps</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Hastibaladhikrit</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Camel Corps</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Ushtrabaladhikrit</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">2.3 ECONOMY & TAXATION</h3>
              <p class="mb-3">Agriculture, minerals, and forests were primary revenue sources. Land measurements: <strong>Dronavapam, Nali Vapam, Kulyavap (8 Dron), Kharivap (20 Dron)</strong></p>
              <p>System of <strong>Vishnupriti, Goonth, Agrahar</strong> — tax-free lands to Brahmins/temples, forming the foundation of temple economy in ancient Uttarakhand.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">2.4 SOCIETY, CULTURE & RELIGION</h3>
              <p><strong>Sanskrit</strong> as court language; common people spoke <strong>Prakrit/Pali</strong>. Most significant: arrival of <strong>Adi Guru Shankaracharya</strong> who established Jyotirmath (Badrikashram). Renounced body at Kedarnath in <strong>820 CE</strong>.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">2.5 ARCHITECTURE — GOLDEN AGE</h3>
              <p class="mb-3"><strong>Two Styles:</strong></p>
              <ul class="list-disc list-inside space-y-2 mb-3">
                <li><strong>Chhatra-Type (Pagoda)</strong> - Wooden umbrella roof (Kedarnath, Lakhamandal, Bageshwar)</li>
                <li><strong>Shikhara-Type</strong> - Stone structures without umbrellas (Dwarahat, Katarmal)</li>
              </ul>
              <p><strong>Key Sites:</strong> Jageshwar (100+ temples) | Dwarahat (Shikhara masterpiece) | Katarmal Sun Temple (2nd largest in India) | Baijnath (Shiva shrine + 17 subsidiary shrines)</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">2.6 DECLINE & FRAGMENTATION</h3>
              <p class="mb-3">Weak successors + <strong>1191 CE: King Ashokchalla invaded | 1223 CE: King Krachaldeva subjugated</strong> Katyuri territories. Last ruler <strong>Brahmadev (Veerdev)</strong> — highly tyrannical. Rising Chand Dynasty ended Katyuri supremacy.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">2.7 COPPER PLATE EVIDENCE</h3>
              <p><strong>Pandukeshwar</strong> (Lalit Sur Dev's grants) | <strong>Bageshwar</strong> (8 Katyuri kings) | <strong>Kandara</strong> (Admin records) | <strong>Champawat</strong> (Kumaon presence)</p>
            </div>
          </div>
        `,
      },
      '3': {
        label: 'Chapter 3',
        title: 'Anglo-Gorkha War & Liberation (1814-1815)',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 3: Anglo-Gorkha War 1814-1815</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">Battle of Nalapani (Khalanga Fort)</h3>
              <p class="mb-3">Most celebrated engagement at Khalanga Fort, Dehradun. British forces under <strong>Major General Gillespie</strong> vs Captain <strong>Balbhadra Thapa</strong> with 500 Gorkhas.</p>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Oct 31, 1814</strong> - Gillespie killed in battle</li>
                <li>British prevailed by cutting water supply</li>
                <li><strong>Khalanga War Memorial</strong> - honors both victors and vanquished (unique in military history)</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">Treaty of Sugauli (1816)</h3>
              <p class="mb-3">Signed and ratified by Nepal on <strong>May 4, 1816</strong>. Formally ended conflict and liberated Uttarakhand from Gorkha rule.</p>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <thead>
                  <tr class="bg-slate-700">
                    <th class="border border-slate-600 px-3 py-2 text-left">Territory</th>
                    <th class="border border-slate-600 px-3 py-2 text-left">Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2">Eastern Garhwal (Pauri)</td>
                    <td class="border border-slate-600 px-3 py-2">British retained</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2">Western Garhwal</td>
                    <td class="border border-slate-600 px-3 py-2">Sudarshan Shah (Tehri State)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">Strategic Impact</h3>
              <p>Fundamental alteration of region's political landscape. Uttarakhand entered British Indian Empire. 132 years of British colonial administration (1815-1947) followed.</p>
            </div>
          </div>
        `,
      },
      '4': {
        label: 'Chapter 4',
        title: 'British Rule in Uttarakhand (1815-1947)',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 4: British Rule (1815-1947)</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">4.1 ARRIVAL & TERRITORIAL DIVISION</h3>
              <p class="mb-3">Following Treaty of Sugauli (1815), British East India Company took control. Territory divided:</p>
              <ul class="list-disc list-inside space-y-2 mb-3">
                <li><strong>East of Alaknanda</strong> - British Kumaon & Garhwal (Kumaon Commissionerate)</li>
                <li><strong>West of Alaknanda</strong> - Tehri Riyasat (Princely State under Parmar King Sudarshan Shah)</li>
              </ul>
              <p><strong>1815-1857:</strong> Subdued governance, peace, and dynamism—stark contrast to brutal Gorkha era. Population perceived British as liberal and reformist.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">4.2 MAJOR BRITISH COMMISSIONERS</h3>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <thead>
                  <tr class="bg-slate-700">
                    <th class="border border-slate-600 px-3 py-2 text-left">Commissioner</th>
                    <th class="border border-slate-600 px-3 py-2 text-left">Period</th>
                    <th class="border border-slate-600 px-3 py-2 text-left">Key Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Edward Gardner</strong></td>
                    <td class="border border-slate-600 px-3 py-2">1815-1816</td>
                    <td class="border border-slate-600 px-3 py-2">First land settlement; postal service Almora-Srinagar</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>G.W. Traill</strong></td>
                    <td class="border border-slate-600 px-3 py-2">1816-1835</td>
                    <td class="border border-slate-600 px-3 py-2">9 Patwari posts (1819); Double Lock (1824); Mule Army (1822); Assi Sala Settlement (1823)</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>J.H. Batten</strong></td>
                    <td class="border border-slate-600 px-3 py-2">1848-1856</td>
                    <td class="border border-slate-600 px-3 py-2">Shifted HQ to Nainital (1855); Upper Ganges Canal (1854)</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Sir Henry Ramsay</strong></td>
                    <td class="border border-slate-600 px-3 py-2">1856-1884</td>
                    <td class="border border-slate-600 px-3 py-2">Codified Revenue Police (1874); abolished contractors (1858); Ramsay School (1871)</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>K.L. Mehta</strong></td>
                    <td class="border border-slate-600 px-3 py-2">1947-1948</td>
                    <td class="border border-slate-600 px-3 py-2">First & only Indian Commissioner</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">4.3 G.W. TRAILL — ARCHITECT OF BRITISH RULE</h3>
              <p class="mb-3">Built administrative DNA of British Uttarakhand. Judicial policy: <strong>"Na Vakeel, Na Daleel, Na Appeal"</strong> (No lawyer, no argument, no appeal).</p>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>1819:</strong> Created Revenue Police (9 Patwari posts)</li>
                <li><strong>1822:</strong> Mule Army (Khachchar Sena) to address Coolie Begar</li>
                <li><strong>1823:</strong> Assi Sala Settlement (precise boundary demarcation)</li>
                <li><strong>1824:</strong> Double Lock System (Collector + Treasurer keys)</li>
                <li><strong>1826:</strong> Thapla Land Reservation; banned Sal felling (first govt forests)</li>
                <li><strong>1816:</strong> Postal service; Almora & Pauri Jails</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">4.7 BRITISH FOREST MANAGEMENT — 4 PHASES</h3>
              
              <h4 class="font-bold text-white mt-3 mb-2">PHASE 1: Exploitation (1815-1858)</h4>
              <p><strong>1818:</strong> Shivalik/Bhabar forests leased via Kath-Bamboo Mahals. <strong>1853+:</strong> Railway boom demands sleepers. <strong>1855-1861:</strong> 'Pahari Wilson' ruthlessly felled forests. Peak destruction period.</p>

              <h4 class="font-bold text-white mt-3 mb-2">PHASE 2: Scientific Management (1858-1911)</h4>
              <p><strong>1858:</strong> Ramsay abolished contractor system. <strong>1864:</strong> Forest Dept created under Dietrich Brandis. <strong>1865:</strong> First Forest Act. <strong>1878:</strong> Forest School (Dehradun). <strong>1893:</strong> Benap Notification (unmeasured land = protected forests). <strong>1894:</strong> First Forest Policy (hunting/fishing illegal). <strong>1906:</strong> Imperial Forest Research Institute.</p>

              <h4 class="font-bold text-white mt-3 mb-2">PHASE 3: Forest Rebellions (1904-1930)</h4>
              <p><strong>1904-1906:</strong> Khas Patti Movement (Chandrabadni temple forests). <strong>1921:</strong> Widespread protest fires in reserved forests. <strong>Durga Devi</strong> (first woman arrested, burned Thakalodi). <strong>May 30, 1930: Tiladi (Rawain) Massacre</strong> — "Jallianwala Bagh of Uttarakhand" — Diwan Chakradhar Juyal ordered firing on unarmed farmers. Now observed as Martyr's Day.</p>

              <h4 class="font-bold text-white mt-3 mb-2">PHASE 4: Forest Panchayats (1921-1931)</h4>
              <p><strong>April 13, 1921:</strong> Forest Grievances Committee under Percy Wyndham acknowledged villagers' suffering. Recommended returning rights, lifting bans on bamboo/grazing, forest rights up to half mile from villages.</p>
            </div>
          </div>
        `,
      },
      '27': {
        label: 'Chapter 27',
        title: 'Education Reforms & Human Resources Development',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 27: Education & HRD</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">Three Phases Development</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Phase 1 (2000-2013):</strong> Access & Enrollment</li>
                <li><strong>Phase 2 (2013-2020):</strong> Quality & Governance</li>
                <li><strong>Phase 3 (2020-Present):</strong> Outcomes & Employability</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">School Statistics</h3>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <tr class="bg-slate-700">
                  <th class="border border-slate-600 px-3 py-2 text-left">Category</th>
                  <th class="border border-slate-600 px-3 py-2">Primary</th>
                  <th class="border border-slate-600 px-3 py-2">Secondary</th>
                  <th class="border border-slate-600 px-3 py-2">Higher Sec</th>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-3 py-2">Government</td>
                  <td class="border border-slate-600 px-3 py-2">8,450</td>
                  <td class="border border-slate-600 px-3 py-2">3,280</td>
                  <td class="border border-slate-600 px-3 py-2">1,540</td>
                </tr>
                <tr class="bg-slate-700/50">
                  <td class="border border-slate-600 px-3 py-2">Private</td>
                  <td class="border border-slate-600 px-3 py-2">2,120</td>
                  <td class="border border-slate-600 px-3 py-2">1,450</td>
                  <td class="border border-slate-600 px-3 py-2">890</td>
                </tr>
              </table>
              <p><strong>Literacy: 78.82% | Gender Parity: 0.98</strong></p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">Key Initiatives</h3>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Samagra Shiksha</strong> - Universal education quality</li>
                <li><strong>Digital Literacy</strong> - Technology in rural areas</li>
                <li><strong>Skill Uttarakhand</strong> - Vocational training (18-35 years)</li>
                <li><strong>Higher Education</strong> - University support & scholarships</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">NEP 2020 Implementation</h3>
              <ul class="list-disc list-inside space-y-2">
                <li>Multidisciplinary education approach</li>
                <li>Indian languages (Sanskrit, Hindi)</li>
                <li>Critical thinking & analysis skills</li>
                <li>Vocational training integration</li>
                <li>Teacher professional development</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">SANTULAN Model & VIGYAN Framework</h3>
              <p>Convertings "Geography-led problems into Technology-led solutions" with Value-based, Innovation-driven, Governance-first, Youth-centric, Accountability, Nature-smart approaches.</p>
              <p class="mt-3"><strong>Target: Transform "migration force" into "Himalayan growth force" for Viksit Bharat @ 2047</strong></p>
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

        {/* Main Content - CHAPTERS ON TOP, FORM ON BOTTOM */}
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

          {/* RIGHT: CHAPTERS ON TOP, FORM ON BOTTOM */}
          <div className="lg:col-span-2 space-y-6">
            {/* CHAPTER PREVIEW - TOP */}
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
            ) : (
              <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
                <ChevronDown size={48} className="mx-auto opacity-50 mb-4 text-slate-400" />
                <p className="text-slate-300 text-lg">
                  {selectedLanguage === 'en'
                    ? 'Select a chapter from the left to view sample'
                    : 'नमूना देखने के लिए बाईं ओर से कोई अध्याय चुनें'}
                </p>
              </div>
            )}

            {/* FORM - BOTTOM */}
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
