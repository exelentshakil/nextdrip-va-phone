import { NextRequest, NextResponse } from "next/server";
import { generateAiSmartReply } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName = "Valued Patient",
      territory = "Beverly Hills",
      lineNumber = "+1 (310) 555-0142",
      lastCustomerMessage = "",
      conversationHistory = []
    } = body;

    if (!lastCustomerMessage) {
      return NextResponse.json(
        { error: "lastCustomerMessage is required" },
        { status: 400 }
      );
    }

    const result = await generateAiSmartReply({
      customerName,
      territory,
      lineNumber,
      lastCustomerMessage,
      conversationHistory
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error("AI Reply API Route Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to generate AI response"
      },
      { status: 500 }
    );
  }
}
