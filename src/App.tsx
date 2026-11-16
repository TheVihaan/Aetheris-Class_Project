/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  DailyHoroscopeReading,
  MemoryItem,
  NatalProfile,
  PartnerProfile,
  RelationshipCategory,
  SynastryReport,
} from "./types/astrology";
import {
  DEFAULT_USER_PROFILE,
  INITIAL_CHAT_MESSAGES,
  INITIAL_DAILY_HOROSCOPE,
  INITIAL_MEMORY_BANK,
  INITIAL_SAVED_PARTNERS,
} from "./utils/ephemeris";
import { DailyHoroscopeView } from "./components/DailyHoroscopeView";
import { NatalChartView } from "./components/NatalChartView";
import { CompatibilityView } from "./components/CompatibilityView";
import { AstrologerChatView } from "./components/AstrologerChatView";
import { CalibrateChartModal } from "./components/CalibrateChartModal";
import { InteractiveSkyCanvas } from "./components/InteractiveSkyCanvas";

type ActiveTab = "horoscope" | "chart" | "compatibility" | "chat";

const STORAGE_KEYS = {
  PROFILE: "aetheris_user_profile_v1",
  PARTNERS: "aetheris_saved_partners_v1",
  MEMORIES: "aetheris_memory_bank_v1",
  HOROSCOPE: "aetheris_daily_horoscope_v1",
  MESSAGES: "aetheris_chat_messages_v1",
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("horoscope");
  const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);
  const dailyReadingAnchorRef = useRef<HTMLDivElement | null>(null);

  const [userProfile, setUserProfile] = useState<NatalProfile>(() =>
    loadFromStorage(STORAGE_KEYS.PROFILE, DEFAULT_USER_PROFILE)
  );
  const [savedPartners, setSavedPartners] = useState<PartnerProfile[]>(() =>
    loadFromStorage(STORAGE_KEYS.PARTNERS, INITIAL_SAVED_PARTNERS)
  );
  const [memories, setMemories] = useState<MemoryItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.MEMORIES, INITIAL_MEMORY_BANK)
  );
  const [dailyReading, setDailyReading] = useState<DailyHoroscopeReading>(() =>
    loadFromStorage(STORAGE_KEYS.HOROSCOPE, INITIAL_DAILY_HOROSCOPE)
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    loadFromStorage(STORAGE_KEYS.MESSAGES, INITIAL_CHAT_MESSAGES)
  );

  const [focusedPartnerId, setFocusedPartnerId] = useState<string | null>(null);
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(
    null
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(savedPartners));
    } catch {
      // ignore
    }
  }, [savedPartners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch {
      // ignore
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOROSCOPE, JSON.stringify(dailyReading));
    } catch {
      // ignore
    }
  }, [dailyReading]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(chatMessages));
    } catch {
      // ignore
    }
  }, [chatMessages]);

  const handleNavigateToChatWithPrompt = (prompt: string) => {
    setPendingChatPrompt(prompt);
    setActiveTab("chat");
  };

  const handleNavigateToChatWithPartner = (
    partnerId: string,
    prompt: string
  ) => {
    setFocusedPartnerId(partnerId);
    setPendingChatPrompt(prompt);
    setActiveTab("chat");
  };

  const handleAddPartner = (partner: PartnerProfile) => {
    setSavedPartners((prev) => [partner, ...prev]);
  };

  const handleDeletePartner = (partnerId: string) => {
    setSavedPartners((prev) => prev.filter((p) => p.id !== partnerId));
    if (focusedPartnerId === partnerId) {
      setFocusedPartnerId(null);
    }
  };

  const handleUpdatePartnerReport = (
    partnerId: string,
    lens: RelationshipCategory,
    report: SynastryReport
  ) => {
    setSavedPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? {
              ...p,
              cachedReports: {
                ...(p.cachedReports || {}),
                [lens]: report,
              },
            }
          : p
      )
    );
  };

  const handleAddMemory = (item: MemoryItem) => {
    setMemories((prev) => {
      const exists = prev.some(
        (m) => m.content.toLowerCase() === item.content.toLowerCase()
      );
      if (exists) return prev;
      return [item, ...prev];
    });
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const handleResetChat = () => {
    setChatMessages(INITIAL_CHAT_MESSAGES);
  };

  const handleSaveCalibratedProfile = async (updated: NatalProfile) => {
    setUserProfile(updated);
    try {
      const response = await fetch("/api/astrology/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: updated,
          timeframe: dailyReading.timeframe || "today",
          focus: dailyReading.focus || "holistic",
          memories,
          currentDate: "2026-10-25",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setDailyReading({
          ...data,
          timeframe: dailyReading.timeframe || "today",
          focus: dailyReading.focus || "holistic",
          generatedAt: "2026-10-25",
        });
      }
    } catch {
      // Keep existing reading if offline
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#07050E] text-[#F6F3FF]">
      {/* Strict 3-Zone Top Bar Contract: [Brand Wordmark] — [4 Single-Line Nav Links] — [1 Primary Action] */}
      <header className="sticky top-0 z-40 bg-[#090614]/85 backdrop-blur-md border-b border-[#C084FC]/18">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab("horoscope")}
            className="text-2xl font-editorial font-semibold tracking-tight text-[#F6F3FF] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Aetheris
          </button>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-[#A99EC2] overflow-x-auto"
          >
            {(
              [
                { id: "horoscope", label: "Daily Reading" },
                { id: "chart", label: "Natal Chart" },
                { id: "compatibility", label: "Synastry" },
                { id: "chat", label: "Astrologer Chat" },
              ] as const
            ).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b ${
                    isActive
                      ? "text-[#F6F3FF] border-[#C084FC]"
                      : "text-[#A99EC2] border-transparent hover:text-[#F6F3FF]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setIsCalibrateOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-[#07050E] bg-gradient-to-r from-[#C084FC] to-[#E5C158] rounded hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
            >
              Calibrate Chart
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (1440px Desktop Presence) */}
      <main className="relative z-10 flex-1 w-full max-w-[1360px] mx-auto px-6 py-8 lg:py-10">
        {activeTab === "horoscope" && (
          <>
            {/* Exclusive Home Page Celestial Observatory Hero with "Aetheris" Wordmark */}
            <InteractiveSkyCanvas
              onScrollToContent={() =>
                dailyReadingAnchorRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            />

            <div ref={dailyReadingAnchorRef}>
              <DailyHoroscopeView
                profile={userProfile}
                reading={dailyReading}
                memories={memories}
                onUpdateReading={setDailyReading}
                onNavigateToChatWithPrompt={handleNavigateToChatWithPrompt}
                onNavigateToChart={() => setActiveTab("chart")}
                onOpenCalibration={() => setIsCalibrateOpen(true)}
              />
            </div>
          </>
        )}

        {activeTab === "chart" && (
          <NatalChartView
            profile={userProfile}
            onOpenCalibration={() => setIsCalibrateOpen(true)}
            onNavigateToChatWithPrompt={handleNavigateToChatWithPrompt}
          />
        )}

        {activeTab === "compatibility" && (
          <CompatibilityView
            userProfile={userProfile}
            savedPartners={savedPartners}
            memories={memories}
            onAddPartner={handleAddPartner}
            onDeletePartner={handleDeletePartner}
            onUpdatePartnerReport={handleUpdatePartnerReport}
            onNavigateToChatWithPartner={handleNavigateToChatWithPartner}
          />
        )}

        {activeTab === "chat" && (
          <AstrologerChatView
            userProfile={userProfile}
            savedPartners={savedPartners}
            memories={memories}
            messages={chatMessages}
            focusedPartnerId={focusedPartnerId}
            pendingPrompt={pendingChatPrompt}
            onClearPendingPrompt={() => setPendingChatPrompt(null)}
            onSetFocusedPartnerId={setFocusedPartnerId}
            onAddMessage={handleAddChatMessage}
            onResetChat={handleResetChat}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="relative z-10 border-t border-[#C084FC]/16 bg-[#07050E]/80 backdrop-blur-sm py-6 mt-16">
        <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A99EC2]">
          <div>
            Aetheris Celestial Observatory · Personalized Natal Ephemeris &amp;
            Longitudinal Memory
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCalibrateOpen(true)}
              className="hover:text-[#F6F3FF] transition-colors cursor-pointer"
            >
              Birth Data: {userProfile.name} ({userProfile.birthDate})
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab("chat")}
              className="hover:text-[#F6F3FF] transition-colors cursor-pointer"
            >
              Memory Bank ({memories.length} insights)
            </button>
          </div>
        </div>
      </footer>

      {/* Birth Chart Calibration Modal */}
      <CalibrateChartModal
        profile={userProfile}
        isOpen={isCalibrateOpen}
        onClose={() => setIsCalibrateOpen(false)}
        onSaveProfile={handleSaveCalibratedProfile}
      />
    </div>
  );
}
