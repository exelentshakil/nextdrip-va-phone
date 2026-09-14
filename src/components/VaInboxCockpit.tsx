"use client";

import React, { useState, useEffect } from "react";
import { 
  CallRecord, 
  SmsThread, 
  SmsMessage, 
  TwilioLine, 
  ScheduleConfig 
} from "@/lib/types";
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOff, 
  MessageSquare, 
  Lock, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Plus
} from "lucide-react";
import { formatPhoneNumber } from "@/lib/utils";

interface VaInboxCockpitProps {
  lines: TwilioLine[];
  calls: CallRecord[];
  smsThreads: SmsThread[];
  scheduleConfig: ScheduleConfig;
  isVaShiftActive: boolean;
  incomingCallAlert: {
    lineId: string;
    customerName: string;
    customerNumber: string;
    territory: string;
  } | null;
  onAnswerIncomingCall: () => void;
  onDeclineIncomingCall: () => void;
}

export function VaInboxCockpit({
  lines,
  calls,
  smsThreads,
  scheduleConfig,
  isVaShiftActive,
  incomingCallAlert,
  onAnswerIncomingCall,
  onDeclineIncomingCall
}: VaInboxCockpitProps) {
  // Inbox selection & filter state
  const [activeChannel, setActiveChannel] = useState<"ALL" | "VOICE" | "SMS">("ALL");
  const [selectedLineId, setSelectedLineId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected item state
  const [selectedItemType, setSelectedItemType] = useState<"CALL" | "SMS">("SMS");
  const [selectedItemId, setSelectedItemId] = useState<string>("thread-001");

  // Local thread messages state to allow real sending
  const [threadsState, setThreadsState] = useState<SmsThread[]>(smsThreads);
  const [callsState, setCallsState] = useState<CallRecord[]>(calls);

  // Compose text state
  const [composeText, setComposeText] = useState<string>("");
  const [isGeneratingAiReply, setIsGeneratingAiReply] = useState<boolean>(false);
  const [aiTelemetry, setAiTelemetry] = useState<{
    model: string;
    latencyMs: number;
    provider: string;
    reasoning: string;
  } | null>(null);

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState<number>(35);

  // Active call WebRTC state
  const [isInActiveCall, setIsInActiveCall] = useState<boolean>(false);
  const [activeCallSeconds, setActiveCallSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeCallDetails, setActiveCallDetails] = useState<{
    customerName: string;
    customerNumber: string;
    lineTerritory: string;
    lineNumber: string;
  }>({
    customerName: "Victoria Sterling",
    customerNumber: "+1 (310) 894-2201",
    lineTerritory: "Beverly Hills",
    lineNumber: "+1 (310) 555-0142"
  });

  // Keep state synced when props change
  useEffect(() => {
    setThreadsState(smsThreads);
  }, [smsThreads]);

  useEffect(() => {
    setCallsState(calls);
  }, [calls]);

  // Active Call Timer
  useEffect(() => {
    let timer: any = null;
    if (isInActiveCall) {
      timer = setInterval(() => {
        setActiveCallSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setActiveCallSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isInActiveCall]);

  // Find currently selected thread or call
  const activeSmsThread = threadsState.find((t) => t.id === selectedItemId) || threadsState[0];
  const activeCallRecord = callsState.find((c) => c.id === selectedItemId) || callsState[0];

  // Filter threads and calls
  const filteredSmsThreads = threadsState.filter((t) => {
    const matchesLine = selectedLineId === "ALL" || t.lineId === selectedLineId;
    const matchesSearch =
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerNumber.includes(searchQuery) ||
      t.lineTerritory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLine && matchesSearch;
  });

  const filteredCalls = callsState.filter((c) => {
    const matchesLine = selectedLineId === "ALL" || c.lineId === selectedLineId;
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerNumber.includes(searchQuery) ||
      c.lineTerritory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLine && matchesSearch;
  });

  // Handle Send SMS
  const handleSendSms = () => {
    if (!composeText.trim() || !activeSmsThread) return;

    const newMessage: SmsMessage = {
      id: `msg-${Date.now()}`,
      threadId: activeSmsThread.id,
      lineId: activeSmsThread.lineId,
      from: activeSmsThread.lineNumber.replace(/\D/g, ""),
      to: activeSmsThread.customerNumber,
      body: composeText.trim(),
      timestamp: "Just now",
      sender: "VA",
      deliveryStatus: "DELIVERED"
    };

    setThreadsState((prev) =>
      prev.map((thread) => {
        if (thread.id === activeSmsThread.id) {
          return {
            ...thread,
            lastMessage: newMessage.body,
            lastTimestamp: "Just now",
            messages: [...thread.messages, newMessage]
          };
        }
        return thread;
      })
    );

    setComposeText("");
  };

  // Handle Trigger AI Smart Reply
  const handleGenerateAiReply = async () => {
    if (!activeSmsThread) return;
    setIsGeneratingAiReply(true);

    try {
      const res = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: activeSmsThread.customerName,
          territory: activeSmsThread.lineTerritory,
          lineNumber: activeSmsThread.lineNumber,
          lastCustomerMessage: activeSmsThread.lastMessage,
          conversationHistory: activeSmsThread.messages.map((m) => ({
            role: m.sender === "CUSTOMER" ? "customer" : m.sender === "VA" ? "va" : "system",
            text: m.body
          }))
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setComposeText(json.data.reply);
          setAiTelemetry({
            model: json.data.model,
            latencyMs: json.data.latencyMs,
            provider: json.data.provider,
            reasoning: json.data.reasoning
          });
        }
      }
    } catch (err) {
      console.error("Failed to generate AI reply:", err);
    } finally {
      setIsGeneratingAiReply(false);
    }
  };

  // Click-to-Call Outbound Bridge
  const handleInitiateCallback = (customerName: string, customerNumber: string, lineTerritory: string, lineNumber: string) => {
    setActiveCallDetails({
      customerName,
      customerNumber,
      lineTerritory,
      lineNumber
    });
    setIsInActiveCall(true);
    setActiveCallSeconds(0);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
      
      {/* Incoming Call Overlay Banner if alert active */}
      {incomingCallAlert && (
        <div className="bg-[var(--brand)] text-white p-3 sm:p-4 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg border-b border-red-400">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white text-[var(--brand)] flex items-center justify-center font-bold animate-bounce shrink-0">
              <PhoneIncoming className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  INCOMING CALL • {incomingCallAlert.territory}
                </span>
                <span className="text-xs text-white/80">Twilio Line {incomingCallAlert.lineId.toUpperCase()}</span>
              </div>
              <p className="text-sm sm:text-base font-bold mt-0.5">
                {incomingCallAlert.customerName} ({incomingCallAlert.customerNumber})
              </p>
              <p className="text-xs text-white/90">
                Playing Pre-Roll California Consent Disclosure...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onAnswerIncomingCall();
                setActiveCallDetails({
                  customerName: incomingCallAlert.customerName,
                  customerNumber: incomingCallAlert.customerNumber,
                  lineTerritory: incomingCallAlert.territory,
                  lineNumber: "+1 (310) 555-0142"
                });
                setIsInActiveCall(true);
              }}
              className="px-4 py-2 rounded-lg bg-[var(--live)] hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Answer in WebRTC</span>
            </button>
            <button
              onClick={onDeclineIncomingCall}
              className="px-3 py-2 rounded-lg bg-black/30 hover:bg-black/40 text-white text-xs sm:text-sm font-semibold transition-all"
            >
              Send to Voicemail
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Pane Cockpit Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[720px] divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
        
        {/* ================= PANE 1: FEED & LINE FILTER (4 cols) ================= */}
        <div className="md:col-span-4 lg:col-span-4 flex flex-col bg-[var(--surface-subtle)]/40">
          
          {/* Top Filter Bar */}
          <div className="p-3 sm:p-3.5 border-b border-[var(--border)] space-y-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search patient, number, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              />
            </div>

            {/* Channel Tabs */}
            <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
              <button
                onClick={() => setActiveChannel("ALL")}
                className={`flex-1 py-1 text-xs font-semibold rounded transition-all whitespace-nowrap ${
                  activeChannel === "ALL"
                    ? "bg-[var(--brand)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                All ({filteredSmsThreads.length + filteredCalls.length})
              </button>
              <button
                onClick={() => setActiveChannel("SMS")}
                className={`flex-1 py-1 text-xs font-semibold rounded transition-all whitespace-nowrap ${
                  activeChannel === "SMS"
                    ? "bg-[var(--brand)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                SMS ({filteredSmsThreads.length})
              </button>
              <button
                onClick={() => setActiveChannel("VOICE")}
                className={`flex-1 py-1 text-xs font-semibold rounded transition-all whitespace-nowrap ${
                  activeChannel === "VOICE"
                    ? "bg-[var(--brand)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Calls ({filteredCalls.length})
              </button>
            </div>

            {/* Territory Line Filter Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <Filter className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
              <span className="shrink-0 font-medium">Line:</span>
              <select
                value={selectedLineId}
                onChange={(e) => setSelectedLineId(e.target.value)}
                className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
              >
                <option value="ALL">All 20 NextDrip Lines</option>
                {lines.map((l) => (
                  <option key={l.id} value={l.id}>
                    Line #{l.lineIndex.toString().padStart(2, "0")} • {l.territory} ({l.phoneNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Feed List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]/70 max-h-[640px]">
            
            {/* SMS Threads Section */}
            {(activeChannel === "ALL" || activeChannel === "SMS") &&
              filteredSmsThreads.map((thread) => {
                const isSelected = selectedItemType === "SMS" && selectedItemId === thread.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setSelectedItemType("SMS");
                      setSelectedItemId(thread.id);
                    }}
                    className={`p-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[var(--surface)] border-l-4 border-l-[var(--brand)] shadow-xs"
                        : "hover:bg-[var(--surface)]/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MessageSquare className="h-3.5 w-3.5 text-[var(--brand)] shrink-0" />
                        <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {thread.customerName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                        {thread.lastTimestamp}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-1 font-normal">
                      {thread.lastMessage}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-1 text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded bg-[var(--brand-subtle)] px-1.5 py-0.5 font-medium text-[var(--brand-text)] border border-[var(--brand)]/15">
                        <Lock className="h-2.5 w-2.5" />
                        <span>{thread.lineTerritory}</span>
                      </span>

                      {thread.optOutStatus === "OPTED_OUT" ? (
                        <span className="text-[10px] font-mono text-[var(--accent-amber)] font-semibold">
                          OPTED-OUT
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {thread.lineNumber}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Voice Calls Section */}
            {(activeChannel === "ALL" || activeChannel === "VOICE") &&
              filteredCalls.map((call) => {
                const isSelected = selectedItemType === "CALL" && selectedItemId === call.id;
                return (
                  <div
                    key={call.id}
                    onClick={() => {
                      setSelectedItemType("CALL");
                      setSelectedItemId(call.id);
                    }}
                    className={`p-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[var(--surface)] border-l-4 border-l-[var(--live)] shadow-xs"
                        : "hover:bg-[var(--surface)]/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <PhoneCall className="h-3.5 w-3.5 text-[var(--live)] shrink-0" />
                        <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {call.customerName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                        {call.audioDurationStr}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-1">
                      {call.summary}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-1 text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded bg-[var(--live-subtle)] px-1.5 py-0.5 font-medium text-[var(--live-text)] border border-[var(--live)]/20">
                        <span>{call.lineTerritory}</span>
                      </span>

                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {call.routedTo === "VA_WEBRTC" ? "WebRTC VA" : "Owner Forward"}
                      </span>
                    </div>
                  </div>
                );
              })}

          </div>

        </div>

        {/* ================= PANE 2: DETAIL VIEW (SMS OR CALL) (5 cols) ================= */}
        <div className="md:col-span-5 lg:col-span-5 flex flex-col bg-[var(--surface)]">
          
          {selectedItemType === "SMS" && activeSmsThread ? (
            /* --- SMS THREAD ACTIVE --- */
            <div className="flex flex-col h-full">
              
              {/* Mandatory Caller ID Lock Banner */}
              <div className="p-3 border-b border-[var(--border)] bg-[var(--surface-subtle)]/60">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {activeSmsThread.customerName}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        ({activeSmsThread.customerNumber})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-[var(--brand)] px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                        <Lock className="h-3 w-3" />
                        <span>Locked Caller ID: {activeSmsThread.lineNumber}</span>
                      </span>
                      <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                        {activeSmsThread.lineTerritory}
                      </span>
                    </div>
                  </div>

                  {/* Callback Button */}
                  <button
                    onClick={() =>
                      handleInitiateCallback(
                        activeSmsThread.customerName,
                        activeSmsThread.customerNumber,
                        activeSmsThread.lineTerritory,
                        activeSmsThread.lineNumber
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-md bg-[var(--live)] hover:bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all whitespace-nowrap"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Call Patient</span>
                  </button>
                </div>

                <div className="mt-2 text-[11px] text-[var(--live-text)] bg-[var(--live-subtle)] px-2 py-1 rounded border border-[var(--live)]/20 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Replies auto-send from {activeSmsThread.lineNumber}. VA never chooses or selects a number.
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[360px] max-h-[420px]">
                {activeSmsThread.messages.map((msg) => {
                  const isCustomer = msg.sender === "CUSTOMER";
                  const isSystem = msg.sender === "SYSTEM";

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono bg-[var(--surface-subtle)] text-[var(--text-muted)] border border-[var(--border)]">
                          {msg.body}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                          isCustomer
                            ? "bg-[var(--surface-subtle)] text-[var(--text-primary)] border border-[var(--border)] rounded-tl-xs"
                            : "bg-[var(--brand)] text-white rounded-tr-xs"
                        }`}
                      >
                        {msg.body}
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 px-1">
                        {isCustomer ? activeSmsThread.customerName : "NextDrip VA"} • {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* AI Smart Reply Generator Suggestion Box */}
              <div className="p-2.5 border-t border-[var(--border)] bg-[var(--surface-subtle)]/40">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
                    <span>AI Concierge Smart Assistant</span>
                  </div>

                  <button
                    onClick={handleGenerateAiReply}
                    disabled={isGeneratingAiReply}
                    className="text-[11px] font-semibold text-[var(--brand)] hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${isGeneratingAiReply ? "animate-spin" : ""}`} />
                    <span>{isGeneratingAiReply ? "Drafting with Dual AI..." : "Generate Smart Reply"}</span>
                  </button>
                </div>

                {aiTelemetry && (
                  <div className="mb-2 p-2 rounded bg-[var(--surface)] border border-[var(--border)] text-[11px]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                      <span className="text-[var(--live)] font-bold uppercase">
                        [{aiTelemetry.provider.toUpperCase()} • {aiTelemetry.model}]
                      </span>
                      <span>{aiTelemetry.latencyMs}ms</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {aiTelemetry.reasoning}
                    </p>
                  </div>
                )}

                {/* Compose Input */}
                <div className="relative">
                  <textarea
                    rows={2}
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    placeholder={`Reply to ${activeSmsThread.customerName} (dispatches from ${activeSmsThread.lineNumber})...`}
                    className="w-full p-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-[var(--text-muted)]">
                    <span>
                      {composeText.length} / 160 characters • 1 Segment
                    </span>
                    <button
                      onClick={handleSendSms}
                      disabled={!composeText.trim()}
                      className="px-3 py-1 rounded bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold text-xs shadow-xs disabled:opacity-40 transition-all flex items-center gap-1"
                    >
                      <span>Send</span>
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* --- CALL RECORD DETAIL VIEW --- */
            <div className="flex flex-col h-full p-4 overflow-y-auto space-y-4">
              
              {/* Call Header */}
              <div className="pb-3 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--live)] text-white">
                      <PhoneCall className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        {activeCallRecord.customerName}
                      </h3>
                      <p className="text-xs font-mono text-[var(--text-muted)]">
                        {activeCallRecord.customerNumber} • {activeCallRecord.audioDurationStr} duration
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleInitiateCallback(
                        activeCallRecord.customerName,
                        activeCallRecord.customerNumber,
                        activeCallRecord.lineTerritory,
                        activeCallRecord.lineNumber
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-md bg-[var(--live)] hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Call Back</span>
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-[var(--brand-subtle)] px-2 py-0.5 text-[var(--brand-text)] font-semibold border border-[var(--brand)]/20">
                    Line: {activeCallRecord.lineTerritory} ({activeCallRecord.lineNumber})
                  </span>
                  <span className="rounded bg-[var(--live-subtle)] px-2 py-0.5 text-[var(--live-text)] font-semibold border border-[var(--live)]/20 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>CA § 632 Pre-Roll Played</span>
                  </span>
                  <span className="rounded bg-[var(--surface-subtle)] px-2 py-0.5 text-[var(--text-secondary)] font-mono border border-[var(--border)]">
                    {activeCallRecord.timestamp}
                  </span>
                </div>
              </div>

              {/* Audio Waveform Player Simulation */}
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  <span>Twilio Dual-Channel Recording</span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    record="record-from-answer-dual"
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="h-8 w-8 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shadow hover:bg-[var(--brand-hover)] shrink-0"
                  >
                    {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </button>

                  <div className="flex-1 flex items-center gap-0.5 h-8">
                    {[12, 24, 18, 8, 30, 20, 16, 28, 14, 22, 10, 32, 26, 18, 12, 28, 20, 15, 25, 10].map(
                      (h, i) => (
                        <div
                          key={i}
                          className={`w-1.5 rounded-full transition-all ${
                            i < 7 ? "bg-[var(--brand)]" : "bg-[var(--border-strong)]"
                          } ${isPlayingAudio && i % 2 === 0 ? "animate-wave-1" : ""}`}
                          style={{ height: `${h}px` }}
                        />
                      )
                    )}
                  </div>

                  <span className="font-mono text-xs text-[var(--text-primary)]">
                    {isPlayingAudio ? "0:42 / 3:04" : "3:04"}
                  </span>
                </div>
              </div>

              {/* Clinical Summary & Action Items */}
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Clinical Summary & Intent
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--live)] bg-[var(--live-subtle)] px-2 py-0.5 rounded">
                    {activeCallRecord.clinicalIntent}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {activeCallRecord.summary}
                </p>

                <div className="pt-2 border-t border-[var(--border)]">
                  <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wide">
                    Action Items:
                  </span>
                  <ul className="mt-1 space-y-1">
                    {activeCallRecord.actionItems.map((item, i) => (
                      <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--live)] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Transcript */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Speaker-Separated Transcript
                </span>
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] font-mono text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto">
                  {activeCallRecord.transcription}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ================= PANE 3: WEBRTC SOFTPHONE & DIALER (3 cols) ================= */}
        <div className="md:col-span-3 lg:col-span-3 flex flex-col p-4 bg-[var(--surface-subtle)]/60">
          
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                WebRTC Softphone
              </span>
              <p className="text-[11px] text-[var(--text-muted)]">Twilio Voice Client</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--live-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--live-text)] border border-[var(--live)]/20">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)] animate-ping" />
              SIP Registered
            </span>
          </div>

          {/* Active Call Card */}
          {isInActiveCall ? (
            <div className="my-4 p-3.5 rounded-xl border border-[var(--live)] bg-[var(--surface)] shadow-md space-y-3">
              <div className="text-center">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[var(--live-subtle)] text-[var(--live-text)] border border-[var(--live)]/30 animate-pulse">
                  CALL IN PROGRESS
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mt-1">
                  {activeCallDetails.customerName}
                </h4>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  {activeCallDetails.customerNumber}
                </p>
                <p className="text-xs font-mono text-[var(--live)] font-bold mt-1">
                  {Math.floor(activeCallSeconds / 60)
                    .toString()
                    .padStart(2, "0")}
                  :
                  {(activeCallSeconds % 60).toString().padStart(2, "0")}
                </p>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-full border transition-all ${
                    isMuted ? "bg-red-500 text-white border-transparent" : "bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--border)]"
                  }`}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => setIsInActiveCall(false)}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-all"
                  title="Hang Up"
                >
                  <PhoneOff className="h-5 w-5" />
                </button>
              </div>

              <div className="text-[10px] text-center text-[var(--text-muted)] border-t border-[var(--border)] pt-2">
                Line: {activeCallDetails.lineTerritory} ({activeCallDetails.lineNumber})
              </div>
            </div>
          ) : (
            /* Idle Dialer UI */
            <div className="my-4 space-y-3">
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-center">
                <span className="text-[11px] font-semibold text-[var(--text-muted)]">
                  VA Softphone Idle
                </span>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Ready to receive inbound calls on all 20 lines
                </p>
              </div>

              {/* Dial Pad Simulation */}
              <div className="grid grid-cols-3 gap-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                  <button
                    key={key}
                    className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-xs font-bold font-mono text-[var(--text-primary)] transition-all shadow-2xs active:scale-95"
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-[var(--text-muted)] text-center pt-2">
                Calls initiated from this softphone automatically display NextDrip business caller ID.
              </div>
            </div>
          )}

          {/* Quick Line Status Indicator */}
          <div className="mt-auto pt-3 border-t border-[var(--border)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Line Health Summary
            </span>
            <div className="mt-1.5 flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Voice SIP Legs:</span>
              <span className="font-mono font-bold text-[var(--live)]">20/20 Ready</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mt-1">
              <span>SMS Conversations API:</span>
              <span className="font-mono font-bold text-[var(--live)]">Connected</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
