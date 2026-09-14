"use client";

import React, { useState, useEffect } from "react";
import { UserRole } from "@/lib/types";
import { 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  Lock, 
  Sun, 
  Moon, 
  MessageSquare, 
  Radio, 
  CalendarClock,
  Sparkles,
  Layers
} from "lucide-react";
import { useTheme } from "next-themes";

interface NavbarProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: "inbox" | "workflow" | "compliance" | "schedule" | "owner";
  onTabChange: (tab: "inbox" | "workflow" | "compliance" | "schedule" | "owner") => void;
  onSimulateInboundCall: () => void;
  onSimulateInboundSms: () => void;
  pacificTimeDisplay: string;
  isVaShiftActive: boolean;
}

export function Navbar({
  role,
  onRoleChange,
  activeTab,
  onTabChange,
  onSimulateInboundCall,
  onSimulateInboundSms,
  pacificTimeDisplay,
  isVaShiftActive,
}: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand & Organization */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)] text-white shadow-sm font-bold text-lg">
              ND
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                  NextDrip
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[var(--brand-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-text)] border border-[var(--brand)]/20 whitespace-nowrap">
                  20-Line Voice & SMS Hub
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate hidden md:block">
                Concierge IV & Longevity Medicine • Enterprise Twilio Cockpit
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--surface-subtle)] p-1 rounded-lg border border-[var(--border)]">
            <button
              onClick={() => onTabChange("inbox")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "inbox"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 text-[var(--brand)]" />
              <span>Unified VA Inbox</span>
            </button>

            <button
              onClick={() => onTabChange("workflow")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "workflow"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Radio className="h-3.5 w-3.5 text-[var(--live)]" />
              <span>Live Routing Pipeline</span>
            </button>

            <button
              onClick={() => onTabChange("compliance")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "compliance"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-indigo)]" />
              <span>Compliance & 10DLC</span>
            </button>

            {role === "OWNER" && (
              <button
                onClick={() => onTabChange("owner")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "owner"
                    ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-[var(--accent-cyan)]" />
                <span>Owner Admin Audit</span>
              </button>
            )}
          </nav>

          {/* Pacific Schedule Badge & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Live Pacific Schedule Status */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs">
              <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-xs font-medium text-[var(--text-primary)]">
                  {pacificTimeDisplay || "8:00 AM Pacific"}
                </span>
                <span className="text-[10px] flex items-center gap-1 font-semibold">
                  <span className={`h-1.5 w-1.5 rounded-full ${isVaShiftActive ? "bg-[var(--live)] animate-pulse" : "bg-[var(--accent-amber)]"}`} />
                  <span className={isVaShiftActive ? "text-[var(--live-text)]" : "text-[var(--accent-amber)]"}>
                    {isVaShiftActive ? "VA Active (WebRTC)" : "Owner Forward"}
                  </span>
                </span>
              </div>
            </div>

            {/* Inbound Simulator Quick Triggers */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onSimulateInboundCall}
                title="Simulate incoming customer call on Line #01 (Beverly Hills)"
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brand)] px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--brand-hover)] transition-all whitespace-nowrap shrink-0"
              >
                <PhoneCall className="h-3.5 w-3.5 animate-bounce" />
                <span className="hidden sm:inline">Test Inbound Call</span>
                <span className="sm:hidden">Call</span>
              </button>

              <button
                onClick={onSimulateInboundSms}
                title="Simulate inbound SMS to Line #04 (Newport Beach)"
                className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] shadow-sm hover:bg-[var(--surface-subtle)] transition-all whitespace-nowrap shrink-0"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[var(--brand)]" />
                <span>Test SMS</span>
              </button>
            </div>

            {/* Role Switcher (VA vs Owner) */}
            <div className="flex items-center bg-[var(--surface-subtle)] p-0.5 rounded-lg border border-[var(--border)]">
              <button
                onClick={() => onRoleChange("VA")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  role === "VA"
                    ? "bg-[var(--brand)] text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                VA Mode
              </button>
              <button
                onClick={() => onRoleChange("OWNER")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                  role === "OWNER"
                    ? "bg-[var(--text-primary)] text-[var(--background)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Lock className="h-3 w-3" />
                <span>Owner</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-1 py-2 border-t border-[var(--border)] overflow-x-auto">
          <button
            onClick={() => onTabChange("inbox")}
            className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 ${
              activeTab === "inbox"
                ? "bg-[var(--brand)] text-white"
                : "text-[var(--text-secondary)]"
            }`}
          >
            Unified VA Inbox
          </button>
          <button
            onClick={() => onTabChange("workflow")}
            className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 ${
              activeTab === "workflow"
                ? "bg-[var(--brand)] text-white"
                : "text-[var(--text-secondary)]"
            }`}
          >
            Routing Pipeline
          </button>
          <button
            onClick={() => onTabChange("compliance")}
            className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 ${
              activeTab === "compliance"
                ? "bg-[var(--brand)] text-white"
                : "text-[var(--text-secondary)]"
            }`}
          >
            Compliance & 10DLC
          </button>
          {role === "OWNER" && (
            <button
              onClick={() => onTabChange("owner")}
              className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 ${
                activeTab === "owner"
                  ? "bg-[var(--brand)] text-white"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              Owner Audit
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
