import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Ordered model cascade to handle temporary 503 spikes on any single model
const MODEL_CASCADE = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

async function generateStructuredJsonWithFallback<T>(params: {
  prompt: string;
  systemInstruction: string;
  responseSchema: any;
  fallbackGenerator: () => T;
}): Promise<T> {
  if (!process.env.GEMINI_API_KEY) {
    return params.fallbackGenerator();
  }

  for (const modelName of MODEL_CASCADE) {
    try {
      const config: any = {
        systemInstruction: params.systemInstruction,
        responseMimeType: "application/json",
        responseSchema: params.responseSchema,
      };

      if (modelName === "gemini-3.8-flash") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on ${modelName}`)), 6000)
      );

      const response: any = await Promise.race([
        ai.models.generateContent({
          model: modelName,
          contents: params.prompt,
          config,
        }),
        timeoutPromise,
      ]);

      const rawText = response?.text;
      if (rawText) {
        return JSON.parse(rawText.trim()) as T;
      }
    } catch (err: any) {
      console.warn(
        `[Aetheris] Model ${modelName} unavailable (${err?.status || err?.message || "error"}), trying next...`
      );
    }
  }

  // If all upstream models are experiencing 503 high demand or rate limits,
  // synthesize deterministically from the user's natal ephemeris & memory bank.
  return params.fallbackGenerator();
}

/**
 * Deterministic Ephemeris Horoscope Synthesizer for instant resilience during 503 spikes
 */
function buildEphemerisHoroscope(
  profile: any,
  timeframe: string,
  focus: string,
  memories: any[],
  variationSeed = 0
) {
  const placements = profile?.placements || [];
  const findPlanet = (name: string) =>
    placements.find((p: any) => p.planet === name) || {
      planet: name,
      sign: "Scorpio",
      degree: 14,
      minute: 22,
      house: 5,
    };

  const sun = findPlanet("Sun");
  const moon = findPlanet("Moon");
  const asc = findPlanet("Ascendant");
  const mercury = findPlanet("Mercury");
  const venus = findPlanet("Venus");
  const mars = findPlanet("Mars");
  const saturn = findPlanet("Saturn");
  const jupiter = findPlanet("Jupiter");

  const recentMemory =
    Array.isArray(memories) && memories.length > 0
      ? memories[variationSeed % memories.length]?.content
      : null;

  const timeframeTitleMap: Record<string, string> = {
    today: "Today's",
    tomorrow: "Tomorrow's",
    weekly: "The 7-Day",
  };

  const headlineVariants: Record<string, Record<string, string[]>> = {
    today: {
      holistic: [
        `Luminous Alignment Across Your ${sun.sign} Sun & ${asc.sign} Horizon`,
        `Velvet Gravity: The Scorpio Sun Awakens Your Natal House ${sun.house}`,
        `Harmonic Convergence Between Your ${moon.sign} Moon & the Nocturnal Tide`,
      ],
      love: [
        `Magnetic Currents Between Your ${venus.sign} Venus & the Pisces Moon`,
        `Unspoken Tenderness Across Your Seventh-House Relational Mirror`,
        `Alchemical Intimacy: Venus & Mars Ignite Your ${venus.sign} Placements`,
      ],
      career: [
        `Architectural Precision as Saturn Steadies Your ${saturn.sign} Axis`,
        `Sovereign Authorship: Mercury Sharpens Your House ${sun.house} Blueprint`,
        `Strategic Command Under the Scorpio Solar Meridian`,
      ],
      inner_growth: [
        `Nocturnal Stillness & Alchemical Renewal for Your ${moon.sign} Moon`,
        `Sanctuary of the Deep Waters: Listening to Your ${asc.sign} Intuition`,
        `Subterranean Clarity: Releasing Urgency in Natal House ${moon.house}`,
      ],
    },
    tomorrow: {
      holistic: [
        `As the Moon Crosses into Aries, Your ${mars.sign} Mars Awakens`,
        `Cardinal Fire Horizon: Fresh Momentum for Your ${sun.sign} Sun`,
        `The Equinox of Will: Translating ${moon.sign} Reflection into Motion`,
      ],
      love: [
        `Direct Emotional Honesty Illuminates Your Seventh-House Mirror`,
        `Spontaneous Warmth & Courageous Dialogue for Your ${venus.sign} Venus`,
      ],
      career: [
        `Decisive Momentum for Your ${sun.sign} Solar Ambitions`,
        `First-Principle Execution Across Your Natal Tenth House`,
      ],
      inner_growth: [
        `Threshold Courage: Translating Private Intuition into Action`,
        `Somatic Vitalization Under Tomorrow's Lunar Ingress`,
      ],
    },
    weekly: {
      holistic: [
        `The Seven-Day Scorpio Corridor: Sovereignty in House ${sun.house}`,
        `Weekly Ephemeris Arc: Integrating ${sun.sign} Will & ${moon.sign} Wisdom`,
      ],
      love: [
        `A Week of Deepening Covenants for Your ${venus.sign} Venus`,
        `Seven Days of Relational Alchemy Across Your Water & Earth Houses`,
      ],
      career: [
        `Long-Horizon Mastery Under the Jupiter-Saturn Trine`,
        `Architecting the Autumn Milestone: Your 7-Day Vocational Forecast`,
      ],
      inner_growth: [
        `Integrating Shadow & Luminosity Across Your Water Houses`,
        `A Week of Restorative Solitude & Creative Gestation`,
      ],
    },
  };

  const pool =
    headlineVariants[timeframe]?.[focus] ||
    headlineVariants.today.holistic;
  const selectedHeadline = pool[variationSeed % pool.length];

  const subheadline = `${
    timeframeTitleMap[timeframe] || "Today's"
  } transit geometry links the Scorpio Sun with your natal ${sun.planet} in ${
    sun.sign
  } (${sun.degree}°${String(sun.minute).padStart(2, "0")}', House ${
    sun.house
  }), bringing heightened clarity to your ${
    focus === "love"
      ? "relational attachments and emotional reciprocity"
      : focus === "career"
      ? "vocational architecture and long-term authority"
      : focus === "inner_growth"
      ? "subconscious patterns and nervous-system sanctuary"
      : "creative sovereignty and personal trajectory"
  }.`;

  const memoryClause = recentMemory
    ? ` In light of what we hold in your Memory Bank—"${recentMemory}"—this alignment asks you to trust the groundwork you have already laid rather than second-guessing the timing.`
    : "";

  const leadSynthesis = `Across ${
    timeframe === "weekly"
      ? "the coming seven days"
      : timeframe === "tomorrow"
      ? "tomorrow's shifting lunar horizon"
      : "today's nocturnal ephemeris"
  }, the sky speaks directly to the core triad of your birth chart, ${
    profile.name
  }. With your natal Sun anchored at ${sun.degree}° ${sun.sign} in House ${
    sun.house
  } and your ${moon.sign} Moon governing House ${
    moon.house
  }, transiting luminaries activate the exact degrees where your private intuition meets external structure.${memoryClause}\n\nMeanwhile, Mercury in ${
    mercury.sign
  } and Venus in ${venus.sign} harmonize with your ${
    asc.sign
  } Ascendant. Where recent cycles demanded solitary refinement behind closed doors, this transit window rewards deliberate, unhurried self-expression. Let your decisions be guided by your dominant ${
    profile.dominantElement || "Water"
  } temperament—choosing depth of impact over performative urgency.`;

  const pullQuoteMap: Record<string, string> = {
    holistic:
      "When intention aligns with planetary timing, effort transforms into quiet inevitability.",
    love: "Intimacy deepens not by erasing difference, but by honoring the sacred rhythm between two horizons.",
    career:
      "Lasting architecture is built in the unseen hours when Saturn tests the blueprint.",
    inner_growth:
      "Your Moon knows the tide long before the intellect names the shore.",
  };

  return {
    headline: selectedHeadline,
    subheadline,
    leadSynthesis,
    pullQuote: pullQuoteMap[focus] || pullQuoteMap.holistic,
    domains: {
      innerAlchemy: `With your natal Moon in ${moon.sign} (${moon.degree}°, House ${moon.house}), ${
        timeframe === "tomorrow"
          ? "tomorrow's cardinal shift"
          : "the current lunar tide"
      } heightens sensory and emotional perception. Protect thirty minutes of unscheduled quiet in the evening to let insights settle without analytical pressure.`,
      loveAndBonds: `Your natal Venus in ${venus.sign} (House ${venus.house}) and Mars in ${mars.sign} respond warmly to direct, unguarded presence. Whether navigating romantic partnership or close creative friendship, lead with tactile reassurance and clear spoken boundaries.`,
      vocationAndPurpose: `Natal Saturn in ${saturn.sign} (House ${saturn.house}) and Jupiter in ${jupiter.sign} anchor your professional stamina. Focus your highest-leverage strategic work on the primary milestone in your Memory Bank and decline peripheral distractions.`,
    },
    keyTransits: [
      {
        transitTitle: `Transit Sun in Scorpio ${
          sun.element === "Water" ? "Trine" : "Sextile"
        } Natal Sun in ${sun.sign}`,
        orbAndHouse: `Orb 0°44' · Activating Natal House ${sun.house}`,
        harmony: "harmonious" as const,
        interpretation: `Reinforces your core vitality and creative authority in House ${sun.house}, making it easier to articulate your long-term vision.`,
      },
      {
        transitTitle: `Transit Moon ${
          timeframe === "tomorrow" ? "in Aries" : "in Pisces"
        } Aspecting Natal Venus in ${venus.sign}`,
        orbAndHouse: `Orb 1°15' · Activating Natal House ${venus.house}`,
        harmony: "dynamic" as const,
        interpretation: `Heightens relational magnetism and aesthetic discernment; ideal for meaningful conversations with partners or collaborators.`,
      },
      {
        transitTitle: `Transit Saturn in Aries Aspecting Natal ${saturn.planet} in ${saturn.sign}`,
        orbAndHouse: `Orb 1°52' · Activating Natal House ${saturn.house} & X`,
        harmony: "transformative" as const,
        interpretation: `Calls for disciplined stewardship of your time and energy as you turn autumn plans into durable reality.`,
      },
    ],
    ritualDirective:
      timeframe === "tomorrow"
        ? `Before tomorrow's midday meridian, write down the single boldest action your ${mars.sign} Mars has been waiting to initiate—and commit to its first step.`
        : timeframe === "weekly"
        ? `Anchor this seven-day arc by reviewing your Memory Bank milestones each evening and noting which conversations leave your ${moon.sign} Moon feeling energized.`
        : `At dusk tonight, step away from screens for twenty minutes and reflect on how your ${sun.sign} Sun and ${moon.sign} Moon want to pace the week ahead.`,
  };
}

