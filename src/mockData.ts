import { HazardReport, ActiveAlert, SocialTrend } from "./types";

export const INITIAL_HAZARD_REPORTS: HazardReport[] = [
  {
    id: "rep-001",
    title: "Large Fuel Oil Slick Approaching Marine Sanctuary",
    category: "oil_spill",
    description: "An apparent heavy diesel or crude slick has been detected drifting southwest approximately 4 miles off the coastal bay. Area corresponds to sensitive seagrass turtle habitats. A local fishing vessel sighted the slick spreading over approximately 2 square kilometers.",
    latitude: 14.65,
    longitude: 120.21,
    locationName: "Sector Delta-3, North Anchorage Reef",
    reportedBy: "Captain Carlos Silva",
    reporterRole: "Fisherman",
    reportedAt: "2026-06-18T05:30:00Z",
    severity: "Critical",
    status: "Verified",
    confidence: 94,
    images: [],
    aiSummary: "Heavy fuel slick tracking southwest towards nesting turtle seagrass reserves. Multi-agency containment required.",
    riskTrend: "Increasing"
  },
  {
    id: "rep-002",
    title: "Severe Bleaching Sighted in Protected Shallow Reefs",
    category: "coral_bleaching",
    description: "Widespread bleaching observed down to 8 meters depth in the marine sanctuary zones. Over 60% of Acropora species are showing full fluorescent white states. Local water temperature sensor reads 31.4°C, which is 2.2°C above seasonal norms.",
    latitude: 14.58,
    longitude: 120.35,
    locationName: "Zone Echo-7, Coral Gardens Sanctuary",
    reportedBy: "Dr. Sarah Chen",
    reporterRole: "Researcher",
    reportedAt: "2026-06-17T09:15:00Z",
    severity: "High",
    status: "Verified",
    confidence: 91,
    images: [],
    aiSummary: "Thermal distress bleached upwards of 60% of Acropora coral due to prolonged +2.2°C marine heatwave anomaly.",
    riskTrend: "Increasing"
  },
  {
    id: "rep-003",
    title: "Unidentified Trawlers Operating inside Sanctuary No-Take Zone",
    category: "illegal_fishing",
    description: "Two medium-sized industrial trawlers without active AIS transponders sighted operating pair trawling gear deep inside the protected marine nursery zone during low visibility hours. Gathered video evidence shows commercial bottom dragging.",
    latitude: 14.72,
    longitude: 120.12,
    locationName: "Sector Alpha-1, Sanctuary Shelf",
    reportedBy: "Elena Rostova",
    reporterRole: "Researcher",
    reportedAt: "2026-06-18T02:10:00Z",
    severity: "High",
    status: "Pending",
    confidence: 85,
    images: [],
    aiSummary: "Unregulated pair-trawling in designated no-take zone with deactivated transponders. Direct maritime enforcement target.",
    riskTrend: "Stable"
  },
  {
    id: "rep-004",
    title: "Massive plastic ghost nets wrapped around primary pinnacles",
    category: "marine_debris",
    description: "A discarded commercial monofilament net, roughly 120 meters long, has wrapped around the main dive pinnacle. Entangled species include several horn sharks and multiple species of rays. Divers cleared 3 green turtles, but there is active danger of further ghost fishing.",
    latitude: 14.51,
    longitude: 120.28,
    locationName: "Sector Zulu-9, Sea Horse Pinnacle",
    reportedBy: "Kenji Sato",
    reporterRole: "Citizen",
    reportedAt: "2026-06-16T14:45:00Z",
    severity: "Medium",
    status: "Verified",
    confidence: 88,
    images: [],
    aiSummary: "120m commercial ghost net snagged on underwater pinnacle. High mortality threat to local marine megafauna.",
    riskTrend: "Stable"
  },
  {
    id: "rep-005",
    title: "Sudden Harmful Algae Bloom (Red Tide) in Eastern Inlet",
    category: "toxic_algae",
    description: "Water has turned a distinct brownish-red color spanning across the local aquaculture cages. Numerous dead milkfish floating on surface. Shellfish harvesting must be immediately restricted to prevent paralytic shellfish poisoning.",
    latitude: 14.61,
    longitude: 120.44,
    locationName: "Estuary Zone Bravo, East Inlet Aquaculture",
    reportedBy: "Manuel Marcos",
    reporterRole: "Fisherman",
    reportedAt: "2026-06-17T21:00:00Z",
    severity: "Critical",
    status: "Verified",
    confidence: 96,
    images: [],
    aiSummary: "Active Harmful Algal Bloom triggering severe oxygen depletion and aquatic kill across estuaries. Ban shellfish collection.",
    riskTrend: "Increasing"
  },
  {
    id: "rep-006",
    title: "Extreme storm surge erosion and micro-plastics wash-off",
    category: "severe_weather",
    description: "Sustained high winds and extreme tide cycles caused severe bank cave-ins across the southern sand spit. Large amounts of historical landfill microplastics have washed out from coastal dunes into the intertidal channels.",
    latitude: 14.48,
    longitude: 120.19,
    locationName: "South Bay Outer Spit",
    reportedBy: "Maya Lin",
    reporterRole: "Citizen",
    reportedAt: "2026-06-18T00:05:00Z",
    severity: "Medium",
    status: "Pending",
    confidence: 72,
    images: [],
    aiSummary: "Coastal bank collapse flushing landfill debris and particles into inner shipping channels.",
    riskTrend: "Decreasing"
  }
];

