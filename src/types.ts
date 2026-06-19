export type UserRole = "Citizen" | "Fisherman" | "Researcher" | "Authority" | "Admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
}

export type HazardCategory =
  | "oil_spill"
  | "coral_bleaching"
  | "illegal_fishing"
  | "severe_weather"
  | "marine_debris"
  | "toxic_algae";

export type SeverityLevel = "Critical" | "High" | "Medium" | "Low";

export type VerificationStatus = "Verified" | "Pending" | "Unverified";

export interface HazardReport {
  id: string;
  title: string;
  category: HazardCategory;
  description: string;
  latitude: number;
  longitude: number;
  locationName: string;
  reportedBy: string;
  reporterRole: UserRole;
  reportedAt: string;
  severity: SeverityLevel;
  status: VerificationStatus;
  confidence: number; // 0-100% computed or annotated by AI
  images: string[]; // URLs or base64 data
  aiSummary?: string;
  riskTrend?: string; // Stable, Increasing, Decreasing
}

export interface ActiveAlert {
  id: string;
  title: string;
  description: string;
  category: HazardCategory;
  severity: SeverityLevel;
  issuedAt: string;
  expiresAt: string;
  affectedCoordinates: { lat: number; lng: number; radiusKm: number };
  verifiedBy: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface SocialTrend {
  keyword: string;
  volume24h: number;
  trendPercentage: number;
  sentiment: { positive: number; neutral: number; negative: number };
  topCategory: HazardCategory;
}

export interface MarineAnalyticStats {
  totalReports: number;
  activeAlerts: number;
  verificationRate: number; // e.g. 84%
  averageConfidence: number; // e.g. 78%
}