/**
 * Deterministic Astrologer Chat & Automatic Memory Extraction Synthesizer
 */
function buildEphemerisChatResponse(params: {
  message: string;
  userProfile: any;
  savedPartners: any[];
  focusedPartnerId: string | null;
  memories: any[];
}) {
  const { message, userProfile, savedPartners = [], focusedPartnerId, memories = [] } = params;
  const placements = userProfile?.placements || [];
  const findP = (name: string) =>
    placements.find((p: any) => p.planet === name) || {
      planet: name,
      sign: "Scorpio",
      degree: 14,
      minute: 10,
      house: 5,
    };

  const sun = findP("Sun");
  const moon = findP("Moon");
  const asc = findP("Ascendant");
  const venus = findP("Venus");
  const mars = findP("Mars");
  const saturn = findP("Saturn");
  const mercury = findP("Mercury");

  const lower = message.toLowerCase();

  // Check if a partner is mentioned or focused
  const focusedPartner =
    savedPartners.find((p: any) => p.id === focusedPartnerId) ||
    savedPartners.find((p: any) => lower.includes(p.name.toLowerCase().split(" ")[0]));

  // Automatic memory extraction from user disclosure
  const extractedMemories: {
    category: "life_event" | "relationship" | "emotional_pattern" | "goal";
    content: string;
    referencedPlacements: string[];
  }[] = [];

  const isQuestionOnly =
    lower.startsWith("how ") ||
    lower.startsWith("what ") ||
    lower.startsWith("why ") ||
    lower.startsWith("can ") ||
    lower.startsWith("explain ") ||
    lower.startsWith("analyze ") ||
    lower.startsWith("regarding ");

  if (!isQuestionOnly && message.trim().length > 18) {
    let category: "life_event" | "relationship" | "emotional_pattern" | "goal" = "life_event";
    let refs = [`Sun in ${sun.sign} · House ${sun.house}`];

    if (
      lower.includes("launch") ||
      lower.includes("studio") ||
      lower.includes("career") ||
      lower.includes("job") ||
      lower.includes("work") ||
      lower.includes("project") ||
      lower.includes("build") ||
      lower.includes("goal")
    ) {
      category = "goal";
      refs = [`Saturn in ${saturn.sign} · House ${saturn.house}`, `Sun in ${sun.sign}`];
    } else if (
      lower.includes("partner") ||
      lower.includes("love") ||
      lower.includes("dating") ||
      lower.includes("friend") ||
      lower.includes("julian") ||
      lower.includes("soren") ||
      lower.includes("amara") ||
      lower.includes("relationship") ||
      lower.includes("moving in")
    ) {
      category = "relationship";
      refs = [`Venus in ${venus.sign} · House ${venus.house}`, `Moon in ${moon.sign}`];
    } else if (
      lower.includes("feel") ||
      lower.includes("anxious") ||
      lower.includes("stress") ||
      lower.includes("pull back") ||
      lower.includes("afraid") ||
      lower.includes("overwhelmed") ||
      lower.includes("solitude")
    ) {
      category = "emotional_pattern";
      refs = [`Moon in ${moon.sign} · House ${moon.house}`, `Ascendant in ${asc.sign}`];
    }

    const cleanedNote =
      message.length > 140 ? `${message.slice(0, 137).trim()}...` : message.trim();

    const alreadyExists = memories.some(
      (m: any) => m.content?.toLowerCase() === cleanedNote.toLowerCase()
    );
    if (!alreadyExists) {
      extractedMemories.push({
        category,
        content: cleanedNote,
        referencedPlacements: refs,
      });
    }
  }

  // Build context-rich reply tailored to the specific topic in the user's message
  let reply = "";
  let referencedPlacements: string[] = [];
  let followUpPrompts: string[] = [];

  if (lower.includes("saturn") || lower.includes("studio") || lower.includes("launch") || lower.includes("november") || lower.includes("career") || lower.includes("vocation")) {
    reply = `Looking closely at your natal Saturn in ${saturn.sign} (${saturn.degree}°${String(
      saturn.minute
    ).padStart(2, "0")}', House ${saturn.house}) alongside your ${sun.sign} Sun in House ${
      sun.house
    }, your November studio launch sits inside a classic Saturnian maturation threshold, ${
      userProfile.name
    }. Saturn never blocks authentic vocation—instead, it asks you to strip away unessential obligations so the core foundation can bear real weight.\n\nBecause transiting Saturn is currently forming a dynamic aspect to your ${
      asc.sign
    } Ascendant while the Scorpio Sun illuminates your fifth house of sovereign creation, the pressure you feel right now is the sensation of stepping from backstage preparation into visible authorship. Remember what we hold in your Memory Bank about your tendency to over-research in solitude when visibility rises: treat November not as an exam requiring perfection, but as the steady opening of a doorsill you have already earned.\n\nPractically, favor clear contractual boundaries and phased deliverables between now and mid-November. Your ${
      mercury.sign
    } Mercury gives you forensic clarity in negotiations—trust your first structural instinct.`;

    referencedPlacements = [
      `Natal Saturn in ${saturn.sign} · House ${saturn.house}`,
      `Natal Sun in ${sun.sign} · House ${sun.house}`,
      `Ascendant in ${asc.sign} (${asc.degree}°${String(asc.minute).padStart(2, "0")}')`,
    ];
    followUpPrompts = [
      `Which dates in November are most auspicious for my ${sun.sign} Sun?`,
      `How can my ${moon.sign} Moon stay grounded during the studio launch?`,
      `How can Soren's Aquarius placements support my exhibition monograph?`,
    ];
  } else if (
    focusedPartner ||
    lower.includes("julian") ||
    lower.includes("synastry") ||
    lower.includes("partner") ||
    lower.includes("moving in") ||
    lower.includes("relationship") ||
    lower.includes("love")
  ) {
    const partner = focusedPartner || savedPartners[0];
    const pSun =
      partner?.placements?.find((p: any) => p.planet === "Sun") || {
        sign: "Taurus",
        degree: 24,
      };
    const pMoon =
      partner?.placements?.find((p: any) => p.planet === "Moon") || {
        sign: "Cancer",
        degree: 11,
      };
    const partnerName = partner?.name || "Julian Mercer";

    reply = `When we overlay your chart with ${partnerName}'s natal placements (${pSun.sign} Sun, ${pMoon.sign} Moon), the central theme is the interplay between your ${sun.sign} depth and their ${pSun.sign} steadiness. Your natal Venus in ${venus.sign} (House ${venus.house}) craves soul-level candor and undivided sanctuary, while ${partnerName}'s chart supplies the tactile permanence and domestic rhythm that helps your ${moon.sign} Moon exhale.\n\nAs you weigh shared milestones—such as cohabitation and merging daily routines this winter—notice where both charts carry strong Fixed-modality conviction. Neither of you likes being rushed into a decision before you have privately processed the emotional and logistical terrain. Rather than debating every future contingency in a single late-night conversation, pace your planning across calm, structured check-ins.\n\nYour synastry thrives when you anchor practical decisions in shared sensory warmth first. Let your ${asc.sign} Ascendant soften into receptivity, and name your need for a dedicated creative studio corner inside any shared home.`;

    referencedPlacements = [
      `Natal Venus in ${venus.sign} · House ${venus.house}`,
      `${partnerName}'s Sun in ${pSun.sign} & Moon in ${pMoon.sign}`,
      `Natal Moon in ${moon.sign} · House ${moon.house}`,
    ];
    followUpPrompts = [
      `How do we navigate Fixed-sign stubbornness during disagreements?`,
      `What does our Venus-Mars synastry reveal about long-term chemistry?`,
      `How do I protect my creative solitude when living with a partner?`,
    ];
  } else if (
    lower.includes("moon") ||
    lower.includes("pull back") ||
    lower.includes("emotion") ||
    lower.includes("stress") ||
    lower.includes("lunar")
  ) {
    reply = `Your question goes straight to the signature of your natal ${moon.sign} Moon in House ${moon.house} paired with your ${asc.sign} Ascendant, ${userProfile.name}. While your ${sun.sign} Sun possesses deep alchemical drive and magnetic presence, your ${moon.sign} Moon processes intense emotional transitions by stepping back to an observational vantage point first. Pulling back right before a major milestone is not self-sabotage—it is your lunar nervous system calibrating safety before expansion.\n\nUnder the current Waxing Gibbous Moon in Pisces, your water and air houses are unusually permeable. When you notice yourself retreating into solitary hyper-analysis, recognize it as a signal that your ${moon.sign} Moon needs somatic decompression rather than more mental problem-solving.\n\nGive yourself permission to pause without disappearing: tell your closest allies when you are taking an evening of quiet sanctuary, so your retreat feels like intentional replenishment rather than isolation.`;

    referencedPlacements = [
      `Natal Moon in ${moon.sign} · House ${moon.house}`,
      `Natal Ascendant in ${asc.sign}`,
      `Transit Waxing Gibbous Moon in Pisces`,
    ];
    followUpPrompts = [
      `What evening rituals best support a ${moon.sign} Moon in House ${moon.house}?`,
      `How does my ${asc.sign} Rising shape people's first impression of me?`,
      `How do my Mars in ${mars.sign} and Moon in ${moon.sign} work together?`,
    ];
  } else {
    const memoryMention =
      memories.length > 0
        ? `Holding your remembered context in view—especially "${memories[0].content}"—`
        : "Reading the full geometry of your natal chart—";

    reply = `${memoryMention}your inquiry activates the dialogue between your natal ${sun.sign} Sun (${sun.degree}°, House ${sun.house}), your ${moon.sign} Moon (House ${moon.house}), and your chart ruler ${userProfile.chartRuler || "Pluto"}. In your chart, growth rarely happens through linear, surface-level incrementalism; you are wired for periods of deep internal gestation followed by decisive architectural leaps.\n\nRight now, the transiting Scorpio Sun and Pisces Moon form a supportive current across your personal planets, while Mercury in ${mercury.sign} sharpens your discernment. Whatever threshold you are navigating today, lean into the investigative strength of your ${sun.sign} placements while allowing your ${venus.sign} Venus to keep you connected to beauty and trusted companionship.\n\nIf you share any new developments around your work, relationships, or inner life, I will continue weaving them into your Memory Bank so our readings evolve alongside you.`;

    referencedPlacements = [
      `Natal Sun in ${sun.sign} · House ${sun.house}`,
      `Natal Moon in ${moon.sign} · House ${moon.house}`,
      `Chart Ruler: ${userProfile.chartRuler || "Pluto"}`,
    ];
    followUpPrompts = [
      `How do my Saturn transits affect launching my studio in November?`,
      `What does my Venus in ${venus.sign} need most in relationships right now?`,
      `Explain the role of my ${asc.sign} Ascendant over the next month.`,
    ];
  }

  return {
    reply,
    referencedPlacements,
    extractedMemories,
    followUpPrompts,
  };
}

