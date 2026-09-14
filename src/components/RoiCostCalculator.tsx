"use client";

import React, { useState } from "react";
import { 
  Calculator, 
  TrendingDown, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Sparkles
} from "lucide-react";

export function RoiCostCalculator() {
  const [numLines, setNumLines] = useState<number>(20);
  const [monthlyMinutes, setMonthlyMinutes] = useState<number>(2500);
  const [monthlySms, setMonthlySms] = useState<number>(1800);

  // Direct Twilio API Pricing
  // Numbers: $1.15/mo each
  const didCost = numLines * 1.15;
  // Inbound Voice: $0.0085/min, WebRTC Client: $0.0040/min
  const voiceCost = monthlyMinutes * (0.0085 + 0.0040);
  // Dual-channel recording: $0.0025/min + storage $0.0005/min
  const recordingCost = monthlyMinutes * 0.0030;
  // A2P 10DLC SMS: $0.0079/msg + $1.50/mo campaign fee
  const smsCost = (monthlySms * 0.0079) + 1.50;
  // Dual-provider AI (GPT-4o-mini / Gemini Flash)
  const aiCost = ((monthlyMinutes * 0.2) * 0.002) + (monthlySms * 0.0008);

  const totalTwilioDirect = didCost + voiceCost + recordingCost + smsCost + aiCost;

  // Third-Party SaaS (Twilio Flex / GoHighLevel / Dialpad / RingCentral)
  // Base seat fee ($150 - $250/mo) + $5/mo per extra number beyond 1 + carrier markup
  const saasBaseSeat = 189.00;
  const saasExtraNumbers = Math.max(0, numLines - 1) * 6.50;
  const saasUsageCost = (monthlyMinutes * 0.035) + (monthlySms * 0.025);
  const totalSaas = saasBaseSeat + saasExtraNumbers + saasUsageCost;

  const monthlySavings = Math.max(0, totalSaas - totalTwilioDirect);
  const annualSavings = monthlySavings * 12;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[var(--brand-subtle)] text-[var(--brand)]">
              <Calculator className="h-5 w-5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Direct Twilio API vs. Third-Party SaaS Cost Engine
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            NextDrip architectural advantage: zero per-seat subscriptions, wholesale Twilio carrier billing, and 100% proprietary code ownership.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--live-subtle)] text-[var(--live-text)] border border-[var(--live)]/30">
            <TrendingDown className="h-3.5 w-3.5" />
            SAVE ~${Math.round(annualSavings).toLocaleString()} / YR
          </span>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Slider 1: Active DIDs */}
        <div className="space-y-2 p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Twilio Phone Numbers
            </span>
            <span className="font-bold font-mono text-[var(--brand)]">
              {numLines} Lines
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={numLines}
            onChange={(e) => setNumLines(parseInt(e.target.value, 10))}
            className="w-full accent-[var(--brand)] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono">
            <span>5 Lines</span>
            <span>Current: 20</span>
            <span>50 Lines</span>
          </div>
        </div>

        {/* Slider 2: Monthly Call Minutes */}
        <div className="space-y-2 p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Monthly Call Minutes
            </span>
            <span className="font-bold font-mono text-[var(--brand)]">
              {monthlyMinutes.toLocaleString()} Mins
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={10000}
            step={250}
            value={monthlyMinutes}
            onChange={(e) => setMonthlyMinutes(parseInt(e.target.value, 10))}
            className="w-full accent-[var(--brand)] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono">
            <span>500 min</span>
            <span>2,500 min</span>
            <span>10,000 min</span>
          </div>
        </div>

        {/* Slider 3: Monthly SMS Messages */}
        <div className="space-y-2 p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Monthly SMS Volume
            </span>
            <span className="font-bold font-mono text-[var(--brand)]">
              {monthlySms.toLocaleString()} Texts
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={15000}
            step={250}
            value={monthlySms}
            onChange={(e) => setMonthlySms(parseInt(e.target.value, 10))}
            className="w-full accent-[var(--brand)] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono">
            <span>500 msgs</span>
            <span>1,800 msgs</span>
            <span>15,000 msgs</span>
          </div>
        </div>

      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Direct Twilio API (This Architecture) */}
        <div className="p-5 rounded-xl border border-[var(--live)]/40 bg-[var(--live-subtle)]/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--live)]">
                RECOMMENDED ARCHITECTURE
              </span>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                NextDrip Direct Twilio API Stack
              </h4>
            </div>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--live)]">
              ${totalTwilioDirect.toFixed(2)}
              <span className="text-xs font-normal text-[var(--text-secondary)]">/mo</span>
            </span>
          </div>

          <div className="space-y-2 text-xs border-t border-[var(--live)]/20 pt-3">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">{numLines} Phone Numbers ($1.15/ea):</span>
              <span className="font-mono font-semibold">${didCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Voice Inbound + WebRTC Softphone:</span>
              <span className="font-mono font-semibold">${voiceCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Dual-Channel Audio Recording:</span>
              <span className="font-mono font-semibold">${recordingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">A2P 10DLC Verified SMS &amp; Campaign:</span>
              <span className="font-mono font-semibold">${smsCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Dual-Provider AI Summaries &amp; Replies:</span>
              <span className="font-mono font-semibold">${aiCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[var(--live)] font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>Pay only for exact carrier seconds. No vendor lock-in.</span>
          </div>
        </div>

        {/* Third-Party SaaS (GoHighLevel / Twilio Flex / Dialpad) */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                OFF-THE-SHELF ALTERNATIVE
              </span>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                Third-Party SaaS Seat Software
              </h4>
            </div>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-secondary)] line-through">
              ${totalSaas.toFixed(2)}
              <span className="text-xs font-normal">/mo</span>
            </span>
          </div>

          <div className="space-y-2 text-xs border-t border-[var(--border)] pt-3">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Base Seat License:</span>
              <span className="font-mono font-semibold">${saasBaseSeat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Extra Phone Number Surcharges:</span>
              <span className="font-mono font-semibold">${saasExtraNumbers.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Marked-Up Carrier Minutes &amp; Texts:</span>
              <span className="font-mono font-semibold">${saasUsageCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Platform Data Lock-In Risk:</span>
              <span className="font-mono text-rose-500 font-semibold">High</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Custom Caller ID Lock Rule Flexibility:</span>
              <span className="font-mono text-rose-500 font-semibold">Restricted</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <span>SaaS companies add 300%–500% margin on top of Twilio wholesale.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
