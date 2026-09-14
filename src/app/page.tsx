"use client";

import React, { useState, useEffect } from "react";
import { 
  TWILIO_LINES_POOL, 
  DEFAULT_SCHEDULE_CONFIG, 
  INITIAL_CALL_RECORDS, 
  INITIAL_SMS_THREADS,
  INITIAL_COMPLIANCE_STATE
} from "@/lib/constants";
import { 
  TwilioLine, 
  CallRecord, 
  SmsThread, 
  ScheduleConfig, 
  UserRole 
} from "@/lib/types";
import { checkPacificBusinessHours } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { BentoHeader } from "@/components/BentoHeader";
import { VaInboxCockpit } from "@/components/VaInboxCockpit";
import { WorkflowCanvas } from "@/components/WorkflowCanvas";
import { ComplianceHubCockpit } from "@/components/ComplianceHubCockpit";
import { OwnerAdminCockpit } from "@/components/OwnerAdminCockpit";
import { ScheduleSimulatorModal } from "@/components/ScheduleSimulatorModal";
import { ExecutionLogDrawer, LogEntry } from "@/components/ExecutionLogDrawer";
import { ChaosOutageSimulator } from "@/components/ChaosOutageSimulator";
import { RoiCostCalculator } from "@/components/RoiCostCalculator";
import { BlueprintExporter } from "@/components/BlueprintExporter";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [lines, setLines] = useState<TwilioLine[]>(TWILIO_LINES_POOL);
  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALL_RECORDS);
  const [smsThreads, setSmsThreads] = useState<SmsThread[]>(INITIAL_SMS_THREADS);
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>(DEFAULT_SCHEDULE_CONFIG);
  const [role, setRole] = useState<UserRole>("VA");
  const [activeTab, setActiveTab] = useState<"inbox" | "workflow" | "compliance" | "schedule" | "owner">("inbox");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [incomingCallAlert, setIncomingCallAlert] = useState<{
    lineId: string;
    customerName: string;
    customerNumber: string;
    territory: string;
  } | null>(null);

  const [mounted, setMounted] = useState(false);
  // Deterministic Pacific Clock state for hydration safety
  const [pacificStatus, setPacificStatus] = useState({
    isVaShift: true,
    pacificDayName: "Wednesday",
    pacificHour: 10,
    pacificMinute: 30,
    timeString: "10:30 AM Pacific",
    routingDestination: "VA_WEBRTC" as const,
    reason: "Standard VA shift active"
  });

  // Live Execution Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log-init-1",
      timestamp: "Today 08:00 AM Pacific",
      type: "COMPLIANCE",
      title: "TCR Brand 'NextDrip LLC' & 20-DID Messaging Pool Active",
      details: {
        brandId: "BRND_NXD99214",
        campaignId: "CMP_99214A2P",
        didsAttached: 20,
        carrierFilters: "BYPASSED",
        twoPartyConsent: "CA Penal Code § 632 Pre-Roll Armed"
      },
      status: "success"
    },
    {
      id: "log-init-2",
      timestamp: "Today 08:00 AM Pacific",
      type: "SYSTEM",
      title: "Pacific TimeGate Initialized (Wed-Sun 8AM-4PM PT)",
      details: {
        timezone: "America/Los_Angeles",
        dstAware: true,
        inProgressBoundaryLock: "ENABLED"
      },
      status: "info"
    }
  ]);

  // Clock tick every 10 seconds with mounted guard
  useEffect(() => {
    setMounted(true);
    setPacificStatus(checkPacificBusinessHours(scheduleConfig));
    const timer = setInterval(() => {
      setPacificStatus(checkPacificBusinessHours(scheduleConfig));
    }, 10000);
    return () => clearInterval(timer);
  }, [scheduleConfig]);

  // Test Inbound Call Simulation
  const handleSimulateInboundCall = () => {
    const targetLine = lines[0]; // Beverly Hills line #1
    const newCallId = `call-sim-${Date.now()}`;
    const timestampStr = "Just now";

    setIncomingCallAlert({
      lineId: targetLine.id,
      customerName: "Dr. Marcus Vance (Beverly Hills Concierge)",
      customerNumber: "+1 (310) 555-8821",
      territory: targetLine.territory
    });

    const newCall: CallRecord = {
      id: newCallId,
      lineId: targetLine.id,
      lineNumber: targetLine.phoneNumber,
      lineTerritory: targetLine.territory,
      customerNumber: "+1 (310) 555-8821",
      customerName: "Dr. Marcus Vance",
      direction: "INBOUND",
      status: "IN_PROGRESS",
      durationSeconds: 94,
      audioDurationStr: "1m 34s",
      timestamp: timestampStr,
      recordingUrl: "https://api.twilio.com/mock/recordings/re_991823.mp3",
      consentDisclosurePlayed: true,
      routedTo: pacificStatus.isVaShift ? "VA_WEBRTC" : "OWNER_IPHONE",
      transcription: "Caller: Hi, Dr. Vance here. Looking to book NAD+ and Myers cocktail home infusion for 3 clients tomorrow at 10 AM in Beverly Hills.",
      summary: "Inbound inquiry regarding NAD+ and Myers cocktail home infusion for 3 clients tomorrow at 10 AM.",
      clinicalIntent: "HYDRATION_APPOINTMENT",
      actionItems: [
        "Confirm mobile nurse availability in Beverly Hills for 10:00 AM",
        "Send digital health questionnaire via SMS to +1 (310) 555-8821"
      ],
      sentiment: "POSITIVE"
    };

    setCalls(prev => [newCall, ...prev]);

    // Update line metric
    setLines(prev => prev.map(l => l.id === targetLine.id ? { ...l, callsToday: l.callsToday + 1 } : l));

    // Append Execution Log
    setLogs(prev => [
      {
        id: `log-call-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "VOICE",
        title: `Inbound Call on ${targetLine.phoneNumber} (${targetLine.territory})`,
        details: {
          From: "+13105558821",
          To: targetLine.e164,
          disclosure: "CA Penal Code § 632 Pre-Roll Executed",
          routedTo: pacificStatus.isVaShift ? "va_workstation_webrtc" : "owner_iphone_cellular",
          recording: "record-from-answer-dual",
          callerIdLock: targetLine.e164
        },
        status: "success"
      },
      ...prev
    ]);
  };

  // Test Inbound SMS Simulation
  const handleSimulateInboundSms = () => {
    const targetLine = lines[3]; // Newport Beach line #4
    const newMsgId = `msg-sim-${Date.now()}`;
    const timestampStr = "Just now";

    const targetThread = smsThreads.find(t => t.lineId === targetLine.id) || smsThreads[0];

    const updatedThreads = smsThreads.map(t => {
      if (t.id === targetThread.id) {
        return {
          ...t,
          lastMessage: "Hi, can you send the price list for the Glutathione IV push?",
          lastTimestamp: timestampStr,
          unreadCount: t.unreadCount + 1,
          messages: [
            ...t.messages,
            {
              id: newMsgId,
              threadId: t.id,
              lineId: targetLine.id,
              from: t.customerNumber,
              to: targetLine.e164,
              body: "Hi, can you send the price list for the Glutathione IV push?",
              timestamp: timestampStr,
              sender: "CUSTOMER" as const,
              deliveryStatus: "RECEIVED" as const
            }
          ]
        };
      }
      return t;
    });

    setSmsThreads(updatedThreads);

    // Update line text count
    setLines(prev => prev.map(l => l.id === targetLine.id ? { ...l, textsToday: l.textsToday + 1 } : l));

    // Append Execution Log
    setLogs(prev => [
      {
        id: `log-sms-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "SMS",
        title: `Inbound SMS on Line #04 Newport Beach (${targetLine.phoneNumber})`,
        details: {
          From: targetThread.customerNumber,
          To: targetLine.e164,
          messagingServiceSid: "MG_NEXTDRIP_POOL",
          a2p10dlcVerified: true,
          tcpaStatus: "OPTED_IN",
          lockedOutboundCallerId: targetLine.e164
        },
        status: "success"
      },
      ...prev
    ]);
  };

  const handleAnswerIncomingCall = () => {
    setIncomingCallAlert(null);
  };

  const handleDeclineIncomingCall = () => {
    setIncomingCallAlert(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)] transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        role={role}
        onRoleChange={(newRole) => {
          setRole(newRole);
          if (newRole === "OWNER" && activeTab !== "owner") {
            setActiveTab("owner");
          } else if (newRole === "VA" && activeTab === "owner") {
            setActiveTab("inbox");
          }
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "schedule") {
            setIsScheduleModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onSimulateInboundCall={handleSimulateInboundCall}
        onSimulateInboundSms={handleSimulateInboundSms}
        pacificTimeDisplay={pacificStatus.timeString}
        isVaShiftActive={pacificStatus.isVaShift}
      />

      {/* Bento Metric Header Strip */}
      <BentoHeader
        onOpenScheduleSimulator={() => setIsScheduleModalOpen(true)}
        isVaShiftActive={pacificStatus.isVaShift}
        activeLineCount={lines.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Tab 1: Unified VA Inbox Cockpit */}
        {activeTab === "inbox" && (
          <div className="space-y-8">
            <VaInboxCockpit
              lines={lines}
              calls={calls}
              smsThreads={smsThreads}
              scheduleConfig={scheduleConfig}
              isVaShiftActive={pacificStatus.isVaShift}
              incomingCallAlert={incomingCallAlert}
              onAnswerIncomingCall={handleAnswerIncomingCall}
              onDeclineIncomingCall={handleDeclineIncomingCall}
            />

            {/* Chaos & Failover Test Simulator */}
            <ChaosOutageSimulator />

            {/* Direct Twilio API vs SaaS Cost Calculator */}
            <RoiCostCalculator />
          </div>
        )}

        {/* Tab 2: Live Routing Pipeline & Flow Canvas */}
        {activeTab === "workflow" && (
          <div className="space-y-8">
            <WorkflowCanvas
              isVaShiftActive={pacificStatus.isVaShift}
              onSimulateInboundCall={handleSimulateInboundCall}
              onSimulateInboundSms={handleSimulateInboundSms}
            />

            {/* Turnkey Blueprint Exporter */}
            <BlueprintExporter />
          </div>
        )}

        {/* Tab 3: Regulatory & Compliance Hub */}
        {activeTab === "compliance" && (
          <div className="space-y-8">
            <ComplianceHubCockpit lines={lines} />
            <RoiCostCalculator />
          </div>
        )}

        {/* Tab 4: Owner Administrative Audit */}
        {activeTab === "owner" && (
          <div className="space-y-8">
            <OwnerAdminCockpit
              lines={lines}
              calls={calls}
              smsThreads={smsThreads}
              scheduleConfig={scheduleConfig}
              onUpdateSchedule={(newConf) => {
                setScheduleConfig(newConf);
                setPacificStatus(checkPacificBusinessHours(newConf));
                setLogs(prev => [
                  {
                    id: `log-conf-${Date.now()}`,
                    timestamp: new Date().toLocaleTimeString(),
                    type: "SYSTEM",
                    title: "Owner Updated Business Hours Schedule Config",
                    details: { ...newConf },
                    status: "info"
                  },
                  ...prev
                ]);
              }}
            />

            <BlueprintExporter />
          </div>
        )}

      </main>

      {/* Engineering Footer */}
      <Footer />

      {/* Pacific Schedule & TimeGate Simulator Modal */}
      <ScheduleSimulatorModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        config={scheduleConfig}
      />

      {/* Collapsible Execution Log & cURL Drawer */}
      <ExecutionLogDrawer
        logs={logs}
        onClearLogs={() => setLogs([])}
      />

    </div>
  );
}