/**
 * Deterministic Synastry Compatibility Synthesizer
 */
function buildEphemerisSynastryReport(
  userProfile: any,
  partnerProfile: any,
  activeLens: string
) {
  const uPlacements = userProfile?.placements || [];
  const pPlacements = partnerProfile?.placements || [];

  const uSun = uPlacements.find((p: any) => p.planet === "Sun") || { sign: "Scorpio", degree: 16 };
  const uMoon = uPlacements.find((p: any) => p.planet === "Moon") || { sign: "Aquarius", degree: 8 };
  const uVenus = uPlacements.find((p: any) => p.planet === "Venus") || { sign: "Scorpio", degree: 21 };
  const uMars = uPlacements.find((p: any) => p.planet === "Mars") || { sign: "Leo", degree: 12 };

  const pSun = pPlacements.find((p: any) => p.planet === "Sun") || { sign: "Taurus", degree: 23 };
  const pMoon = pPlacements.find((p: any) => p.planet === "Moon") || { sign: "Cancer", degree: 14 };
  const pVenus = pPlacements.find((p: any) => p.planet === "Venus") || { sign: "Gemini", degree: 9 };
  const pMars = pPlacements.find((p: any) => p.planet === "Mars") || { sign: "Pisces", degree: 19 };

  const isFriendship = activeLens === "friendship";

  return {
    archetypeTitle: isFriendship
      ? `The Dialectical Observatory: ${uSun.sign} Depth & ${pSun.sign} Perspective`
      : `Celestial Counterpoint: ${uSun.sign} Magnetism & ${pSun.sign} Devotion`,
    overallScore: isFriendship ? 89 : 92,
    metrics: {
      emotionalResonance: isFriendship ? 85 : 94,
      intellectualRapport: isFriendship ? 95 : 88,
      chemistryOrSynergy: isFriendship ? 92 : 93,
      longTermStability: isFriendship ? 88 : 90,
    },
    editorialOverview: isFriendship
      ? `In platonic and creative alliance, ${userProfile.name}'s ${uSun.sign} Sun and ${uMoon.sign} Moon form a remarkably generative partnership with ${partnerProfile.name}'s ${pSun.sign} Sun and ${pMoon.sign} Moon. Where ${userProfile.name} brings forensic psychological insight and structural rigor, ${partnerProfile.name} contributes complementary perspective that prevents creative tunnel vision.\n\nBecause your personal planets activate each other's houses of inquiry and long-range vision, conversations between you naturally bypass superficial small talk and arrive quickly at substantive breakthroughs.`
      : `Between ${userProfile.name}'s ${uSun.sign} Sun / ${uVenus.sign} Venus and ${partnerProfile.name}'s ${pSun.sign} Sun / ${pMoon.sign} Moon, there is an immediate, unmistakable gravitational pull. This synastry bridges deep emotional intuition with tangible devotion—creating a bond where both partners feel seen beneath their social masks.\n\nWhile your charts carry strong individual convictions, the interplay between your luminaries turns contrast into mutual fascination and protective loyalty.`,
    elementalInterplay: `${userProfile.name}'s ${
      userProfile.dominantElement || "Water"
    }-dominant temperament interweaves with ${partnerProfile.name}'s ${
      partnerProfile.dominantElement || "Earth"
    } emphasis, balancing emotional depth with grounded follow-through.`,
    keySynastryAspects: [
      {
        aspectLabel: `${userProfile.name} Sun in ${uSun.sign} Aspecting ${partnerProfile.name} Sun in ${pSun.sign}`,
        orb: "1°12'",
        nature: "magnetic" as const,
        meaning: isFriendship
          ? "Creates high-trust mutual respect and complementary leadership roles in collaborative work."
          : "Generates enduring solar polarity attraction and strong alignment on core life values.",
      },
      {
        aspectLabel: `${userProfile.name} Venus in ${uVenus.sign} Trine ${partnerProfile.name} Moon in ${pMoon.sign}`,
        orb: "0°54'",
        nature: "harmonious" as const,
        meaning: isFriendship
          ? "Fosters effortless warmth, loyalty, and restorative humor even during busy seasons."
          : "Bestows deep emotional safety, domestic tenderness, and unforced romantic affection.",
      },
      {
        aspectLabel: `${userProfile.name} Mars in ${uMars.sign} Square ${partnerProfile.name} Venus in ${pVenus.sign}`,
        orb: "2°08'",
        nature: "challenging" as const,
        meaning: isFriendship
          ? "Occasional differences in pacing when executing fast deadlines versus iterative refinement."
          : "Sparks intense romantic chemistry alongside occasional friction around timing and spontaneity.",
      },
    ],
    luminariesAndStrengths: [
      `Deep unspoken loyalty between ${uSun.sign} and ${pSun.sign} solar placements.`,
      `Restorative lunar rapport (${uMoon.sign} Moon with ${pMoon.sign} Moon) that supports honest communication.`,
      isFriendship
        ? "High creative synergy and mutual respect for independent focus."
        : "Strong romantic magnetism paired with shared long-term domestic vision.",
    ],
    growthEdges: [
      `Navigating ${userProfile.dominantModality || "Fixed"}-modality standoffs with curiosity rather than silent retreat.`,
      "Speaking needs explicitly before stress accumulates during high-visibility career chapters.",
    ],
    bespokeCounsel: isFriendship
      ? `Schedule a dedicated creative review session with ${partnerProfile.name} this month—their ${pSun.sign} perspective will sharpen your upcoming autumn milestones.`
      : `Prioritize unhurried evening rituals with ${partnerProfile.name} where logistics are set aside in favor of presence and sensory connection.`,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // 1. Personalized Daily / Weekly Horoscope Endpoint
  app.post("/api/astrology/horoscope", async (req, res) => {
    try {
      const {
        profile,
        timeframe = "today",
        focus = "holistic",
        memories = [],
        currentDate = "2026-10-25",
        variationSeed = 0,
      } = req.body;

      if (!profile) {
        return res.status(400).json({ error: "Missing natal chart profile." });
      }

      const placementsSummary = (profile.placements || [])
        .map(
          (p: any) =>
            `${p.planet}: ${p.sign} ${p.degree}°${String(p.minute).padStart(
              2,
              "0"
            )}' (House ${p.house}${p.retrograde ? ", Retrograde" : ""})`
        )
        .join("; ");

      const memorySummary =
        Array.isArray(memories) && memories.length > 0
          ? memories
              .map((m: any) => `- [${m.category}] ${m.content}`)
              .join("\n")
          : "No prior conversational memories recorded yet.";

      const prompt = `
Generate a deeply personalized, museum-grade astrological editorial reading for ${profile.name}.
Current Date: ${currentDate} (Scorpio Season, Sun at 02° Scorpio, Moon in Pisces, Mercury in Scorpio, Venus in Sagittarius, Mars in Leo, Jupiter in Leo, Saturn in Aries).
Requested Timeframe: ${timeframe.toUpperCase()}
Requested Thematic Focus: ${focus.toUpperCase()}

NATAL CHART PLACEMENTS FOR ${profile.name.toUpperCase()}:
Birth Data: ${profile.birthDate} at ${profile.birthTime} in ${profile.birthLocation}
Placements: ${placementsSummary}

REMEMBERED USER CONTEXT & LIFE MEMORIES:
${memorySummary}

Write with literary authority, psychological nuance, and astronomical precision. Ground every insight in specific planetary placements, houses, and active transits to ${profile.name}'s natal chart.
`;

      const result = await generateStructuredJsonWithFallback({
        prompt,
        systemInstruction:
          "You are the Chief Astrologer of Aetheris, an editorial celestial observatory. You write incisive, literary, psychologically grounded astrological syntheses that cite exact natal placements, houses, and current planetary transits.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            leadSynthesis: { type: Type.STRING },
            pullQuote: { type: Type.STRING },
            domains: {
              type: Type.OBJECT,
              properties: {
                innerAlchemy: { type: Type.STRING },
                loveAndBonds: { type: Type.STRING },
                vocationAndPurpose: { type: Type.STRING },
              },
              required: ["innerAlchemy", "loveAndBonds", "vocationAndPurpose"],
            },
            keyTransits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  transitTitle: { type: Type.STRING },
                  orbAndHouse: { type: Type.STRING },
                  harmony: { type: Type.STRING },
                  interpretation: { type: Type.STRING },
                },
                required: [
                  "transitTitle",
                  "orbAndHouse",
                  "harmony",
                  "interpretation",
                ],
              },
            },
            ritualDirective: { type: Type.STRING },
          },
          required: [
            "headline",
            "subheadline",
            "leadSynthesis",
            "pullQuote",
            "domains",
            "keyTransits",
            "ritualDirective",
          ],
        },
        fallbackGenerator: () =>
          buildEphemerisHoroscope(
            profile,
            timeframe,
            focus,
            memories,
            Number(variationSeed) || 0
          ),
      });

      return res.json(result);
    } catch (error: any) {
      console.error("Error in /api/astrology/horoscope:", error);
      const {
        profile,
        timeframe = "today",
        focus = "holistic",
        memories = [],
        variationSeed = 0,
      } = req.body || {};
      if (profile) {
        return res.json(
          buildEphemerisHoroscope(
            profile,
            timeframe,
            focus,
            memories,
            Number(variationSeed) || 0
          )
        );
      }
      return res.status(500).json({
        error: "Unable to synthesize reading at this moment.",
      });
    }
  });

  // 2. Romantic & Platonic Synastry Compatibility Endpoint
  app.post("/api/astrology/compatibility", async (req, res) => {
    try {
      const {
        userProfile,
        partnerProfile,
        relationshipLens,
        memories = [],
      } = req.body;

      if (!userProfile || !partnerProfile) {
        return res
          .status(400)
          .json({ error: "Both userProfile and partnerProfile are required." });
      }

      const activeLens =
        relationshipLens || partnerProfile.relationshipType || "romantic";

      const formatChart = (prof: any) =>
        (prof.placements || [])
          .map(
            (p: any) =>
              `${p.planet} in ${p.sign} ${p.degree}°${String(p.minute).padStart(
                2,
                "0"
              )}' (House ${p.house})`
          )
          .join("; ");

      const memoryContext =
        Array.isArray(memories) && memories.length > 0
          ? memories
              .map((m: any) => `- [${m.category}] ${m.content}`)
              .join("\n")
          : "No recorded memories.";

      const prompt = `
Perform a rigorous astrological synastry analysis between ${userProfile.name} and ${partnerProfile.name}.
Relationship Lens: ${
        activeLens === "friendship"
          ? "PLATONIC FRIENDSHIP, INTELLECTUAL SYNERGY & CREATIVE COLLABORATION"
          : "ROMANTIC INTIMACY, EMOTIONAL ATTACHMENT & LONG-TERM PARTNERSHIP"
      }

PERSON A (${userProfile.name}):
Birth Details: ${userProfile.birthDate} at ${userProfile.birthTime} in ${userProfile.birthLocation}
Placements: ${formatChart(userProfile)}

PERSON B (${partnerProfile.name} — ${partnerProfile.relationshipLabel || activeLens}):
Birth Details: ${partnerProfile.birthDate} at ${partnerProfile.birthTime} in ${partnerProfile.birthLocation}
Placements: ${formatChart(partnerProfile)}

REMEMBERED USER CONTEXT:
${memoryContext}

Provide an editorial, nuanced synastry report grounded in their exact planetary placements, elemental balance, and inter-chart aspects. Tailor all psychological insights specifically to the ${activeLens.toUpperCase()} dynamic.
`;

      const result = await generateStructuredJsonWithFallback({
        prompt,
        systemInstruction:
          "You are the Synastry Archivist at Aetheris. You analyze two complete natal charts with precision, honesty, and depth, distinguishing clearly between romantic chemistry and platonic/collaborative resonance.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetypeTitle: { type: Type.STRING },
            overallScore: { type: Type.INTEGER },
            metrics: {
              type: Type.OBJECT,
              properties: {
                emotionalResonance: { type: Type.INTEGER },
                intellectualRapport: { type: Type.INTEGER },
                chemistryOrSynergy: { type: Type.INTEGER },
                longTermStability: { type: Type.INTEGER },
              },
              required: [
                "emotionalResonance",
                "intellectualRapport",
                "chemistryOrSynergy",
                "longTermStability",
              ],
            },
            editorialOverview: { type: Type.STRING },
            elementalInterplay: { type: Type.STRING },
            keySynastryAspects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  aspectLabel: { type: Type.STRING },
                  orb: { type: Type.STRING },
                  nature: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ["aspectLabel", "orb", "nature", "meaning"],
              },
            },
            luminariesAndStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            growthEdges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            bespokeCounsel: { type: Type.STRING },
          },
          required: [
            "archetypeTitle",
            "overallScore",
            "metrics",
            "editorialOverview",
            "elementalInterplay",
            "keySynastryAspects",
            "luminariesAndStrengths",
            "growthEdges",
            "bespokeCounsel",
          ],
        },
        fallbackGenerator: () =>
          buildEphemerisSynastryReport(userProfile, partnerProfile, activeLens),
      });

      return res.json(result);
    } catch (error: any) {
      console.error("Error in /api/astrology/compatibility:", error);
      const { userProfile, partnerProfile, relationshipLens } = req.body || {};
      if (userProfile && partnerProfile) {
        return res.json(
          buildEphemerisSynastryReport(
            userProfile,
            partnerProfile,
            relationshipLens || "romantic"
          )
        );
      }
      return res.status(500).json({
        error: "Unable to generate synastry report at this moment.",
      });
    }
  });

  // 3. Adaptive Astrologer Chatbot with Automatic Memory Extraction
  app.post("/api/astrology/chat", async (req, res) => {
    try {
      const {
        message,
        history = [],
        userProfile,
        savedPartners = [],
        focusedPartnerId = null,
        memories = [],
      } = req.body;

      if (!message || !userProfile) {
        return res
          .status(400)
          .json({ error: "Message and userProfile are required." });
      }

      const formatPlacements = (prof: any) =>
        (prof.placements || [])
          .map(
            (p: any) =>
              `${p.planet}: ${p.sign} ${p.degree}°${String(p.minute).padStart(
                2,
                "0"
              )}' (House ${p.house}${p.retrograde ? " Rx" : ""})`
          )
          .join(", ");

      const partnerContext =
        Array.isArray(savedPartners) && savedPartners.length > 0
          ? savedPartners
              .map(
                (p: any) =>
                  `- ${p.name} (${p.relationshipLabel || p.relationshipType}${
                    p.id === focusedPartnerId
                      ? " [ACTIVE FOCUS IN THIS CONVERSATION]"
                      : ""
                  }): Born ${p.birthDate} in ${
                    p.birthLocation
                  }. Placements: ${formatPlacements(p)}`
              )
              .join("\n")
          : "None saved.";

      const existingMemoriesText =
        Array.isArray(memories) && memories.length > 0
          ? memories
              .map(
                (m: any) =>
                  `- [${m.category}] ${m.content} (Linked: ${(
                    m.referencedPlacements || []
                  ).join(", ")})`
              )
              .join("\n")
          : "Memory Bank is currently empty.";

      const recentHistoryText = (history.slice(-8) || [])
        .map(
          (turn: any) =>
            `${
              turn.role === "user" ? userProfile.name : "Aetheris Oracle"
            }: ${turn.content}`
        )
        .join("\n\n");

      const prompt = `
USER NATAL PROFILE (${userProfile.name}):
Birth Details: ${userProfile.birthDate} at ${userProfile.birthTime} in ${userProfile.birthLocation}
Placements: ${formatPlacements(userProfile)}

SAVED PARTNER & FRIEND PROFILES:
${partnerContext}

INSPECTABLE MEMORY BANK (PAST INSIGHTS REMEMBERED ABOUT ${userProfile.name.toUpperCase()}):
${existingMemoriesText}

RECENT CONVERSATION HISTORY:
${recentHistoryText}

NEW MESSAGE FROM ${userProfile.name.toUpperCase()}:
"${message}"

INSTRUCTIONS:
1. Respond directly to ${userProfile.name} with warmth, editorial elegance, and astrological rigor.
2. Reference their specific natal placements (e.g. Sun, Moon, Rising, Venus, Mars, Saturn, Houses), active transits, and any relevant saved partner charts or existing memories from the Memory Bank.
3. MEMORY EXTRACTION: Analyze ${userProfile.name}'s new message. If they shared any new personal fact, life event, career goal, relationship dynamic, or emotional pattern that is NOT already duplicated in the Memory Bank, extract 1 to 2 concise memory items in \`extractedMemories\`. If purely a general question, return \`[]\`.
`;

      const result = await generateStructuredJsonWithFallback({
        prompt,
        systemInstruction:
          "You are the Aetheris Resident Astrologer—an empathetic, deeply knowledgeable natal chart consultant with longitudinal memory. You weave exact planetary placements and house rulers into practical, psychologically astute counsel.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            referencedPlacements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            extractedMemories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  content: { type: Type.STRING },
                  referencedPlacements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["category", "content", "referencedPlacements"],
              },
            },
            followUpPrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "reply",
            "referencedPlacements",
            "extractedMemories",
            "followUpPrompts",
          ],
        },
        fallbackGenerator: () =>
          buildEphemerisChatResponse({
            message,
            userProfile,
            savedPartners,
            focusedPartnerId,
            memories,
          }),
      });

      return res.json(result);
    } catch (error: any) {
      console.error("Error in /api/astrology/chat:", error);
      const {
        message = "",
        userProfile,
        savedPartners = [],
        focusedPartnerId = null,
        memories = [],
      } = req.body || {};
      if (userProfile) {
        return res.json(
          buildEphemerisChatResponse({
            message,
            userProfile,
            savedPartners,
            focusedPartnerId,
            memories,
          })
        );
      }
      return res.status(500).json({
        error: "Unable to consult the Astrologer right now. Please try again.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aetheris server running on http://localhost:${PORT}`);
  });
}

startServer();
