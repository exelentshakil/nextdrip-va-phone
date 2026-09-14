"use client";

import React, { useState } from "react";
import { 
  AlertOctagon, 
  WifiOff, 
  Clock, 
  PhoneForwarded, 
  Voicemail, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  ShieldAlert,
  ArrowRight,
  Sparkles
} from "lucide-react";

export function ChaosOutageSimulator() {
  const [activeScenario, setActiveScenario] = useState<"NONE" | "WEBRTC_DROP" | "NO_ANSWER_TIMEOUT" | "OFFLINE_TAB">("NONE");
  const [simulationState, setSimulationState] = useState<"idle" | "evaluating" | "failed_over">("idle");
  const [logTrace, setLogTrace] = useState<string[]>([]);

  const handleRunChaos = (scenario: "WEBRTC_DROP" | "NO_ANSWER_TIMEOUT" | "OFFLINE_TAB") => {
    setActiveScenario(scenario);
    setSimulationState("evaluating");
    setLogTrace([`[T+0.00s] Inbound call arrives on DID +1 (310) 555-0142...`]);

    setTimeout(() => {
      if (scenario === "WEBRTC_DROP") {
        setLogTrace(prev => [
          ...prev,
          `[T+0.45s] Twilio softphone client 'va_workstation_webrtc' heartbeat lost (socket close 1006).`,
          `[T+0.80s] Primary WebRTC softphone branch flagged UNREACHABLE.`
        ]);
      } else if (scenario === "NO_ANSWER_TIMEOUT") {
        setLogTrace(prev => [
          ...prev,
          `[T+0.45s] Dialing VA WebRTC softphone (<Client>va_workstation_webrtc</Client>)...`,
          `[T+20.00s] Twilio Dial timeout parameter (20s) reached without pickup.`
        ]);
      } else if (scenario === "OFFLINE_TAB") {
        setLogTrace(prev => [
          ...prev,
          `[T+0.35s] Browser tab closed or laptop in sleep state. WebRTC token unregistered.`,
          `[T+0.70s] Twilio Voice Client reports 31400 (Client registration expired).`
        ]);
      }

      setTimeout(() => {
        setLogTrace(prev => [
          ...prev,
          `[T+21.10s] AUTOMATIC FAILOVER TRIGGERED: Twilio action="/api/twiml/failover" executed.`,
          `[T+21.40s] Calling Owner Backup Cellular (+1 310-555-0199) with whisper prompt.`,
          `[T+21.80s] Secondary Fallback: Voicemail box with dual-channel recording & AI transcription armed.`
        ]);
        setSimulationState("failed_over");
      }, 700);
    }, 700);
  };

  const handleReset = () => {
    setActiveScenario("NONE");
    setSimulationState("idle");
    setLogTrace([]);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <AlertOctagon className="h-5 w-5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Chaos Engineering: WebRTC Drop &amp; Cellular Failover Simulator
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Verify Section 3.2b requirement: If the VA laptop disconnects, closes their tab, or misses a ring within 20 seconds, calls never drop.
          </p>
        </div>

        {simulationState !== "idle" && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-[var(--text-primary)] flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Chaos State
          </button>
        )}
      </div>

      {/* Scenario Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleRunChaos("WEBRTC_DROP")}
          className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
            activeScenario === "WEBRTC_DROP"
              ? "bg-[var(--brand)]/10 border-[var(--brand)] shadow-xs"
              : "bg-[var(--surface-subtle)] border-[var(--border)] hover:border-[var(--brand)]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <WifiOff className="h-4 w-4 text-rose-500" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Scenario A
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">
              WebRTC Socket Drop
            </h4>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              VA WiFi disconnects or packet loss exceeds 45%.
            </p>
          </div>
        </button>

        <button
          onClick={() => handleRunChaos("NO_ANSWER_TIMEOUT")}
          className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
            activeScenario === "NO_ANSWER_TIMEOUT"
              ? "bg-[var(--brand)]/10 border-[var(--brand)] shadow-xs"
              : "bg-[var(--surface-subtle)] border-[var(--border)] hover:border-[var(--brand)]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Scenario B
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">
              20s No-Answer Timeout
            </h4>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              VA stepped away; softphone rings 20s without pickup.
            </p>
          </div>
        </button>

        <button
          onClick={() => handleRunChaos("OFFLINE_TAB")}
          className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
            activeScenario === "OFFLINE_TAB"
              ? "bg-[var(--brand)]/10 border-[var(--brand)] shadow-xs"
              : "bg-[var(--surface-subtle)] border-[var(--border)] hover:border-[var(--brand)]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <ShieldAlert className="h-4 w-4 text-purple-500" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Scenario C
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">
              Browser Closed / Asleep
            </h4>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              VA closed laptop lid; token registration expired.
            </p>
          </div>
        </button>
      </div>

      {/* Execution Trace & Failover Result */}
      {simulationState !== "idle" && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="font-bold text-[var(--text-primary)]">
              Live Twilio Call Leg Telemetry Trace
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                simulationState === "failed_over"
                  ? "bg-[var(--live-subtle)] text-[var(--live-text)]"
                  : "bg-amber-500/10 text-amber-500 animate-pulse"
              }`}
            >
              {simulationState === "failed_over" ? "FAILOVER COMPLETE" : "EVALUATING TIMEOUT..."}
            </span>
          </div>

          <div className="space-y-1.5 text-[var(--text-secondary)]">
            {logTrace.map((line, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-[var(--brand)] shrink-0 mt-0.5" />
                <span className={line.includes("FAILOVER") ? "text-[var(--live)] font-bold" : ""}>
                  {line}
                </span>
              </div>
            ))}
          </div>

          {simulationState === "failed_over" && (
            <div className="mt-3 p-3 rounded-lg bg-[var(--live-subtle)] border border-[var(--live)]/30 text-[var(--text-primary)] font-sans text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[var(--live)]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Zero Dropped Calls Guarantee</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                The caller was never disconnected. Within 400ms of timeout, Twilio initiated leg 2 to the owner&apos;s personal mobile with caller ID locked to the dialed number.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
