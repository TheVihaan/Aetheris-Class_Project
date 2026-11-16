import React, { useState } from "react";
import { NatalProfile, PlanetName } from "../types/astrology";
import { HOUSE_THEMES, PLANET_METADATA } from "../utils/ephemeris";
import { NatalWheelSvg } from "./NatalWheelSvg";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";

interface NatalChartViewProps {
  profile: NatalProfile;
  onOpenCalibration: () => void;
  onNavigateToChatWithPrompt: (prompt: string) => void;
}

export const NatalChartView: React.FC<NatalChartViewProps> = ({
  profile,
  onOpenCalibration,
  onNavigateToChatWithPrompt,
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetName>("Sun");
  const [tableFilter, setTableFilter] = useState<
    "all" | "personal" | "outer" | "aspects"
  >("all");

  const activePlacement =
    profile.placements.find((p) => p.planet === selectedPlanet) ||
    profile.placements[0];

  const sun = profile.placements.find((p) => p.planet === "Sun");
  const moon = profile.placements.find((p) => p.planet === "Moon");
  const asc = profile.placements.find((p) => p.planet === "Ascendant");

  const filteredPlacements = profile.placements.filter((p) => {
    if (tableFilter === "personal") {
      return ["Sun", "Moon", "Ascendant", "Mercury", "Venus", "Mars"].includes(
        p.planet
      );
    }
    if (tableFilter === "outer") {
      return [
        "Jupiter",
        "Saturn",
        "Uranus",
        "Neptune",
        "Pluto",
        "North Node",
      ].includes(p.planet);
    }
    return true;
  });

  return (
    <div className="space-y-12">
      {/* Header Metadata Ribbon */}
      <div className="border-b border-[#C084FC]/18 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#C084FC] font-mono-tabular mb-2">
            NATAL EPHEMERIS ARCHIVE · SUBJECT: {profile.name.toUpperCase()}
          </div>
          <h1 className="text-3xl lg:text-4xl font-editorial font-semibold text-[#F6F3FF]">
            Complete Natal Chart &amp; Planetary Accession
          </h1>
          <p className="mt-1 text-xs text-[#A99EC2] font-mono-tabular">
            BORN {profile.birthDate} · {profile.birthTime} LOCAL TIME ·{" "}
            {profile.birthLocation.toUpperCase()} ({profile.latitude.toFixed(2)}°N,{" "}
            {profile.longitude.toFixed(2)}°E)
          </p>
        </div>

        <button
          onClick={onOpenCalibration}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#1C1236] text-[#F6F3FF] border border-[#C084FC]/40 rounded hover:border-[#E5C158] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>Recalibrate Birth Coordinates</span>
        </button>
      </div>

      {/* Core Big Three Triad Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            role: "SOLAR SOVEREIGNTY · CONSCIOUS IDENTITY",
            placement: sun,
          },
          {
            role: "LUNAR SANCTUARY · EMOTIONAL MEMORY",
            placement: moon,
          },
          {
            role: "EASTERN HORIZON · EMBODIED ASCENDANT",
            placement: asc,
          },
        ].map(
          ({ role, placement }) =>
            placement && (
              <div
                key={placement.planet}
                onClick={() => setSelectedPlanet(placement.planet)}
                className={`p-6 rounded-lg border backdrop-blur-sm transition-colors cursor-pointer flex flex-col justify-between ${
                  selectedPlanet === placement.planet
                    ? "bg-[#1C1236]/90 border-[#C084FC]"
                    : "bg-[#120B24]/85 border-[#C084FC]/18 hover:border-[#C084FC]/40"
                }`}
              >
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-[#A99EC2] font-mono-tabular">
                    {role}
                  </div>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <h2 className="text-2xl font-editorial font-semibold text-[#F6F3FF]">
                      {placement.glyph} {placement.planet} in {placement.sign}{" "}
                      {placement.signGlyph}
                    </h2>
                    <span className="text-sm font-mono-tabular text-[#E5C158]">
                      {placement.degree}°{String(placement.minute).padStart(2, "0")}&apos;
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-[#C084FC]">
                    House {placement.house} · {placement.element} ·{" "}
                    {placement.modality}
                  </div>
                  <p className="mt-4 text-sm text-[#EAE4F8] leading-relaxed">
                    {placement.interpretation}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#C084FC]/14 flex items-center justify-between text-xs text-[#E5C158]">
                  <span>Inspect aspect geometry on wheel</span>
                  <span>→</span>
                </div>
              </div>
            )
        )}
      </div>

      {/* Main Split Console: Left Interactive Wheel + Selected Planet Inspector | Right Ephemeris Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Interactive SVG Wheel & Elemental Calibration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-editorial font-semibold text-[#F6F3FF]">
                  Interactive Ecliptic Wheel
                </h2>
                <p className="text-xs text-[#A99EC2]">
                  Click any planetary glyph to isolate its aspect chords
                </p>
              </div>
              <span className="text-xs font-mono-tabular text-[#E5C158]">
                FOCUS: {selectedPlanet.toUpperCase()}
              </span>
            </div>

            <NatalWheelSvg
              profile={profile}
              selectedPlanet={selectedPlanet}
              onSelectPlanet={(planet) => setSelectedPlanet(planet)}
              size={460}
            />
          </div>

          {/* Elemental & Modality Balance Calibration */}
          <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-editorial font-semibold text-[#F6F3FF]">
                  Elemental Temperament Balance
                </h3>
                <span className="text-xs text-[#C084FC] font-mono-tabular">
                  DOMINANT: {profile.dominantElement.toUpperCase()}
                </span>
              </div>
              <div className="space-y-3">
                {(
                  [
                    { el: "Water", color: "bg-[#C084FC]", desc: "Intuition, Depth & Memory" },
                    { el: "Fire", color: "bg-[#E5C158]", desc: "Vitality, Vision & Will" },
                    { el: "Earth", color: "bg-emerald-400", desc: "Structure, Craft & Permanence" },
                    { el: "Air", color: "bg-indigo-300", desc: "Synthesis, Dialogue & Theory" },
                  ] as const
                ).map(({ el, color, desc }) => {
                  const pct = profile.elements[el] || 0;
                  return (
                    <div key={el} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#F6F3FF] font-medium">
                          {el}{" "}
                          <span className="text-[#A99EC2] font-normal">
                            · {desc}
                          </span>
                        </span>
                        <span className="font-mono-tabular text-[#F6F3FF]">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#080511] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-200`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#C084FC]/16">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-editorial font-semibold text-[#F6F3FF]">
                  Quadruplicity / Modality Distribution
                </h3>
                <span className="text-xs text-[#E5C158] font-mono-tabular">
                  {profile.dominantModality.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-1">
                {(["Cardinal", "Fixed", "Mutable"] as const).map((mod) => (
                  <div
                    key={mod}
                    className="p-3 bg-[#080511] border border-[#C084FC]/14 rounded text-center"
                  >
                    <div className="text-xs text-[#A99EC2]">{mod}</div>
                    <div className="mt-1 text-xl font-mono-tabular font-semibold text-[#F6F3FF]">
                      {profile.modalities[mod]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Detailed Placement Dossier & Ephemeris Table */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Selected Planet Deep Inspector */}
          {activePlacement && (
            <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/45 rounded-lg p-6 lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular text-[#C084FC] mb-2">
                <span>
                  SELECTED PLACEMENT DOSSIER · HOUSE {activePlacement.house} (
                  {HOUSE_THEMES[activePlacement.house].toUpperCase()})
                </span>
                <span className="text-[#E5C158]">
                  ECLIPTIC LON: {activePlacement.eclipticLongitude.toFixed(2)}°
                </span>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-2xl lg:text-3xl font-editorial font-semibold text-[#F6F3FF]">
                  {activePlacement.glyph} {activePlacement.planet} in{" "}
                  {activePlacement.sign} {activePlacement.signGlyph}
                </h2>
                <span className="text-base font-mono-tabular text-[#E5C158]">
                  {activePlacement.degree}°
                  {String(activePlacement.minute).padStart(2, "0")}&apos; ·{" "}
                  {activePlacement.element} · {activePlacement.modality}
                  {activePlacement.retrograde ? " · Retrograde" : ""}
                </span>
              </div>

              <p className="mt-4 text-[15px] text-[#EAE4F8] leading-relaxed">
                {activePlacement.interpretation}
              </p>

              {/* Connected Natal Aspects for Selected Planet */}
              <div className="mt-6 pt-5 border-t border-[#C084FC]/16">
                <div className="text-xs uppercase tracking-widest text-[#A99EC2] mb-3">
                  Geometric Aspects Involving {activePlacement.planet}
                </div>
                <div className="space-y-2">
                  {profile.aspects
                    .filter(
                      (a) =>
                        a.planetA === activePlacement.planet ||
                        a.planetB === activePlacement.planet
                    )
                    .map((asp) => (
                      <div
                        key={asp.id}
                        className="flex flex-wrap items-center justify-between gap-2 text-xs py-1.5 border-b border-[#C084FC]/10 last:border-none"
                      >
                        <span className="text-[#F6F3FF] font-medium">
                          {asp.planetA} {asp.type} {asp.planetB}
                        </span>
                        <span className="text-[#A99EC2]">{asp.summary}</span>
                      </div>
                    ))}
                  {profile.aspects.filter(
                    (a) =>
                      a.planetA === activePlacement.planet ||
                      a.planetB === activePlacement.planet
                  ).length === 0 && (
                    <p className="text-xs text-[#A99EC2]">
                      Operates as an unaspected autonomous channel in your chart, expressing pure {activePlacement.sign} archetype.
                    </p>
                  )}
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() =>
                      onNavigateToChatWithPrompt(
                        `Analyze my natal ${activePlacement.planet} in ${activePlacement.sign} (${activePlacement.degree}°, House ${activePlacement.house}) and how it shapes my life path.`
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-[#C084FC] to-[#E5C158] text-[#07050E] rounded hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    <span>Consult Oracle on {activePlacement.planet} in {activePlacement.sign}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filterable Planetary Ephemeris & Aspect Table */}
          <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#C084FC]/16">
              <h3 className="text-xl font-editorial font-semibold text-[#F6F3FF]">
                Planetary Longitude &amp; House Table
              </h3>

              {/* Interactive Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#080511] border border-[#C084FC]/15 rounded-md">
                {(
                  [
                    { id: "all", label: "All Bodies (12)" },
                    { id: "personal", label: "Personal (6)" },
                    { id: "outer", label: "Social & Outer (6)" },
                    { id: "aspects", label: `Aspects (${profile.aspects.length})` },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTableFilter(tab.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      tableFilter === tab.id
                        ? "bg-[#1C1236] text-[#C084FC] border border-[#C084FC]/45"
                        : "text-[#A99EC2] hover:text-[#F6F3FF]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {tableFilter !== "aspects" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#C084FC]/16 text-[11px] uppercase tracking-wider text-[#A99EC2]">
                      <th className="py-3 pr-4">Celestial Body</th>
                      <th className="py-3 px-4">Zodiac Sign</th>
                      <th className="py-3 px-4">Position</th>
                      <th className="py-3 px-4">House</th>
                      <th className="py-3 pl-4 text-right">Element / Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C084FC]/10 text-xs">
                    {filteredPlacements.map((p) => {
                      const isActive = selectedPlanet === p.planet;
                      const roleMeta = PLANET_METADATA.find(
                        (m) => m.planet === p.planet
                      );
                      return (
                        <tr
                          key={p.planet}
                          onClick={() => setSelectedPlanet(p.planet)}
                          className={`cursor-pointer transition-colors ${
                            isActive
                              ? "bg-[#1C1236] text-[#F6F3FF]"
                              : "hover:bg-[#1C1236]/50 text-[#EAE4F8]"
                          }`}
                        >
                          <td className="py-3.5 pr-4">
                            <div className="font-medium text-[#F6F3FF]">
                              <span className="inline-block w-5 text-[#C084FC] font-serif">
                                {p.glyph}
                              </span>
                              {p.planet}
                              {p.retrograde && (
                                <span className="ml-1.5 text-[10px] font-mono-tabular text-[#E5C158]">
                                  Rx
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#A99EC2] mt-0.5">
                              {roleMeta?.roleLabel}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium">
                            {p.signGlyph} {p.sign}
                          </td>
                          <td className="py-3.5 px-4 font-mono-tabular text-[#E5C158]">
                            {p.degree}°{String(p.minute).padStart(2, "0")}&apos;
                          </td>
                          <td className="py-3.5 px-4 font-mono-tabular">
                            House {p.house}
                          </td>
                          <td className="py-3.5 pl-4 text-right text-[#A99EC2]">
                            {p.element} · {p.modality}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="divide-y divide-[#C084FC]/12">
                {profile.aspects.map((asp) => (
                  <div
                    key={asp.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="text-[#F6F3FF] font-medium">
                        {asp.planetA} ({asp.signA}) {asp.type} {asp.planetB} (
                        {asp.signB})
                      </span>
                      <p className="text-[#A99EC2] mt-0.5">{asp.summary}</p>
                    </div>
                    <div className="font-mono-tabular text-[#E5C158] shrink-0">
                      {asp.angle}° · Orb {asp.orb.toFixed(2)}°
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
