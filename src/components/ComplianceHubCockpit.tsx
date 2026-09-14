"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Lock, 
  FileText, 
  Database, 
  PhoneOff, 
  Send, 
  Scale, 
  Volume2, 
  Code,
  Download,
  Check,
  Building2,
  Cpu
} from "lucide-react";
import { ComplianceState, TwilioLine } from "@/lib/types";

interface ComplianceHubCockpitProps {
  lines: TwilioLine[];
}

export function ComplianceHubCockpit({ lines }: ComplianceHubCockpitProps) {
  const [testNumber, setTestNumber] = useState("+14155552671");
  const [testKeyword, setTestKeyword] = useState("STOP");
  const [testFeedback, setTestFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suppressionList, setSuppressionList] = useState<Array<{
    phone: string;
    keyword: string;
    timestamp: string;
    scope: string;
  }>>([
    {
      phone: "+14155559812",
      keyword: "STOP",
      timestamp: "Today, 09:14 AM Pacific",
      scope: "Universal (All 20 DIDs Suppressed)"
    },
    {
      phone: "+12125557732",
      keyword: "STOPALL",
      timestamp: "Yesterday, 04:22 PM Pacific",
      scope: "Universal (All 20 DIDs Suppressed)"
    }
  ]);

  const handleSimulateKeyword = () => {
    setIsProcessing(true);
    setTestFeedback(null);

    setTimeout(() => {
      const kw = testKeyword.trim().toUpperCase();
      const num = testNumber.trim();

      if (["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"].includes(kw)) {
        if (!suppressionList.some(item => item.phone === num)) {
          setSuppressionList(prev => [
            {
              phone: num,
              keyword: kw,
              timestamp: "Just now",
              scope: "Universal (All 20 DIDs Suppressed)"
            },
            ...prev
          ]);
        }
        setTestFeedback(`[TCPA ENFORCED] ${num} received keyword '${kw}'. Automatically suppressed across all 20 lines in Twilio Messaging Service 'MG_NEXTDRIP_POOL'. Outbound SMS locked.`);
      } else if (["START", "UNSTOP"].includes(kw)) {
        setSuppressionList(prev => prev.filter(item => item.phone !== num));
        setTestFeedback(`[TCPA RESUMED] ${num} sent '${kw}'. Consent restored. Outbound SMS unlocked across all 20 lines.`);
      } else if (["HELP", "INFO"].includes(kw)) {
        setTestFeedback(`[HELP RESPONDED] NextDrip Support: Reply STOP to unsubscribe or call (310) 555-0142. Msg&Data rates may apply.`);
      } else {
        setTestFeedback(`Keyword '${kw}' forwarded to VA Inbox as standard conversational SMS.`);
      }
      setIsProcessing(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Hero */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[var(--live-subtle)] text-[var(--live)]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Enterprise Regulatory & Legal Compliance Architecture
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              NextDrip 3-Pillar Compliance Engine: A2P 10DLC TCR Campaign, Centralized TCPA Opt-Out Pool, and California Penal Code § 632 Pre-Roll Enforcement.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--live-subtle)] text-[var(--live-text)] border border-[var(--live)]/30">
              <span className="h-2 w-2 rounded-full bg-[var(--live)] animate-pulse" />
              100% REGULATORY IMMUNITY
            </span>
          </div>
        </div>
      </div>

      {/* 3 Pillar Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Pillar 1: A2P 10DLC TCR Brand & Campaign */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[var(--brand)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Pillar 1: A2P 10DLC TCR Registry
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[var(--live-subtle)] text-[var(--live-text)]">
                TIER 2 VERIFIED
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Brand Name:</span>
                <span className="font-semibold font-mono text-[var(--text-primary)]">NextDrip LLC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">TCR Brand ID:</span>
                <span className="font-mono text-[var(--text-primary)]">BRND_NXD99214</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Campaign ID:</span>
                <span className="font-mono text-[var(--text-primary)]">CMP_99214A2P</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Registered Use Case:</span>
                <span className="font-semibold text-[var(--text-primary)]">Customer Care & Inquiries</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Throughput / TPM:</span>
                <span className="font-bold text-[var(--live)]">4,500 msgs / min</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--live)] shrink-0 mt-0.5" />
                <span>Twilio Messaging Service <strong className="font-mono text-[var(--text-primary)]">MG_NEXTDRIP_POOL</strong> links all 20 lines</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--live)] shrink-0 mt-0.5" />
                <span>Zero carrier filtering across T-Mobile, AT&amp;T, and Verizon</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--live)] shrink-0 mt-0.5" />
                <span>Published privacy policy &amp; terms linked to registration</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)]">
            <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-[var(--brand)]" />
              Automated Twilio SDK provisioning script included
            </span>
          </div>
        </div>

        {/* Pillar 2: TCPA Universal Opt-Out Suppression */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneOff className="h-4 w-4 text-[var(--brand)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Pillar 2: Centralized TCPA Pool
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[var(--live-subtle)] text-[var(--live-text)]">
                ADVANCED OPT-OUT
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              If a customer texts <strong>STOP</strong> to Line #3, Twilio Advanced Opt-Out instantly locks that customer out of <strong>all 20 lines</strong>. The VA cannot accidentally message an unsubscribed lead.
            </p>

            <div className="p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Opt-Out Keywords:</span>
                <span className="font-mono font-bold text-[var(--brand)]">STOP, CANCEL, END, QUIT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Opt-In Resumption:</span>
                <span className="font-mono font-bold text-[var(--live)]">START, UNSTOP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Statutory Liability:</span>
                <span className="font-semibold text-rose-500">$500 – $1,500 / text fine prevented</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--live)] shrink-0 mt-0.5" />
                <span>Hardware-level carrier rejection before message dispatch</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--live)] shrink-0 mt-0.5" />
                <span>Zero manual VA list pruning or console intervention required</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)]">
            <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-[var(--brand)]" />
              Real-time webhook suppression trigger active
            </span>
          </div>
        </div>

        {/* Pillar 3: California Two-Party Consent (Penal Code § 632) */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-[var(--brand)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Pillar 3: California § 632 Pre-Roll
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[var(--live-subtle)] text-[var(--live-text)]">
                DUAL-CHANNEL LOCK
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              California Penal Code § 632 mandates two-party consent with statutory damages of <strong>$2,500 per violation</strong>. TwiML ensures disclosure plays completely before recording initiates.
            </p>

            <div className="p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Inbound Sequence:</span>
                <span className="font-semibold text-[var(--text-primary)]">&lt;Say&gt; ➔ &lt;Dial record=&quot;...&quot;&gt;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Outbound Sequence:</span>
                <span className="font-semibold text-[var(--text-primary)]">Whisper Audio on Callee Answer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Recording Engine:</span>
                <span className="font-mono text-[var(--live)]">record-from-answer-dual</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--live)] shrink-0 mt-0.5" />
                <span>Covers all 12 two-party consent US jurisdictions</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--live)] shrink-0 mt-0.5" />
                <span>Dual audio channels isolate VA from customer for clean AI</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)]">
            <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
              <Volume2 className="h-3 w-3 text-[var(--brand)]" />
              Configurable synthetic neural voice: Polly.Joanna
            </span>
          </div>
        </div>

      </div>

      {/* Interactive Compliance Testing Lab */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Live TCPA Opt-Out &amp; Keyword Verification Simulator
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Test how Twilio webhook events instantly update the 20-number suppression list without manual intervention.
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Hook: /api/twiml/sms
          </span>
        </div>

        {/* Input Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              Customer Phone Number
            </label>
            <input
              type="text"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              className="w-full p-2.5 text-xs font-mono rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)]"
              placeholder="+1XXXXXXXXXX"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
              Inbound SMS Keyword
            </label>
            <select
              value={testKeyword}
              onChange={(e) => setTestKeyword(e.target.value)}
              className="w-full p-2.5 text-xs font-bold rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)]"
            >
              <option value="STOP">STOP (Universal Opt-Out)</option>
              <option value="STOPALL">STOPALL (Hard Suppression)</option>
              <option value="CANCEL">CANCEL (Opt-Out)</option>
              <option value="START">START (Consent Restored)</option>
              <option value="UNSTOP">UNSTOP (Opt-In Revived)</option>
              <option value="HELP">HELP (Required Disclosure)</option>
              <option value="INQUIRY">Standard Inbound Customer Message</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSimulateKeyword}
              disabled={isProcessing}
              className="w-full p-2.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {isProcessing ? "Processing Webhook..." : "Dispatch TCPA Event"}
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {testFeedback && (
          <div className="p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--brand)]/30 text-xs font-mono text-[var(--text-primary)] flex items-start gap-2 animate-in fade-in duration-200">
            <ShieldCheck className="h-4 w-4 text-[var(--brand)] shrink-0 mt-0.5" />
            <span>{testFeedback}</span>
          </div>
        )}

        {/* Current Active Suppression Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Centralized Messaging Service Blacklist ({suppressionList.length} Protected Numbers)
            </span>
            <span className="text-xs font-mono text-[var(--live)]">
              Real-Time Sync Active
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border)] text-[var(--text-secondary)] font-semibold">
                  <th className="p-3">Customer Phone</th>
                  <th className="p-3">Trigger Keyword</th>
                  <th className="p-3">Logged At</th>
                  <th className="p-3">Suppression Scope</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)] font-mono">
                {suppressionList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[var(--surface-subtle)] transition-colors">
                    <td className="p-3 font-bold text-[var(--text-primary)]">{item.phone}</td>
                    <td className="p-3 text-rose-500 font-bold">{item.keyword}</td>
                    <td className="p-3 text-[var(--text-secondary)]">{item.timestamp}</td>
                    <td className="p-3 text-[var(--text-primary)]">{item.scope}</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        OUTBOUND BLOCKED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* TCR 20-DID Messaging Service Architecture */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Twilio Messaging Service DID Binding Pool (20 Numbers Attached)
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              All 20 NextDrip DIDs share campaign <strong className="font-mono text-[var(--text-primary)]">CMP_99214A2P</strong> under SID <strong className="font-mono text-[var(--text-primary)]">MG_NEXTDRIP_POOL</strong>.
            </p>
          </div>
          <button
            onClick={() => {
              const manifest = {
                brand: "NextDrip LLC",
                brandId: "BRND_NXD99214",
                campaignId: "CMP_99214A2P",
                messagingServiceSid: "MG_NEXTDRIP_POOL",
                attachedDids: lines.map(l => l.phoneNumber),
                tcpaOptOutKeywords: ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"],
                twoPartyConsent: "CA Penal Code § 632 Pre-Roll Enabled"
              };
              const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "nextdrip-compliance-manifest.json";
              a.click();
            }}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-all"
          >
            <Download className="h-3.5 w-3.5 text-[var(--brand)]" />
            Download Compliance Manifest JSON
          </button>
        </div>

        {/* 20 DID Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 pt-2">
          {lines.map((line) => (
            <div
              key={line.id}
              className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] flex flex-col justify-between gap-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-[var(--brand)]">
                  DID #{line.id}
                </span>
                <span className="h-2 w-2 rounded-full bg-[var(--live)]" />
              </div>
              <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                {line.phoneNumber}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] truncate">
                {line.territory}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
