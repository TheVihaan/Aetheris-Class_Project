import React, { useState } from "react";
import { NatalProfile, ZodiacSign } from "../types/astrology";
import { HOUSE_THEMES, ZODIAC_SIGNS } from "../utils/ephemeris";
import { ArrowUpRight } from "lucide-react";

export interface LunarPhaseInfo {
  id: string;
  name: string;
  angleRange: string;
  illumination: number;
  lunarDay: number;
  transitSign: ZodiacSign;
  transitDegree: number;
  transitMinute: number;
  eclipticLon: number;
  dateLabel: string;
  archetype: string;
  collectiveInfluence: string;
  somaticDirective: string;
}

export const LUNATION_PHASES: LunarPhaseInfo[] = [
  {
    id: "new_moon",
    name: "New Moon",
    angleRange: "0° – 45°",
    illumination: 2.1,
    lunarDay: 0.8,
    transitSign: "Libra",
    transitDegree: 17,
    transitMinute: 42,
    eclipticLon: 197.7,
    dateLabel: "Oct 10",
    archetype: "The Subterranean Seed",
    collectiveInfluence:
      "Solar and Lunar longitudes conjoin in darkness. External visibility recedes so intention can take root without premature scrutiny.",
    somaticDirective:
      "Conserve vocal and social expenditure; draft private blueprints before announcing commitments.",
  },
  {
    id: "waxing_crescent",
    name: "Waxing Crescent",
    angleRange: "45° – 90°",
    illumination: 24.6,
    lunarDay: 4.3,
    transitSign: "Sagittarius",
    transitDegree: 9,
    transitMinute: 15,
    eclipticLon: 249.25,
    dateLabel: "Oct 14",
    archetype: "First Emergence",
    collectiveInfluence:
      "The first silver arc breaks free of solar glare. Curiosity quickens and tentative hypotheses begin gathering material momentum.",
    somaticDirective:
      "Gather research, test early prototypes, and invite preliminary dialogue with trusted peers.",
  },
  {
    id: "first_quarter",
    name: "First Quarter",
    angleRange: "90° – 135°",
    illumination: 50.0,
    lunarDay: 7.4,
    transitSign: "Capricorn",
    transitDegree: 28,
    transitMinute: 4,
    eclipticLon: 298.06,
    dateLabel: "Oct 17",
    archetype: "The Structural Crisis of Action",
    collectiveInfluence:
      "A 90° square between Sun and Moon demands decisive architectural choices. Ambiguity is stripped away in favor of concrete execution.",
    somaticDirective:
      "Resolve lingering bottlenecks; prune secondary tasks that dilute your primary autumn objective.",
  },
  {
    id: "waxing_gibbous",
    name: "Waxing Gibbous",
    angleRange: "135° – 180°",
    illumination: 94.8,
    lunarDay: 13.6,
    transitSign: "Pisces",
    transitDegree: 24,
    transitMinute: 18,
    eclipticLon: 354.3,
    dateLabel: "Today · Oct 25",
    archetype: "Alchemical Refinement & Ripening",
    collectiveInfluence:
      "Standing at the threshold of culmination in late Pisces, the Waxing Gibbous Moon heightens emotional permeability, poetic synthesis, and final calibration before the Full Moon illumination.",
    somaticDirective:
      "Attune to subtle intuitive signals rather than forcing rigid deadlines; refine the emotional cadence of your work.",
  },
  {
    id: "full_moon",
    name: "Full Moon",
    angleRange: "180° – 225°",
    illumination: 100.0,
    lunarDay: 14.8,
    transitSign: "Aries",
    transitDegree: 3,
    transitMinute: 51,
    eclipticLon: 3.85,
    dateLabel: "Oct 26",
    archetype: "Meridian Illumination & Polarity",
    collectiveInfluence:
      "Sun and Moon stand in exact 180° opposition across the horizon. Subconscious tensions, relational mirrors, and creative harvests reach maximum visibility.",
    somaticDirective:
      "Honor what is revealed in relationships without reactive haste; witness the harvest before restructuring.",
  },
  {
    id: "waning_gibbous",
    name: "Waning Gibbous (Disseminating)",
    angleRange: "225° – 270°",
    illumination: 81.4,
    lunarDay: 18.2,
    transitSign: "Gemini",
    transitDegree: 15,
    transitMinute: 29,
    eclipticLon: 75.48,
    dateLabel: "Oct 30",
    archetype: "The Lantern of Transmission",
    collectiveInfluence:
      "After peak illumination, the lunar tide turns toward synthesis, mentorship, and articulating lessons learned during the waxing arc.",
    somaticDirective:
      "Share findings, publish essays or proposals, and translate private breakthroughs into collaborative language.",
  },
  {
    id: "third_quarter",
    name: "Third Quarter",
    angleRange: "270° – 315°",
    illumination: 50.0,
    lunarDay: 22.1,
    transitSign: "Leo",
    transitDegree: 11,
    transitMinute: 47,
    eclipticLon: 131.78,
    dateLabel: "Nov 03",
    archetype: "Reorientation & Editorial Pruning",
    collectiveInfluence:
      "The closing square between Sun and Moon asks for honest inventory. Outgrown habits and completed obligations are released to clear space.",
    somaticDirective:
      "Complete administrative closures, archive finished projects, and renegotiate unsustainable commitments.",
  },
  {
    id: "waning_crescent",
    name: "Waning Balsamic",
    angleRange: "315° – 360°",
    illumination: 9.2,
    lunarDay: 27.3,
    transitSign: "Scorpio",
    transitDegree: 1,
    transitMinute: 12,
    eclipticLon: 211.2,
    dateLabel: "Nov 07",
    archetype: "Sanctuary & Distillation",
    collectiveInfluence:
      "The final nocturnal hush before the next New Moon. Wisdom condenses into quiet intuition; external striving yields to restorative rest.",
    somaticDirective:
      "Prioritize solitude, dream journaling, and deep physical restoration ahead of the next lunar cycle.",
  },
];

