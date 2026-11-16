import React, { useState } from "react";
import {
  DailyHoroscopeReading,
  MemoryItem,
  NatalProfile,
} from "../types/astrology";
import { NatalWheelSvg } from "./NatalWheelSvg";
import { MoonPhaseCard } from "./MoonPhaseCard";
import { RefreshCw, ArrowUpRight } from "lucide-react";

interface DailyHoroscopeViewProps {
  profile: NatalProfile;
  reading: DailyHoroscopeReading;
  memories: MemoryItem[];
  onUpdateReading: (newReading: DailyHoroscopeReading) => void;
  onNavigateToChatWithPrompt: (prompt: string) => void;
  onNavigateToChart: () => void;
  onOpenCalibration: () => void;
}

export const DailyHoroscopeView: React.FC<DailyHoroscopeViewProps> = ({
  profile,
  reading,
  memories,
  onUpdateReading,
  onNavigateToChatWithPrompt,
  onNavigateToChart,
  onOpenCalibration,
}) => {
  const [timeframe, setTimeframe] = useState<"today" | "tomorrow" | "weekly">(
    reading.timeframe || "today"
  );
  const [focus, setFocus] = useState<"holistic" | "love" | "career" | "inner_growth">(
    reading.focus || "holistic"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [variationSeed, setVariationSeed] = useState(1);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const sunPlacement = profile.placements.find((p) => p.planet === "Sun");
  const moonPlacement = profile.placements.find((p) => p.planet === "Moon");
  const ascPlacement = profile.placements.find((p) => p.planet === "Ascendant");

  const handleGenerateReading = async (
    nextTimeframe = timeframe,
    nextFocus = focus
  ) => {
    const nextSeed = variationSeed + 1;
    setVariationSeed(nextSeed);
    setTimeframe(nextTimeframe);
    setFocus(nextFocus);
    setIsLoading(true);
    setErrorMsg(null);
    setStatusNotice(null);

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 14000);

    try {
      const response = await fetch("/api/astrology/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          profile,
          timeframe: nextTimeframe,
          focus: nextFocus,
          memories,
          currentDate: "2026-10-25",
          variationSeed: nextSeed,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to synthesize celestial transit reading.");
      }

      onUpdateReading({
        ...data,
        timeframe: nextTimeframe,
        focus: nextFocus,
        generatedAt: "2026-10-25",
      });
      setStatusNotice(
        `Synthesized fresh ${nextTimeframe} · ${nextFocus.replace("_", " ")} reading for ${profile.name}`
      );
    } catch (err: any) {
      setErrorMsg(
        err?.name === "AbortError"
          ? "Request timed out. Please click Retry Synthesis."
          : err.message || "Connection error while consulting the ephemeris."
      );
    } finally {
      window.clearTimeout(timer);
      setIsLoading(false);
    }
  };

  const paragraphs = (reading.leadSynthesis || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-12">
      {/* Operational Ephemeris Utility Bar (Zero-Pill Discipline: Unboxed Metadata with · separators) */}
      <div className="border-b border-[#C084FC]/18 pb-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#A99EC2]">
        <div className="flex flex-wrap items-center gap-2 font-mono-tabular">
          <span className="text-[#C084FC] uppercase tracking-widest">EPHEMERIS DISPATCH</span>
          <span aria-hidden="true">·</span>
          <span>OCTOBER 25, 2026</span>
          <span aria-hidden="true">·</span>
          <span>TRANSIT SUN 02°18&apos; SCORPIO</span>
          <span aria-hidden="true">·</span>
          <span>WAXING GIBBOUS MOON IN PISCES</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#F6F3FF] font-medium">{profile.name}</span>
          <span aria-hidden="true">·</span>
          <span>
            ☉ {sunPlacement?.sign} {sunPlacement?.degree}°
          </span>
          <span aria-hidden="true">·</span>
          <span>
            ☽ {moonPlacement?.sign} {moonPlacement?.degree}°
          </span>
          <span aria-hidden="true">·</span>
          <span>
            ASC {ascPlacement?.sign} {ascPlacement?.degree}°
          </span>
          <span aria-hidden="true">·</span>
          <button
            onClick={onOpenCalibration}
            className="text-[#E5C158] hover:underline transition-colors cursor-pointer whitespace-nowrap"
          >
            Edit Birth Data
          </button>
        </div>
      </div>

      {/* Interactive Filter & Calibration Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 p-4 rounded-lg">
        <div className="flex flex-wrap items-center gap-6">
          {/* Timeframe Segmented Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#A99EC2] mr-1">
              Horizon:
            </span>
            <div className="flex items-center gap-1 p-1 bg-[#080511] border border-[#C084FC]/15 rounded-md">
              {(
                [
                  { id: "today", label: "Today · Oct 25" },
                  { id: "tomorrow", label: "Tomorrow · Oct 26" },
                  { id: "weekly", label: "7-Day Transit Arc" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleGenerateReading(item.id, focus)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    timeframe === item.id
                      ? "bg-[#C084FC] text-[#07050E] font-semibold"
                      : "text-[#A99EC2] hover:text-[#F6F3FF]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Thematic Lens Segmented Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#A99EC2] mr-1">
              Focus:
            </span>
            <div className="flex items-center gap-1 p-1 bg-[#080511] border border-[#C084FC]/15 rounded-md">
              {(
                [
                  { id: "holistic", label: "Holistic Synthesis" },
                  { id: "love", label: "Love & Bonds" },
                  { id: "career", label: "Vocation & Strategy" },
                  { id: "inner_growth", label: "Inner Alchemy" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleGenerateReading(timeframe, item.id)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    focus === item.id
                      ? "bg-[#1E133A] text-[#E5C158] border border-[#E5C158]/45"
                      : "text-[#A99EC2] hover:text-[#F6F3FF]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleGenerateReading(timeframe, focus)}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-[#C084FC] to-[#E5C158] text-[#07050E] rounded hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isLoading ? "Synthesizing Transits..." : "Synthesize Fresh Reading"}</span>
        </button>
      </div>

      {statusNotice && !isLoading && (
        <div className="px-4 py-2.5 bg-[#1C1236]/90 border border-[#C084FC]/40 rounded-lg flex items-center justify-between gap-4 text-xs text-[#DDD6FE] font-mono-tabular">
          <span>✓ {statusNotice.toUpperCase()}</span>
          <button
            onClick={() => setStatusNotice(null)}
            className="text-[#A99EC2] hover:text-[#F6F3FF] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/35 rounded-lg flex items-center justify-between gap-4 text-xs text-rose-200">
          <span>{errorMsg}</span>
          <button
            onClick={() => handleGenerateReading(timeframe, focus)}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 rounded transition-colors cursor-pointer whitespace-nowrap"
          >
            Retry Synthesis
          </button>
        </div>
      )}

      {/* Tier 1: Lead Monograph Split (70% Editorial Essay / 30% Celestial Wheel & Natal Anchor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Main Editorial Essay Column */}
        <article className="lg:col-span-8 bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#A99EC2] mb-4">
              <span className="text-[#C084FC]">PERSONALIZED TRANSIT MONOGRAPH</span>
              <span aria-hidden="true">·</span>
              <span>CHART RULER: {profile.chartRuler.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>{memories.length} ACTIVE MEMORIES INTEGRATED</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-editorial font-semibold text-[#F6F3FF] leading-[1.12] tracking-tight">
              {reading.headline}
            </h2>

            <p className="mt-4 text-base lg:text-lg text-[#A99EC2] max-w-2xl leading-relaxed">
              {reading.subheadline}
            </p>

            <div className="my-8 border-b border-[#C084FC]/16" />

            {/* Long-form Editorial Reading with Drop Cap */}
            <div className="space-y-5 text-[15.5px] text-[#EAE4F8] leading-[1.8] max-w-prose">
              {paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "first-letter:text-5xl first-letter:font-editorial first-letter:font-semibold first-letter:text-[#C084FC] first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:leading-none"
                      : ""
                  }
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Pull Quote with Subtle Top/Bottom Hairline Dividers */}
            <blockquote className="my-9 py-6 border-y border-[#C084FC]/28 text-center px-4">
              <p className="text-xl lg:text-2xl font-editorial italic text-[#F6F3FF] max-w-xl mx-auto leading-snug">
                &ldquo;{reading.pullQuote}&rdquo;
              </p>
              <footer className="mt-2 text-xs uppercase tracking-widest text-[#A99EC2]">
                SOLAR-LUNAR SYNTHESIS · {profile.name.toUpperCase()}
              </footer>
            </blockquote>
          </div>

          {/* Contemplative Directive & Prompt Action */}
          <div className="pt-6 border-t border-[#C084FC]/16 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="text-xs uppercase tracking-widest text-[#E5C158] font-medium">
                Contemplative Timing &amp; Practice
              </div>
              <p className="text-sm text-[#EAE4F8] leading-relaxed">
                {reading.ritualDirective}
              </p>
            </div>

            <button
              onClick={() =>
                onNavigateToChatWithPrompt(
                  `Can we explore today's horoscope headline ("${reading.headline}") and how I should apply it to my current goals?`
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#F6F3FF] bg-[#1C1236] border border-[#C084FC]/40 rounded hover:border-[#E5C158] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Discuss Reading with Astrologer</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#E5C158]" />
            </button>
          </div>
        </article>

        {/* Right Column: Live Natal Ecliptic Wheel & Triad Summary */}
        <aside className="lg:col-span-4 bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C084FC]/16">
              <div>
                <h2 className="text-lg font-editorial font-semibold text-[#F6F3FF]">
                  Natal Ecliptic Projection
                </h2>
                <p className="text-xs text-[#A99EC2]">
                  {profile.birthLocation}
                </p>
              </div>
              <button
                onClick={onNavigateToChart}
                className="text-xs text-[#E5C158] hover:underline cursor-pointer whitespace-nowrap"
              >
                Full Ephemeris →
              </button>
            </div>

            <NatalWheelSvg profile={profile} size={380} />
          </div>

          {/* Core Natal Triad Accession List */}
          <div className="mt-6 pt-5 border-t border-[#C084FC]/16 space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#A99EC2]">
              Core Luminaries &amp; Horizon
            </div>
            {[sunPlacement, moonPlacement, ascPlacement].map(
              (item) =>
                item && (
                  <div
                    key={item.planet}
                    className="flex items-center justify-between py-2 border-b border-[#C084FC]/10 last:border-none text-xs"
                  >
                    <div className="text-[#F6F3FF] font-medium">
                      {item.glyph} {item.planet} in {item.sign}
                    </div>
                    <div className="text-[#C084FC] font-mono-tabular">
                      {item.degree}°{String(item.minute).padStart(2, "0")}&apos; · House {item.house}
                    </div>
                  </div>
                )
            )}
          </div>
        </aside>
      </div>

      {/* Lunar Cycle & Natal Tide Influence Component */}
      <MoonPhaseCard
        profile={profile}
        onNavigateToChatWithPrompt={onNavigateToChatWithPrompt}
      />

      {/* Tier 2: Three Curated Domain Columns (Inner Alchemy, Love & Bonds, Vocation & Purpose) */}
      <section aria-label="Domain Guidance">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-editorial font-semibold text-[#F6F3FF]">
            01. Planetary Houses &amp; Life Domains
          </h2>
          <span className="text-xs text-[#A99EC2]">
            Tailored to your {profile.dominantElement} dominance &amp; {profile.dominantModality} modality
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              index: "I",
              title: "Inner Alchemy & Vitality",
              meta: `Moon in ${moonPlacement?.sign} · House ${moonPlacement?.house}`,
              content: reading.domains.innerAlchemy,
              prompt: `How can I care for my ${moonPlacement?.sign} Moon in House ${moonPlacement?.house} today?`,
            },
            {
              index: "II",
              title: "Love, Attachments & Bonds",
              meta: `Venus in ${
                profile.placements.find((p) => p.planet === "Venus")?.sign
              } · House VII`,
              content: reading.domains.loveAndBonds,
              prompt: `What do today's transits reveal for my romantic and close friendship dynamics?`,
            },
            {
              index: "III",
              title: "Vocation & Architectural Purpose",
              meta: `Saturn in ${
                profile.placements.find((p) => p.planet === "Saturn")?.sign
              } · House X`,
              content: reading.domains.vocationAndPurpose,
              prompt: `How should I pace my career and creative goals under today's transits?`,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-[#C084FC] font-mono-tabular mb-2">
                  DOMAIN {card.index} · {card.meta.toUpperCase()}
                </div>
                <h3 className="text-xl font-editorial font-semibold text-[#F6F3FF] mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-[#EAE4F8] leading-relaxed">
                  {card.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#C084FC]/12 flex items-center justify-between">
                <button
                  onClick={() => onNavigateToChatWithPrompt(card.prompt)}
                  className="text-xs text-[#A99EC2] hover:text-[#E5C158] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Inquire in Oracle Chat</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tier 3: Active Transit-to-Natal Aspect Ledger */}
      <section aria-label="Active Planetary Transits">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <h2 className="text-2xl font-editorial font-semibold text-[#F6F3FF]">
            02. Active Transit-to-Natal Aspects
          </h2>
          <span className="text-xs text-[#A99EC2] font-mono-tabular">
            EXACT ORB CALCULATIONS · OCTOBER 25, 2026
          </span>
        </div>

        <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg divide-y divide-[#C084FC]/12">
          {(reading.keyTransits || []).map((transit, i) => {
            const toneColor =
              transit.harmony === "harmonious"
                ? "text-[#C084FC]"
                : transit.harmony === "transformative"
                ? "text-rose-400"
                : "text-[#E5C158]";
            const toneSymbol =
              transit.harmony === "harmonious"
                ? "● Harmonious Flow"
                : transit.harmony === "transformative"
                ? "▲ High-Tension Catalyst"
                : "◆ Magnetic Alignment";

            return (
              <div
                key={i}
                className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                    <span className={toneColor}>{toneSymbol}</span>
                    <span className="text-[#A99EC2]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-[#A99EC2]">{transit.orbAndHouse}</span>
                  </div>
                  <h3 className="text-lg font-editorial font-semibold text-[#F6F3FF]">
                    {transit.transitTitle}
                  </h3>
                  <p className="text-sm text-[#EAE4F8] leading-relaxed">
                    {transit.interpretation}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() =>
                      onNavigateToChatWithPrompt(
                        `Explain how the transit "${transit.transitTitle}" (${transit.orbAndHouse}) affects my birth chart and what I should focus on.`
                      )
                    }
                    className="px-3.5 py-2 text-xs font-medium text-[#F6F3FF] bg-[#080511] border border-[#C084FC]/25 rounded hover:border-[#E5C158] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Ask Astrologer About Transit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
