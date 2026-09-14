"use client";

import React from "react";
import { Phone, ShieldAlert, CheckCircle2, Lock, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface BentoHeaderProps {
  onOpenScheduleSimulator: () => void;
  isVaShiftActive: boolean;
  activeLineCount: number;
}

export function BentoHeader({
  onOpenScheduleSimulator,
  isVaShiftActive,
  activeLineCount
}: BentoHeaderProps) {
  return (
    <section className="py-4 sm:py-5 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Core Cockpit Title & Defensibility Hook Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                NextDrip Unified Virtual Assistant Communications Cockpit
              </h1>
              <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-[var(--live-subtle)] px-2.5 py-0.5 text-xs font-semibold text-[var(--live-text)] border border-[var(--live)]/20 whitespace-nowrap shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)] animate-ping" />
                Twilio Native APIs
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
              Single-screen operations for 20 Twilio lines. Auto-locked caller IDs, pre-roll California recording disclosure, and seamless after-hours owner failover.
            </p>
          </div>

          {/* Architectural Defensibility Guarantee Pill */}
          <div className="shrink-0 flex items-center gap-2 bg-[var(--surface-subtle)] p-2 rounded-lg border border-[var(--border)]">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--brand)] text-white">
              <Lock className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span>Zero Console Access Needed</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--live)]" />
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                VA identity isolated • Personal cell never exposed
              </p>
            </div>
          </div>
        </div>

        {/* 5-Column High-Density Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Card 1: Active DIDs */}
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/60 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Twilio Numbers
              </span>
              <Phone className="h-4 w-4 text-[var(--brand)]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
                {activeLineCount}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">/ 20 Active</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
              CA, NV, AZ, FL, NY coverage
            </p>
          </div>

          {/* Card 2: Auto-Origin Caller ID Lock */}
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/60 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Caller ID Lock
              </span>
              <Lock className="h-4 w-4 text-[var(--live)]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--live)]">
                100%
              </span>
              <span className="text-xs font-medium text-[var(--live-text)]">Enforced</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
              Auto-reply from dialed line
            </p>
          </div>

          {/* Card 3: CA Two-Party Consent Disclosure */}
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/60 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Recording Safe
              </span>
              <ShieldCheck className="h-4 w-4 text-[var(--accent-indigo)]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
                CA § 632
              </span>
              <span className="text-xs font-medium text-[var(--live-text)]">Pre-Roll</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
              Spoken before audio capture
            </p>
          </div>

          {/* Card 4: Pacific Schedule TimeGate */}
          <div 
            onClick={onOpenScheduleSimulator}
            className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/60 hover:border-[var(--brand)]/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Pacific TimeGate
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
                Wed-Sun
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">8a-4p</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`h-1.5 w-1.5 rounded-full ${isVaShiftActive ? "bg-[var(--live)] animate-pulse" : "bg-[var(--accent-amber)]"}`} />
              <span className="text-xs text-[var(--text-secondary)] truncate">
                {isVaShiftActive ? "Routing: VA WebRTC" : "Routing: Owner Phone"}
              </span>
            </div>
          </div>

          {/* Card 5: A2P 10DLC TCR Campaign */}
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]/60 relative overflow-hidden col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                A2P 10DLC
              </span>
              <Zap className="h-4 w-4 text-[var(--accent-cyan)]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
                Tier 2
              </span>
              <span className="text-xs font-mono text-[var(--accent-cyan)] font-semibold">84 Trust</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
              20 DIDs in Messaging Service
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
