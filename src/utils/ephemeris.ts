import {
  ChartAspect,
  CityPreset,
  DailyHoroscopeReading,
  ElementType,
  MemoryItem,
  ModalityType,
  NatalProfile,
  PartnerProfile,
  PlanetName,
  PlanetPlacement,
  ZodiacSign,
  ChatMessage,
} from "../types/astrology";

export const ZODIAC_SIGNS: {
  sign: ZodiacSign;
  glyph: string;
  element: ElementType;
  modality: ModalityType;
  ruler: PlanetName;
  startDegree: number;
}[] = [
  { sign: "Aries", glyph: "♈", element: "Fire", modality: "Cardinal", ruler: "Mars", startDegree: 0 },
  { sign: "Taurus", glyph: "♉", element: "Earth", modality: "Fixed", ruler: "Venus", startDegree: 30 },
  { sign: "Gemini", glyph: "♊", element: "Air", modality: "Mutable", ruler: "Mercury", startDegree: 60 },
  { sign: "Cancer", glyph: "♋", element: "Water", modality: "Cardinal", ruler: "Moon", startDegree: 90 },
  { sign: "Leo", glyph: "♌", element: "Fire", modality: "Fixed", ruler: "Sun", startDegree: 120 },
  { sign: "Virgo", glyph: "♍", element: "Earth", modality: "Mutable", ruler: "Mercury", startDegree: 150 },
  { sign: "Libra", glyph: "♎", element: "Air", modality: "Cardinal", ruler: "Venus", startDegree: 180 },
  { sign: "Scorpio", glyph: "♏", element: "Water", modality: "Fixed", ruler: "Pluto", startDegree: 210 },
  { sign: "Sagittarius", glyph: "♐", element: "Fire", modality: "Mutable", ruler: "Jupiter", startDegree: 240 },
  { sign: "Capricorn", glyph: "♑", element: "Earth", modality: "Cardinal", ruler: "Saturn", startDegree: 270 },
  { sign: "Aquarius", glyph: "♒", element: "Air", modality: "Fixed", ruler: "Uranus", startDegree: 300 },
  { sign: "Pisces", glyph: "♓", element: "Water", modality: "Mutable", ruler: "Neptune", startDegree: 330 },
];

export const PLANET_METADATA: {
  planet: PlanetName;
  glyph: string;
  orbitalPeriodDays: number;
  j2000Longitude: number;
  dailyMotion: number;
  roleLabel: string;
}[] = [
  { planet: "Sun", glyph: "☉", orbitalPeriodDays: 365.256, j2000Longitude: 280.46, dailyMotion: 0.9856, roleLabel: "Core Identity & Conscious Will" },
  { planet: "Moon", glyph: "☽", orbitalPeriodDays: 27.321, j2000Longitude: 218.32, dailyMotion: 13.1764, roleLabel: "Emotional Landscape & Instinct" },
  { planet: "Ascendant", glyph: "ASC", orbitalPeriodDays: 1, j2000Longitude: 0, dailyMotion: 360, roleLabel: "Horizon Mask & Embodied Approach" },
  { planet: "Mercury", glyph: "☿", orbitalPeriodDays: 87.969, j2000Longitude: 252.25, dailyMotion: 1.383, roleLabel: "Cognition, Speech & Perception" },
  { planet: "Venus", glyph: "♀", orbitalPeriodDays: 224.701, j2000Longitude: 181.98, dailyMotion: 1.2, roleLabel: "Desire, Aesthetics & Attachment" },
  { planet: "Mars", glyph: "♂", orbitalPeriodDays: 686.98, j2000Longitude: 355.43, dailyMotion: 0.524, roleLabel: "Drive, Boundaries & Volition" },
  { planet: "Jupiter", glyph: "♃", orbitalPeriodDays: 4332.59, j2000Longitude: 34.35, dailyMotion: 0.0831, roleLabel: "Expansion, Meaning & Abundance" },
  { planet: "Saturn", glyph: "♄", orbitalPeriodDays: 10759.22, j2000Longitude: 50.08, dailyMotion: 0.0335, roleLabel: "Discipline, Time & Mastery" },
  { planet: "Uranus", glyph: "♅", orbitalPeriodDays: 30688.5, j2000Longitude: 314.05, dailyMotion: 0.0117, roleLabel: "Awakening, Innovation & Disruption" },
  { planet: "Neptune", glyph: "♆", orbitalPeriodDays: 60182, j2000Longitude: 304.35, dailyMotion: 0.006, roleLabel: "Transcendence, Dreams & Intuition" },
  { planet: "Pluto", glyph: "♇", orbitalPeriodDays: 90560, j2000Longitude: 238.93, dailyMotion: 0.004, roleLabel: "Metamorphosis & Deep Shadow" },
  { planet: "North Node", glyph: "☊", orbitalPeriodDays: -6793.5, j2000Longitude: 125.04, dailyMotion: -0.0529, roleLabel: "Evolutionary Destiny Vector" },
];

