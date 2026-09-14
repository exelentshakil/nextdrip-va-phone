"use client";

import React, { useState, useEffect } from "react";
import { 
  PhoneCall, 
  Clock, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  Inbox, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface WorkflowCanvasProps {
  isVaShiftActive: boolean;
  onSimulateInboundCall: () => void;
  onSimulateInboundSms: () => void;
}

export function WorkflowCanvas({
  isVaShiftActive,
  onSimulateInboundCall,
  onSimulateInboundSms
}: WorkflowCanvasProps) {
  const [activeStep, setActiveStep] = useState<number>(0); // 0 = idle/armed
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [activeScenario, setActiveScenario] = useState<"VOICE_VA" | "VOICE_OWNER" | "SMS_REPLY">("VOICE_VA");

  const runSimulation = (scenario: "VOICE_VA" | "VOICE_OWNER" | "SMS_REPLY") => {
    if (isRunning) return;
    setActiveScenario(scenario);
    setIsRunning(true);
    setActiveStep(1);
    setSimulationLog([`[00:00.010] INBOUND_TRIGGER: Customer dialed +1 (310) 555-0142 (Line #01 Beverly Hills)`]);

    // Step 2: Timezone Check
    setTimeout(() => {
      setActiveStep(2);
      setSimulationLog((prev) => [
        ...prev,
        scenario === "VOICE_OWNER"
          ? `[00:00.120] TIMEZONE_GATE: Monday 9:30 PM PDT evaluated. Result: AFTER_HOURS -> Destination: Owner iPhone (+14155550199)`
          : `[00:00.120] TIMEZONE_GATE: Wednesday 10:15 AM PDT evaluated. Result: VA_WORKING_HOURS -> Destination: VA WebRTC Softphone`
      ]);
    }, 900);

    // Step 3: Consent Disclosure
    setTimeout(() => {
      setActiveStep(3);
      setSimulationLog((prev) => [
        ...prev,
        `[00:00.450] CA_CONSENT_DISCLOSURE: Spoken disclosure executed (<Say> 'This call may be recorded...'). Audio recording held until finish.`
      ]);
    }, 1800);

    // Step 4: Routing & Dual-Channel Recording
    setTimeout(() => {
      setActiveStep(4);
      setSimulationLog((prev) => [
        ...prev,
        scenario === "VOICE_OWNER"
          ? `[00:01.020] TWILIO_DIAL: <Dial callerId="+13105550142" record="record-from-answer-dual"> bridging to Owner Mobile.`
          : `[00:01.020] TWILIO_DIAL: WebRTC SIP registration verified. Ringing VA softphone with line tag 'Line #01 · Beverly Hills'.`
      ]);
    }, 2700);

    // Step 5: AI Transcription
    setTimeout(() => {
      setActiveStep(5);
      setSimulationLog((prev) => [
        ...prev,
        `[00:01.850] AI_INTELLIGENCE: Call completed. Dual-channel audio processed by OpenAI gpt-4o-mini (1,140ms, 99.4% accuracy, action items extracted).`
      ]);
    }, 3600);

    // Step 6: Unified Inbox Lock
    setTimeout(() => {
      setActiveStep(6);
      setSimulationLog((prev) => [
        ...prev,
        `[00:02.400] UNIFIED_INBOX: Call record synchronized. Reply / Callback caller ID auto-locked to +1 (310) 555-0142. Zero VA manual selection.`
      ]);
      setIsRunning(false);
    }, 4500);
  };

  const steps = [
    {
      id: 1,
      title: "1. Inbound DID Pool",
      subtitle: "~20 Numbers Active",
      icon: PhoneCall,
      detail: "Twilio webhook catches call or SMS on any of the 20 local marketing lines.",
      statusBadge: activeStep === 1 ? "RUNNING" : activeStep > 1 ? "PASSED" : "ARMED",
      color: "var(--brand)"
    },
    {
      id: 2,
      title: "2. Pacific TimeGate",
      subtitle: "Wed-Sun 8am-4pm",
      icon: Clock,
      detail: "Timezone-aware rule engine (PDT/PST aware). Routes to VA or Owner Mobile.",
      statusBadge: activeStep === 2 ? "EVALUATING" : activeStep > 2 ? "PASSED" : "ARMED",
      color: "var(--accent-amber)"
    },
    {
      id: 3,
      title: "3. Consent Disclosure",
      subtitle: "CA § 632 Pre-Roll",
      icon: ShieldCheck,
      detail: "Mandatory two-party recording notice completes before audio recording begins.",
      statusBadge: activeStep === 3 ? "SPEAKING" : activeStep > 3 ? "VERIFIED" : "ARMED",
      color: "var(--accent-indigo)"
    },
    {
      id: 4,
      title: "4. Dual Dial & Record",
      subtitle: "WebRTC / Owner Bridge",
      icon: Radio,
      detail: "Dual-channel recording ('record-from-answer-dual') on Twilio leg regardless of receiver.",
      statusBadge: activeStep === 4 ? "CONNECTED" : activeStep > 4 ? "CAPTURED" : "ARMED",
      color: "var(--live)"
    },
    {
      id: 5,
      title: "5. Dual-AI Transcription",
      subtitle: "OpenAI + Gemini Fallback",
      icon: Cpu,
      detail: "NLP transcription, patient intent extraction, and clinical summary generated.",
      statusBadge: activeStep === 5 ? "INFERENCING" : activeStep > 5 ? "SYNCED" : "ARMED",
      color: "var(--accent-cyan)"
    },
    {
      id: 6,
      title: "6. Unified Inbox Lock",
      subtitle: "100% Line Binding",
      icon: Inbox,
      detail: "Thread stored in VA Cockpit. All callbacks & SMS locked to originating DID.",
      statusBadge: activeStep === 6 ? "LOCKED" : activeStep > 6 ? "COMPLETE" : "ARMED",
      color: "var(--brand)"
    }
  ];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 shadow-sm">
      
      {/* Header & Simulator Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--live)] animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Twilio Voice & SMS Event-Driven Architecture Pipeline
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--text-secondary)] font-mono border border-[var(--border)]">
              Real-Time Node Graph
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Visualizing the automated flow from customer dial, Pacific business-hours gate, California recording consent, WebRTC softphone bridge, to AI transcription.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => runSimulation("VOICE_VA")}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--brand-hover)] disabled:opacity-50 transition-all whitespace-nowrap"
          >
            <Play className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
            <span>Simulate VA Shift Call</span>
          </button>

          <button
            onClick={() => runSimulation("VOICE_OWNER")}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] shadow-sm hover:bg-[var(--surface-subtle)] disabled:opacity-50 transition-all whitespace-nowrap"
          >
            <Clock className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
            <span>Simulate After-Hours</span>
          </button>
        </div>
      </div>

      {/* Interactive Flow Nodes Grid */}
      <div className="py-6 relative">
        
        {/* Living Ambient Animated SVG Connector Wire */}
        <div className="hidden lg:block absolute top-[52px] left-[5%] right-[5%] h-1 z-0">
          <svg className="w-full h-4 overflow-visible">
            <line
              x1="0"
              y1="2"
              x2="100%"
              y2="2"
              stroke="var(--border)"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="animate-wire-pulse"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? "bg-[var(--surface)] border-[var(--brand)] shadow-md ring-2 ring-[var(--brand)]/20 scale-[1.02]"
                    : isCompleted
                    ? "bg-[var(--surface-subtle)] border-[var(--live)]/50"
                    : "bg-[var(--surface)] border-[var(--border)] opacity-85 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-md"
                      style={{
                        backgroundColor: isCurrent ? step.color : "var(--surface-subtle)",
                        color: isCurrent ? "#ffffff" : "var(--text-primary)"
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                        isCurrent
                          ? "bg-[var(--brand)] text-white border-transparent animate-pulse"
                          : isCompleted
                          ? "bg-[var(--live-subtle)] text-[var(--live-text)] border-[var(--live)]/30"
                          : "bg-[var(--surface-subtle)] text-[var(--text-muted)] border-[var(--border)]"
                      }`}
                    >
                      {step.statusBadge}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-[11px] font-medium text-[var(--brand)] mt-0.5">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--border)]/50 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span className="font-mono">Stage 0{step.id}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--live)]" />
                  ) : isCurrent ? (
                    <span className="h-2 w-2 rounded-full bg-[var(--brand)] animate-ping" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Live Simulation Execution Trace */}
      {simulationLog.length > 0 && (
        <div className="mt-4 rounded-lg bg-[var(--surface-subtle)] p-3 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--live)]" />
              Live Execution Event Stream ({activeScenario})
            </span>
            <button
              onClick={() => setSimulationLog([])}
              className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Clear Log
            </button>
          </div>
          <div className="space-y-1 font-mono text-xs max-h-32 overflow-y-auto pr-1">
            {simulationLog.map((log, idx) => (
              <div key={idx} className="text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
                <span className="text-[var(--brand)] font-semibold shrink-0">➜</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
