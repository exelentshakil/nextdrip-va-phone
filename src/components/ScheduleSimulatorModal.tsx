"use client";

import React, { useState } from "react";
import { ScheduleConfig } from "@/lib/types";
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck, 
  Zap,
  Code
} from "lucide-react";
import { buildVoiceTwiML } from "@/lib/utils";

interface ScheduleSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ScheduleConfig;
}

export function ScheduleSimulatorModal({
  isOpen,
  onClose,
  config
}: ScheduleSimulatorModalProps) {
  const [selectedDay, setSelectedDay] = useState<number>(3); // Wednesday
  const [selectedHour, setSelectedHour] = useState<number>(10); // 10 AM
  const [selectedMinute, setSelectedMinute] = useState<number>(15);
  const [isCallInProgress, setIsCallInProgress] = useState<boolean>(false);

  if (!isOpen) return null;

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const isAllowedDay = config.vaDays.includes(selectedDay);
  const isAllowedHour = selectedHour >= config.vaStartHour && selectedHour < config.vaEndHour;

  // In-progress boundary protection logic:
  // If call was connected before 4:00 PM (e.g. 3:55 PM), it remains connected to VA even if clock hits 4:05 PM!
  let routingDestination: "VA_WEBRTC" | "OWNER_IPHONE" = "OWNER_IPHONE";
  let explanation = "";

  if (isCallInProgress) {
    routingDestination = "VA_WEBRTC";
    explanation = "In-Progress Call Boundary Protection: Call initiated at 3:55 PM remains securely locked to VA WebRTC leg. Active call is NEVER dropped or rerouted mid-conversation when the 4:00 PM boundary passes.";
  } else if (isAllowedDay && isAllowedHour) {
    routingDestination = "VA_WEBRTC";
    explanation = `Within VA working hours (${dayNames[selectedDay]} at ${selectedHour}:${selectedMinute.toString().padStart(2, "0")} Pacific). Routed directly to VA WebRTC browser softphone.`;
  } else {
    routingDestination = "OWNER_IPHONE";
    explanation = `Outside VA working hours (${dayNames[selectedDay]} at ${selectedHour}:${selectedMinute.toString().padStart(2, "0")} Pacific). Forwarded seamlessly to Owner Personal iPhone (${config.ownerForwardNumber}).`;
  }

  const sampleTwiML = buildVoiceTwiML({
    disclosureScript: config.disclosureScript,
    destination: routingDestination,
    ownerNumber: config.ownerForwardNumber,
    callerId: "+13105550142"
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface-subtle)]">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--brand)]" />
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Pacific TimeGate & Schedule Simulator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[var(--border)] text-[var(--text-secondary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Test any Pacific day and time to inspect the deterministic routing decision, Daylight Saving Time (PDT/PST) compliance, and in-progress call boundary locks.
          </p>

          {/* Day Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1.5">
              Simulated Day of Week
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {dayNames.map((name, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDay(i);
                    setIsCallInProgress(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                    selectedDay === i
                      ? "bg-[var(--brand)] text-white border-transparent shadow-xs"
                      : "bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-[var(--border)]"
                  }`}
                >
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1.5">
                Simulated Hour (Pacific Time)
              </label>
              <select
                value={selectedHour}
                onChange={(e) => {
                  setSelectedHour(parseInt(e.target.value, 10));
                  setIsCallInProgress(false);
                }}
                className="w-full p-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
              >
                <option value={7}>7:00 AM (Before Shift)</option>
                <option value={8}>8:00 AM (Shift Start)</option>
                <option value={10}>10:00 AM (Mid-Shift)</option>
                <option value={12}>12:00 PM (Noon)</option>
                <option value={15}>3:00 PM (Active Shift)</option>
                <option value={16}>4:00 PM (Shift End Boundary)</option>
                <option value={19}>7:00 PM (Evening After-Hours)</option>
                <option value={22}>10:00 PM (Night After-Hours)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1.5">
                Boundary Protection Test
              </label>
              <button
                onClick={() => setIsCallInProgress(!isCallInProgress)}
                className={`w-full p-2 text-xs font-semibold rounded-lg border transition-all text-left flex items-center justify-between ${
                  isCallInProgress
                    ? "bg-[var(--live-subtle)] text-[var(--live-text)] border-[var(--live)]"
                    : "bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-[var(--border)]"
                }`}
              >
                <span>Call Active Across 4PM</span>
                <span className="font-bold">{isCallInProgress ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>

          {/* Real-Time Routing Decision Result Card */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Evaluation Result
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                  routingDestination === "VA_WEBRTC"
                    ? "bg-[var(--live-subtle)] text-[var(--live-text)] border-[var(--live)]/30"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                }`}
              >
                {routingDestination === "VA_WEBRTC" ? "ROUTE ➔ VA WEBRTC" : "ROUTE ➔ OWNER MOBILE"}
              </span>
            </div>

            <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">
              {explanation}
            </p>

            <div className="pt-2 border-t border-[var(--border)] flex flex-wrap gap-2 text-[11px]">
              <span className="rounded bg-[var(--surface)] px-2 py-0.5 border border-[var(--border)] font-mono">
                Timezone: America/Los_Angeles (PDT)
              </span>
              <span className="rounded bg-[var(--surface)] px-2 py-0.5 border border-[var(--border)] text-[var(--live)] font-semibold">
                ✓ Recording & CA § 632 Pre-Roll Applied Either Branch
              </span>
            </div>
          </div>

          {/* Generated TwiML XML Preview */}
          <div>
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              <Code className="h-3.5 w-3.5 text-[var(--brand)]" />
              <span>Generated Twilio TwiML Response</span>
            </div>
            <pre className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono text-xs text-[var(--text-secondary)] overflow-x-auto">
              {sampleTwiML}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-subtle)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-bold shadow-xs transition-all"
          >
            Close Simulator
          </button>
        </div>

      </div>
    </div>
  );
}