export const INITIAL_ALERTS: ActiveAlert[] = [
  {
    id: "alert-1",
    title: "URGENT: Hydrocarbon Containment Protocol Active",
    description: "All vessels within 10km of Sector Delta-3 (14.65N, 120.21E) must maintain low speeds to avoid dispersing drifting diesel slicks. Commercial fishing is prohibited in the sector until cleanup vessels declare ocean safety clearance.",
    category: "oil_spill",
    severity: "Critical",
    issuedAt: "2026-06-18T06:00:00Z",
    expiresAt: "2026-06-21T18:00:00Z",
    affectedCoordinates: { lat: 14.65, lng: 120.21, radiusKm: 10 },
    verifiedBy: "Coast Guard Dispatch (Sector 4)"
  },
  {
    id: "alert-2",
    title: "SHELLFISH CONSUMPTION BAN - Harmful Algal Bloom",
    description: "Red Tide toxins verified in Estuary Zone Bravo. Marine toxicology advises against human consumption of bivalves, crabs, and oysters sourced from Eastern Inlet until further bioassay data is compiled.",
    category: "toxic_algae",
    severity: "High",
    issuedAt: "2026-06-17T22:30:00Z",
    expiresAt: "2026-06-24T00:00:00Z",
    affectedCoordinates: { lat: 14.61, lng: 120.44, radiusKm: 5 },
    verifiedBy: "Department of Marine Biosafety"
  },
  {
    id: "alert-3",
    title: "Marine Thermal Stress Outlook - Bleaching Warning",
    description: "Prolonged high SST anomaly is triggering a tier-1 coral bleaching event across shallow reefs. Researchers requested to report all bleached coral taxa via OceanShield.",
    category: "coral_bleaching",
    severity: "Medium",
    issuedAt: "2026-06-17T12:00:00Z",
    expiresAt: "2026-07-01T12:00:00Z",
    affectedCoordinates: { lat: 14.58, lng: 120.35, radiusKm: 25 },
    verifiedBy: "International Coral Reef Network"
  }
];

export const MOCK_SOCIAL_TRENDS: SocialTrend[] = [
  {
    keyword: "redtide",
    volume24h: 1840,
    trendPercentage: 112,
    sentiment: { positive: 8, neutral: 14, negative: 78 },
    topCategory: "toxic_algae"
  },
  {
    keyword: "oil_slick_delta",
    volume24h: 3120,
    trendPercentage: 450,
    sentiment: { positive: 2, neutral: 20, negative: 78 },
    topCategory: "oil_spill"
  },
  {
    keyword: "bleaching_coralgardens",
    volume24h: 890,
    trendPercentage: 35,
    sentiment: { positive: 5, neutral: 45, negative: 50 },
    topCategory: "coral_bleaching"
  },
  {
    keyword: "illegaltrawling",
    volume24h: 1420,
    trendPercentage: -15,
    sentiment: { positive: 10, neutral: 30, negative: 60 },
    topCategory: "illegal_fishing"
  },
  {
    keyword: "beachdebris",
    volume24h: 620,
    trendPercentage: 12,
    sentiment: { positive: 25, neutral: 35, negative: 40 },
    topCategory: "marine_debris"
  }
];

export const MAP_GRID_CELLS = [
  { id: "A1", label: "Sector Alpha-1 (Marine Sanctuary)", description: "High security, deep shelf, critical spawning ground.", color: "rgba(16, 185, 129, 0.15)" },
  { id: "A2", label: "Sector Alpha-2 (Coastal Aquaculture)", description: "Contains extensive inland milkfish grids.", color: "rgba(14, 165, 233, 0.1)" },
  { id: "B1", label: "Sector Bravo-1 (Shipping Route)", description: "Commercial cargo corridor, heavy tanker traffic.", color: "rgba(240, 150, 10, 0.1)" },
  { id: "B2", label: "Sector Bravo-2 (Outer Shelf Deep)", description: "Depth ranges from 80m to 240m. Strong thermoclines.", color: "rgba(51, 65, 85, 0.1)" },
  { id: "C1", label: "Sector Delta-3 (Reef Nursery)", description: "Critical nesting lagoon for endangered hawksbill turtles.", color: "rgba(16, 185, 129, 0.15)" },
  { id: "C2", label: "Sector Echo-7 (Deep Trench Gateway)", description: "Abrupt drop-off. Subject to powerful deep counter-currents.", color: "rgba(15, 23, 42, 0.15)" },
];
