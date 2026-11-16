export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export type ElementType = "Fire" | "Earth" | "Air" | "Water";
export type ModalityType = "Cardinal" | "Fixed" | "Mutable";

export type PlanetName =
  | "Sun"
  | "Moon"
  | "Ascendant"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto"
  | "North Node";

export interface PlanetPlacement {
  planet: PlanetName;
  glyph: string;
  sign: ZodiacSign;
  signGlyph: string;
  degree: number; // 0 - 29
  minute: number; // 0 - 59
  eclipticLongitude: number; // 0 - 359.99
  house: number; // 1 - 12
  element: ElementType;
  modality: ModalityType;
  retrograde: boolean;
  dignity?: string;
  archetypeTitle: string;
  interpretation: string;
}

export interface ChartAspect {
  id: string;
  planetA: PlanetName;
  planetB: PlanetName;
  signA: ZodiacSign;
  signB: ZodiacSign;
  type: "Conjunction" | "Trine" | "Sextile" | "Square" | "Opposition";
  angle: number;
  orb: number;
  harmony: "harmonious" | "dynamic" | "challenging";
  summary: string;
}

export interface NatalProfile {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthLocation: string;
  latitude: number;
  longitude: number;
  placements: PlanetPlacement[];
  aspects: ChartAspect[];
  elements: Record<ElementType, number>;
  modalities: Record<ModalityType, number>;
  dominantElement: ElementType;
  dominantModality: ModalityType;
  chartRuler: PlanetName;
}

export type RelationshipCategory = "romantic" | "friendship";

export interface SynastryReport {
  archetypeTitle: string;
  overallScore: number;
  metrics: {
    emotionalResonance: number;
    intellectualRapport: number;
    chemistryOrSynergy: number;
    longTermStability: number;
  };
  editorialOverview: string;
  elementalInterplay: string;
  keySynastryAspects: {
    aspectLabel: string;
    orb: string;
    nature: "harmonious" | "magnetic" | "challenging";
    meaning: string;
  }[];
  luminariesAndStrengths: string[];
  growthEdges: string[];
  bespokeCounsel: string;
  generatedAt?: string;
  lens?: RelationshipCategory;
}

export interface PartnerProfile extends NatalProfile {
  relationshipType: RelationshipCategory;
  relationshipLabel: string; // e.g. "Romantic Partner", "Close Friend", "Creative Collaborator"
  notes?: string;
  cachedReports?: Partial<Record<RelationshipCategory, SynastryReport>>;
}

export interface DailyHoroscopeReading {
  headline: string;
  subheadline: string;
  leadSynthesis: string;
  pullQuote: string;
  domains: {
    innerAlchemy: string;
    loveAndBonds: string;
    vocationAndPurpose: string;
  };
  keyTransits: {
    transitTitle: string;
    orbAndHouse: string;
    harmony: "harmonious" | "dynamic" | "transformative";
    interpretation: string;
  }[];
  ritualDirective: string;
  timeframe?: "today" | "tomorrow" | "weekly";
  focus?: "holistic" | "love" | "career" | "inner_growth";
  generatedAt?: string;
}

export type MemoryCategory = "life_event" | "relationship" | "emotional_pattern" | "goal";

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  content: string;
  referencedPlacements: string[];
  createdAt: string;
  source: "auto_extracted" | "manual";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  referencedPlacements?: string[];
  extractedMemories?: MemoryItem[];
  followUpPrompts?: string[];
}

export interface CityPreset {
  label: string;
  latitude: number;
  longitude: number;
}
