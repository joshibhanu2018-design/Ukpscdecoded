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
  const [error, setError] = useState<string | null>(null);

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
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 2: The Katyuri Dynasty & Parmar Dynasty of Garhwal</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">PART A: THE KARTIKEYAPUR (KATYURI) DYNASTY (700 CE – 11th Century)</h3>
              <p>The Kartikeyapur Dynasty, commonly known as the Katyuri Dynasty, holds the distinction of being the first unified historical dynasty of Uttarakhand. Their reign is widely regarded as the Golden Age of the region's architecture and sculpture.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">2.1 FOUNDATION & KEY RULERS</h3>
              <p class="mb-3">The dynasty was founded by Basant Dev around 700 CE. The rulers adopted the imperial title of <em>Paramabhattaraka Maharajadhiraja Parameshwar</em>, reflecting their claim to supreme sovereignty over the region. Their first capital was established at Joshimath in Chamoli district, which was later shifted to Vaidhnath-Kartikeyapur in the Katyur Valley near Baijnath by Subhikshraj Dev.</p>
              <p><strong>Three Key Rulers:</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li><strong>Ishtagan</strong> - First to unite entire Uttarakhand region</li>
                <li><strong>Lalitsur Dev</strong> - Most powerful; prolific builder with maximum copper plate inscriptions</li>
                <li><strong>Bhudev</strong> - Staunch Brahmanist; major contributor to Baijnath temple construction</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">2.2 ADMINISTRATION & MILITARY STRUCTURE</h3>
              <p class="mb-2"><strong>Territorial Division</strong></p>
              <p class="mb-3">The Katyuri administrative system was highly centralized and hierarchical. At the apex stood the King, beneath whom the territory was divided into Bhuktis (provinces) headed by an Uparika. Each Bhukti was subdivided into Vishs (districts) managed by a Vishpati, which in turn contained Pallikas (villages) headed by a Mahattam or Sayan.</p>
              
              <p class="mb-2"><strong>Key Administrative Officials</strong></p>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <thead>
                  <tr class="bg-slate-700">
                    <th class="border border-slate-600 px-3 py-2 text-left">Official</th>
                    <th class="border border-slate-600 px-3 py-2 text-left">Responsibility</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2">Saudabhangadhikrit</td>
                    <td class="border border-slate-600 px-3 py-2">Chief Architect for royal construction</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2">Prantpal</td>
                    <td class="border border-slate-600 px-3 py-2">Defender of kingdom borders</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2">Ghattpal</td>
                    <td class="border border-slate-600 px-3 py-2">Guardian of mountain passes</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2">Narapati</td>
                    <td class="border border-slate-600 px-3 py-2">Manager of river crossings & toll collection</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2">Akshapatlik</td>
                    <td class="border border-slate-600 px-3 py-2">Chief Auditor & Accountant</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2">Bhogpati</td>
                    <td class="border border-slate-600 px-3 py-2">Tax Collector</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2">Pramavatar</td>
                    <td class="border border-slate-600 px-3 py-2">Land Measurement Officer</td>
                  </tr>
                </tbody>
              </table>

              <p class="mb-2"><strong>Military Divisions</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li><strong>Paidal Sena</strong> (Infantry) - led by Gaulmika</li>
                <li><strong>Ashvabal</strong> (Cavalry) - commanded by Ashvabaladhikrit</li>
                <li><strong>Hastibal</strong> (Elephant Corps) - led by Hastibaladhikrit</li>
                <li><strong>Ushtrabal</strong> (Camel Corps) - under Ushtrabaladhikrit</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">2.3 ECONOMY & TAXATION</h3>
              <p>Agriculture, minerals, and forests constituted the primary revenue sources of the Katyuri state. Land measurement followed a standardized system in which the basic units were the Dronavapam and Nali Vapam. Larger measurements included the Kulyavap (equivalent to 8 Dron) and the Kharivap (equivalent to 20 Dron).</p>
              <p class="mt-3">The dynasty maintained a system of land grants known as Vishnupriti, Goonth, or Agrahar – tax-free lands donated to Brahmins or temples. This Goonth land grant system formed the foundation of the temple economy in ancient Uttarakhand and enabled the construction and maintenance of the region's remarkable sacred architecture.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">2.4 SOCIETY, CULTURE & RELIGION</h3>
              <p>Sanskrit served as the court language, while the common people spoke Prakrit or Pali (Lokbhasha). The most significant religious event of this period was the arrival of Adi Guru Shankaracharya, who established Jyotirmath (Badrikashram) as part of his mission to re-establish Hinduism across the subcontinent. Shankaracharya is believed to have renounced his body at Kedarnath in 820 CE.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">2.5 ARCHITECTURE – THE ZENITH OF TEMPLE CONSTRUCTION</h3>
              <p class="mb-3">The Katyuri period represents the architectural Golden Age of Uttarakhand, heavily influenced by the Nagara style of North Indian temple architecture. Two distinct styles emerged during this era.</p>
              <p class="mb-3"><strong>Two Distinct Styles:</strong></p>
              <ul class="list-disc list-inside space-y-2">
                <li><strong>Chhatra-Type (Pagoda)</strong> - Featured wooden umbrella roof; predominantly wood-based. Examples: Kedarnath Temple, Lakhamandal, Bageshwar temples</li>
                <li><strong>Shikhara-Type</strong> - Square, stone-built structures without wooden umbrellas. Examples: Dwarahat Group (Gujar Deval), Katarmal Sun Temple</li>
              </ul>
              <p class="mt-3"><strong>Key Architectural Sites:</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li><strong>Jageshwar</strong> - Over 100 temples showcasing Nagara and Shikara styles</li>
                <li><strong>Dwarahat (Gujar Deval)</strong> - Incomparable example of Shikhara style</li>
                <li><strong>Katarmal Sun Temple</strong> - Second largest Sun Temple in India</li>
                <li><strong>Baijnath</strong> - Main Shiva shrine + 17 subsidiary shrines</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">2.6 DECLINE & FRAGMENTATION</h3>
              <p>The decline of the Katyuri Dynasty was driven by multiple factors. Weak successors allowed internal administrative decay to set in. Two devastating Nepalese invasions accelerated the collapse: King Ashokchalla attacked in 1191 CE, and King Krachaldeva subjugated Katyuri territories in 1223 CE. The dynasty eventually fractured into multiple branches, including the Rajwars of Askot and the Mallas of Doti. The last ruler, Brahmadev (also known as Veerdev), was highly tyrannical and oppressive – according to the folk ballad <em>Jiyarani</em>, his misrule was the primary internal cause of the dynasty's collapse. The rising Chand Dynasty eventually ended Katyuri supremacy entirely.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">2.7 COPPER PLATE EVIDENCE</h3>
              <p>Copper plate inscriptions discovered at various locations provide crucial historical evidence of the Katyuri Dynasty. Plates found at Pandukeshwar document Lalit Sur Dev's rule and land grants. Those at Bageshwar, issued by King Bhudev, name eight Katyuri kings. Additional plates from Kandara provide administrative evidence, while those found at Champawat confirm the dynasty's presence in Kumaon.</p>
            </div>
          </div>
        `,
      },
      '3': {
        label: 'Chapter 3',
        title: 'Gorkha Rule & Anglo-Gorkha War (1790-1815)',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 3: Gorkha Rule & Anglo-Gorkha War</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">3.11 THE OPPRESSIVE TAXATION SYSTEM</h3>
              <p class="mb-3">The Gorkha taxation regime was characterized by arbitrary, event-based taxes that affected every aspect of life:</p>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <thead>
                  <tr class="bg-slate-700">
                    <th class="border border-slate-600 px-3 py-2 text-left">Tax Name</th>
                    <th class="border border-slate-600 px-3 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Pungdi Kar</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Primary land tax</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Kushahi Kar</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Specific tax on Brahmins for land acquisition</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Manga Kar</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Tax collected during wartime</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Tika Bhent Kar</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Levied on marriages and auspicious occasions</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Mijhari Kar</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Levied on Jagaris and Brahmins</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Maro Kar</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Tax on person who died without leaving a son</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Timari Kar</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Direct tax to Gorkha Faujdars & Subedars</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Sonya Phagun Kar</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Tax levied during festivals</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Rakhiya</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Tax during religious ceremonies</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">3.12 SOCIAL & CULTURAL IMPACT OF GORKHA RULE</h3>
              <p class="mb-3">Gorkha tyranny was so severe that when British took control in 1815, their administration appeared "liberal and reformist" in comparison. The traumatized population welcomed British rule without immediate mass resistance.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">3.13 THE ANGLO-GORKHA WAR & LIBERATION (1814–1815)</h3>
              <p class="mb-3"><strong>The Battle of Nalapani (Khalanga Fort):</strong> Most celebrated engagement where British forces under Major General Gillespie assaulted the fort defended by Captain Balbhadra Thapa with 500 Gorkhas. Gillespie was killed on October 31, 1814. British prevailed by cutting water supply.</p>
              <p><strong>Treaty of Sugauli:</strong> Signed between British and Nepal, ratified May 4, 1816. Formally ended conflict and liberated Uttarakhand from Gorkha rule.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">3.14 MASTER COMPARATIVE TABLE: ALL FOUR RULERS</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-xs border border-slate-600">
                  <thead>
                    <tr class="bg-slate-700">
                      <th class="border border-slate-600 px-2 py-2 text-left">Parameter</th>
                      <th class="border border-slate-600 px-2 py-2 text-left">Katyuri</th>
                      <th class="border border-slate-600 px-2 py-2 text-left">Parmar</th>
                      <th class="border border-slate-600 px-2 py-2 text-left">Chand</th>
                      <th class="border border-slate-600 px-2 py-2 text-left">Gorkha</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border border-slate-600 px-2 py-2"><strong>Nature</strong></td>
                      <td class="border border-slate-600 px-2 py-2">First unified monarchy</td>
                      <td class="border border-slate-600 px-2 py-2">Regional (Garhwal)</td>
                      <td class="border border-slate-600 px-2 py-2">Regional (Kumaon)</td>
                      <td class="border border-slate-600 px-2 py-2">Foreign occupation</td>
                    </tr>
                    <tr class="bg-slate-700/50">
                      <td class="border border-slate-600 px-2 py-2"><strong>Period</strong></td>
                      <td class="border border-slate-600 px-2 py-2">700–11th C. CE</td>
                      <td class="border border-slate-600 px-2 py-2">688–1804</td>
                      <td class="border border-slate-600 px-2 py-2">~700–1790</td>
                      <td class="border border-slate-600 px-2 py-2">1790–1815</td>
                    </tr>
                    <tr>
                      <td class="border border-slate-600 px-2 py-2"><strong>Golden Age</strong></td>
                      <td class="border border-slate-600 px-2 py-2">Architecture</td>
                      <td class="border border-slate-600 px-2 py-2">Fateh Shah's reign</td>
                      <td class="border border-slate-600 px-2 py-2">Jagat Chand's reign</td>
                      <td class="border border-slate-600 px-2 py-2">Dark Age</td>
                    </tr>
                    <tr class="bg-slate-700/50">
                      <td class="border border-slate-600 px-2 py-2"><strong>Primary Tax</strong></td>
                      <td class="border border-slate-600 px-2 py-2">Bhogpati (land-based)</td>
                      <td class="border border-slate-600 px-2 py-2">Tihar (1/3 produce)</td>
                      <td class="border border-slate-600 px-2 py-2">Galla-Chhahada (1/6)</td>
                      <td class="border border-slate-600 px-2 py-2">Pungdi (arbitrary)</td>
                    </tr>
                    <tr>
                      <td class="border border-slate-600 px-2 py-2"><strong>Justice System</strong></td>
                      <td class="border border-slate-600 px-2 py-2">King supreme</td>
                      <td class="border border-slate-600 px-2 py-2">King + Panchayat</td>
                      <td class="border border-slate-600 px-2 py-2">Two formal courts</td>
                      <td class="border border-slate-600 px-2 py-2">Divya Pariksha (ordeals)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `,
      },
      '4': {
        label: 'Chapter 4',
        title: 'British Rule in Uttarakhand (1815-1947)',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 4: British Rule in Uttarakhand (1815–1947)</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">4.1 ARRIVAL & TERRITORIAL DIVISION (1815)</h3>
              <p class="mb-3">Following the defeat of the Gorkhas and the Treaty of Sugauli (1815), the British East India Company took control of the region. The territory was divided into two parts: British Kumaon and Garhwal (east of the Alaknanda River) came under direct British rule and was included in the Kumaon Commissionerate, while the western trans-Alaknanda region was handed to the Parmar King Sudarshan Shah as the Tehri Riyasat (Princely State).</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">4.2 MAJOR BRITISH COMMISSIONERS</h3>
              <table class="w-full text-xs border border-slate-600">
                <thead>
                  <tr class="bg-slate-700">
                    <th class="border border-slate-600 px-2 py-2 text-left">Commissioner</th>
                    <th class="border border-slate-600 px-2 py-2 text-left">Tenure</th>
                    <th class="border border-slate-600 px-2 py-2 text-left">Key Title</th>
                    <th class="border border-slate-600 px-2 py-2 text-left">Major Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-slate-600 px-2 py-2"><strong>Edward Gardner</strong></td>
                    <td class="border border-slate-600 px-2 py-2">1815–1816</td>
                    <td class="border border-slate-600 px-2 py-2">First Commissioner</td>
                    <td class="border border-slate-600 px-2 py-2">First land settlement; postal service</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-2 py-2"><strong>G.W. Traill</strong></td>
                    <td class="border border-slate-600 px-2 py-2">1816–1835</td>
                    <td class="border border-slate-600 px-2 py-2">Father of Revenue Police</td>
                    <td class="border border-slate-600 px-2 py-2">Patwari posts, Double Lock System, Mule Army, forest reservations</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-2 py-2"><strong>J.H. Batten</strong></td>
                    <td class="border border-slate-600 px-2 py-2">1848–1856</td>
                    <td class="border border-slate-600 px-2 py-2">–</td>
                    <td class="border border-slate-600 px-2 py-2">Shifted HQ to Nainital; Upper Ganges Canal</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-2 py-2"><strong>Sir Henry Ramsay</strong></td>
                    <td class="border border-slate-600 px-2 py-2">1856–1884</td>
                    <td class="border border-slate-600 px-2 py-2">Uncrowned King of Kumaon</td>
                    <td class="border border-slate-600 px-2 py-2">Golden Age; Revenue Police codified; Ramsay School (1871)</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-2 py-2"><strong>K.L. Mehta</strong></td>
                    <td class="border border-slate-600 px-2 py-2">1947–48</td>
                    <td class="border border-slate-600 px-2 py-2">First Indian Commissioner</td>
                    <td class="border border-slate-600 px-2 py-2">Last Commissioner of Kumaon Commissionerate</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">4.3 COMMISSIONER G.W. TRAILL – DETAILED PROFILE</h3>
              <p class="mb-3">G.W. Traill was the man who built the administrative DNA of British Uttarakhand. His judicial policy was characteristically iron-fisted, encapsulated in the phrase <em>"Na Vakeel, Na Daleel, Na Appeal"</em> (No lawyer, no argument, no appeal).</p>
              <p class="mb-3">In 1819, Traill created the Revenue Police system by establishing nine posts of Patwari – officials responsible for revenue collection, land records, and police powers simultaneously. In 1824, he introduced the Double Lock System for treasury security. He established the 'Mule Army' (Khachchar Sena) in 1822 to transport goods, reducing the burden on forced labourers.</p>
              <p class="mb-3">Traill's forest policy began in 1826 when he reserved 'Thapla' land for government use and banned the felling of Sal trees – laying the first foundation for government-controlled forests in the region. His landmark land settlement, the Assi Sala Settlement of 1823, achieved the first precise boundary demarcation of the region.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-2">4.4 COMMISSIONER SIR HENRY RAMSAY – DETAILED PROFILE</h3>
              <p class="mb-3">Sir Henry Ramsay earned the title 'Uncrowned King of Kumaon' during his unprecedented 28-year tenure (1856–1884), the longest of any Commissioner. His era is regarded as the Golden Age of British rule in the region.</p>
              <p class="mb-3">Ramsay managed the impact of the 1857 Revolt by declaring martial law in Kumaon and utilizing the loyalty of local zamindars, keeping the revolt's impact extremely low in the region. In 1858, he abolished the destructive forest contractor system and initiated scientific management practices. He formally expanded and codified the Revenue Police System in 1874. In 1871, he established the Ramsay Collegiate School in Almora – Kumaon's first inter college.</p>
            </div>
          </div>
        `,
      },
      '27': {
        label: 'Chapter 27',
        title: 'Education Reforms & HRD - Labour & Skills',
        htmlContent: `
          <div class="space-y-6 text-slate-300 text-sm">
            <h2 class="text-2xl font-bold text-white">Chapter 27: Education & HRD - Labour Force & Skills</h2>
            
            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">A. LABOUR FORCE MACRO-DATA</h3>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <thead>
                  <tr class="bg-slate-700">
                    <th class="border border-slate-600 px-3 py-2 text-left">Parameter</th>
                    <th class="border border-slate-600 px-3 py-2 text-left">Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>LFPR (15+)</strong></td>
                    <td class="border border-slate-600 px-3 py-2">60.7% (national avg: 60.1%)</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Working Age LFPR (15-59)</strong></td>
                    <td class="border border-slate-600 px-3 py-2">64.4%</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Unemployment Rate</strong></td>
                    <td class="border border-slate-600 px-3 py-2">4.3% overall; 9.8% youth (15-29)</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Hill Graduate Unemployment</strong></td>
                    <td class="border border-slate-600 px-3 py-2">~40% (highly educated)</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>e-Shram Portal</strong></td>
                    <td class="border border-slate-600 px-3 py-2">31,04,917 unorganized workers (56% female)</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Primary Sector Employment</strong></td>
                    <td class="border border-slate-600 px-3 py-2">~70% of workforce (9.59% of GSDP)</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>MSME Employment</strong></td>
                    <td class="border border-slate-600 px-3 py-2">4,56,605 people (79,394 units)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">B. FLAGSHIP SKILLING SCHEMES</h3>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <thead>
                  <tr class="bg-slate-700">
                    <th class="border border-slate-600 px-3 py-2 text-left">Scheme</th>
                    <th class="border border-slate-600 px-3 py-2 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Mukhyamantri Kaushal Yojana</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Global mobility; trains ANM/GNM, hospitality, elder-care; 20% subsidy on foreign language training; 75% loan interest subsidy</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>UKWDP (World Bank)</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Modernizes ITI machinery, smart labs, aligns curriculum</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>UKSDM</strong></td>
                    <td class="border border-slate-600 px-3 py-2">3-6 month free vocational courses for dropouts; homestay, adventure tourism, organic products</td>
                  </tr>
                  <tr class="bg-slate-700/50">
                    <td class="border border-slate-600 px-3 py-2"><strong>Devbhoomi Udyamita</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Innovation labs in colleges; 12,000+ entrepreneurship training</td>
                  </tr>
                  <tr>
                    <td class="border border-slate-600 px-3 py-2"><strong>Corporate-ITI Partnerships</strong></td>
                    <td class="border border-slate-600 px-3 py-2">Hyundai, Maruti, Samsung, Tata STRIVE upgrading machinery</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">C. ORANGE ECONOMY (Creative & Cultural)</h3>
              <p class="mb-3">Uttarakhand pivots toward Orange Economy—intellectual property, cultural heritage, arts, and creative expression.</p>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <tr class="bg-slate-700">
                  <th class="border border-slate-600 px-3 py-2 text-left">Component</th>
                  <th class="border border-slate-600 px-3 py-2 text-left">Details</th>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-3 py-2"><strong>Heritage & Craft</strong></td>
                  <td class="border border-slate-600 px-3 py-2">Aipan art, ringal-bamboo weaving standardized; artisans to entrepreneurs</td>
                </tr>
                <tr class="bg-slate-700/50">
                  <td class="border border-slate-600 px-3 py-2"><strong>"House of Himalayas"</strong></td>
                  <td class="border border-slate-600 px-3 py-2">Premium brand marketing 68,000 Women SHGs products</td>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-3 py-2"><strong>GI Tag Leadership</strong></td>
                  <td class="border border-slate-600 px-3 py-2">29 products protected (Munsiyari Rajma, Almora Copperware); 30-40% value boost</td>
                </tr>
                <tr class="bg-slate-700/50">
                  <td class="border border-slate-600 px-3 py-2"><strong>ODTP (One District Two Products)</strong></td>
                  <td class="border border-slate-600 px-3 py-2">Each district specializes 2 local products for global promotion</td>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-3 py-2"><strong>Digital Content Hub</strong></td>
                  <td class="border border-slate-600 px-3 py-2">Film production, drone piloting, travel vlogging skills</td>
                </tr>
                <tr class="bg-slate-700/50">
                  <td class="border border-slate-600 px-3 py-2"><strong>Wellness & Yoga</strong></td>
                  <td class="border border-slate-600 px-3 py-2">Yoga instructors, Ayurvedic therapists; Rishikesh as training node</td>
                </tr>
              </table>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">D. SILVER ECONOMY & CAREGIVER MISSION</h3>
              <p class="mb-3">Aging hill population due to youth out-migration. <strong>Caregiver Skill Mission</strong> trains youth as Care Sahayaks for elderly homestays and wellness retreats. Plan: Train 1.5 lakh Care Sahayaks to turn demographic challenge into high-value service.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">E. SYSTEMIC ISSUES IN SKILLING</h3>
              <table class="w-full text-xs border border-slate-600 mb-4">
                <tr class="bg-slate-700">
                  <th class="border border-slate-600 px-3 py-2 text-left">Issue</th>
                  <th class="border border-slate-600 px-3 py-2 text-left">Details</th>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-3 py-2"><strong>Spatial Disconnect</strong></td>
                  <td class="border border-slate-600 px-3 py-2">Training skewed toward plains; mountain youth travel far</td>
                </tr>
                <tr class="bg-slate-700/50">
                  <td class="border border-slate-600 px-3 py-2"><strong>Skills Paradox</strong></td>
                  <td class="border border-slate-600 px-3 py-2">78.82% literacy but low employability</td>
                </tr>
                <tr>
                  <td class="border border-slate-600 px-3 py-2"><strong>Gender Gap</strong></td>
                  <td class="border border-slate-600 px-3 py-2">Rural LFPR 52.6%; Urban LFPR only 24.4%</td>
                </tr>
                <tr class="bg-slate-700/50">
                  <td class="border border-slate-600 px-3 py-2"><strong>Ex-Servicemen Mismatch</strong></td>
                  <td class="border border-slate-600 px-3 py-2">1.39 lakh ex-servicemen underutilized</td>
                </tr>
              </table>
            </div>

            <div>
              <h3 class="text-lg font-bold text-orange-400 mb-3">27.17 THE WAY FORWARD - SANTULAN MODEL</h3>
              <p class="mb-3"><strong>SANTULAN:</strong> Convert "Geography-led problems into Technology-led solutions"</p>
              <ul class="list-disc list-inside space-y-2 text-xs">
                <li><strong>Curriculum Contextualization:</strong> Monetize local geography—eco-tourism, carbon auditing</li>
                <li><strong>PM SHRI Cluster:</strong> Residential "Schools of Excellence" with smart bus services</li>
                <li><strong>Hub-and-Spoke:</strong> Apex centers feeding mobile training labs to remote blocks</li>
                <li><strong>Transition to Weightless Industries:</strong> IT, AYUSH, Aromatic plants (Aroma Valleys)</li>
                <li><strong>Green Skills:</strong> Train "Carbon Auditors" and "Eco-mapping Technicians"</li>
                <li><strong>Orange & Green Economy:</strong> High-value mountain products, climate-smart agriculture, eco-tourism</li>
                <li><strong>Localized Incubation:</strong> District start-up incubators + soft loans for ITI graduates</li>
                <li><strong>Silver Economy:</strong> Certified geriatric caregivers for aging hill population</li>
                <li><strong>AI Mission 2025:</strong> Prompt engineering and modern tech roles</li>
              </ul>
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
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.city || !formData.pincode || !formData.state || !formData.address) {
      setError(selectedLanguage === 'en' ? 'Please fill all required fields!' : 'कृपया सभी आवश्यक फ़ील्ड भरें!');
      return;
    }

    setSubmitting(true);

    try {
      const createOrderResponse = await fetch('/api/create-book-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          state: formData.state.trim(),
          landmark: formData.landmark.trim(),
          language: selectedLanguage,
        }),
      });

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const paymentData = await createOrderResponse.json();

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onerror = () => {
        setError(selectedLanguage === 'en' ? 'Failed to load payment gateway. Please check internet and try again.' : 'भुगतान गेटवे लोड करने में विफल। कृपया इंटरनेट जांचें और पुनः प्रयास करें।');
        setSubmitting(false);
      };

      script.onload = () => {
        const options = {
          key: paymentData.key,
          amount: paymentData.amount,
          currency: 'INR',
          order_id: paymentData.orderId,
          name: 'UKPSC Decoded',
          description: selectedLanguage === 'en' ? 'UKPSC Book - English Edition' : 'UKPSC पुस्तक - हिंदी संस्करण',
          prefill: {
            name: paymentData.name,
            email: paymentData.email || '',
            contact: paymentData.phone,
          },
          handler: async (response: any) => {
            await handlePaymentSuccess(response, paymentData);
          },
          modal: {
            ondismiss: () => {
              setError(selectedLanguage === 'en' ? 'Payment cancelled. Please try again.' : 'भुगतान रद्द किया गया। कृपया पुनः प्रयास करें।');
              setSubmitting(false);
            },
          },
          theme: { color: '#FF9933' },
        };

        try {
          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        } catch (err) {
          setError(selectedLanguage === 'en' ? 'Failed to open payment gateway. Please try again.' : 'भुगतान गेटवे खोलने में विफल। कृपया पुनः प्रयास करें।');
          setSubmitting(false);
        }
      };

      document.body.appendChild(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : (selectedLanguage === 'en' ? 'Something went wrong. Please try again.' : 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।'));
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (response: any, paymentData: any) => {
    try {
      const verifyResponse = await fetch('/api/verify-book-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: paymentData.receiptId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          state: formData.state.trim(),
          landmark: formData.landmark.trim(),
          language: selectedLanguage,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }

      const verifyData = await verifyResponse.json();

      const params = new URLSearchParams({
        orderId: verifyData.orderId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        language: selectedLanguage === 'en' ? 'English' : 'हिंदी',
        paymentId: response.razorpay_payment_id,
        status: 'success',
      });

      router.push(`/order-confirmation?${params.toString()}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Payment verification error:', err);
      setError(
        selectedLanguage === 'en'
          ? `Payment verified but error occurred. Please contact support.`
          : `भुगतान सत्यापित लेकिन त्रुटि हुई। कृपया सहायता से संपर्क करें।`
      );
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

          <div className="flex justify-center gap-6 mt-8 mb-8">
            <button onClick={() => handleLanguageChange('en')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${selectedLanguage === 'en' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              🇬🇧 ENGLISH
            </button>
            <button onClick={() => handleLanguageChange('hi')} className={`px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${selectedLanguage === 'hi' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
              🇮🇳 हिंदी
            </button>
          </div>

          <div className="flex justify-center mb-12">
            <div className="w-full max-w-md">
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 p-4 hover:shadow-3xl transition-shadow">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-900">
                  <Image
                    src={selectedLanguage === 'en' ? '/IMG_5855.jpeg' : '/IMG_5854.jpeg'}
                    alt={selectedLanguage === 'en' ? 'UTTARAKHAND Decoded - English Edition' : 'UTTARAKHAND Decoded - Hindi Edition'}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 400px"
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
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm">
                  {error}
                </div>
              )}
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
