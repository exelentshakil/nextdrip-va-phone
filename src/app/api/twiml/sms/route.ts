import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From")?.toString() || "";
    const to = formData.get("To")?.toString() || "";
    const body = formData.get("Body")?.toString() || "";

    const normalized = body.trim().toUpperCase();
    let twimlResponse = "";

    // Centralized TCPA Opt-Out handling across all 20 lines
    if (["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"].includes(normalized)) {
      twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>NextDrip: You have been unsubscribed from all SMS alerts across all 20 service lines. No more messages will be sent. Reply START to resubscribe.</Message>
</Response>`;
    } else if (["HELP", "INFO"].includes(normalized)) {
      twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>NextDrip Concierge Care: For booking support, call ${to}. Msg&data rates may apply. Reply STOP to cancel.</Message>
</Response>`;
    } else if (normalized === "START") {
      twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>NextDrip: Welcome back! You have resubscribed to mobile IV concierge updates. Reply STOP to opt out anytime.</Message>
</Response>`;
    } else {
      // Inbound SMS routed to VA unified inbox - empty response allows webhook dispatch to client app
      twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <!-- Message enqueued into NextDrip Conversations API unified inbox -->
</Response>`;
    }

    return new NextResponse(twimlResponse, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "X-NextDrip-Originating-Line": to
      }
    });
  } catch (err: any) {
    return new NextResponse(
      `<Response><Say>Error processing message</Say></Response>`,
      { status: 500, headers: { "Content-Type": "application/xml" } }
    );
  }
}
