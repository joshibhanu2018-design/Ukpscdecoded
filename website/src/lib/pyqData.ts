// PYQ Tracker data — built from actual UKPSC previous-year analysis
// Years analysed: 2016, 2021, 2024, 2025

export type Priority = "CRITICAL" | "HIGH" | "MEDIUM";

export interface PYQTopic {
  topic: string;
  years: number[];
  note: string;
}

export interface PYQCluster {
  cluster: string;
  priority: Priority;
  totalHits: number;
  repeat: string;
  topics: PYQTopic[];
}

export const PYQ_YEARS = [2016, 2021, 2024, 2025];

export const uttarakhandClusters: PYQCluster[] = [
  {
    cluster: "Wildlife & Protected Areas",
    priority: "CRITICAL",
    totalHits: 8,
    repeat: "Every year",
    topics: [
      { topic: "National Parks — establishment years", years: [2016, 2021, 2024, 2025], note: "TRAP: Govind Wildlife Sanctuary (1955) vs Govind National Park (1989) — two different entities" },
      { topic: "Wildlife Sanctuaries — location/district", years: [2016, 2021, 2024, 2025], note: "Format: 'In which district is X sanctuary located?' — memorize district mapping" },
      { topic: "Key species & biodiversity", years: [2021, 2024, 2025], note: "Musk deer / Snow leopard / Himalayan Monal frequently tested" },
      { topic: "Biosphere Reserves (Nanda Devi etc.)", years: [2016, 2024, 2025], note: "UNESCO status + year of declaration both tested" },
      { topic: "Ramsar Sites in Uttarakhand", years: [2024, 2025], note: "Newer additions (post-2020) being tested now — keep updated" },
    ],
  },
  {
    cluster: "District-wise Comparisons",
    priority: "CRITICAL",
    totalHits: 11,
    repeat: "Format repeats",
    topics: [
      { topic: "Sex ratio — highest/lowest district", years: [2016, 2021, 2024, 2025], note: "FORMAT TRAP: Stat changes but structure stays same" },
      { topic: "Literacy rate — highest/lowest district", years: [2016, 2021, 2024], note: "Census 2011 data still used as of 2025 paper" },
      { topic: "Population — highest/lowest district", years: [2016, 2021, 2025], note: "Haridwar (highest) vs Chamoli (lowest density)" },
      { topic: "Forest cover percentage by district", years: [2021, 2024, 2025], note: "Forest Survey of India — latest year always tested" },
      { topic: "Area — largest/smallest district", years: [2016, 2024, 2025], note: "Chamoli (largest) vs Champawat (smallest)" },
      { topic: "SC/ST population by district", years: [2021, 2024, 2025], note: "Newer angle — post-2021 papers" },
      { topic: "River/drainage system by district", years: [2016, 2021, 2025], note: "Which river passes through which district" },
    ],
  },
  {
    cluster: "Uttarakhand Geography",
    priority: "HIGH",
    totalHits: 7,
    repeat: "Regular",
    topics: [
      { topic: "Glaciers — location & rivers originating", years: [2016, 2021, 2024, 2025], note: "Gangotri / Pindari / Milam / Satopanth — river origin most common" },
      { topic: "Mountain Passes (Darr/La)", years: [2016, 2021, 2024], note: "Lipulekh / Mana / Niti — border passes with China most tested" },
      { topic: "Lakes — location and type", years: [2016, 2021, 2024, 2025], note: "Glacial vs tectonic vs man-made classification tested" },
      { topic: "Rivers — origin points & tributaries", years: [2016, 2021, 2024, 2025], note: "Alaknanda system (5 Prayags) is a UKPSC favourite" },
      { topic: "Valleys & Bugyals", years: [2021, 2024, 2025], note: "Newer trend — Valley of Flowers + alpine meadows" },
      { topic: "Doons and Bhabhar/Tarai belt", years: [2016, 2021, 2025], note: "Physiographic division: Shiwalik / Doon / Bhabhar / Tarai" },
    ],
  },
  {
    cluster: "Tribes & Culture",
    priority: "HIGH",
    totalHits: 9,
    repeat: "Regular",
    topics: [
      { topic: "Major tribes (Bhotiya/Jaunsari/Tharu/Buksa/Raji)", years: [2016, 2021, 2024, 2025], note: "TRAP: Raji is smallest tribe — don't confuse with Van Raji" },
      { topic: "Traditional fairs & festivals", years: [2016, 2021, 2024, 2025], note: "Nanda Devi Raj Jat Yatra (12-yearly) — year of last occurrence tested" },
      { topic: "Folk dances — region mapping", years: [2016, 2021, 2024], note: "Which dance belongs to Kumaon vs Garhwal" },
      { topic: "Traditional art forms (Aipan/Pahari painting)", years: [2021, 2024, 2025], note: "Newer trend — art/craft-based questions increasing" },
      { topic: "Scheduled Tribe list & PVTG status", years: [2024, 2025], note: "Post-2023 — PVTG concept being tested" },
      { topic: "Religious sites & temples", years: [2016, 2021, 2024, 2025], note: "Char Dham + Panch Prayag + Panch Kedar" },
    ],
  },
  {
    cluster: "Dynasties & Inscriptions",
    priority: "CRITICAL",
    totalHits: 8,
    repeat: "Every year",
    topics: [
      { topic: "Katyuri Dynasty — rulers/period/capital", years: [2016, 2021, 2024, 2025], note: "Most tested dynasty — Kartikeyapura capital / Brahmadev temple" },
      { topic: "Parmar Dynasty — Garhwal", years: [2016, 2021, 2024, 2025], note: "Ajay Pal (unifier of Garhwal) — most asked ruler" },
      { topic: "Chand Dynasty — Kumaon", years: [2016, 2021, 2024, 2025], note: "Baz Bahadur Chand / Udyot Chand — Almora connection" },
      { topic: "Inscriptions — Ashoka Kalsi/Gopeshwar", years: [2016, 2021, 2024], note: "Kalsi inscription (only Ashoka rock edict in UK) always tested" },
      { topic: "Panwar Dynasty (later Garhwal)", years: [2016, 2024, 2025], note: "Connection to Srinagar (Garhwal) as capital" },
      { topic: "British period — Gorkha/Treaty of Sugauli", years: [2016, 2021, 2024, 2025], note: "1815 Treaty + Commissioner system — always appears" },
    ],
  },
  {
    cluster: "State Formation & Governance",
    priority: "HIGH",
    totalHits: 6,
    repeat: "Regular",
    topics: [
      { topic: "Statehood movement — key dates/events", years: [2016, 2021, 2024, 2025], note: "Muzaffarnagar (1994) / Rampur Tiraha (1994) / 9 Nov 2000" },
      { topic: "Governors & Chief Ministers list", years: [2016, 2021, 2024, 2025], note: "First CM: Nityanand Swami / First Governor: Surjit Singh Barnala" },
      { topic: "State symbols (bird/animal/flower/tree)", years: [2016, 2021, 2024, 2025], note: "Monal / Musk Deer / Brahma Kamal / Burans" },
      { topic: "Legislative Assembly facts", years: [2021, 2024, 2025], note: "Seats / first Speaker / reservation seats" },
      { topic: "Administrative divisions — 13 districts", years: [2016, 2021, 2024, 2025], note: "2 divisions (Kumaon/Garhwal) — district creation years tested" },
      { topic: "Important Commissions & Committees", years: [2024, 2025], note: "Newer angle — state-level commissions" },
    ],
  },
  {
    cluster: "Economy & Development",
    priority: "HIGH",
    totalHits: 7,
    repeat: "Regular",
    topics: [
      { topic: "Major dams & hydro projects", years: [2016, 2021, 2024, 2025], note: "Tehri Dam (tallest in India) / Vishnuprayag / Tapovan-Vishnugad" },
      { topic: "State GDP & sector contribution", years: [2021, 2024, 2025], note: "Service sector dominant — percentage distribution asked" },
      { topic: "Tourism circuits & pilgrimages", years: [2016, 2021, 2024, 2025], note: "Char Dham Yatra — road project / annual visitor data" },
      { topic: "Major crops & agricultural zones", years: [2016, 2021, 2024], note: "Basmati (Dehradun) / Mandua / Jhangora (hill crops)" },
      { topic: "Industrial areas & SEZs", years: [2021, 2024, 2025], note: "SIDCUL — Haridwar / Pantnagar / Sitarganj" },
      { topic: "State budget highlights", years: [2024, 2025], note: "Current affairs — latest budget allocations" },
      { topic: "Mineral resources & mining", years: [2016, 2021, 2025], note: "Limestone / Magnesite / Soapstone locations" },
    ],
  },
  {
    cluster: "Socio-Political Movements",
    priority: "CRITICAL",
    totalHits: 12,
    repeat: "Exact repeats",
    topics: [
      { topic: "Chipko Movement (1973)", years: [2016, 2021, 2024, 2025], note: "Tests Gaura Devi & Bahuguna separately" },
      { topic: "Maiti Movement", years: [2021, 2024], note: "Kalyan Singh Rawat — founder. Environmental movement" },
      { topic: "Tehri Anti-Dam Movement", years: [2016, 2021, 2024, 2025], note: "Sundarlal Bahuguna — same person, different context" },
      { topic: "Coolie-Begar Movement (1921)", years: [2016, 2021, 2024], note: "Anti-forced labour. Badri Dutt Pandey connection" },
      { topic: "Uttarakhand Statehood Movement", years: [2016, 2021, 2024, 2025], note: "Dates + places + martyrs — all angles tested" },
      { topic: "Anti-Alcohol/Women's movements", years: [2016, 2021, 2025], note: "Women-led — Nasha Nahi Rozgar Do" },
      { topic: "Doodhatoli Movement", years: [2021, 2024, 2025], note: "Sachidanand Bharti — newer entrant in papers" },
      { topic: "Role in 1857 rebellion", years: [2016, 2021, 2025], note: "Kalu Mahara / Kalwa / Bishen Singh" },
    ],
  },
  {
    cluster: "Current Affairs & Schemes",
    priority: "HIGH",
    totalHits: 5,
    repeat: "Growing",
    topics: [
      { topic: "State government schemes (recent)", years: [2024, 2025], note: "Vatsalya Yojana / Mukhyamantri schemes — last 2-3 years" },
      { topic: "Awards — state-level", years: [2021, 2024, 2025], note: "Uttarakhand Gaurav + recent recipients" },
      { topic: "Disaster management (Kedarnath 2013)", years: [2016, 2021, 2024, 2025], note: "SDRF / NDRF / Kedarnath reconstruction" },
      { topic: "Smart City / AMRUT / Urban schemes", years: [2024, 2025], note: "Central schemes implemented in UK cities" },
      { topic: "Census data & demographic facts", years: [2016, 2021, 2024, 2025], note: "Census 2011 still primary source" },
    ],
  },
  {
    cluster: "Literature & Personalities",
    priority: "MEDIUM",
    totalHits: 6,
    repeat: "Regular",
    topics: [
      { topic: "Literary figures (Pant/Nirala/Guha)", years: [2016, 2021, 2024, 2025], note: "Birthplace + works + awards all tested" },
      { topic: "Freedom fighters from UK", years: [2016, 2021, 2024, 2025], note: "GB Pant — his pre-independence UK role" },
      { topic: "Social reformers", years: [2016, 2021, 2024], note: "Ganga Ram / Swami Purnanand" },
      { topic: "Sports personalities from UK", years: [2024, 2025], note: "Newer trend — state sportspersons" },
      { topic: "Languages & dialects", years: [2016, 2021, 2025], note: "Kumaoni / Garhwali literary works" },
    ],
  },
];


