import React, { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  MemoryCategory,
  MemoryItem,
  NatalProfile,
  PartnerProfile,
} from "../types/astrology";
import {
  Send,
  Plus,
  Trash2,
  RotateCcw,
  ArrowUpRight,
  Check,
} from "lucide-react";

interface AstrologerChatViewProps {
  userProfile: NatalProfile;
  savedPartners: PartnerProfile[];
  memories: MemoryItem[];
  messages: ChatMessage[];
  focusedPartnerId: string | null;
  pendingPrompt: string | null;
  onClearPendingPrompt: () => void;
  onSetFocusedPartnerId: (id: string | null) => void;
  onAddMessage: (msg: ChatMessage) => void;
  onResetChat: () => void;
  onAddMemory: (item: MemoryItem) => void;
  onDeleteMemory: (id: string) => void;
}

const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  life_event: "Life Milestone",
  relationship: "Relationship Context",
  emotional_pattern: "Inner Pattern",
  goal: "Vocation & Goal",
};

export const AstrologerChatView: React.FC<AstrologerChatViewProps> = ({
  userProfile,
  savedPartners,
  memories,
  messages,
  focusedPartnerId,
  pendingPrompt,
  onClearPendingPrompt,
  onSetFocusedPartnerId,
  onAddMessage,
  onResetChat,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [memoryFilter, setMemoryFilter] = useState<"all" | MemoryCategory>("all");
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newMemoryText, setNewMemoryText] = useState("");
  const [newMemoryCategory, setNewMemoryCategory] =
    useState<MemoryCategory>("goal");
  const [newlyExtractedNotice, setNewlyExtractedNotice] = useState<string | null>(
    null
  );

  const chatEndRef = useRef<HTMLDivElement>(null);
  const autoRecoveredRef = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    if (pendingPrompt) {
      setInput(pendingPrompt);
      onClearPendingPrompt();
    }
  }, [pendingPrompt, onClearPendingPrompt]);

  const handleSendMessage = async (
    textToSend?: string,
    skipAddingUserBubble = false
  ) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed || isSending) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: timeStr,
    };

    if (!skipAddingUserBubble) {
      onAddMessage(userMsg);
      if (!textToSend) setInput("");
    }
    setIsSending(true);
    setErrorMsg(null);
    setNewlyExtractedNotice(null);

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 14000);

    try {
      const response = await fetch("/api/astrology/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: trimmed,
          history: skipAddingUserBubble ? messages : [...messages, userMsg],
          userProfile,
          savedPartners,
          focusedPartnerId,
          memories,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to reach the Aetheris Oracle.");
      }

      const extractedItems: MemoryItem[] = (data.extractedMemories || []).map(
        (m: any, idx: number) => ({
          id: `mem-${Date.now()}-${idx}`,
          category: (["life_event", "relationship", "emotional_pattern", "goal"].includes(
            m.category
          )
            ? m.category
            : "life_event") as MemoryCategory,
          content: m.content,
          referencedPlacements: m.referencedPlacements || [],
          createdAt: "2026-10-25",
          source: "auto_extracted",
        })
      );

      extractedItems.forEach((item) => onAddMemory(item));
      if (extractedItems.length > 0) {
        setNewlyExtractedNotice(
          `Remembered ${extractedItems.length} new insight${
            extractedItems.length > 1 ? "s" : ""
          } in your Memory Bank`
        );
      }

      const assistantMsg: ChatMessage = {
        id: `oracle-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: timeStr,
        referencedPlacements: data.referencedPlacements || [],
        extractedMemories: extractedItems,
        followUpPrompts: data.followUpPrompts || [],
      };

      onAddMessage(assistantMsg);
    } catch (err: any) {
      setErrorMsg(
        err?.name === "AbortError"
          ? "Consultation timed out. Please click Consult to retry."
          : "Temporary connection interruption. Please click Consult to retry."
      );
    } finally {
      window.clearTimeout(timer);
      setIsSending(false);
    }
  };

  // Automatically answer any trailing unanswered user turn left from a prior 503 spike
  useEffect(() => {
    if (autoRecoveredRef.current || isSending || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "user") {
      autoRecoveredRef.current = true;
      handleSendMessage(lastMsg.content, true);
    }
  }, [messages]);

  const handleManualMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    const sun = userProfile.placements.find((p) => p.planet === "Sun");
    const item: MemoryItem = {
      id: `mem-manual-${Date.now()}`,
      category: newMemoryCategory,
      content: newMemoryText.trim(),
      referencedPlacements: [
        `Sun in ${sun?.sign || "Scorpio"}`,
        `Chart Ruler ${userProfile.chartRuler}`,
      ],
      createdAt: "2026-10-25",
      source: "manual",
    };

    onAddMemory(item);
    setNewMemoryText("");
    setShowAddMemory(false);
  };

  const filteredMemories = memories.filter(
    (m) => memoryFilter === "all" || m.category === memoryFilter
  );

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");

  const suggestedPrompts =
    lastAssistantMessage?.followUpPrompts &&
    lastAssistantMessage.followUpPrompts.length > 0
      ? lastAssistantMessage.followUpPrompts
      : [
          "How do my current transits interact with my career goals?",
          "What should I know about my Moon sign's emotional needs right now?",
          "Compare my chart with my partner's chart for the coming month.",
        ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-[#C084FC]/18 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#C084FC] font-mono-tabular mb-2">
            LONGITUDINAL NATAL CONSULTATION · ADAPTIVE MEMORY ENGINE
          </div>
          <h1 className="text-3xl lg:text-4xl font-editorial font-semibold text-[#F6F3FF]">
            Resident Astrologer &amp; Inspectable Memory Bank
          </h1>
          <p className="mt-1 text-sm text-[#A99EC2]">
            Every consultation adapts to your full natal chart, active partner
            synastry, and personal insights distilled from past conversations.
          </p>
        </div>

        <button
          onClick={onResetChat}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs text-[#A99EC2] hover:text-[#F6F3FF] bg-[#120B24]/85 border border-[#C084FC]/20 rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Thread (Keep Memories)</span>
        </button>
      </div>

      {/* 70% / 30% Asymmetric Consultation & Memory Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols / ~67%): Adaptive Chat Stream */}
        <div className="lg:col-span-8 bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg flex flex-col h-[720px]">
          {/* Active Natal & Synastry Context Bar */}
          <div className="px-6 py-3.5 border-b border-[#C084FC]/16 flex flex-wrap items-center justify-between gap-3 bg-[#080511]/70">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A99EC2] font-mono-tabular">
              <span className="text-[#F6F3FF] font-medium">
                CHART CONTEXT: {userProfile.name.toUpperCase()}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#C084FC]">{memories.length} MEMORIES ACTIVE</span>
            </div>

            {/* Optional Partner Chart Context Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#A99EC2]">Synastry Focus:</span>
              <select
                value={focusedPartnerId || ""}
                onChange={(e) =>
                  onSetFocusedPartnerId(e.target.value ? e.target.value : null)
                }
                className="px-2.5 py-1 bg-[#120B24] border border-[#C084FC]/25 rounded text-xs text-[#F6F3FF] focus:outline-none focus:border-[#C084FC]"
              >
                <option value="">Solo Natal Reading</option>
                {savedPartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    + {p.name} ({p.relationshipLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversation Scroll Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 text-[11px] text-[#A99EC2] font-mono-tabular mb-1.5">
                    <span>
                      {isUser ? userProfile.name.toUpperCase() : "AETHERIS ASTROLOGER"}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-2xl rounded-lg p-5 text-[15px] leading-relaxed ${
                      isUser
                        ? "bg-[#1E133A] border border-[#C084FC]/45 text-[#F6F3FF]"
                        : "bg-[#080511]/90 border border-[#C084FC]/16 text-[#EAE4F8]"
                    }`}
                  >
                    <div className="space-y-3.5">
                      {msg.content
                        .split(/\n+/)
                        .filter(Boolean)
                        .map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                    </div>

                    {!isUser &&
                      msg.referencedPlacements &&
                      msg.referencedPlacements.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#C084FC]/14 text-xs text-[#A99EC2] font-mono-tabular flex flex-wrap items-center gap-1.5">
                          <span className="text-[#E5C158]">CITED PLACEMENTS:</span>
                          {msg.referencedPlacements.map((ref, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && <span aria-hidden="true">·</span>}
                              <span>{ref}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                    {!isUser &&
                      msg.extractedMemories &&
                      msg.extractedMemories.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#C084FC]/22 text-xs text-[#C084FC] font-mono-tabular">
                          + COMMITTED TO MEMORY BANK:{" "}
                          {msg.extractedMemories
                            .map((m) => `"${m.content}"`)
                            .join(" · ")}
                        </div>
                      )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex flex-col items-start">
                <div className="text-[11px] text-[#C084FC] font-mono-tabular mb-1.5">
                  AETHERIS ASTROLOGER · CONSULTING EPHEMERIS &amp; MEMORY BANK...
                </div>
                <div className="bg-[#080511] border border-[#C084FC]/18 rounded-lg p-5 text-sm text-[#A99EC2] max-w-md">
                  Synthesizing planetary transits, house rulers, and your
                  remembered life narrative...
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-rose-950/40 border border-rose-500/35 rounded text-xs text-rose-200 flex items-center justify-between gap-4">
                <span>{errorMsg}</span>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="text-rose-100 underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Follow-Up Prompts */}
          <div className="px-6 py-3 border-t border-[#C084FC]/12 bg-[#080511]/55">
            <div className="text-[11px] uppercase tracking-wider text-[#A99EC2] mb-2">
              Tailored Natal Inquiries
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isSending}
                  className="text-left text-xs text-[#EAE4F8] hover:text-[#E5C158] bg-[#120B24] border border-[#C084FC]/16 hover:border-[#C084FC]/45 px-3 py-1.5 rounded transition-colors cursor-pointer truncate max-w-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 border-t border-[#C084FC]/16 bg-[#080511] flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share a life update, relationship question, or transit inquiry with the Astrologer..."
              className="flex-1 px-4 py-2.5 text-sm bg-[#120B24] border border-[#C084FC]/22 rounded text-[#F6F3FF] placeholder:text-[#A99EC2]/60 focus:outline-none focus:border-[#C084FC]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-gradient-to-r from-[#C084FC] to-[#E5C158] text-[#07050E] rounded hover:opacity-95 transition-opacity disabled:opacity-40 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Consult</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Column (4 cols / ~33%): Inspectable Memory Bank Ledger */}
        <aside className="lg:col-span-4 bg-[#120B24]/85 backdrop-blur-sm border border-[#C084FC]/18 rounded-lg p-6 space-y-5">
          <div className="flex items-start justify-between gap-2 pb-4 border-b border-[#C084FC]/16">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#C084FC] font-mono-tabular">
                TRANSPARENT LONGITUDINAL MEMORY
              </div>
              <h2 className="text-xl font-editorial font-semibold text-[#F6F3FF] mt-0.5">
                Inspectable Memory Bank ({memories.length})
              </h2>
              <p className="text-xs text-[#A99EC2] mt-1">
                Insights automatically distilled from your conversations to
                personalize horoscopes and advice.
              </p>
            </div>

            <button
              onClick={() => setShowAddMemory((prev) => !prev)}
              className="p-2 bg-[#1C1236] border border-[#C084FC]/40 rounded text-[#E5C158] hover:border-[#E5C158] transition-colors cursor-pointer shrink-0"
              title="Add manual memory insight"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {newlyExtractedNotice && (
            <div className="p-3 bg-[#1E133A] border border-[#C084FC]/45 rounded text-xs text-[#DDD6FE] font-mono-tabular">
              {newlyExtractedNotice}
            </div>
          )}

          {/* Manual Memory Creation Form */}
          {showAddMemory && (
            <form
              onSubmit={handleManualMemorySubmit}
              className="p-4 bg-[#080511] border border-[#C084FC]/45 rounded space-y-3"
            >
              <div className="text-xs font-medium text-[#F6F3FF]">
                Record Personal Insight or Milestone
              </div>
              <select
                value={newMemoryCategory}
                onChange={(e) =>
                  setNewMemoryCategory(e.target.value as MemoryCategory)
                }
                className="w-full px-3 py-1.5 text-xs bg-[#120B24] border border-[#C084FC]/22 rounded text-[#F6F3FF]"
              >
                <option value="goal">Vocation &amp; Goal</option>
                <option value="relationship">Relationship Context</option>
                <option value="life_event">Life Milestone</option>
                <option value="emotional_pattern">Inner Pattern</option>
              </select>
              <textarea
                rows={2}
                required
                value={newMemoryText}
                onChange={(e) => setNewMemoryText(e.target.value)}
                placeholder="e.g., Moving to Lisbon in spring 2027 to write a book..."
                className="w-full px-3 py-2 text-xs bg-[#120B24] border border-[#C084FC]/22 rounded text-[#F6F3FF] focus:outline-none focus:border-[#C084FC]"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemory(false)}
                  className="px-2.5 py-1 text-xs text-[#A99EC2] hover:text-[#F6F3FF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-[#C084FC] to-[#E5C158] text-[#07050E] rounded cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Save Insight</span>
                </button>
              </div>
            </form>
          )}

          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#080511] border border-[#C084FC]/14 rounded-md">
            {(
              [
                { id: "all", label: "All" },
                { id: "goal", label: "Goals" },
                { id: "relationship", label: "Bonds" },
                { id: "emotional_pattern", label: "Patterns" },
                { id: "life_event", label: "Events" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMemoryFilter(tab.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                  memoryFilter === tab.id
                    ? "bg-[#1C1236] text-[#C084FC] border border-[#C084FC]/45"
                    : "text-[#A99EC2] hover:text-[#F6F3FF]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Memory Items List */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-4 bg-[#080511]/90 border border-[#C084FC]/16 rounded-lg space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular text-[#A99EC2]">
                  <span className="text-[#E5C158] uppercase">
                    {CATEGORY_LABELS[mem.category]} · {mem.createdAt}
                  </span>
                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    title="Forget this memory"
                    className="text-[#A99EC2] hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#F6F3FF] leading-relaxed">
                  {mem.content}
                </p>

                {mem.referencedPlacements &&
                  mem.referencedPlacements.length > 0 && (
                    <div className="text-[11px] text-[#C084FC] font-mono-tabular">
                      Linked: {mem.referencedPlacements.join(" · ")}
                    </div>
                  )}

                <div className="pt-2 border-t border-[#C084FC]/10 flex justify-end">
                  <button
                    onClick={() =>
                      handleSendMessage(
                        `Regarding what you remember about me ("${mem.content}"), how do my current planetary transits advise me to approach this next?`
                      )
                    }
                    disabled={isSending}
                    className="text-[11px] text-[#E5C158] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore in Consultation</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {filteredMemories.length === 0 && (
              <div className="p-6 text-center text-xs text-[#A99EC2] border border-dashed border-[#C084FC]/20 rounded">
                No memories recorded in this category yet. Mention personal
                milestones, goals, or relationship questions in chat to populate
                your Memory Bank automatically.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
