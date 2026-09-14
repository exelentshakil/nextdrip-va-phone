import { NextResponse } from "next/server";

export async function GET() {
  const openaiActive = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-"));
  const geminiActive = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);

  return NextResponse.json({
    status: "healthy",
    system: "NextDrip Twilio VA Phone & SMS Operations Cockpit",
    version: "1.0.0",
    compliance: {
      a2p10DlcCampaign: "CMP-ND-2026-A2P",
      a2pStatus: "APPROVED",
      californiaTwoPartyConsentEnforced: true,
      tcpaOptOutHandlerActive: true,
      registeredDids: 20
    },
    routing: {
      scheduleTimezone: "America/Los_Angeles",
      vaShiftWindow: "Wednesday-Sunday 8:00 AM - 4:00 PM Pacific",
      afterHoursDestination: "Owner Mobile Forward"
    },
    aiProviders: {
      openai: {
        active: openaiActive,
        model: "gpt-4o-mini"
      },
      gemini: {
        active: geminiActive,
        model: "gemini-2.0-flash"
      },
      deterministicFallback: {
        active: true,
        model: "nextdrip-clinical-rules-v1"
      }
    },
    timestamp: new Date().toISOString()
  });
}