export const CITY_PRESETS: CityPreset[] = [
  { label: "New York, NY, USA", latitude: 40.7128, longitude: -74.006 },
  { label: "London, United Kingdom", latitude: 51.5074, longitude: -0.1278 },
  { label: "Los Angeles, CA, USA", latitude: 34.0522, longitude: -118.2437 },
  { label: "Paris, France", latitude: 48.8566, longitude: 2.3522 },
  { label: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503 },
  { label: "Mumbai, India", latitude: 19.076, longitude: 72.8777 },
  { label: "San Francisco, CA, USA", latitude: 37.7749, longitude: -122.4194 },
  { label: "Berlin, Germany", latitude: 52.52, longitude: 13.405 },
  { label: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093 },
  { label: "Toronto, Canada", latitude: 43.6532, longitude: -79.3832 },
  { label: "Mexico City, Mexico", latitude: 19.4326, longitude: -99.1332 },
  { label: "Buenos Aires, Argentina", latitude: -34.6037, longitude: -58.3816 },
];

export const HOUSE_THEMES: Record<number, string> = {
  1: "Selfhood, Vital Presence & First Impressions",
  2: "Material Anchors, Values & Personal Stewardship",
  3: "Immediate Environment, Inquiry & Dialogue",
  4: "Ancestral Roots, Sanctuary & Private Foundation",
  5: "Creative Sovereignty, Romance & Joy",
  6: "Daily Ritual, Craftsmanship & Somatic Order",
  7: "Sacred Mirrors, Covenants & Committed Others",
  8: "Shared Depth, Alchemy & Psychological Rebirth",
  9: "Philosophy, Far Horizons & Higher Synthesis",
  10: "Public Vocation, Legacy & Architectural Authority",
  11: "Collective Vision, Alliances & Future Ideals",
  12: "Unconscious Sanctuary, Solitude & Liminal Mystery",
};

const SIGN_TRAITS: Record<ZodiacSign, { adjective: string; motif: string }> = {
  Aries: { adjective: "incandescent and pioneering", motif: "instinctive courage and direct initiation" },
  Taurus: { adjective: "grounded and tactile", motif: "enduring devotion, sensory refinement, and deliberate pacing" },
  Gemini: { adjective: "quicksilver and polymathic", motif: "dialectical curiosity and nimble synthesis" },
  Cancer: { adjective: "protective and tidal", motif: "emotional attunement, memory preservation, and fierce loyalty" },
  Leo: { adjective: "radiant and sovereign", motif: "wholehearted creative generosity and theatrical warmth" },
  Virgo: { adjective: "discerning and artisanal", motif: "devotional precision, pattern recognition, and quiet service" },
  Libra: { adjective: "harmonizing and architectural", motif: "relational equilibrium, aesthetic poise, and diplomacy" },
  Scorpio: { adjective: "penetrating and alchemical", motif: "unflinching emotional honesty and transformative depth" },
  Sagittarius: { adjective: "expansive and philosophical", motif: "visionary truth-seeking and mythic optimism" },
  Capricorn: { adjective: "structural and sovereign", motif: "patient mastery, institutional integrity, and long-horizon ambition" },
  Aquarius: { adjective: "iconoclastic and civic", motif: "futurist objectivity, intellectual independence, and systemic reform" },
  Pisces: { adjective: "liminal and empathetic", motif: "poetic permeability, spiritual imagination, and boundless compassion" },
};