export const nationalClusters: PYQCluster[] = [
  {
    cluster: "A: Ancient India",
    priority: "HIGH",
    totalHits: 7,
    repeat: "Regular",
    topics: [
      { topic: "Indus Valley Civilization — sites/features", years: [2016, 2021, 2024], note: "UKPSC asks factual: 'which site had X feature' vs UPSC analytical" },
      { topic: "Vedic Period — society/economy", years: [2016, 2024, 2025], note: "Rig Veda vs Later Vedic distinction tested" },
      { topic: "Mauryan Empire — Ashoka/administration", years: [2016, 2021, 2024, 2025], note: "Ashoka edicts (Kalsi in UK context) / Arthashastra" },
      { topic: "Gupta Period — Golden Age", years: [2016, 2021, 2025], note: "Science/literature achievements" },
      { topic: "Buddhism & Jainism — councils/teachings", years: [2016, 2021, 2024, 2025], note: "Buddhist councils + Jain Tirthankaras — always 1-2 Qs" },
      { topic: "Sangam Literature & South Indian dynasties", years: [2021, 2024, 2025], note: "Increasing trend — Chola/Pandya administration" },
    ],
  },
  {
    cluster: "B: Medieval India",
    priority: "HIGH",
    totalHits: 8,
    repeat: "Regular",
    topics: [
      { topic: "Delhi Sultanate — dynasty sequence/admin", years: [2016, 2021, 2024, 2025], note: "Iltutmish / Alauddin Khalji reforms — factual Qs dominate" },
      { topic: "Mughal Empire — Akbar to Aurangzeb", years: [2016, 2021, 2024, 2025], note: "Mansabdari / Revenue systems + cultural contributions" },
      { topic: "Bhakti & Sufi Movement", years: [2016, 2021, 2024], note: "Saints + teachings + regional spread" },
      { topic: "Vijayanagara Empire", years: [2016, 2024, 2025], note: "Architecture + administration" },
      { topic: "Maratha Empire — Shivaji/Peshwas", years: [2016, 2021, 2025], note: "Ashtapradhan system tested" },
    ],
  },
  {
    cluster: "C: Modern India & Freedom Struggle",
    priority: "CRITICAL",
    totalHits: 10,
    repeat: "Always appears",
    topics: [
      { topic: "Revolt of 1857 — causes/leaders/centres", years: [2016, 2021, 2024, 2025], note: "UKPSC also tests UK's role — Kalu Mahara / Bishen Singh" },
      { topic: "INC — formation to split", years: [2016, 2021, 2024, 2025], note: "Moderates vs Extremists vs Revolutionaries" },
      { topic: "Gandhi's movements (NCM/CDM/QIM)", years: [2016, 2021, 2024, 2025], note: "Chronology + specific events within each" },
      { topic: "Revolutionary movements & leaders", years: [2016, 2021, 2024], note: "Bhagat Singh / Chandrashekhar Azad / Surya Sen" },
      { topic: "Constitutional development (Acts 1773-1947)", years: [2016, 2021, 2024, 2025], note: "UKPSC loves this — Regulating Act to Independence Act" },
      { topic: "Socio-religious reform movements", years: [2016, 2021, 2024, 2025], note: "Brahmo Samaj / Arya Samaj / Prarthana Samaj" },
      { topic: "Partition & Independence", years: [2016, 2024, 2025], note: "Mountbatten Plan / Cabinet Mission / Cripps Mission" },
      { topic: "Peasant & Tribal movements", years: [2021, 2024, 2025], note: "Munda / Santhal / Indigo + local Kumaon revolts" },
    ],
  },
  {
    cluster: "D: Constitutional Framework",
    priority: "CRITICAL",
    totalHits: 12,
    repeat: "Always appears",
    topics: [
      { topic: "Fundamental Rights — Articles 14-32", years: [2016, 2021, 2024, 2025], note: "UKPSC tests article numbers directly" },
      { topic: "DPSP — Articles 36-51", years: [2016, 2021, 2024, 2025], note: "Classification: Socialist / Gandhian / Liberal" },
      { topic: "Fundamental Duties — Article 51A", years: [2016, 2024, 2025], note: "11 duties + additions (11th duty on education)" },
      { topic: "Constitutional Amendments — major", years: [2016, 2021, 2024, 2025], note: "7th/42nd/44th/73rd/74th/86th/101st" },
      { topic: "Preamble — keywords & amendments", years: [2016, 2021, 2024], note: "42nd Amendment: Socialist/Secular/Integrity added" },
      { topic: "Schedules of Constitution", years: [2016, 2021, 2024, 2025], note: "5th/6th/8th/9th Schedules — content + relevance" },
    ],
  },
  {
    cluster: "E: Governance & Institutions",
    priority: "HIGH",
    totalHits: 9,
    repeat: "Regular",
    topics: [
      { topic: "Parliament — powers/procedures", years: [2016, 2021, 2024, 2025], note: "Money Bill vs Finance Bill / Joint Sitting / No-confidence" },
      { topic: "President & Governor — powers", years: [2016, 2021, 2024, 2025], note: "Discretionary powers of Governor — UKPSC state angle" },
      { topic: "Supreme Court & High Courts", years: [2016, 2021, 2024], note: "Jurisdiction types + Article 32 vs 226" },
      { topic: "Panchayati Raj (73rd Amendment)", years: [2016, 2021, 2024, 2025], note: "Also tests Uttarakhand Panchayati Raj Act provisions" },
      { topic: "Election Commission", years: [2016, 2021, 2024, 2025], note: "EVM/VVPAT + Model Code of Conduct" },
      { topic: "CAG / UPSC / Finance Commission", years: [2016, 2021, 2025], note: "Constitutional bodies — appointment + functions" },
      { topic: "Emergency provisions (352/356/360)", years: [2016, 2021, 2024, 2025], note: "44th Amendment changes — always tested" },
      { topic: "Centre-State Relations", years: [2021, 2024, 2025], note: "3 lists + Sarkaria/Punchhi Commission" },
      { topic: "Urban Local Govt (74th Amendment)", years: [2016, 2024, 2025], note: "Municipality types + constitutional provisions" },
    ],
  },
  {
    cluster: "F: Physical Geography",
    priority: "HIGH",
    totalHits: 8,
    repeat: "Regular",
    topics: [
      { topic: "Plate Tectonics & Earthquakes", years: [2016, 2021, 2024, 2025], note: "UKPSC adds Himalayan seismic zones — Zone IV/V for UK" },
      { topic: "Indian Monsoon system", years: [2016, 2021, 2024, 2025], note: "Western Disturbance (UK winter rainfall) always tested" },
      { topic: "Soil types — classification", years: [2016, 2021, 2024], note: "Alluvial / Black / Red / Laterite — distribution + crops" },
      { topic: "Rivers of India — systems & projects", years: [2016, 2021, 2024, 2025], note: "Peninsular vs Himalayan + inter-linking projects" },
      { topic: "Climate zones & vegetation", years: [2016, 2021, 2025], note: "Koppen classification + forest types" },
      { topic: "Himalayan physiography", years: [2016, 2021, 2024, 2025], note: "Greater / Lesser / Shiwalik + specific ranges" },
    ],
  },
  {
    cluster: "G: Human & Economic Geography",
    priority: "HIGH",
    totalHits: 7,
    repeat: "Regular",
    topics: [
      { topic: "Census 2011 — national facts", years: [2016, 2021, 2024, 2025], note: "State-wise literacy/sex ratio/density" },
      { topic: "Agriculture — Revolutions", years: [2016, 2021, 2024], note: "Green/White/Blue Revolution — architects + states" },
      { topic: "Mineral & energy resources", years: [2016, 2021, 2024, 2025], note: "Coal/Iron/Petroleum belts + power stations" },
      { topic: "Transport networks", years: [2016, 2024, 2025], note: "Golden Quadrilateral + Freight Corridors" },
      { topic: "World Geography basics", years: [2021, 2024, 2025], note: "Continents/Oceans/Climate — basic but present" },
      { topic: "Industrial regions of India", years: [2016, 2021, 2025], note: "Mumbai-Pune / Bangalore-Chennai / Chota Nagpur" },
    ],
  },
  {
    cluster: "H: Indian Economy",
    priority: "HIGH",
    totalHits: 9,
    repeat: "Regular",
    topics: [
      { topic: "Planning — NITI Aayog / Five Year Plans", years: [2016, 2021, 2024, 2025], note: "Planning Commission to NITI Aayog transition" },
      { topic: "Banking — RBI / Monetary Policy", years: [2016, 2021, 2024, 2025], note: "Repo / Reverse Repo / CRR / SLR — always 1-2 Qs" },
      { topic: "Fiscal Policy — Budget / Deficits", years: [2016, 2021, 2024, 2025], note: "Revenue / Fiscal / Primary deficit + GST basics" },
      { topic: "Poverty & Unemployment", years: [2016, 2021, 2024], note: "Tendulkar / Rangarajan committee + types" },
      { topic: "Money & Inflation", years: [2016, 2021, 2024, 2025], note: "WPI vs CPI + demand-pull vs cost-push" },
      { topic: "International Trade — WTO/IMF/WB", years: [2016, 2021, 2025], note: "BoP / Current Account / Capital Account" },
      { topic: "Agriculture sector — MSP/FCI/NABARD", years: [2016, 2021, 2024, 2025], note: "PM-KISAN + crop insurance schemes" },
      { topic: "Tax structure — Direct vs Indirect", years: [2016, 2024, 2025], note: "GST Council + cess vs surcharge" },
      { topic: "HDI & global indices", years: [2021, 2024, 2025], note: "HDI/MPI/GHI — India's ranking" },
    ],
  },
  {
    cluster: "I: Physics & Chemistry",
    priority: "MEDIUM",
    totalHits: 8,
    repeat: "Regular",
    topics: [
      { topic: "Light/Sound/Heat — principles", years: [2016, 2021, 2024, 2025], note: "UKPSC asks application-based: 'Why does X happen?'" },
      { topic: "Electricity & Magnetism", years: [2016, 2021, 2025], note: "Household circuits + EM spectrum" },
      { topic: "Acids/Bases/Salts", years: [2016, 2021, 2024], note: "pH scale + daily life applications" },
      { topic: "Metals & Non-metals", years: [2016, 2024, 2025], note: "Alloys + reactivity series" },
      { topic: "Nuclear energy — fission/fusion", years: [2016, 2021, 2024, 2025], note: "India's nuclear program + power stations" },
    ],
  },
  {
    cluster: "J: Biology & Health",
    priority: "MEDIUM",
    totalHits: 7,
    repeat: "Regular",
    topics: [
      { topic: "Human body systems", years: [2016, 2021, 2024, 2025], note: "Digestive/Circulatory/Nervous — function-based" },
      { topic: "Diseases — causes/prevention", years: [2016, 2021, 2024, 2025], note: "Viral vs Bacterial vs Deficiency classification" },
      { topic: "Genetics — DNA/RNA/heredity", years: [2021, 2024, 2025], note: "Mendel's laws + chromosome basics" },
      { topic: "Nutrition — vitamins/minerals", years: [2016, 2021, 2024, 2025], note: "Sources + deficiency diseases — factual recall" },
      { topic: "Ecology & Environment", years: [2016, 2021, 2024, 2025], note: "Biomes / food chains / ecological succession" },
      { topic: "Plant biology", years: [2016, 2021, 2025], note: "Photosynthesis / transpiration / plant hormones" },
    ],
  },
  {
    cluster: "K: Technology & Space",
    priority: "HIGH",
    totalHits: 6,
    repeat: "Growing trend",
    topics: [
      { topic: "ISRO missions — satellites/launches", years: [2016, 2021, 2024, 2025], note: "Chandrayaan / Mangalyaan / Gaganyaan details" },
      { topic: "Defence tech — missiles/systems", years: [2016, 2021, 2024, 2025], note: "Agni/Prithvi/BrahMos — range + type" },
      { topic: "IT & Digital India initiatives", years: [2021, 2024, 2025], note: "UPI / Aadhaar / DigiLocker" },
      { topic: "Biotechnology applications", years: [2021, 2024, 2025], note: "GMO / Bt crops / DNA fingerprinting" },
      { topic: "Nanotechnology & emerging tech", years: [2024, 2025], note: "AI / blockchain basics — newer trend" },
    ],
  },
  {
    cluster: "L: Environment",
    priority: "HIGH",
    totalHits: 7,
    repeat: "Regular",
    topics: [
      { topic: "National Parks & Sanctuaries (national)", years: [2016, 2021, 2024, 2025], note: "Project Tiger / Project Elephant + reserve counts" },
      { topic: "Climate Change — protocols", years: [2016, 2021, 2024, 2025], note: "Kyoto / Paris / COP — India's NDC + targets" },
      { topic: "Pollution — types/control/legislation", years: [2016, 2021, 2024, 2025], note: "Water Act 1974 / Air Act 1981 / EPA 1986" },
      { topic: "Biodiversity — hotspots/endemic species", years: [2016, 2021, 2024], note: "4 hotspots in India + IUCN Red List categories" },
      { topic: "Environmental legislation & bodies", years: [2016, 2021, 2024, 2025], note: "NGT / CPCB / SPCB / Forest Rights Act" },
      { topic: "Sustainable Development & SDGs", years: [2021, 2024, 2025], note: "17 SDGs + India's progress" },
      { topic: "Wetlands & Ramsar Convention", years: [2021, 2024, 2025], note: "Updated Ramsar sites count + UK sites" },
    ],
  },
  {
    cluster: "M: National Current Affairs",
    priority: "HIGH",
    totalHits: 8,
    repeat: "Depends on year",
    topics: [
      { topic: "Government schemes — flagship", years: [2021, 2024, 2025], note: "PM-KISAN / Ayushman Bharat / Swachh Bharat" },
      { topic: "Awards — Padma/Sports", years: [2016, 2021, 2024, 2025], note: "Bharat Ratna + Dronacharya/Arjuna + recent recipients" },
      { topic: "International summits/orgs", years: [2016, 2021, 2024, 2025], note: "G20 / BRICS / SCO / QUAD — India's role" },
      { topic: "Sports events & achievements", years: [2016, 2021, 2024, 2025], note: "Olympics / CWG / Asian Games — recent performances" },
      { topic: "Important reports & indices", years: [2021, 2024, 2025], note: "Ease of Doing Business / HDI / Global indices" },
      { topic: "Defence & Security", years: [2021, 2024, 2025], note: "New systems + exercises + partnerships" },
      { topic: "Science achievements", years: [2021, 2024, 2025], note: "Nobel prizes + Indian breakthroughs" },
      { topic: "Constitutional/Legal developments", years: [2021, 2024, 2025], note: "Recent SC judgments / new laws" },
    ],
  },
  {
    cluster: "N: CSAT (Paper II)",
    priority: "MEDIUM",
    totalHits: 6,
    repeat: "Standard",
    topics: [
      { topic: "Reading Comprehension", years: [2016, 2021, 2024, 2025], note: "Qualifying paper (33%) — moderate difficulty" },
      { topic: "Logical Reasoning", years: [2016, 2021, 2024, 2025], note: "Blood relations / coding-decoding / direction" },
      { topic: "Quantitative Aptitude", years: [2016, 2021, 2024, 2025], note: "Percentage / Ratio / Time-Work — no advanced maths" },
      { topic: "Data Interpretation", years: [2016, 2021, 2024, 2025], note: "Bar/Pie/Line graphs — 4-5 Qs in a set" },
      { topic: "Decision Making", years: [2021, 2024, 2025], note: "Administrative scenario-based" },
      { topic: "Basic numeracy & mental ability", years: [2016, 2021, 2024, 2025], note: "Number series / pattern recognition" },
    ],
  },
];


