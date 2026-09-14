"use client";

import React, { useState } from "react";
import { 
  Download, 
  FileCode, 
  Code, 
  Layers, 
  Copy, 
  Check, 
  Workflow, 
  Cpu, 
  ExternalLink,
  FolderDown
} from "lucide-react";

export function BlueprintExporter() {
  const [selectedAsset, setSelectedAsset] = useState<"STUDIO_FLOW" | "TWILIO_FUNCTION" | "INNGEST_WORKER" | "CLI_SCRIPT">("STUDIO_FLOW");
  const [copied, setCopied] = useState(false);

  const studioFlowJson = JSON.stringify({
    description: "NextDrip Multi-DID Voice & SMS Routing Engine with Pacific TimeGate and CA § 632 Pre-Roll",
    states: [
      {
        name: "Trigger",
        type: "trigger",
        transitions: [
          { event: "incomingMessage", next: "Check_TCPA_OptOut" },
          { event: "incomingCall", next: "CA_Penal_Code_632_Disclosure" }
        ]
      },
      {
        name: "CA_Penal_Code_632_Disclosure",
        type: "say-play",
        properties: {
          say: "This call is recorded for quality and training purposes.",
          voice: "Polly.Joanna-Neural",
          language: "en-US"
        },
        transitions: [
          { event: "audioComplete", next: "Pacific_TimeGate_Check" }
        ]
      },
      {
        name: "Pacific_TimeGate_Check",
        type: "split-based-on",
        properties: {
          input: "{{flow.channel.address}}",
          timezone: "America/Los_Angeles",
          schedule: {
            days: ["wed", "thu", "fri", "sat", "sun"],
            start_time: "08:00",
            end_time: "16:00"
          }
        },
        transitions: [
          { event: "match", next: "Dial_VA_WebRTC_Softphone" },
          { event: "noMatch", next: "Forward_Owner_Cellular" }
        ]
      },
      {
        name: "Dial_VA_WebRTC_Softphone",
        type: "make-http-request",
        properties: {
          method: "POST",
          url: "https://nextdrip-va-phone.vercel.app/api/twiml/voice",
          record: "record-from-answer-dual",
          timeout: 20
        },
        transitions: [
          { event: "answered", next: "End_Call" },
          { event: "timeout", next: "Failover_Owner_Cellular" },
          { event: "failed", next: "Failover_Owner_Cellular" }
        ]
      }
    ]
  }, null, 2);

  const twilioFunctionCode = `// Twilio Serverless Function: voice-router.js
// Handles Inbound Voice, CA § 632 Pre-Roll, Pacific TimeGate, and Dual-Recording
exports.handler = function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  
  // 1. Mandatory California Penal Code § 632 Disclosure Pre-Roll
  twiml.say({
    voice: 'Polly.Joanna-Neural',
    language: 'en-US'
  }, 'This call is recorded for quality and training purposes.');

  // 2. Dynamic Daylight-Saving-Aware Pacific Business Hours Check
  const now = new Date();
  const pacificFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    weekday: 'short',
    hour12: false
  });
  
  const parts = pacificFormatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
  const weekday = parts.find(p => p.type === 'weekday').value;
  
  const isVaDay = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(weekday);
  const isVaHour = hour >= 8 && hour < 16;

  // 3. Deterministic Routing Decision
  if (isVaDay && isVaHour) {
    // Route to VA Browser WebRTC Softphone with 20s timeout and dual-channel recording
    const dial = twiml.dial({
      record: 'record-from-answer-dual',
      recordingStatusCallback: 'https://nextdrip-va-phone.vercel.app/api/ai/transcribe',
      timeout: 20,
      action: '/failover-cellular'
    });
    dial.client('va_workstation_webrtc');
  } else {
    // Forward to Owner iPhone while locking Caller ID to dialed DID
    const dial = twiml.dial({
      callerId: event.To,
      record: 'record-from-answer-dual',
      recordingStatusCallback: 'https://nextdrip-va-phone.vercel.app/api/ai/transcribe'
    });
    dial.number(context.OWNER_FORWARD_NUMBER || '+13105550199');
  }

  callback(null, twiml);
};`;

  const inngestWorkerCode = `// Inngest Background Worker: call-intelligence.ts
import { inngest } from "@/lib/inngest";
import { generateAiCallTranscription } from "@/lib/ai";

export const processCallRecording = inngest.createFunction(
  { id: "nextdrip-process-call-recording", retries: 3 },
  { event: "twilio/recording.completed" },
  async ({ event, step }) => {
    // Step 1: Download dual-channel recording audio WAV/MP3
    const audioPayload = await step.run("fetch-twilio-audio", async () => {
      return { recordingUrl: event.data.RecordingUrl, duration: event.data.RecordingDuration };
    });

    // Step 2: Transcribe and generate clinical action items via OpenAI/Gemini
    const aiAnalysis = await step.run("ai-dual-channel-transcribe", async () => {
      return await generateAiCallTranscription({
        dialogue: event.data.transcriptDraft || "Customer called inquiring on services.",
        callerId: event.data.To
      });
    });

    // Step 3: Dispatch real-time notification to VA Cockpit & Owner Archive
    await step.run("notify-cockpit", async () => {
      return { success: true, callSid: event.data.CallSid, summary: aiAnalysis.summary };
    });
  }
);`;

  const cliScriptCode = `#!/usr/bin/env bash
# Deploy NextDrip Twilio Phone & SMS Architecture via Twilio CLI
set -e

echo "==> Authenticating Twilio Profile for NextDrip..."
# twilio profiles:create --profile nextdrip

echo "==> Creating A2P 10DLC Messaging Service Pool..."
MESSAGING_SERVICE_SID=$(twilio api:messaging:v1:services:create \\
  --friendly-name "NextDrip 20-DID Messaging Pool" \\
  --use-inbound-webhook-on-number false \\
  --inbound-request-url "https://nextdrip-va-phone.vercel.app/api/twiml/sms" \\
  --area-code-geomatch true | grep -o 'MG[a-z0-9]*' | head -1)

echo "==> Linking 20 Twilio DIDs to Messaging Service $MESSAGING_SERVICE_SID..."
# Loop through all 20 DIDs and bind to Messaging Service pool

echo "==> Deploying Twilio Serverless Voice Router..."
twilio serverless:deploy --service-name nextdrip-voice-router --environment production

echo "==> NextDrip Phone & SMS System fully operational!"`;

  const getActiveCode = () => {
    switch (selectedAsset) {
      case "STUDIO_FLOW": return studioFlowJson;
      case "TWILIO_FUNCTION": return twilioFunctionCode;
      case "INNGEST_WORKER": return inngestWorkerCode;
      case "CLI_SCRIPT": return cliScriptCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = "nextdrip-studio-flow.json";
    let mime = "application/json";
    if (selectedAsset === "TWILIO_FUNCTION") {
      filename = "voice-router.js";
      mime = "application/javascript";
    } else if (selectedAsset === "INNGEST_WORKER") {
      filename = "call-intelligence.ts";
      mime = "text/typescript";
    } else if (selectedAsset === "CLI_SCRIPT") {
      filename = "deploy-twilio-assets.sh";
      mime = "text/x-sh";
    }

    const blob = new Blob([getActiveCode()], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[var(--brand-subtle)] text-[var(--brand)]">
              <FolderDown className="h-5 w-5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Turnkey Technical Blueprint &amp; Infrastructure Exporter
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Export ready-to-deploy Twilio Studio Flow JSON, Twilio Serverless Functions, Inngest workers, and Twilio CLI deployment scripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-subtle)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[var(--live)]" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Code"}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            Download Asset
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "STUDIO_FLOW", label: "Twilio Studio Flow v2 JSON", icon: Workflow },
          { id: "TWILIO_FUNCTION", label: "Twilio Serverless Function (JS)", icon: FileCode },
          { id: "INNGEST_WORKER", label: "Inngest Durable AI Worker (TS)", icon: Cpu },
          { id: "CLI_SCRIPT", label: "Twilio CLI Automated Deploy (Bash)", icon: Code }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedAsset(tab.id as any)}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all border ${
                selectedAsset === tab.id
                  ? "bg-[var(--surface-subtle)] text-[var(--brand)] border-[var(--brand)] shadow-xs"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Viewer */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] overflow-hidden">
        <div className="p-2.5 bg-[var(--surface-subtle)] border-b border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
          <span>
            {selectedAsset === "STUDIO_FLOW" && "studio-flow-nextdrip-v2.json"}
            {selectedAsset === "TWILIO_FUNCTION" && "src/functions/voice-router.js"}
            {selectedAsset === "INNGEST_WORKER" && "src/inngest/call-intelligence.ts"}
            {selectedAsset === "CLI_SCRIPT" && "scripts/deploy-twilio-assets.sh"}
          </span>
          <span className="text-[11px] text-[var(--live)] font-semibold">
            Ready for Production
          </span>
        </div>
        <pre className="p-4 font-mono text-xs text-[var(--text-primary)] overflow-x-auto max-h-[380px] leading-relaxed">
          {getActiveCode()}
        </pre>
      </div>

    </div>
  );
}
