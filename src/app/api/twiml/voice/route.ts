import { NextRequest, NextResponse } from "next/server";
import { buildVoiceTwiML, checkPacificBusinessHours } from "@/lib/utils";
import { DEFAULT_SCHEDULE_CONFIG } from "@/lib/constants";

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  const url = new URL(req.url);
  const callerId = url.searchParams.get("To") || "+13105550142";
  const forceDest = url.searchParams.get("dest") as "VA_WEBRTC" | "OWNER_IPHONE" | null;

  const scheduleCheck = checkPacificBusinessHours(DEFAULT_SCHEDULE_CONFIG);
  const destination = forceDest || scheduleCheck.routingDestination;

  const twiml = buildVoiceTwiML({
    disclosureScript: DEFAULT_SCHEDULE_CONFIG.disclosureScript,
    destination,
    ownerNumber: DEFAULT_SCHEDULE_CONFIG.ownerForwardNumber,
    callerId
  });

  return new NextResponse(twiml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-NextDrip-Routing-Reason": scheduleCheck.reason
    }
  });
}