export interface PrepDay {
  day: number;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
  pyq: string;
}

export interface PrepPhase {
  phase: string;
  days: PrepDay[];
}

export const prepPlan: PrepPhase[] = [
  {
    phase: "Phase 1 — Uttarakhand Foundation (Days 1-16)",
    days: [
      { day: 1, theme: "UK History — Dynasties", morning: "Katyuri Dynasty (origin/rulers/capital/temples)", afternoon: "Parmar Dynasty (Garhwal/Ajay Pal/admin)", evening: "Revision + short notes", pyq: "Cluster 5 PYQs (all years)" },
      { day: 2, theme: "UK History — Dynasties + Inscriptions", morning: "Chand Dynasty (Kumaon/rulers/capital shift)", afternoon: "Panwar Dynasty + Inscriptions (Kalsi/Gopeshwar)", evening: "Revision + short notes", pyq: "Cluster 5 continued" },
      { day: 3, theme: "UK History — British Period", morning: "Gorkha invasion + Treaty of Sugauli 1815", afternoon: "British admin + Commissioner system", evening: "Compare with national 1857", pyq: "Cluster 5 + Cluster C" },
      { day: 4, theme: "UK Movements — Part 1", morning: "Coolie-Begar + Early revolts", afternoon: "Chipko Movement (Gaura Devi + Bahuguna)", evening: "Link to environment Qs", pyq: "Cluster 8 (2016-2025)" },
      { day: 5, theme: "UK Movements — Part 2", morning: "Maiti / Doodhatoli / Anti-Alcohol", afternoon: "Tehri Anti-Dam + Statehood (1994)", evening: "Movement chronology chart", pyq: "Cluster 8 + Cluster 6" },
      { day: 6, theme: "UK State Formation & Governance", morning: "Statehood facts (9 Nov 2000) + first officials", afternoon: "Governors/CMs + State symbols + Legislature", evening: "All 13 districts mapping", pyq: "Cluster 6 (all years)" },
      { day: 7, theme: "UK Geography — Physical", morning: "Glaciers + Rivers (origin/tributaries/Prayags)", afternoon: "Mountain Passes + Valleys + Bugyals", evening: "Physiographic divisions", pyq: "Cluster 3 PYQs" },
      { day: 8, theme: "UK Geography + Protected Areas", morning: "Lakes + Doons/Tarai", afternoon: "National Parks — year + district + species", evening: "Govind trap: Sanctuary 1955 vs NP 1989", pyq: "Cluster 1 + 3" },
      { day: 9, theme: "UK Wildlife & Protected Areas", morning: "Wildlife Sanctuaries — list + locations", afternoon: "Biosphere Reserves + Ramsar (updated)", evening: "IUCN status of key species", pyq: "Cluster 1 (all years)" },
      { day: 10, theme: "UK District Data — Census", morning: "District population/density/growth", afternoon: "Sex ratio + Literacy mapping", evening: "Area + Forest cover by district", pyq: "Cluster 2 — FORMAT practice" },
      { day: 11, theme: "UK District Data — Advanced", morning: "SC/ST population by district", afternoon: "Rivers/drainage by district mapping", evening: "Personal district master-chart", pyq: "Cluster 2 continued" },
      { day: 12, theme: "UK Tribes & Culture", morning: "5 tribes + PVTG", afternoon: "Fairs & Festivals (Nanda Devi Raj Jat)", evening: "Folk dances + Art forms mapping", pyq: "Cluster 4 PYQs" },
      { day: 13, theme: "UK Culture + Religious Sites", morning: "Char Dham + Panch Prayag + Panch Kedar", afternoon: "Literary figures + Languages", evening: "Freedom fighters + Social reformers", pyq: "Cluster 4 + 10" },
      { day: 14, theme: "UK Economy & Development", morning: "Major dams (Tehri) + Hydro", afternoon: "Tourism circuits + Agriculture + Crops", evening: "Industrial areas (SIDCUL) + Minerals", pyq: "Cluster 7 PYQs" },
      { day: 15, theme: "UK Current Affairs + Schemes", morning: "State schemes (last 3 years)", afternoon: "Budget highlights + Awards", evening: "Disaster mgmt — Kedarnath + SDRF/NDRF", pyq: "Cluster 9 PYQs" },
      { day: 16, theme: "⭐ Revision Day — All UK", morning: "Revise Clusters 1-5 (notes flip)", afternoon: "Revise Clusters 6-10 (self-quiz)", evening: "Full UK PYQ paper — timed", pyq: "Score yourself" },
    ],
  },
  {
    phase: "Phase 2 — History + Polity (Days 17-30)",
    days: [
      { day: 17, theme: "Ancient India — Part 1", morning: "Indus Valley (sites/features/economy)", afternoon: "Vedic Period (Early vs Later)", evening: "Buddhism + Jainism (councils)", pyq: "Cluster A PYQs" },
      { day: 18, theme: "Ancient India — Part 2", morning: "Mauryan Empire (Ashoka/Chandragupta)", afternoon: "Gupta Period (science/literature)", evening: "Sangam Lit + South Indian dynasties", pyq: "Cluster A continued" },
      { day: 19, theme: "Medieval India", morning: "Delhi Sultanate (5 dynasties — reforms)", afternoon: "Mughal Empire (admin + culture)", evening: "Bhakti & Sufi Movement", pyq: "Cluster B PYQs" },
      { day: 20, theme: "Medieval India + Transitions", morning: "Vijayanagara + Maratha Empire", afternoon: "Shivaji admin (Ashtapradhan)", evening: "Regional kingdoms overview", pyq: "Cluster B continued" },
      { day: 21, theme: "Modern India — Part 1", morning: "1857 Revolt (causes/leaders + UK link)", afternoon: "Early Nationalism (INC/Moderates)", evening: "Constitutional Acts (1773-1935)", pyq: "Cluster C PYQs" },
      { day: 22, theme: "Modern India — Part 2", morning: "Gandhi movements (NCM/CDM/QIM)", afternoon: "Revolutionary movements + leaders", evening: "Socio-religious reforms", pyq: "Cluster C continued" },
      { day: 23, theme: "Modern India — Part 3", morning: "Peasant/Tribal movements (nat + UK)", afternoon: "Partition (Cripps/Cabinet/Mountbatten)", evening: "Post-independence consolidation", pyq: "Cluster C final" },
      { day: 24, theme: "Indian Polity — Part 1", morning: "Preamble + Fundamental Rights (article-wise)", afternoon: "DPSP (classification + key articles)", evening: "Fundamental Duties (all 11)", pyq: "Cluster D PYQs" },
      { day: 25, theme: "Indian Polity — Part 2", morning: "Constitutional Amendments (15+ major)", afternoon: "Schedules (5th/6th/8th/9th)", evening: "Union & State Executive — powers", pyq: "Cluster D continued" },
      { day: 26, theme: "Indian Polity — Part 3", morning: "Parliament (procedures/powers)", afternoon: "Judiciary (SC/HC/writs/PIL)", evening: "Emergency (352/356/360 + 44th)", pyq: "Cluster E PYQs" },
      { day: 27, theme: "Indian Polity — Part 4", morning: "Panchayati Raj (73rd + UK Act)", afternoon: "Urban Local Bodies (74th)", evening: "Election Commission + Centre-State", pyq: "Cluster E continued" },
      { day: 28, theme: "Indian Polity — Part 5", morning: "Constitutional Bodies (CAG/UPSC/FC)", afternoon: "Statutory/Non-statutory bodies", evening: "Sarkaria/Punchhi Commission", pyq: "Cluster E final" },
      { day: 29, theme: "⭐ Revision — History", morning: "Ancient + Medieval revision", afternoon: "Modern India + Freedom Struggle", evening: "History PYQ mixed — timed", pyq: "Self-assessment" },
      { day: 30, theme: "⭐ Revision — Polity", morning: "FR/DPSP/FD/Amendments", afternoon: "Governance + Panchayati Raj", evening: "Polity PYQ mixed — timed", pyq: "Self-assessment" },
    ],
  },
  {
    phase: "Phase 3 — Geography + Economy (Days 31-40)",
    days: [
      { day: 31, theme: "Physical Geography — Part 1", morning: "Plate Tectonics + Earthquakes (UK zones)", afternoon: "Indian Monsoon (Western Disturbance)", evening: "Climate zones + vegetation", pyq: "Cluster F PYQs" },
      { day: 32, theme: "Physical Geography — Part 2", morning: "Rivers of India (Himalayan vs Peninsular)", afternoon: "Soil types (distribution + crops)", evening: "Himalayan physiography", pyq: "Cluster F continued" },
      { day: 33, theme: "Human & Economic Geography", morning: "Census 2011 (compare with UK districts)", afternoon: "Agriculture (Green/White/Blue Revolution)", evening: "Mineral & energy resources", pyq: "Cluster G PYQs" },
      { day: 34, theme: "Economic Geography + World", morning: "Industrial regions + Transport", afternoon: "World Geography basics", evening: "Map-based revision (locate all)", pyq: "Cluster G continued" },
      { day: 35, theme: "Indian Economy — Part 1", morning: "Planning (NITI Aayog) + GDP concepts", afternoon: "Banking (RBI tools — Repo/CRR/SLR)", evening: "Fiscal Policy (Budget/Deficits/GST)", pyq: "Cluster H PYQs" },
      { day: 36, theme: "Indian Economy — Part 2", morning: "Money & Inflation (WPI vs CPI)", afternoon: "Poverty & Unemployment (committees)", evening: "Agriculture economy (MSP/FCI/NABARD)", pyq: "Cluster H continued" },
      { day: 37, theme: "Indian Economy — Part 3", morning: "International Trade (WTO/IMF/WB/BoP)", afternoon: "Tax (Direct vs Indirect + GST)", evening: "HDI/MPI + global rankings", pyq: "Cluster H final" },
      { day: 38, theme: "⭐ Revision — Geography", morning: "Physical Geography + Maps", afternoon: "Human/Economic Geography", evening: "Geography PYQ mixed — timed", pyq: "Self-assessment" },
      { day: 39, theme: "⭐ Revision — Economy", morning: "Macro (GDP/Inflation/Banking)", afternoon: "Schemes + sectors + international", evening: "Economy PYQ mixed — timed", pyq: "Self-assessment" },
      { day: 40, theme: "⭐ Mini Mock", morning: "100-Q mock (national topics only)", afternoon: "Analysis: identify weak clusters", evening: "Plan remedial for weak areas", pyq: "Score + weak-area list" },
    ],
  },
  {
    phase: "Phase 4 — Science + Environment + CA (Days 41-48)",
    days: [
      { day: 41, theme: "General Science — Phys/Chem", morning: "Light/Sound/Heat + Electricity", afternoon: "Acids/Bases/Salts + Metals", evening: "Nuclear energy (India's program)", pyq: "Cluster I PYQs" },
      { day: 42, theme: "General Science — Biology", morning: "Human body systems", afternoon: "Diseases + Vaccines", evening: "Nutrition (Vitamins — source + deficiency)", pyq: "Cluster J PYQs" },
      { day: 43, theme: "Science & Technology", morning: "ISRO (Chandrayaan/Mangalyaan/Gaganyaan)", afternoon: "Defence tech (missiles)", evening: "IT/Digital India + Biotech + Emerging", pyq: "Cluster K PYQs" },
      { day: 44, theme: "Environment — Part 1", morning: "National Parks/Tiger Reserves", afternoon: "Climate Change (Kyoto/Paris/COP/NDC)", evening: "Environmental legislation (Acts + NGT)", pyq: "Cluster L PYQs" },
      { day: 45, theme: "Environment — Part 2", morning: "Biodiversity hotspots + IUCN", afternoon: "Pollution types + control", evening: "Wetlands/Ramsar (updated) + SDGs", pyq: "Cluster L continued" },
      { day: 46, theme: "Current Affairs — National", morning: "Govt schemes (last 18 months)", afternoon: "Awards (Padma/Sports) + Summits", evening: "Science + Defence developments", pyq: "Cluster M — newspapers" },
      { day: 47, theme: "Current Affairs — UK + Integration", morning: "UK state schemes (last 2 years) + Budget", afternoon: "UK awards + Disaster + Sports", evening: "Integrate UK + national CA", pyq: "Cluster 9 + M combined" },
      { day: 48, theme: "CSAT Basics", morning: "Reading Comprehension practice", afternoon: "Logical Reasoning (arrangements/coding)", evening: "Quant (percentage/ratio/time)", pyq: "Cluster N — aim 33%+" },
    ],
  },
  {
    phase: "Phase 5 — Revision Marathon (Days 49-57)",
    days: [
      { day: 49, theme: "UK Mega-Revision Day 1", morning: "Clusters 1-3 (Wildlife/Districts/Geography)", afternoon: "Clusters 4-5 (Tribes/Dynasties)", evening: "Clusters 6-7 (State/Economy)", pyq: "UK PYQ quick-fire" },
      { day: 50, theme: "UK Mega-Revision Day 2", morning: "Clusters 8-10 (Movements/CA/Literature)", afternoon: "Gap-fill: weak UK topics", evening: "One-page UK revision sheet", pyq: "UK full paper — timed" },
      { day: 51, theme: "History Mega-Revision", morning: "Ancient India (dates/rulers)", afternoon: "Medieval India (Sultanate/Mughal/Maratha)", evening: "Modern India (Freedom struggle chronology)", pyq: "History quick-fire" },
      { day: 52, theme: "Polity Mega-Revision", morning: "Articles (FR/DPSP/FD) — number recall", afternoon: "Amendments + Schedules + Bodies", evening: "Parliament + Judiciary + Centre-State", pyq: "Polity quick-fire" },
      { day: 53, theme: "Geo + Economy Mega-Revision", morning: "Physical Geo (rivers/soils) — map-based", afternoon: "Economy (banking/deficits/schemes)", evening: "Trade/tax + Census/minerals", pyq: "Geo + Eco quick-fire" },
      { day: 54, theme: "Science + Env Mega-Revision", morning: "Physics/Chemistry + Biology diseases", afternoon: "ISRO + Defence + IT/Digital", evening: "Environment (acts/parks/climate/Ramsar)", pyq: "Sci + Env quick-fire" },
      { day: 55, theme: "Current Affairs Final Push", morning: "Last 6 months — national + international", afternoon: "Last 6 months — Uttarakhand specific", evening: "Awards + Sports + Reports + Rankings", pyq: "CA quiz" },
      { day: 56, theme: "⭐ Full Mock Test 1", morning: "150-Q mock (UK + National + CSAT)", afternoon: "Strict 2-hour time limit", evening: "Analysis: mistakes / timing / weak areas", pyq: "Score + analysis" },
      { day: 57, theme: "⭐ Full Mock Test 2 + Gap-fill", morning: "Another complete mock", afternoon: "Analysis + targeted revision", evening: "Final gap-fill on repeat topics", pyq: "Compare with Mock 1" },
    ],
  },
  {
    phase: "Phase 6 — Exam Ready (Days 58-60)",
    days: [
      { day: 58, theme: "Light Revision Only", morning: "One-page UK sheet — read through", afternoon: "One-page National sheet — read through", evening: "Formulae + articles + dates ONLY", pyq: "No new study — recall only" },
      { day: 59, theme: "Rest + Logistics", morning: "Light reading (30 min — own notes)", afternoon: "Check centre / documents / stationery", evening: "Sleep by 10 PM — full rest", pyq: "No PYQs / No mocks" },
      { day: 60, theme: "🎯 Exam Day", morning: "Reach centre 1 hour early", afternoon: "Stay calm — trust your preparation", evening: "Execute: UK first → strong subjects next", pyq: "You've got this ✓" },
    ],
  },
];