interface MoonPhaseCardProps {
  profile: NatalProfile;
  onNavigateToChatWithPrompt: (prompt: string) => void;
}

const LunarDiscSvg: React.FC<{
  phaseIndex: number;
  size?: number;
  isSelected?: boolean;
}> = ({ phaseIndex, size = 140, isSelected = false }) => {
  const r = size * 0.4;
  const cx = size / 2;
  const cy = size / 2;

  const renderIlluminatedPath = () => {
    switch (phaseIndex) {
      case 0:
        return null;
      case 1:
        return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r * 0.55} ${r} 0 0 0 ${cx} ${cy - r} Z`;
      case 2:
        return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} L ${cx} ${cy - r} Z`;
      case 3:
        return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r * 0.68} ${r} 0 0 1 ${cx} ${cy - r} Z`;
      case 4:
        return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
      case 5:
        return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${r * 0.62} ${r} 0 0 0 ${cx} ${cy - r} Z`;
      case 6:
        return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} L ${cx} ${cy - r} Z`;
      case 7:
        return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${r * 0.6} ${r} 0 0 1 ${cx} ${cy - r} Z`;
      default:
        return null;
    }
  };

  const litPath = renderIlluminatedPath();

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`lunarGlow-${size}-${phaseIndex}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6F3FF" stopOpacity="0.96" />
          <stop offset="68%" stopColor="#DDD6FE" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#E5C158" stopOpacity="0.78" />
        </radialGradient>
      </defs>

      <circle
        cx={cx}
        cy={cy}
        r={r + 8}
        fill="none"
        stroke={isSelected ? "rgba(192, 132, 252, 0.6)" : "rgba(192, 132, 252, 0.16)"}
        strokeWidth="0.85"
        strokeDasharray="2 3"
      />

      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#0B0617"
        stroke={isSelected ? "#C084FC" : "rgba(229, 193, 88, 0.42)"}
        strokeWidth={isSelected ? "1.4" : "1"}
      />

      {litPath && (
        <path
          d={litPath}
          fill={`url(#lunarGlow-${size}-${phaseIndex})`}
        />
      )}

      <line
        x1={cx - r - 12}
        y1={cy}
        x2={cx + r + 12}
        y2={cy}
        stroke="rgba(192, 132, 252, 0.22)"
        strokeWidth="0.6"
      />
      <line
        x1={cx}
        y1={cy - r - 12}
        x2={cx}
        y2={cy + r + 12}
        stroke="rgba(192, 132, 252, 0.22)"
        strokeWidth="0.6"
      />
    </svg>
  );
};