function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function getJulianDaysSinceJ2000(birthDate: string, birthTime: string): number {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = (birthTime || "12:00").split(":").map(Number);
  const utcDate = Date.UTC(year || 1995, (month || 1) - 1, day || 1, hour || 12, minute || 0);
  const j2000 = Date.UTC(2000, 0, 1, 12, 0);
  return (utcDate - j2000) / (1000 * 60 * 60 * 24);
}

/**
 * Deterministic astronomical approximation of planetary longitudes, houses, and aspects
 * so any birth date, time, and coordinates produce a complete, mathematically consistent natal chart.
 */
export function calculateNatalChart(params: {
  id?: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  latitude: number;
  longitude: number;
}): NatalProfile {
  const days = getJulianDaysSinceJ2000(params.birthDate, params.birthTime);
  const [hour, minute] = (params.birthTime || "12:00").split(":").map(Number);
  const fractionalHours = (hour || 0) + (minute || 0) / 60;

  // Solar longitude with equation of center approximation
  const meanAnomalySun = normalizeDegrees(357.5291 + 0.98560028 * days);
  const meanAnomalyRad = (meanAnomalySun * Math.PI) / 180;
  const equationOfCenter = 1.9148 * Math.sin(meanAnomalyRad) + 0.02 * Math.sin(2 * meanAnomalyRad);
  const sunLon = normalizeDegrees(280.4665 + 0.98564736 * days + equationOfCenter);

  // Ascendant approximation from local sidereal time + latitude tilt
  const gmst = normalizeDegrees(280.46061837 + 360.98564736629 * days);
  const localSiderealDeg = normalizeDegrees(gmst + params.longitude + fractionalHours * 0.25);
  const latFactor = Math.sin((params.latitude * Math.PI) / 180) * 14.5;
  const ascLon = normalizeDegrees(localSiderealDeg + latFactor);

  const placements: PlanetPlacement[] = PLANET_METADATA.map((meta, idx) => {
    let eclipticLongitude = 0;
    let retrograde = false;

    if (meta.planet === "Sun") {
      eclipticLongitude = sunLon;
    } else if (meta.planet === "Ascendant") {
      eclipticLongitude = ascLon;
    } else if (meta.planet === "Moon") {
      const moonMean = normalizeDegrees(meta.j2000Longitude + meta.dailyMotion * days);
      const moonAnomaly = ((134.963 + 13.06499 * days) * Math.PI) / 180;
      eclipticLongitude = normalizeDegrees(moonMean + 6.289 * Math.sin(moonAnomaly));
    } else if (meta.planet === "Mercury") {
      // Mercury stays within 28° of the Sun
      const mercPhase = ((days * 4.0923 + 174.79) * Math.PI) / 180;
      eclipticLongitude = normalizeDegrees(sunLon + 22.4 * Math.sin(mercPhase));
      retrograde = Math.cos(mercPhase) < -0.72;
    } else if (meta.planet === "Venus") {
      // Venus stays within 47° of the Sun
      const venusPhase = ((days * 1.6021 + 50.41) * Math.PI) / 180;
      eclipticLongitude = normalizeDegrees(sunLon + 41.2 * Math.sin(venusPhase));
      retrograde = Math.cos(venusPhase) < -0.88;
    } else if (meta.planet === "North Node") {
      eclipticLongitude = normalizeDegrees(meta.j2000Longitude + meta.dailyMotion * days);
      retrograde = true;
    } else {
      const meanLon = meta.j2000Longitude + meta.dailyMotion * days;
      const perturbation = Math.sin(((days / (idx + 2) + idx * 47) * Math.PI) / 180) * 4.8;
      eclipticLongitude = normalizeDegrees(meanLon + perturbation);
      const synodicAngle = normalizeDegrees(sunLon - eclipticLongitude);
      retrograde = synodicAngle > 135 && synodicAngle < 225;
    }

    const signIndex = Math.floor(eclipticLongitude / 30) % 12;
    const zodiacInfo = ZODIAC_SIGNS[signIndex];
    const degreeInSign = eclipticLongitude % 30;
    const degree = Math.floor(degreeInSign);
    const arcMinute = Math.floor((degreeInSign - degree) * 60);

    // Whole-sign / Equal house offset relative to Ascendant
    const houseOffset = normalizeDegrees(eclipticLongitude - Math.floor(ascLon / 30) * 30);
    const house = (Math.floor(houseOffset / 30) % 12) + 1;

    const trait = SIGN_TRAITS[zodiacInfo.sign];
    const archetypeTitle = `${meta.planet} in ${zodiacInfo.sign}`;
    const interpretation = `Your ${meta.planet} in ${zodiacInfo.sign} (${degree}°${String(arcMinute).padStart(
      2,
      "0"
    )}', House ${house}) channels ${meta.roleLabel.toLowerCase()} through a ${
      trait.adjective
    } lens. Placed in the domain of ${HOUSE_THEMES[house].toLowerCase()}, it cultivates ${trait.motif}.`;

    return {
      planet: meta.planet,
      glyph: meta.glyph,
      sign: zodiacInfo.sign,
      signGlyph: zodiacInfo.glyph,
      degree,
      minute: arcMinute,
      eclipticLongitude: Number(eclipticLongitude.toFixed(2)),
      house,
      element: zodiacInfo.element,
      modality: zodiacInfo.modality,
      retrograde,
      archetypeTitle,
      interpretation,
    };
  });

  // Compute Element & Modality distribution (weighting Big Three + Personal Planets slightly higher)
  const elements: Record<ElementType, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modalities: Record<ModalityType, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };

  let totalWeight = 0;
  placements.forEach((p) => {
    const weight =
      p.planet === "Sun" || p.planet === "Moon" || p.planet === "Ascendant"
        ? 2
        : p.planet === "Mercury" || p.planet === "Venus" || p.planet === "Mars"
        ? 1.5
        : 1;
    elements[p.element] += weight;
    modalities[p.modality] += weight;
    totalWeight += weight;
  });

  (Object.keys(elements) as ElementType[]).forEach((el) => {
    elements[el] = Math.round((elements[el] / totalWeight) * 100);
  });
  (Object.keys(modalities) as ModalityType[]).forEach((mod) => {
    modalities[mod] = Math.round((modalities[mod] / totalWeight) * 100);
  });

  const dominantElement = (Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0] as ElementType) || "Water";
  const dominantModality = (Object.entries(modalities).sort((a, b) => b[1] - a[1])[0][0] as ModalityType) || "Fixed";

  const ascSign = placements.find((p) => p.planet === "Ascendant")?.sign || "Scorpio";
  const chartRuler = ZODIAC_SIGNS.find((z) => z.sign === ascSign)?.ruler || "Pluto";

  const aspects = calculateInternalAspects(placements);

  return {
    id: params.id || `natal-${Date.now()}`,
    name: params.name,
    birthDate: params.birthDate,
    birthTime: params.birthTime,
    birthLocation: params.birthLocation,
    latitude: params.latitude,
    longitude: params.longitude,
    placements,
    aspects,
    elements,
    modalities,
    dominantElement,
    dominantModality,
    chartRuler,
  };
}

