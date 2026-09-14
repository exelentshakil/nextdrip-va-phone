"use client";

import React from "react";
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  GitBranch, 
  Award, 
  Code2, 
  Server,
  Zap,
  Layers
} from "lucide-react";

export function Footer() {
  const architecturalCards = [
    {
      title: "Automated Caller ID Locking",
      icon: Lock,
      description: "Replies and callbacks are cryptographically locked to the originating DID. The VA never picks numbers, preventing personal number leakage."
    },
    {
      title: "Timezone-Aware Pacific Routing",
      icon: Clock,
      description: "Native Intl.DateTimeFormat (America/Los_Angeles) dynamic DST checks. Active calls never drop or reroute across boundary changes."
    },
    {
      title: "CA § 632 Pre-Roll Disclosure",
      icon: ShieldCheck,
      description: "Full audio disclosure plays to completion before <Dial record='record-from-answer-dual'> begins, delivering 100% two-party consent compliance."
    },
    {
      title: "Centralized A2P 10DLC & TCPA",
      icon: Cpu,
      description: "TCR-registered brand with a 20-DID Messaging Service pool. An inbound STOP keyword suppresses texts across all 20 lines instantly."
    }
  ];

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition-colors mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        
        {/* 4 Architectural Decision Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Core Architectural Pillars &amp; Defensive Guarantees
            </h4>
            <span className="text-xs font-mono text-[var(--live)] font-semibold">
              Production Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {architecturalCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] space-y-2 hover:border-[var(--brand)]/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[var(--surface)] text-[var(--brand)] border border-[var(--border)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h5 className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {card.title}
                    </h5>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stack Badges & System Spec Grid */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
              Telecom Engine
            </span>
            <span className="font-mono font-semibold text-[var(--text-primary)]">
              Twilio Voice WebRTC &amp; Messaging API
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
              Runtime &amp; Compute
            </span>
            <span className="font-mono font-semibold text-[var(--text-primary)]">
              Next.js 15 App Router · Fluid Compute
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
              Dual-Provider AI
            </span>
            <span className="font-mono font-semibold text-[var(--text-primary)]">
              GPT-4o-mini + Gemini 2.0 Flash Fallback
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
              Compliance Standard
            </span>
            <span className="font-mono font-semibold text-[var(--live)]">
              A2P 10DLC TCR + CA Penal Code § 632
            </span>
          </div>
        </div>

        {/* Bottom Bar & Verified Credentials */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-semibold text-[var(--text-primary)]">
              NextDrip Virtual Assistant Phone &amp; SMS Operating System
            </span>
            <span className="hidden sm:inline text-[var(--border)]">|</span>
            <span>Engineered by BarakahSoft LLC</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
              12+ Yrs Enterprise Engineering
            </span>
            <span className="px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
              Verified Partner
            </span>
            <span className="px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--live)] font-semibold">
              100% Client Satisfaction
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
