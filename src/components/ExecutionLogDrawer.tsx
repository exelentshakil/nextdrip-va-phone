"use client";

import React, { useState } from "react";
import { 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink,
  Code2,
  Activity,
  Zap
} from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "VOICE" | "SMS" | "AI" | "COMPLIANCE" | "SYSTEM";
  title: string;
  details: Record<string, unknown>;
  status: "success" | "warning" | "error" | "info";
}

interface ExecutionLogDrawerProps {
  logs: LogEntry[];
  onClearLogs?: () => void;
}

export function ExecutionLogDrawer({ logs, onClearLogs }: ExecutionLogDrawerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [copiedCurl, setCopiedCurl] = useState<string | null>(null);

  const curlExamples = [
    {
      label: "TwiML Voice Webhook",
      command: `curl -X POST https://nextdrip-va-phone.vercel.app/api/twiml/voice \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "From=%2B14155550199&To=%2B13105550142&CallSid=CA123456789"`
    },
    {
      label: "TwiML SMS Webhook",
      command: `curl -X POST https://nextdrip-va-phone.vercel.app/api/twiml/sms \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "From=%2B14155550199&To=%2B13105550142&Body=STOP"`
    },
    {
      label: "AI Dual-Provider Smart Reply",
      command: `curl -X POST https://nextdrip-va-phone.vercel.app/api/ai/reply \\
  -H "Content-Type: application/json" \\
  -d '{"customerMessage":"Can you send me your pricing?","callerId":"+13105550142"}'`
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCurl(id);
    setTimeout(() => setCopiedCurl(null), 2000);
  };

  const filteredLogs = logs.filter(log => {
    if (filter === "ALL") return true;
    return log.type === filter;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all duration-300">
      
      {/* Collapsed Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[var(--surface-subtle)] hover:bg-[var(--border)]/50 cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="h-4 w-4 text-[var(--brand)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Live Execution &amp; Webhook Telemetry
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[var(--live-subtle)] text-[var(--live-text)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--live)] animate-pulse" />
            {logs.length} EVENTS LOGGED
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
            Click to {isOpen ? "collapse" : "expand"} live Twilio webhooks &amp; cURLs
          </span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" />
          ) : (
            <ChevronUp className="h-4 w-4 text-[var(--text-secondary)]" />
          )}
        </div>
      </div>

      {/* Expanded Content Drawer */}
      {isOpen && (
        <div className="p-4 sm:p-6 max-h-[500px] overflow-y-auto space-y-4">
          
          {/* Controls & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {["ALL", "VOICE", "SMS", "AI", "COMPLIANCE", "SYSTEM"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    filter === f
                      ? "bg-[var(--brand)] text-white"
                      : "bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {onClearLogs && (
              <button
                onClick={onClearLogs}
                className="text-xs text-[var(--text-secondary)] hover:text-rose-500 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Event Stream
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Log Stream Column */}
            <div className="lg:col-span-2 space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--text-secondary)] rounded-lg border border-dashed border-[var(--border)]">
                  No execution events logged for this filter yet. Trigger a test inbound call or SMS from the navigation bar.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-2.5 rounded-lg border text-xs font-mono cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      selectedLog?.id === log.id
                        ? "bg-[var(--surface-subtle)] border-[var(--brand)]"
                        : "bg-[var(--background)] border-[var(--border)] hover:border-[var(--brand)]/50"
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.type === "VOICE"
                              ? "bg-blue-500/10 text-blue-500"
                              : log.type === "SMS"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : log.type === "AI"
                              ? "bg-purple-500/10 text-purple-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {log.type}
                        </span>
                        <span className="font-semibold text-[var(--text-primary)] truncate">
                          {log.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-secondary)] block">
                        {log.timestamp}
                      </span>
                    </div>

                    <span className="text-[11px] text-[var(--text-secondary)] shrink-0">
                      Inspect ➔
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Inspect / Payload View or Copyable cURLs */}
            <div className="space-y-3">
              {selectedLog ? (
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] space-y-2">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      Event Payload
                    </span>
                    <button
                      onClick={() => setSelectedLog(null)}
                      className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      Close
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-[var(--text-secondary)] overflow-x-auto max-h-[220px]">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                    Copyable Terminal cURLs
                  </span>
                  {curlExamples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--text-primary)]">
                          {ex.label}
                        </span>
                        <button
                          onClick={() => handleCopy(ex.command, `curl-${idx}`)}
                          className="p-1 rounded hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)]"
                          title="Copy command"
                        >
                          {copiedCurl === `curl-${idx}` ? (
                            <Check className="h-3.5 w-3.5 text-[var(--live)]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-[11px] text-[var(--text-secondary)] overflow-x-auto p-1.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                        {ex.command}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
