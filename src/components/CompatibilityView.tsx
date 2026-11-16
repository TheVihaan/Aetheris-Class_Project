import React, { useState } from "react";
import {
  MemoryItem,
  NatalProfile,
  PartnerProfile,
  RelationshipCategory,
  SynastryReport,
} from "../types/astrology";
import {
  CITY_PRESETS,
  calculateNatalChart,
  calculateSynastryAspects,
} from "../utils/ephemeris";
import { NatalWheelSvg } from "./NatalWheelSvg";
import {
  Users,
  Heart,
  Plus,
  RefreshCw,
  Trash2,
  ArrowUpRight,
  Check,
} from "lucide-react";

interface CompatibilityViewProps {
  userProfile: NatalProfile;
  savedPartners: PartnerProfile[];
  memories: MemoryItem[];
  onAddPartner: (partner: PartnerProfile) => void;
  onDeletePartner: (partnerId: string) => void;
  onUpdatePartnerReport: (
    partnerId: string,
    lens: RelationshipCategory,
    report: SynastryReport
  ) => void;
  onNavigateToChatWithPartner: (partnerId: string, prompt: string) => void;
}

export const CompatibilityView: React.FC<CompatibilityViewProps> = ({
  userProfile,
  savedPartners,
  memories,
  onAddPartner,
  onDeletePartner,
  onUpdatePartnerReport,
  onNavigateToChatWithPartner,
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    savedPartners[0]?.id || ""
  );
  const activePartner =
    savedPartners.find((p) => p.id === selectedPartnerId) || savedPartners[0];

  const [relationshipLens, setRelationshipLens] = useState<RelationshipCategory>(
    activePartner?.relationshipType || "romantic"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<RelationshipCategory>("romantic");
  const [newLabel, setNewLabel] = useState("Romantic Partner");
  const [newDate, setNewDate] = useState("1993-08-19");
  const [newTime, setNewTime] = useState("15:30");
  const [newCity, setNewCity] = useState(CITY_PRESETS[0].label);
  const [newNotes, setNewNotes] = useState("");

  const handleSelectPartner = (partner: PartnerProfile) => {
    setSelectedPartnerId(partner.id);
    setRelationshipLens(partner.relationshipType);
    setErrorMsg(null);
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const preset =
      CITY_PRESETS.find((c) => c.label === newCity) || CITY_PRESETS[0];
    const baseChart = calculateNatalChart({
      id: `partner-${Date.now()}`,
      name: newName.trim(),
      birthDate: newDate,
      birthTime: newTime,
      birthLocation: preset.label,
      latitude: preset.latitude,
      longitude: preset.longitude,
    });

    const newPartner: PartnerProfile = {
      ...baseChart,
      relationshipType: newCategory,
      relationshipLabel:
        newLabel.trim() ||
        (newCategory === "romantic" ? "Romantic Partner" : "Close Friend"),
      notes: newNotes.trim() || undefined,
      cachedReports: {},
    };

    onAddPartner(newPartner);
    setSelectedPartnerId(newPartner.id);
    setRelationshipLens(newPartner.relationshipType);
    setShowAddForm(false);
    setNewName("");
    setNewNotes("");
  };

  const handleAnalyzeSynastry = async (
    targetPartner = activePartner,
    targetLens = relationshipLens
  ) => {
    if (!targetPartner) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/astrology/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile,
          partnerProfile: targetPartner,
          relationshipLens: targetLens,
          memories,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate synastry analysis.");
      }

      const report: SynastryReport = {
        ...data,
        generatedAt: "2026-10-25",
        lens: targetLens,
      };
      onUpdatePartnerReport(targetPartner.id, targetLens, report);
    } catch (err: any) {
      setErrorMsg(err.message || "Error communicating with synastry engine.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentReport: SynastryReport | undefined =
    activePartner?.cachedReports?.[relationshipLens];

  const interChartAspects = activePartner
    ? calculateSynastryAspects(userProfile, activePartner)
    : [];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="border-b border-[#C084FC]/18 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#C084FC] font-mono-tabular mb-2">
            BI-WHEEL SYNASTRY OBSERVATORY · ROMANTIC &amp; PLATONIC BONDS
          </div>
          <h1 className="text-3xl lg:text-4xl font-editorial font-semibold text-[#F6F3FF]">
            Relational Synastry &amp; Saved Profiles Ledger
          </h1>
          <p className="mt-1 text-sm text-[#A99EC2]">
            Compare full planetary longitudes, elemental harmony, and inter-chart
            aspects across romantic partners and close friends.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-[#C084FC] to-[#E5C158] text-[#07050E] rounded hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "Close Profile Form" : "Add Partner or Friend"}</span>
        </button>
      </div>

      {/* Collapsible New Profile Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreatePartner}
          className="bg-[#120B24]/90 backdrop-blur-md border border-[#C084FC]/45 rounded-lg p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#C084FC]/16 pb-3">
            <h2 className="text-xl font-editorial font-semibold text-[#F6F3FF]">
              Add Saved Profile for Ongoing Synastry
            </h2>
            <span className="text-xs text-[#A99EC2]">
              Calculates full 12-body natal chart automatically
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Elena Rostova"
                className="w-full px-3.5 py-2 text-sm bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] focus:outline-none focus:border-[#C084FC]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Relationship Dynamic
              </label>
              <div className="flex items-center gap-1 p-1 bg-[#080511] border border-[#C084FC]/22 rounded">
                <button
                  type="button"
                  onClick={() => {
                    setNewCategory("romantic");
                    setNewLabel("Romantic Partner");
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    newCategory === "romantic"
                      ? "bg-[#C084FC] text-[#07050E] font-semibold"
                      : "text-[#A99EC2] hover:text-[#F6F3FF]"
                  }`}
                >
                  Romantic
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewCategory("friendship");
                    setNewLabel("Close Friend");
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    newCategory === "friendship"
                      ? "bg-[#C084FC] text-[#07050E] font-semibold"
                      : "text-[#A99EC2] hover:text-[#F6F3FF]"
                  }`}
                >
                  Friendship / Peer
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Role / Descriptor
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., Partner, Best Friend, Co-Founder"
                className="w-full px-3.5 py-2 text-sm bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] focus:outline-none focus:border-[#C084FC]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Birth Date
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] font-mono-tabular focus:outline-none focus:border-[#C084FC]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Birth Time
              </label>
              <input
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] font-mono-tabular focus:outline-none focus:border-[#C084FC]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Birth City
              </label>
              <select
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] focus:outline-none focus:border-[#C084FC]"
              >
                {CITY_PRESETS.map((city) => (
                  <option key={city.label} value={city.label}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Optional context note (e.g., 'Planning a creative project together this winter')"
              className="flex-1 px-3.5 py-2 text-xs bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] focus:outline-none focus:border-[#C084FC]"
            />
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs text-[#A99EC2] hover:text-[#F6F3FF] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-gradient-to-r from-[#C084FC] to-[#E5C158] text-[#07050E] rounded hover:opacity-95 transition-opacity cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile &amp; Calculate Chart</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main Split Workspace: Left Saved Profiles Ledger (4 cols) | Right Synastry Studio (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Saved Partner & Friend Profiles Ledger */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#C084FC]/16">
              <h2 className="text-lg font-editorial font-semibold text-[#F6F3FF]">
                Saved Profiles ({savedPartners.length})
              </h2>
              <span className="text-xs text-[#A99EC2]">Select to compare</span>
            </div>

            <div className="space-y-3">
              {savedPartners.map((partner) => {
                const isSelected = partner.id === activePartner?.id;
                const sun = partner.placements.find((p) => p.planet === "Sun");
                const moon = partner.placements.find((p) => p.planet === "Moon");
                const asc = partner.placements.find(
                  (p) => p.planet === "Ascendant"
                );

                return (
                  <div
                    key={partner.id}
                    onClick={() => handleSelectPartner(partner)}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#1C1236] border-[#C084FC]"
                        : "bg-[#080511]/75 border-[#C084FC]/12 hover:border-[#C084FC]/35"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-[#E5C158] font-mono-tabular">
                          {partner.relationshipLabel}
                        </div>
                        <h3 className="text-lg font-editorial font-semibold text-[#F6F3FF]">
                          {partner.name}
                        </h3>
                      </div>

                      {savedPartners.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePartner(partner.id);
                          }}
                          title="Remove profile"
                          className="p-1 text-[#A99EC2] hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[#C084FC] font-mono-tabular">
                      <span>☉ {sun?.sign}</span>
                      <span aria-hidden="true">·</span>
                      <span>☽ {moon?.sign}</span>
                      <span aria-hidden="true">·</span>
                      <span>ASC {asc?.sign}</span>
                    </div>

                    {partner.notes && (
                      <p className="mt-2 text-xs text-[#EAE4F8]/80 line-clamp-2">
                        {partner.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dual-Ring Bi-Wheel Visualization */}
          {activePartner && (
            <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-5">
              <div className="mb-3">
                <h3 className="text-base font-editorial font-semibold text-[#F6F3FF]">
                  Bi-Wheel Synastry Projection
                </h3>
                <p className="text-xs text-[#A99EC2]">
                  Outer Ring: {userProfile.name} (Amethyst) · Inner Ring:{" "}
                  {activePartner.name} (Gold)
                </p>
              </div>
              <NatalWheelSvg
                profile={userProfile}
                secondaryProfile={activePartner}
                size={380}
              />
            </div>
          )}
        </div>

        {/* Right Column: Synastry Report & Aspect Comparison */}
        <div className="lg:col-span-8 space-y-6">
          {activePartner && (
            <>
              {/* Synastry Control Bar */}
              <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-[#A99EC2]">
                    Analysis Lens:
                  </span>
                  <div className="flex items-center gap-1 p-1 bg-[#080511] border border-[#C084FC]/16 rounded-md">
                    <button
                      onClick={() => {
                        setRelationshipLens("romantic");
                        if (!activePartner.cachedReports?.romantic) {
                          handleAnalyzeSynastry(activePartner, "romantic");
                        }
                      }}
                      disabled={isGenerating}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                        relationshipLens === "romantic"
                          ? "bg-[#C084FC] text-[#07050E] font-semibold"
                          : "text-[#A99EC2] hover:text-[#F6F3FF]"
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Romantic &amp; Intimacy Synastry</span>
                    </button>
                    <button
                      onClick={() => {
                        setRelationshipLens("friendship");
                        if (!activePartner.cachedReports?.friendship) {
                          handleAnalyzeSynastry(activePartner, "friendship");
                        }
                      }}
                      disabled={isGenerating}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                        relationshipLens === "friendship"
                          ? "bg-[#C084FC] text-[#07050E] font-semibold"
                          : "text-[#A99EC2] hover:text-[#F6F3FF]"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Friendship &amp; Platonic Dynamic</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleAnalyzeSynastry(activePartner, relationshipLens)
                  }
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-[#1C1236] text-[#E5C158] border border-[#E5C158]/40 rounded hover:border-[#E5C158] transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isGenerating
                      ? "Analyzing Charts..."
                      : currentReport
                      ? "Refresh LLM Synastry"
                      : "Generate LLM Synastry Report"}
                  </span>
                </button>
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-950/40 border border-rose-500/35 rounded-lg flex items-center justify-between gap-4 text-xs text-rose-200">
                  <span>{errorMsg}</span>
                  <button
                    onClick={() =>
                      handleAnalyzeSynastry(activePartner, relationshipLens)
                    }
                    className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 rounded cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* LLM Synastry Monograph Card */}
              {currentReport ? (
                <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6 lg:p-8 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C084FC]/16 pb-6">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#C084FC] font-mono-tabular mb-2">
                        {userProfile.name.toUpperCase()} ×{" "}
                        {activePartner.name.toUpperCase()} ·{" "}
                        {relationshipLens === "romantic"
                          ? "ROMANTIC SYNASTRY"
                          : "PLATONIC & COLLABORATIVE SYNASTRY"}
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-editorial font-semibold text-[#F6F3FF]">
                        {currentReport.archetypeTitle}
                      </h2>
                    </div>

                    <div className="text-left md:text-right shrink-0">
                      <div className="text-[11px] uppercase tracking-widest text-[#A99EC2]">
                        HARMONIC INDEX
                      </div>
                      <div className="text-3xl font-mono-tabular font-bold text-[#E5C158]">
                        {currentReport.overallScore}
                        <span className="text-xs text-[#A99EC2] font-normal ml-1">
                          / 100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Quantitative Harmonic Sub-Indices */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Emotional Attunement",
                        val: currentReport.metrics.emotionalResonance,
                      },
                      {
                        label: "Intellectual Rapport",
                        val: currentReport.metrics.intellectualRapport,
                      },
                      {
                        label:
                          relationshipLens === "romantic"
                            ? "Magnetic Chemistry"
                            : "Creative Synergy",
                        val: currentReport.metrics.chemistryOrSynergy,
                      },
                      {
                        label: "Long-Horizon Stability",
                        val: currentReport.metrics.longTermStability,
                      },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="p-3.5 bg-[#080511] border border-[#C084FC]/14 rounded"
                      >
                        <div className="text-[11px] text-[#A99EC2]">
                          {m.label}
                        </div>
                        <div className="mt-1 text-xl font-mono-tabular font-semibold text-[#F6F3FF]">
                          {m.val}%
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Editorial Narrative */}
                  <div className="space-y-4 text-[15px] text-[#EAE4F8] leading-relaxed">
                    {currentReport.editorialOverview
                      .split(/\n+/)
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                  </div>

                  {/* Elemental Interplay Box */}
                  <div className="p-5 bg-[#080511] border border-[#C084FC]/18 rounded-lg space-y-1.5">
                    <div className="text-xs uppercase tracking-widest text-[#E5C158]">
                      Elemental &amp; Modality Interplay
                    </div>
                    <p className="text-sm text-[#EAE4F8] leading-relaxed">
                      {currentReport.elementalInterplay}
                    </p>
                  </div>

                  {/* Key Synastry Aspects from Report */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-editorial font-semibold text-[#F6F3FF]">
                      Primary Inter-Chart Planetary Contacts
                    </h3>
                    <div className="divide-y divide-[#C084FC]/12 border-y border-[#C084FC]/16">
                      {currentReport.keySynastryAspects.map((asp, idx) => (
                        <div
                          key={idx}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-mono-tabular">
                              <span
                                className={
                                  asp.nature === "harmonious"
                                    ? "text-[#C084FC]"
                                    : asp.nature === "challenging"
                                    ? "text-rose-400"
                                    : "text-[#E5C158]"
                                }
                              >
                                {asp.nature === "harmonious"
                                  ? "● Harmonious"
                                  : asp.nature === "challenging"
                                  ? "▲ Growth Friction"
                                  : "◆ Magnetic"}
                              </span>
                              <span className="text-[#A99EC2]">·</span>
                              <span className="text-[#A99EC2]">
                                Orb {asp.orb}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-[#F6F3FF]">
                              {asp.aspectLabel}
                            </div>
                            <p className="text-xs text-[#EAE4F8] leading-relaxed">
                              {asp.meaning}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Growth Edges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm uppercase tracking-wider text-[#C084FC] font-mono-tabular">
                        Luminaries &amp; Core Strengths
                      </h4>
                      <ul className="space-y-2 text-xs text-[#EAE4F8] leading-relaxed">
                        {currentReport.luminariesAndStrengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#C084FC]">·</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm uppercase tracking-wider text-[#E5C158] font-mono-tabular">
                        Growth Edges &amp; Shadow Work
                      </h4>
                      <ul className="space-y-2 text-xs text-[#EAE4F8] leading-relaxed">
                        {currentReport.growthEdges.map((g, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#E5C158]">·</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bespoke Counsel Footer */}
                  <div className="pt-6 border-t border-[#C084FC]/16 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="max-w-xl">
                      <div className="text-xs uppercase tracking-widest text-[#E5C158] mb-1">
                        Astrologer&apos;s Relational Counsel
                      </div>
                      <p className="text-sm text-[#EAE4F8] leading-relaxed">
                        {currentReport.bespokeCounsel}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        onNavigateToChatWithPartner(
                          activePartner.id,
                          `Let's discuss my ${relationshipLens} synastry with ${activePartner.name} ("${currentReport.archetypeTitle}") and how to navigate our growth edges.`
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-gradient-to-r from-[#C084FC] to-[#E5C158] text-[#07050E] rounded hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Consult Oracle on {activePartner.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-8 text-center space-y-4">
                  <div className="text-xs uppercase tracking-widest text-[#C084FC] font-mono-tabular">
                    READY FOR LLM SYNASTRY SYNTHESIS
                  </div>
                  <h3 className="text-2xl font-editorial font-semibold text-[#F6F3FF]">
                    Synthesize {relationshipLens === "romantic" ? "Romantic" : "Friendship"} Report for{" "}
                    {userProfile.name} &amp; {activePartner.name}
                  </h3>
                  <p className="text-sm text-[#A99EC2] max-w-lg mx-auto">
                    We have computed {interChartAspects.length} exact geometric
                    aspects between your natal charts. Click below to generate a
                    deep interpretive synastry monograph for this lens.
                  </p>
                  <button
                    onClick={() =>
                      handleAnalyzeSynastry(activePartner, relationshipLens)
                    }
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-gradient-to-r from-[#C084FC] to-[#E5C158] text-[#07050E] rounded hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isGenerating ? "animate-spin" : ""
                      }`}
                    />
                    <span>
                      {isGenerating
                        ? "Synthesizing Synastry..."
                        : `Generate ${
                            relationshipLens === "romantic"
                              ? "Romantic"
                              : "Friendship"
                          } Synastry Report`}
                    </span>
                  </button>
                </div>
              )}

              {/* Mathematical Inter-Chart Ephemeris Aspects Table */}
              <div className="bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#C084FC]/16">
                  <h3 className="text-lg font-editorial font-semibold text-[#F6F3FF]">
                    Calculated Bi-Wheel Aspect Matrix ({interChartAspects.length})
                  </h3>
                  <span className="text-xs text-[#A99EC2] font-mono-tabular">
                    EXACT ECLIPTIC LONGITUDE DELTA
                  </span>
                </div>

                <div className="divide-y divide-[#C084FC]/10 text-xs">
                  {interChartAspects.map((asp) => (
                    <div
                      key={asp.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="text-[#F6F3FF] font-medium">
                        {asp.summary}
                      </span>
                      <span className="font-mono-tabular text-[#C084FC]">
                        {asp.type} ({asp.angle}°)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
