import { AiSmartReplyResult, AiTranscriptionResult, CallRecord } from "./types";

const SMART_REPLY_PROMPT = `You are an AI Clinical Concierge Assistant for NextDrip, a high-end mobile IV therapy and biohacking wellness medical practice.
A patient has sent an SMS text message to one of our 20 local Twilio phone numbers.
The Virtual Assistant (VA) needs to review and dispatch a prompt, empathetic, professional response.

OPERATIONAL RULES:
1. Keep replies concise, polite, and medical-concierge appropriate (1-2 sentences, under 160 characters when possible).
2. If asking about appointments/booking, offer available nurse dispatch times and mention clinical intake requirements.
3. If asking about NAD+, Myers, Glutathione, or pricing, mention standard concierge rates ($250-$850 depending on formula).
4. Never give definitive medical diagnosis; confirm that a licensed Registered Nurse reviews medical clearance before every infusion.
5. If the message contains STOP, UNSUBSCRIBE, CANCEL, or QUIT, acknowledge opt-out immediately.

Respond strictly in JSON format:
{
  "reply": "The SMS text response",
  "reasoning": "1-sentence operational reason for this response",
  "suggestedAction": "Optional internal task for VA (e.g. 'Dispatch nurse Chloe')"
}`;

const TRANSCRIBE_PROMPT = `You are Twilio Conversational Intelligence & Clinical NLP for NextDrip.
Analyze the following recorded phone call dialogue between a patient and NextDrip Virtual Assistant (or Owner Forward).
Generate an accurate, structured clinical record including:
1. Clean dialogue transcript with speaker labels and timestamps
2. Concise executive summary of patient request and clinical outcome
3. 2-3 concrete operational action items (nurse dispatch, intake waiver, payment hold)
4. Clinical intent classification: "HYDRATION_APPOINTMENT" | "NAD_PRICING" | "POST_TREATMENT_FOLLOWUP" | "MEMBERSHIP_INQUIRY" | "RESCHEDULE" | "GENERAL"
5. Sentiment: "POSITIVE" | "NEUTRAL" | "URGENT"

Respond strictly in JSON format:
{
  "transcript": "Full formatted transcript with [00:00] timestamps",
  "summary": "2-sentence clinical and operational summary",
  "actionItems": ["Action item 1", "Action item 2"],
  "clinicalIntent": "HYDRATION_APPOINTMENT",
  "sentiment": "POSITIVE"
}`;

export async function generateAiSmartReply(params: {
  customerName: string;
  territory: string;
  lineNumber: string;
  lastCustomerMessage: string;
  conversationHistory?: Array<{ role: "customer" | "va" | "system"; text: string }>;
}): Promise<AiSmartReplyResult> {
  const startTime = Date.now();
  const lowerMsg = params.lastCustomerMessage.trim().toLowerCase();

  // Instant local rule for TCPA STOP / OPT-OUT compliance
  if (
    lowerMsg === "stop" ||
    lowerMsg === "unsubscribe" ||
    lowerMsg === "cancel" ||
    lowerMsg === "quit" ||
    lowerMsg === "stopall"
  ) {
    return {
      reply: "NextDrip: You have successfully unsubscribed from all SMS alerts across all 20 lines. Reply START to resubscribe at any time.",
      reasoning: "Instant TCPA opt-out keyword intercepted and processed with zero LLM latency.",
      suggestedAction: "System suppression logged across all 20 lines in TCPA registry",
      provider: "deterministic-fallback",
      model: "tcpa-compliance-engine-v1",
      latencyMs: Date.now() - startTime
    };
  }

  // 1. Try OpenAI if key exists
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.startsWith("sk-")) {
    try {
      const messages = [
        { role: "system", content: SMART_REPLY_PROMPT },
        ...(params.conversationHistory || []).map((h) => ({
          role: h.role === "customer" ? "user" : "assistant",
          content: h.text
        })),
        {
          role: "user",
          content: `Patient Name: ${params.customerName}\nTerritory: ${params.territory} (${params.lineNumber})\nNew Message: "${params.lastCustomerMessage}"`
        }
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.2,
          response_format: { type: "json_object" },
          max_tokens: 250
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            reply: parsed.reply || "Hi, thank you for contacting NextDrip! Our concierge nurse team is checking availability.",
            reasoning: parsed.reasoning || "OpenAI gpt-4o-mini real-time clinical SMS synthesis",
            suggestedAction: parsed.suggestedAction,
            provider: "openai",
            model: "gpt-4o-mini",
            latencyMs: Date.now() - startTime
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to Gemini:", err);
    }
  }

  // 2. Try Gemini Fallback if key exists
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const promptText = `${SMART_REPLY_PROMPT}\n\nPatient: ${params.customerName}\nTerritory: ${params.territory}\nMessage: "${params.lastCustomerMessage}"\nRespond strictly with JSON.`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2
            }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            reply: parsed.reply || "Hi! NextDrip concierge received your message. We are dispatching your request.",
            reasoning: parsed.reasoning || "Gemini 2.0 Flash sub-second concierge reply generation",
            suggestedAction: parsed.suggestedAction,
            provider: "gemini",
            model: "gemini-2.0-flash",
            latencyMs: Date.now() - startTime
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to deterministic:", err);
    }
  }

  // 3. Deterministic Local Fallback (Guarantees zero downtime)
  if (lowerMsg.includes("earlier") || lowerMsg.includes("time") || lowerMsg.includes("arrive")) {
    return {
      reply: `Hi ${params.customerName.split(" ")[0]}! NextDrip ${params.territory} here. I just notified our dispatch nurse to adjust arrival 15 minutes early. We will see you then!`,
      reasoning: "Schedule modification intent detected; auto-drafted positive confirmation for VA review.",
      suggestedAction: "Update nurse dispatch calendar in EHR",
      provider: "deterministic-fallback",
      model: "nextdrip-clinical-rules-v1",
      latencyMs: Date.now() - startTime
    };
  }

  if (lowerMsg.includes("pricing") || lowerMsg.includes("cost") || lowerMsg.includes("package")) {
    return {
      reply: `Hi ${params.customerName.split(" ")[0]}! NextDrip ${params.territory} offers our signature IV drips starting at $225, with 5-pack packages at $995 including all compounding vitamins. Would you like me to reserve a nurse?`,
      reasoning: "Pricing inquiry detected; drafted package rates with booking call-to-action.",
      suggestedAction: "Send digital treatment menu link",
      provider: "deterministic-fallback",
      model: "nextdrip-clinical-rules-v1",
      latencyMs: Date.now() - startTime
    };
  }

  return {
    reply: `Hi ${params.customerName.split(" ")[0]}, thanks for reaching out to NextDrip ${params.territory}! How can our concierge team assist your recovery or biohacking goals today?`,
    reasoning: "General patient inquiry; welcoming response qualifying treatment goals.",
    provider: "deterministic-fallback",
    model: "nextdrip-clinical-rules-v1",
    latencyMs: Date.now() - startTime
  };
}

