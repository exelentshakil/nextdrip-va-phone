export type ChannelType = "VOICE" | "SMS";
export type CallDirection = "INBOUND" | "OUTBOUND";
export type CallStatus = "COMPLETED" | "MISSED" | "IN_PROGRESS" | "VOICEMAIL";
export type UserRole = "VA" | "OWNER";

export interface TwilioLine {
  id: string;
  lineIndex: number;
  phoneNumber: string;
  e164: string;
  territory: string;
  state: string;
  voiceStatus: "ready" | "in_call" | "forwarded";
  callsToday: number;
  textsToday: number;
  color: string;
}

export interface CallRecord {
  id: string;
  lineId: string;
  lineNumber: string;
  lineTerritory: string;
  customerNumber: string;
  customerName: string;
  direction: CallDirection;
  status: CallStatus;
  durationSeconds: number;
  timestamp: string;
  audioDurationStr: string;
  recordingUrl?: string;
  consentDisclosurePlayed: boolean;
  routedTo: "VA_WEBRTC" | "OWNER_IPHONE";
  transcription: string;
  summary: string;
  clinicalIntent: 
    | "HYDRATION_APPOINTMENT" 
    | "NAD_PRICING" 
    | "POST_TREATMENT_FOLLOWUP" 
    | "MEMBERSHIP_INQUIRY" 
    | "RESCHEDULE" 
    | "GENERAL";
  actionItems: string[];
  sentiment: "POSITIVE" | "NEUTRAL" | "URGENT";
}

export interface SmsMessage {
  id: string;
  threadId: string;
  lineId: string;
  from: string;
  to: string;
  body: string;
  timestamp: string;
  sender: "CUSTOMER" | "VA" | "SYSTEM";
  deliveryStatus: "DELIVERED" | "SENT" | "RECEIVED";
}

export interface SmsThread {
  id: string;
  lineId: string;
  lineNumber: string;
  lineTerritory: string;
  customerNumber: string;
  customerName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: SmsMessage[];
  optOutStatus: "OPTED_IN" | "OPTED_OUT" | "UNCONFIRMED";
  consentTimestamp?: string;
  consentMethod?: string;
}

export interface ScheduleConfig {
  vaDays: number[]; // 0 = Sun, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  vaStartHour: number; // 8 (8:00 AM)
  vaEndHour: number; // 16 (4:00 PM)
  timezone: string; // "America/Los_Angeles"
  ownerForwardNumber: string;
  disclosureScript: string;
  optInText: string;
  emergencyOverride: "SCHEDULE" | "FORCE_VA" | "FORCE_OWNER";
}

export interface ComplianceState {
  a2pBrandStatus: "VERIFIED" | "PENDING" | "REJECTED";
  a2pTrustScore: number;
  campaignStatus: "APPROVED" | "IN_REVIEW";
  campaignId: string;
  messagingServiceSid: string;
  registeredNumbersCount: number;
  tcpaConsentRecordsCount: number;
  optOutKeywords: string[];
}

export interface AiTranscriptionResult {
  transcript: string;
  summary: string;
  actionItems: string[];
  clinicalIntent: CallRecord["clinicalIntent"];
  sentiment: "POSITIVE" | "NEUTRAL" | "URGENT";
  provider: "openai" | "gemini" | "deterministic-fallback";
  model: string;
  latencyMs: number;
}

export interface AiSmartReplyResult {
  reply: string;
  reasoning: string;
  suggestedAction?: string;
  provider: "openai" | "gemini" | "deterministic-fallback";
  model: string;
  latencyMs: number;
}

export interface PacificStatusResult {
  isVaShift: boolean;
  pacificDayName: string;
  pacificHour: number;
  pacificMinute: number;
  timeString: string;
  routingDestination: "VA_WEBRTC" | "OWNER_IPHONE";
  reason: string;
}
