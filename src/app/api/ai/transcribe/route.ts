import { NextRequest, NextResponse } from "next/server";
import { generateAiCallTranscription } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName = "Valued Patient",
      lineNumber = "+1 (310) 555-0142",
      territory = "Beverly Hills",
      durationSeconds = 120,
      callNotesOrSummary = ""
    } = body;

    const result = await generateAiCallTranscription({
      customerName,
      lineNumber,
      territory,
      durationSeconds,
      callNotesOrSummary
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error("AI Transcribe API Route Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to generate transcription"
      },
      { status: 500 }
    );
  }
}
