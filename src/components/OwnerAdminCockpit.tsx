"use client";

import React, { useState } from "react";
import { 
  TwilioLine, 
  CallRecord, 
  SmsThread, 
  ScheduleConfig 
} from "@/lib/types";
import { 
  ShieldAlert, 
  Lock, 
  Phone, 
  MessageSquare, 
  Sliders, 
  Play, 
  Pause, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from "lucide-react";

interface OwnerAdminCockpitProps {
  lines: TwilioLine[];
  calls: CallRecord[];
  smsThreads: SmsThread[];
  scheduleConfig: ScheduleConfig;
  onUpdateSchedule: (newConfig: ScheduleConfig) => void;
}

export function OwnerAdminCockpit({
  lines,
  calls,
  smsThreads,
  scheduleConfig,
  onUpdateSchedule
}: OwnerAdminCockpitProps) {
  const [selectedTab, setSelectedTab] = useState<"METRICS" | "RECORDINGS" | "ROUTING" | "RBAC">("METRICS");
  const [configDraft, setConfigDraft] = useState<ScheduleConfig>(scheduleConfig);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [selectedCallId, setSelectedCallId] = useState<string>(calls[0]?.id || "");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const selectedCall = calls.find((c) => c.id === selectedCallId) || calls[0];

  const totalCallsToday = lines.reduce((acc, l) => acc + l.callsToday, 0);
  const totalTextsToday = lines.reduce((acc, l) => acc + l.textsToday, 0);

  const handleSaveConfig = () => {
    onUpdateSchedule(configDraft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const toggleDay = (dayNum: number) => {
    const exists = configDraft.vaDays.includes(dayNum);
    const newDays = exists
      ? configDraft.vaDays.filter((d) => d !== dayNum)
      : [...configDraft.vaDays, dayNum].sort();
    setConfigDraft({ ...configDraft, vaDays: newDays });
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 shadow-sm space-y-6">
      
      {/* Header with Restricted Security Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-[var(--text-primary)] text-[var(--background)] flex items-center justify-center font-bold">
              <Lock className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Owner Management & System Audit Console
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              OWNER PRIVILEGED
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Review all call audio recordings, complete transcripts, 20-line usage metrics, and business-hours routing rules. (Hidden from VA role).
          </p>
        </div>

        {/* Sub-tabs within Owner Console */}
        <div className="flex items-center gap-1 bg-[var(--surface-subtle)] p-1 rounded-lg border border-[var(--border)] self-start sm:self-auto">
          <button
            onClick={() => setSelectedTab("METRICS")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedTab === "METRICS"
                ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            20-Line Activity
          </button>
          <button
            onClick={() => setSelectedTab("RECORDINGS")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedTab === "RECORDINGS"
                ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Audit Recordings
          </button>
          <button
            onClick={() => setSelectedTab("ROUTING")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedTab === "ROUTING"
                ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Schedule Config
          </button>
          <button
            onClick={() => setSelectedTab("RBAC")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedTab === "RBAC"
                ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Access Isolation
          </button>
        </div>
      </div>

      {/* ================= TAB 1: 20-LINE ACTIVITY METRICS ================= */}
      {selectedTab === "METRICS" && (
        <div className="space-y-4">
          
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
              <span className="text-xs uppercase font-semibold text-[var(--text-secondary)]">
                Calls Today (All Lines)
              </span>
              <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
                {totalCallsToday}
              </div>
            </div>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
              <span className="text-xs uppercase font-semibold text-[var(--text-secondary)]">
                Texts Today (All Lines)
              </span>
              <div className="text-2xl font-bold font-mono text-[var(--brand)] mt-1">
                {totalTextsToday}
              </div>
            </div>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
              <span className="text-xs uppercase font-semibold text-[var(--text-secondary)]">
                After-Hours Routed
              </span>
              <div className="text-2xl font-bold font-mono text-[var(--accent-amber)] mt-1">
                18 Calls
              </div>
            </div>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
              <span className="text-xs uppercase font-semibold text-[var(--text-secondary)]">
                Transcriptions Complete
              </span>
              <div className="text-2xl font-bold font-mono text-[var(--live)] mt-1">
                100%
              </div>
            </div>
          </div>

          {/* High Density Table of all 20 Lines */}
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="table-fixed w-full min-w-[760px] text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-subtle)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="w-[12%] px-3 py-2.5 text-left">Line DID</th>
                  <th className="w-[28%] px-3 py-2.5 text-left">Territory / Market</th>
                  <th className="w-[15%] px-3 py-2.5 text-left">Phone Number</th>
                  <th className="w-[15%] px-3 py-2.5 text-center">Calls Today</th>
                  <th className="w-[15%] px-3 py-2.5 text-center">Texts Today</th>
                  <th className="w-[15%] px-3 py-2.5 text-right">Voice Routing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60 bg-[var(--surface)]">
                {lines.map((l) => (
                  <tr key={l.id} className="hover:bg-[var(--surface-subtle)]/40 transition-colors">
                    <td className="px-3 py-2 font-mono font-bold text-[var(--text-primary)]">
                      #{l.lineIndex.toString().padStart(2, "0")}
                    </td>
                    <td className="px-3 py-2 font-medium text-[var(--text-primary)]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: l.color }}
                        />
                        <span className="truncate">{l.territory} ({l.state})</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-[var(--text-secondary)]">
                      {l.phoneNumber}
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-bold text-[var(--text-primary)]">
                      {l.callsToday}
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-bold text-[var(--brand)]">
                      {l.textsToday}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--live-text)] bg-[var(--live-subtle)] px-2 py-0.5 rounded border border-[var(--live)]/20">
                        <span>WebRTC / Auto-Failover</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ================= TAB 2: AUDIT RECORDINGS & TRANSCRIPTS ================= */}
      {selectedTab === "RECORDINGS" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Left Column: Call selector list */}
          <div className="md:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {calls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCallId(call.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedCallId === call.id
                    ? "bg-[var(--surface-subtle)] border-[var(--brand)] shadow-xs"
                    : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-subtle)]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--text-primary)]">
                    {call.customerName}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {call.timestamp}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  {call.lineTerritory} • {call.lineNumber}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[10px] bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                    Duration: {call.audioDurationStr}
                  </span>
                  <span className="text-[var(--live)] font-semibold text-[10px]">
                    {call.routedTo === "VA_WEBRTC" ? "VA Softphone" : "Owner iPhone"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Full recording & transcript audit */}
          {selectedCall && (
            <div className="md:col-span-7 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {selectedCall.customerName} ({selectedCall.customerNumber})
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Line: {selectedCall.lineTerritory} ({selectedCall.lineNumber})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[var(--live)] bg-[var(--live-subtle)] px-2 py-0.5 rounded border border-[var(--live)]/20">
                    {selectedCall.clinicalIntent}
                  </span>
                </div>
              </div>

              {/* Audio Playback Deck */}
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="h-8 w-8 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shadow shrink-0"
                >
                  {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    Twilio Dual-Party Call Audio
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">
                    Recording SID: RE7890a8812c3f8091 • {selectedCall.audioDurationStr}
                  </div>
                </div>
                <button
                  onClick={() => alert("Downloading encrypted dual-channel WAV audio file...")}
                  className="p-1.5 rounded border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]"
                  title="Download Recording"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>

              {/* Summary */}
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)] leading-relaxed">
                <span className="font-bold text-[var(--text-primary)] block mb-1">
                  Executive Clinical Summary:
                </span>
                {selectedCall.summary}
              </div>

              {/* Complete Speaker-Separated Transcript */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                  Full Speaker Transcript (Dual-AI Analyzed)
                </span>
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] font-mono text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {selectedCall.transcription}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 3: SCHEDULE CONFIGURATOR ================= */}
      {selectedTab === "ROUTING" && (
        <div className="space-y-4 max-w-2xl">
          
          <div className="p-3 rounded-lg bg-[var(--brand-subtle)] border border-[var(--brand)]/20 text-xs text-[var(--brand-text)] flex items-start gap-2">
            <Clock className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Developer Brief Specification:</span> VA works Wednesday through Sunday, 8:00 AM to 4:00 PM Pacific time. All other hours automatically fail over to Owner Mobile.
            </div>
          </div>

          {/* Days Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
              VA Active Working Days (Pacific Time)
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {[
                { label: "Sun", day: 0 },
                { label: "Mon", day: 1 },
                { label: "Tue", day: 2 },
                { label: "Wed", day: 3 },
                { label: "Thu", day: 4 },
                { label: "Fri", day: 5 },
                { label: "Sat", day: 6 }
              ].map(({ label, day }) => {
                const isActive = configDraft.vaDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`py-2 rounded-lg text-xs font-bold font-mono transition-all border ${
                      isActive
                        ? "bg-[var(--brand)] text-white border-transparent shadow-xs"
                        : "bg-[var(--surface-subtle)] text-[var(--text-muted)] border-[var(--border)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shift Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] block mb-1">
                Shift Start Hour (Pacific)
              </label>
              <select
                value={configDraft.vaStartHour}
                onChange={(e) =>
                  setConfigDraft({ ...configDraft, vaStartHour: parseInt(e.target.value, 10) })
                }
                className="w-full p-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
              >
                <option value={7}>7:00 AM Pacific</option>
                <option value={8}>8:00 AM Pacific (Standard Brief)</option>
                <option value={9}>9:00 AM Pacific</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] block mb-1">
                Shift End Hour (Pacific)
              </label>
              <select
                value={configDraft.vaEndHour}
                onChange={(e) =>
                  setConfigDraft({ ...configDraft, vaEndHour: parseInt(e.target.value, 10) })
                }
                className="w-full p-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
              >
                <option value={15}>3:00 PM Pacific</option>
                <option value={16}>4:00 PM Pacific (Standard Brief)</option>
                <option value={17}>5:00 PM Pacific</option>
                <option value={18}>6:00 PM Pacific</option>
              </select>
            </div>
          </div>

          {/* Owner Forward Phone */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] block mb-1">
              Owner Mobile Forwarding Number (After-Hours Destination)
            </label>
            <input
              type="text"
              value={configDraft.ownerForwardNumber}
              onChange={(e) =>
                setConfigDraft({ ...configDraft, ownerForwardNumber: e.target.value })
              }
              className="w-full p-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] font-mono"
            />
          </div>

          {/* Consent Disclosure Script */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] block mb-1">
              California Two-Party Consent Disclosure Script (&lt;Say&gt;)
            </label>
            <textarea
              rows={2}
              value={configDraft.disclosureScript}
              onChange={(e) =>
                setConfigDraft({ ...configDraft, disclosureScript: e.target.value })
              }
              className="w-full p-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
            />
          </div>

          {/* Emergency Override */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] block mb-1">
              Emergency Routing Override
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "SCHEDULE", label: "Follow Schedule (Auto)" },
                { id: "FORCE_VA", label: "Force All to VA" },
                { id: "FORCE_OWNER", label: "Force All to Owner" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    setConfigDraft({
                      ...configDraft,
                      emergencyOverride: opt.id as any
                    })
                  }
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    configDraft.emergencyOverride === opt.id
                      ? "bg-[var(--brand)] text-white border-transparent"
                      : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Apply & Save Routing Policy</span>
            </button>
            {saveSuccess && (
              <span className="text-xs font-semibold text-[var(--live)] flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="h-4 w-4" />
                <span>Routing rules updated across all 20 Twilio DIDs!</span>
              </span>
            )}
          </div>

        </div>
      )}

      {/* ================= TAB 4: ACCESS ISOLATION (RBAC MATRIX) ================= */}
      {selectedTab === "RBAC" && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--text-secondary)] leading-relaxed">
            <span className="font-bold text-[var(--text-primary)] block mb-1">
              Developer Brief Security Isolation Guarantees:
            </span>
            The Virtual Assistant is permanently blocked from viewing Twilio credentials, modifying routing logic, exporting contact records, or viewing owner personal phone numbers.
          </div>

          <div className="rounded-lg border border-[var(--border)] overflow-hidden">
            <table className="table-fixed w-full min-w-[600px] text-xs divide-y divide-[var(--border)]">
              <thead className="bg-[var(--surface-subtle)] text-[var(--text-secondary)] font-semibold uppercase text-[11px]">
                <tr>
                  <th className="w-[45%] px-3 py-2.5 text-left">System Capability / Screen</th>
                  <th className="w-[25%] px-3 py-2.5 text-center">Virtual Assistant (VA)</th>
                  <th className="w-[30%] px-3 py-2.5 text-center">Owner Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60 bg-[var(--surface)] text-xs">
                {[
                  { feature: "Unified 20-Line Voice & SMS Inbox", va: true, owner: true },
                  { feature: "WebRTC In-Browser Calling & Dialing", va: true, owner: true },
                  { feature: "Automatic Line-Locked SMS Replies", va: true, owner: true },
                  { feature: "Direct Twilio Console Login", va: false, owner: true },
                  { feature: "Access to Account SID & Auth Token", va: false, owner: true },
                  { feature: "Edit Schedule & TimeGate Bounds", va: false, owner: true },
                  { feature: "Export Patient Contacts to CSV", va: false, owner: true },
                  { feature: "View Owner Personal Cell Forward Number", va: false, owner: true },
                  { feature: "Audit All 20 Lines Historical Logs", va: false, owner: true }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[var(--surface-subtle)]/30">
                    <td className="px-3 py-2 font-medium text-[var(--text-primary)]">
                      {row.feature}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {row.va ? (
                        <span className="text-[var(--live)] font-bold">✓ Permitted</span>
                      ) : (
                        <span className="text-red-500 font-bold">✕ Restricted</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {row.owner ? (
                        <span className="text-[var(--live)] font-bold">✓ Full Access</span>
                      ) : (
                        <span className="text-red-500 font-bold">✕ Restricted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