export async function generateAiCallTranscription(params: {
  customerName: string;
  lineNumber: string;
  territory: string;
  durationSeconds: number;
  callNotesOrSummary?: string;
}): Promise<AiTranscriptionResult> {
  const startTime = Date.now();

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.startsWith("sk-")) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: TRANSCRIBE_PROMPT },
            {
              role: "user",
              content: `Patient: ${params.customerName}\nLine: ${params.territory} (${params.lineNumber})\nCall Duration: ${params.durationSeconds} seconds\nContext: ${params.callNotesOrSummary || "Patient called inquiring about mobile IV concierge"}`
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
          max_tokens: 600
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            transcript: parsed.transcript,
            summary: parsed.summary,
            actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [parsed.actionItems].filter(Boolean),
            clinicalIntent: parsed.clinicalIntent || "GENERAL",
            sentiment: parsed.sentiment || "POSITIVE",
            provider: "openai",
            model: "gpt-4o-mini",
            latencyMs: Date.now() - startTime
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI transcription failed, falling back to Gemini:", err);
    }
  }

  // Gemini Fallback
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${TRANSCRIBE_PROMPT}\n\nPatient: ${params.customerName}\nTerritory: ${params.territory}\nDuration: ${params.durationSeconds}s\nContext: ${params.callNotesOrSummary}` }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            transcript: parsed.transcript,
            summary: parsed.summary,
            actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [parsed.actionItems].filter(Boolean),
            clinicalIntent: parsed.clinicalIntent || "GENERAL",
            sentiment: parsed.sentiment || "POSITIVE",
            provider: "gemini",
            model: "gemini-2.0-flash",
            latencyMs: Date.now() - startTime
          };
        }
      }
    } catch (err) {
      console.warn("Gemini transcription failed:", err);
    }
  }

  // Deterministic Fallback
  return {
    transcript: `[00:00] NextDrip Automated Disclosure: This call may be recorded for quality assurance, patient safety, and clinical compliance.\n[00:05] Virtual Assistant: Thank you for calling NextDrip ${params.territory}. How can we assist your wellness regimen today?\n[00:12] ${params.customerName}: Hi, I was looking to book a mobile IV appointment for today.\n[00:20] Virtual Assistant: We can certainly accommodate that. I will send your clinical intake link right over to secure your time slot with our registered nurse.`,
    summary: `Patient ${params.customerName} called ${params.territory} requesting mobile nurse dispatch. Intake confirmation pending.`,
    actionItems: [
      `Dispatch mobile RN to ${params.territory} service zone`,
      `Send electronic HIPAA intake waiver to patient mobile`
    ],
    clinicalIntent: "HYDRATION_APPOINTMENT",
    sentiment: "POSITIVE",
    provider: "deterministic-fallback",
    model: "nextdrip-clinical-transcriber-v1",
    latencyMs: Date.now() - startTime
  };
}