export const MoonPhaseCard: React.FC<MoonPhaseCardProps> = ({
  profile,
  onNavigateToChatWithPrompt,
}) => {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(3);

  const activePhase = LUNATION_PHASES[selectedPhaseIdx];
  const natalMoon = profile.placements.find((p) => p.planet === "Moon");
  const natalAsc = profile.placements.find((p) => p.planet === "Ascendant");

  const ascLon = natalAsc?.eclipticLongitude || 0;
  const relativeOffset =
    ((activePhase.eclipticLon - Math.floor(ascLon / 30) * 30) % 360 + 360) % 360;
  const activatedNatalHouse = (Math.floor(relativeOffset / 30) % 12) + 1;
  const activatedHouseTheme = HOUSE_THEMES[activatedNatalHouse];

  const natalMoonLon = natalMoon?.eclipticLongitude || 0;
  let lunarDelta = Math.abs(activePhase.eclipticLon - natalMoonLon);
  if (lunarDelta > 180) lunarDelta = 360 - lunarDelta;

  const getLunarResonanceDescription = () => {
    const transitSignMeta = ZODIAC_SIGNS.find(
      (z) => z.sign === activePhase.transitSign
    );
    const transitElement = transitSignMeta?.element || "Water";
    const natalMoonSign = natalMoon?.sign || "Aquarius";
    const natalMoonHouse = natalMoon?.house || 8;

    if (lunarDelta < 18) {
      return `This ${activePhase.name} in ${activePhase.transitSign} aligns closely with your natal ${natalMoonSign} Moon (House ${natalMoonHouse}), initiating a personal Lunar Return renewal of emotional clarity and somatic reset.`;
    }
    if (Math.abs(lunarDelta - 120) < 18 || Math.abs(lunarDelta - 60) < 18) {
      return `Moving through ${activePhase.transitSign} (${transitElement}), this ${activePhase.name} forms a supportive harmonic angle to your natal ${natalMoonSign} Moon in House ${natalMoonHouse} while illuminating your natal House ${activatedNatalHouse} of ${activatedHouseTheme.toLowerCase()}.`;
    }
    if (Math.abs(lunarDelta - 90) < 18 || Math.abs(lunarDelta - 180) < 18) {
      return `Transiting ${activePhase.transitSign} across your natal House ${activatedNatalHouse} (${activatedHouseTheme.toLowerCase()}), this ${activePhase.name} creates a dynamic creative tension with your natal ${natalMoonSign} Moon—inviting conscious emotional integration rather than habitual reaction.`;
    }
    return `As the ${activePhase.name} transits ${activePhase.transitSign} (${activePhase.transitDegree}°${String(
      activePhase.transitMinute
    ).padStart(
      2,
      "0"
    )}'), it activates your natal House ${activatedNatalHouse} (${activatedHouseTheme.toLowerCase()}), inviting your natal ${natalMoonSign} Moon to attune to ${transitElement.toLowerCase()}-elemental receptivity.`;
  };

  const transitSignGlyph =
    ZODIAC_SIGNS.find((z) => z.sign === activePhase.transitSign)?.glyph || "♓";

  return (
    <section
      aria-label="Lunar Cycle & Natal Influence"
      className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6 lg:p-8 space-y-8"
    >
      {/* Top Header & Ephemeris Telemetry */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C084FC]/16 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#C084FC] font-mono-tabular mb-1.5">
            <span>SELENOGRAPHIC EPHEMERIS</span>
            <span aria-hidden="true">·</span>
            <span>SYNODIC CYCLE: 29.53 DAYS</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#E5C158]">{activePhase.dateLabel.toUpperCase()}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-editorial font-semibold text-[#F6F3FF]">
            Lunar Phase &amp; Natal Tide Influence
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[#A99EC2] font-mono-tabular">
          <span>
            TRANSIT MOON: {transitSignGlyph} {activePhase.transitSign.toUpperCase()}{" "}
            {activePhase.transitDegree}°
            {String(activePhase.transitMinute).padStart(2, "0")}&apos;
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[#F6F3FF]">
            ACTIVATING NATAL HOUSE {activatedNatalHouse}
          </span>
        </div>
      </div>

      {/* Main Split: Left Lunar Terminator Dial & Metrics | Right Astrological Influence on User's Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 5 Columns: Visual Lunar Sphere & Quantitative Readout */}
        <div className="lg:col-span-5 bg-[#080511] border border-[#C084FC]/16 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
          <LunarDiscSvg
            phaseIndex={selectedPhaseIdx}
            size={148}
            isSelected={true}
          />

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="text-xs uppercase tracking-widest text-[#C084FC] font-mono-tabular">
              {selectedPhaseIdx === 3 ? "CURRENT SKY PHASE" : "SELECTED LUNATION STAGE"}
            </div>
            <h3 className="text-2xl font-editorial font-semibold text-[#F6F3FF]">
              {activePhase.name}
            </h3>
            <div className="text-xs text-[#A99EC2] italic font-editorial">
              &ldquo;{activePhase.archetype}&rdquo;
            </div>

            <div className="pt-3 border-t border-[#C084FC]/14 grid grid-cols-2 gap-3 text-left">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#A99EC2]">
                  ILLUMINATION
                </div>
                <div className="text-lg font-mono-tabular font-semibold text-[#F6F3FF]">
                  {activePhase.illumination.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#A99EC2]">
                  LUNAR AGE
                </div>
                <div className="text-lg font-mono-tabular font-semibold text-[#E5C158]">
                  {activePhase.lunarDay.toFixed(1)}
                  <span className="text-xs text-[#A99EC2] font-normal ml-1">
                    d
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Columns: Collective & Personalized Natal Lunar Influence */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Collective Lunar Tide */}
            <div className="p-5 bg-[#080511] border border-[#C084FC]/14 rounded-lg space-y-2">
              <div className="text-xs uppercase tracking-widest text-[#A99EC2] font-mono-tabular">
                COLLECTIVE LUNAR ATMOSPHERE · {activePhase.angleRange}
              </div>
              <h4 className="text-base font-editorial font-semibold text-[#F6F3FF]">
                Moon in {activePhase.transitSign} {transitSignGlyph}
              </h4>
              <p className="text-xs text-[#EAE4F8] leading-relaxed">
                {activePhase.collectiveInfluence}
              </p>
            </div>

            {/* Personal Natal Resonance */}
            <div className="p-5 bg-[#080511] border border-[#C084FC]/38 rounded-lg space-y-2">
              <div className="text-xs uppercase tracking-widest text-[#E5C158] font-mono-tabular">
                PERSONAL NATAL RESONANCE · HOUSE {activatedNatalHouse}
              </div>
              <h4 className="text-base font-editorial font-semibold text-[#F6F3FF]">
                Impact on {profile.name}&apos;s {natalMoon?.sign} Moon
              </h4>
              <p className="text-xs text-[#EAE4F8] leading-relaxed">
                {getLunarResonanceDescription()}
              </p>
            </div>
          </div>

          {/* Somatic Directive & Consult Astrologer Trigger */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#A99EC2]">
              <span className="text-[#C084FC] uppercase tracking-wider font-mono-tabular mr-2">
                LUNAR TIMING COUNSEL:
              </span>
              <span className="text-[#EAE4F8]">{activePhase.somaticDirective}</span>
            </div>

            <button
              onClick={() =>
                onNavigateToChatWithPrompt(
                  `How does the ${activePhase.name} in ${activePhase.transitSign} (${activePhase.illumination}% illumination, activating my natal House ${activatedNatalHouse}) interact with my natal ${natalMoon?.sign} Moon today?`
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#F6F3FF] bg-[#1C1236] border border-[#C084FC]/40 rounded hover:border-[#E5C158] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Consult Oracle on Lunar Phase</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#E5C158]" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive 8-Stage Synodic Lunation Progression Bar */}
      <div className="pt-6 border-t border-[#C084FC]/16">
        <div className="flex items-center justify-between mb-3 text-xs text-[#A99EC2]">
          <span className="uppercase tracking-widest font-mono-tabular">
            Interactive Synodic Cycle Progression (Click Any Phase to Inspect Natal House Shift)
          </span>
          {selectedPhaseIdx !== 3 && (
            <button
              onClick={() => setSelectedPhaseIdx(3)}
              className="text-[#E5C158] hover:underline cursor-pointer whitespace-nowrap"
            >
              Reset to Today&apos;s Sky (Oct 25)
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {LUNATION_PHASES.map((phase, idx) => {
            const isSelected = idx === selectedPhaseIdx;
            const isToday = idx === 3;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setSelectedPhaseIdx(idx)}
                className={`p-3 rounded-lg border text-left transition-colors flex flex-col items-center sm:items-start justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#1C1236] border-[#C084FC] text-[#F6F3FF]"
                    : "bg-[#080511]/80 border-[#C084FC]/12 text-[#A99EC2] hover:border-[#C084FC]/35 hover:text-[#F6F3FF]"
                }`}
              >
                <div className="w-full flex items-center justify-between gap-1">
                  <LunarDiscSvg
                    phaseIndex={idx}
                    size={36}
                    isSelected={isSelected}
                  />
                  <span className="text-[10px] font-mono-tabular text-[#E5C158]">
                    {phase.illumination.toFixed(0)}%
                  </span>
                </div>

                <div className="w-full">
                  <div className="text-xs font-medium text-[#F6F3FF] truncate">
                    {phase.name.replace(" (Disseminating)", "")}
                  </div>
                  <div className="text-[10px] font-mono-tabular text-[#A99EC2] mt-0.5 truncate">
                    {isToday ? "Today · " : ""}
                    {phase.transitSign}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