export function calculateInternalAspects(placements: PlanetPlacement[]): ChartAspect[] {
  const aspects: ChartAspect[] = [];
  const coreBodies = placements.slice(0, 10); // Sun through Neptune

  const aspectDefs: {
    type: ChartAspect["type"];
    targetAngle: number;
    maxOrb: number;
    harmony: ChartAspect["harmony"];
    verb: string;
  }[] = [
    { type: "Conjunction", targetAngle: 0, maxOrb: 7.5, harmony: "dynamic", verb: "fuses directly with" },
    { type: "Trine", targetAngle: 120, maxOrb: 6.5, harmony: "harmonious", verb: "flows effortlessly with" },
    { type: "Sextile", targetAngle: 60, maxOrb: 5.0, harmony: "harmonious", verb: "catalyzes creative dialogue with" },
    { type: "Square", targetAngle: 90, maxOrb: 6.0, harmony: "challenging", verb: "creates productive tension with" },
    { type: "Opposition", targetAngle: 180, maxOrb: 6.5, harmony: "challenging", verb: "polarizes and mirrors" },
  ];

  for (let i = 0; i < coreBodies.length; i++) {
    for (let j = i + 1; j < coreBodies.length; j++) {
      const pA = coreBodies[i];
      const pB = coreBodies[j];
      let diff = Math.abs(pA.eclipticLongitude - pB.eclipticLongitude);
      if (diff > 180) diff = 360 - diff;

      for (const def of aspectDefs) {
        const orb = Math.abs(diff - def.targetAngle);
        if (orb <= def.maxOrb) {
          aspects.push({
            id: `${pA.planet}-${pB.planet}-${def.type}`,
            planetA: pA.planet,
            planetB: pB.planet,
            signA: pA.sign,
            signB: pB.sign,
            type: def.type,
            angle: Number(diff.toFixed(1)),
            orb: Number(orb.toFixed(2)),
            harmony: def.harmony,
            summary: `${pA.planet} in ${pA.sign} ${def.verb} ${pB.planet} in ${pB.sign} (${orb.toFixed(1)}° orb).`,
          });
          break;
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb).slice(0, 12);
}

export function calculateSynastryAspects(chartA: NatalProfile, chartB: NatalProfile): ChartAspect[] {
  const synastryAspects: ChartAspect[] = [];
  const bodiesA = chartA.placements.slice(0, 8);
  const bodiesB = chartB.placements.slice(0, 8);

  const aspectDefs: {
    type: ChartAspect["type"];
    targetAngle: number;
    maxOrb: number;
    harmony: ChartAspect["harmony"];
  }[] = [
    { type: "Conjunction", targetAngle: 0, maxOrb: 7, harmony: "dynamic" },
    { type: "Trine", targetAngle: 120, maxOrb: 6, harmony: "harmonious" },
    { type: "Sextile", targetAngle: 60, maxOrb: 5, harmony: "harmonious" },
    { type: "Square", targetAngle: 90, maxOrb: 5.5, harmony: "challenging" },
    { type: "Opposition", targetAngle: 180, maxOrb: 6, harmony: "challenging" },
  ];

  for (const pA of bodiesA) {
    for (const pB of bodiesB) {
      let diff = Math.abs(pA.eclipticLongitude - pB.eclipticLongitude);
      if (diff > 180) diff = 360 - diff;

      for (const def of aspectDefs) {
        const orb = Math.abs(diff - def.targetAngle);
        if (orb <= def.maxOrb) {
          synastryAspects.push({
            id: `syn-${pA.planet}-${pB.planet}`,
            planetA: pA.planet,
            planetB: pB.planet,
            signA: pA.sign,
            signB: pB.sign,
            type: def.type,
            angle: Number(diff.toFixed(1)),
            orb: Number(orb.toFixed(2)),
            harmony: def.harmony,
            summary: `${chartA.name}'s ${pA.planet} (${pA.sign}) ${def.type.toLowerCase()} ${chartB.name}'s ${
              pB.planet
            } (${pB.sign}) · Orb ${orb.toFixed(1)}°`,
          });
          break;
        }
      }
    }
  }

  return synastryAspects.sort((a, b) => a.orb - b.orb).slice(0, 10);
}

// Default Pre-Calibrated User Profile
export const DEFAULT_USER_PROFILE: NatalProfile = calculateNatalChart({
  id: "user-primary",
  name: "Clara Vance",
  birthDate: "1994-11-08",
  birthTime: "21:15",
  birthLocation: "New York, NY, USA",
  latitude: 40.7128,
  longitude: -74.006,
});

// Default Saved Partner & Friend Profiles for Synastry
const julianBase = calculateNatalChart({
  id: "partner-julian",
  name: "Julian Mercer",
  birthDate: "1992-05-14",
  birthTime: "08:40",
  birthLocation: "London, United Kingdom",
  latitude: 51.5074,
  longitude: -0.1278,
});

const sorenBase = calculateNatalChart({
  id: "partner-soren",
  name: "Soren Lindqvist",
  birthDate: "1995-02-09",
  birthTime: "14:20",
  birthLocation: "Berlin, Germany",
  latitude: 52.52,
  longitude: 13.405,
});

const amaraBase = calculateNatalChart({
  id: "partner-amara",
  name: "Amara Okafor",
  birthDate: "1994-07-29",
  birthTime: "18:05",
  birthLocation: "Paris, France",
  latitude: 48.8566,
  longitude: 2.3522,
});

export const INITIAL_SAVED_PARTNERS: PartnerProfile[] = [
  {
    ...julianBase,
    relationshipType: "romantic",
    relationshipLabel: "Romantic Partner",
    notes: "Together for 14 months; exploring moving into a shared loft this winter.",
    cachedReports: {
      romantic: {
        archetypeTitle: "The Alchemical Anchor: Fixed Water Meets Tactile Earth",
        overallScore: 91,
        metrics: {
          emotionalResonance: 94,
          intellectualRapport: 86,
          chemistryOrSynergy: 93,
          longTermStability: 90,
        },
        editorialOverview:
          "Clara's Scorpio Sun and nocturnal water emphasis find an extraordinarily steadying counterpart in Julian's Taurus Sun and grounded earth architecture. Across the zodiacal wheel, Scorpio and Taurus form the axis of deep attachment, shared stewardship, and sensory devotion. Where Clara instinctively probes beneath the surface for psychological truth, Julian supplies tangible permanence and calm somatic presence.\n\nThis pairing thrives on unspoken loyalty and high emotional investment. While both charts carry strong Fixed modality signatures—meaning neither yields easily once a conviction hardens—their planetary contacts convert potential stubbornness into enduring mutual protection.",
        elementalInterplay:
          "Water and Earth form fertile clay: Clara's emotional intuition nourishes Julian's pragmatic structures, while Julian's earthy patience prevents Clara's intensity from overflowing.",
        keySynastryAspects: [
          {
            aspectLabel: "Clara Sun in Scorpio Opposition Julian Sun in Taurus",
            orb: "1°14'",
            nature: "magnetic",
            meaning:
              "A classic polarity attraction that creates immediate fascination and complementary strengths in shared domestic decisions.",
          },
          {
            aspectLabel: "Clara Venus in Scorpio Trine Julian Moon in Cancer",
            orb: "0°48'",
            nature: "harmonious",
            meaning:
              "Deep, unforced emotional safety; domestic life and unspoken tenderness feel restorative and protective for both partners.",
          },
          {
            aspectLabel: "Clara Mars in Leo Square Julian Saturn in Taurus",
            orb: "2°21'",
            nature: "challenging",
            meaning:
              "Occasional pacing friction when Clara wants rapid creative change and Julian prefers methodical financial caution.",
          },
        ],
        luminariesAndStrengths: [
          "Rare emotional fidelity and depth of trust across the Scorpio-Taurus relational axis.",
          "Harmonious water-sign lunar rapport that makes home life a genuine sanctuary.",
          "Shared appreciation for privacy, aesthetics, and long-term material building.",
        ],
        growthEdges: [
          "Fixed-sign stalemates during disagreements—avoid silent withdrawal when navigating lease or financial timelines.",
          "Balancing Clara's appetite for psychological metamorphosis with Julian's preference for predictable routines.",
        ],
        bespokeCounsel:
          "As you discuss cohabitation this season, schedule conversations during calm morning hours rather than late at night. Lead with shared tangible visions before diving into emotional edge-cases.",
        generatedAt: "2026-10-25",
        lens: "romantic",
      },
    },
  },
  {
    ...sorenBase,
    relationshipType: "friendship",
    relationshipLabel: "Close Friend & Creative Peer",
    notes: "Longtime design collaborator and sounding board for studio decisions.",
    cachedReports: {
      friendship: {
        archetypeTitle: "The Architect & The Futurist: Strategic Vision in Stereo",
        overallScore: 87,
        metrics: {
          emotionalResonance: 79,
          intellectualRapport: 96,
          chemistryOrSynergy: 91,
          longTermStability: 84,
        },
        editorialOverview:
          "In platonic and creative collaboration, Clara and Soren operate as high-voltage intellectual foils. Soren's Aquarius Sun and air-dominant chart bring bird's-eye systemic clarity, while Clara's Scorpio placements supply forensic depth and emotional resonance. When you critique each other's creative work, nothing superficial survives.\n\nBecause both charts share Fixed modality stamina, your friendship endures long stretches of independent focus without losing warmth or trust.",
        elementalInterplay:
          "Water and Air require intentional translation: Soren approaches dilemmas through conceptual frameworks, whereas Clara reads the subterranean emotional currents of a room.",
        keySynastryAspects: [
          {
            aspectLabel: "Clara Mercury in Scorpio Trine Soren Ascendant",
            orb: "1°05'",
            nature: "harmonious",
            meaning:
              "Seamless, high-trust dialogue; you quickly decode each other's shorthand during creative brainstorming.",
          },
          {
            aspectLabel: "Clara Sun in Scorpio Square Soren Sun in Aquarius",
            orb: "2°09'",
            nature: "challenging",
            meaning:
              "Productive intellectual friction that pushes both of you past safe, conventional ideas.",
          },
        ],
        luminariesAndStrengths: [
          "Zero small talk—your conversations immediately reach philosophical and strategic depth.",
          "Complementary blind-spot detection when evaluating career opportunities or collaborators.",
          "Unwavering respect for each other's autonomy and creative solitude.",
        ],
        growthEdges: [
          "Soren can occasionally intellectualize feelings when Clara is seeking empathetic presence rather than solutions.",
        ],
        bespokeCounsel:
          "Lean on Soren when structuring the external positioning of your autumn studio projects—their Aquarian detachment will sharpen your pitch.",
        generatedAt: "2026-10-25",
        lens: "friendship",
      },
    },
  },
  {
    ...amaraBase,
    relationshipType: "friendship",
    relationshipLabel: "Platonic Confidante",
    notes: "Childhood friend; fellow creative director living in Paris.",
  },
];

export const INITIAL_MEMORY_BANK: MemoryItem[] = [
  {
    id: "mem-1",
    category: "goal",
    content: "Preparing to transition from senior architect to launching an independent spatial design studio in November.",
    referencedPlacements: ["Sun in Scorpio · House V", "Saturn in House X"],
    createdAt: "2026-10-18",
    source: "auto_extracted",
  },
  {
    id: "mem-2",
    category: "relationship",
    content: "In a 14-month romantic partnership with Julian Mercer (Taurus Sun); currently weighing moving into a shared loft together this winter.",
    referencedPlacements: ["Venus in Scorpio", "House VII"],
    createdAt: "2026-10-20",
    source: "auto_extracted",
  },
  {
    id: "mem-3",
    category: "emotional_pattern",
    content: "Tends to internalize stress and over-research in solitude when facing high-stakes creative visibility.",
    referencedPlacements: ["Moon in Aquarius", "Ascendant in Cancer"],
    createdAt: "2026-10-22",
    source: "auto_extracted",
  },
  {
    id: "mem-4",
    category: "life_event",
    content: "Collaborating with close friend Soren Lindqvist (Aquarius Sun) on an exhibition monograph this autumn.",
    referencedPlacements: ["Mercury in Scorpio", "House XI"],
    createdAt: "2026-10-24",
    source: "auto_extracted",
  },
];

export const INITIAL_DAILY_HOROSCOPE: DailyHoroscopeReading = {
  headline: "Subterranean Clarity Beneath the Early Scorpio Sun",
  subheadline:
    "As the Sun crosses the opening degrees of Scorpio and forms a water trine to the Pisces Moon, your natal fifth house of sovereign creation awakens.",
  leadSynthesis:
    "Today's sky mirrors the core architecture of your natal chart, Clara. With the transiting Sun newly arrived in Scorpio illuminating your natal Solar placement and the Pisces Moon casting a restorative trine across your water houses, the internal pressure you have carried around your November studio launch begins to crystallize into calm conviction. You do not need to force external momentum through sheer willpower today; your magnetism is strongest when you allow your work to speak with quiet, unhurried authority.\n\nMeanwhile, transiting Venus in Sagittarius activates your sixth house of daily craft while conversing with your natal Mars. Where recent weeks asked you to hold private counsel and refine blueprints behind closed doors, today's lunar alignment invites you to let trusted allies—both Julian at home and Soren in the studio—witness the structure before it is polished to perfection.",
  pullQuote:
    "True sovereignty does not announce itself with noise; it reorganizes the room through depth of presence.",
  domains: {
    innerAlchemy:
      "The Pisces Moon softens your nocturnal defenses. Notice if you are retreating into hyper-analysis to avoid vulnerability; a walk near water or 20 minutes of unscheduled stillness before dusk will restore your nervous system.",
    loveAndBonds:
      "With your partnership with Julian approaching a domestic milestone this winter, today's Venus-Moon harmony favors tactile reassurance over heavy logistical debate. Share a slow meal and speak from gratitude rather than contingency planning.",
    vocationAndPurpose:
      "Mercury in Scorpio sharpens your editorial eye to surgical precision. Dedicate the afternoon window (14:00–17:00) to finalizing your independent studio charter and financial scope—your judgment on long-term contracts is exceptionally clear.",
  },
  keyTransits: [
    {
      transitTitle: "Transit Moon in Pisces Trine Natal Sun in Scorpio",
      orbAndHouse: "Orb 0°38' · Activating Natal House V & IX",
      harmony: "harmonious",
      interpretation:
        "Creates an effortless bridge between your emotional intuition and your creative authority, ideal for articulating your design philosophy.",
    },
    {
      transitTitle: "Transit Mercury in Scorpio Conjunct Natal Venus",
      orbAndHouse: "Orb 1°12' · Activating Natal House V",
      harmony: "dynamic",
      interpretation:
        "Infuses your spoken and written words with persuasive warmth; conversations with romantic partners or patrons carry lasting resonance.",
    },
    {
      transitTitle: "Transit Saturn Square Natal Ascendant",
      orbAndHouse: "Orb 1°49' · Activating Natal House I & X",
      harmony: "transformative",
      interpretation:
        "Demands disciplined boundaries around your time as you step into public leadership this autumn—say no to peripheral obligations.",
    },
  ],
  ritualDirective:
    "Write down the single structural decision you have been postponing for your November launch, and review it by candlelight after sunset without editing.",
  timeframe: "today",
  focus: "holistic",
  generatedAt: "2026-10-25",
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome-1",
    role: "assistant",
    content:
      "Welcome back to the Observatory, Clara. With the Sun now moving through the early degrees of Scorpio and harmonizing with your natal fifth-house placements, we are entering the exact seasonal corridor you earmarked for your November spatial design studio launch.\n\nI also hold in memory your ongoing conversations with Julian about moving into a shared loft this winter, alongside your tendency to retreat into solitary research when visibility rises. How is the balance between your creative leap and your domestic sanctuary feeling today?",
    timestamp: "22:30",
    referencedPlacements: [
      "Natal Sun in Scorpio · House V",
      "Natal Moon in Aquarius · House VIII",
      "Transit Sun Trine Pisces Moon",
    ],
    followUpPrompts: [
      "How do my Saturn transits affect launching my studio in November?",
      "What does our synastry say about moving in with Julian this winter?",
      "Why do I pull back emotionally right before a major creative milestone?",
    ],
  },
];
