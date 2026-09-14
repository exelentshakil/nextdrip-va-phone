import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ScheduleConfig } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1})?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? `+${match[1]} ` : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return phone;
}

/**
 * Evaluates whether a given date or the current moment falls within VA working hours in Pacific Time (America/Los_Angeles).
 * Handles Daylight Saving Time (PDT vs PST) dynamically using native Intl.DateTimeFormat.
 */
export function checkPacificBusinessHours(
  config: ScheduleConfig,
  targetDate: Date = new Date()
): {
  isVaShift: boolean;
  pacificDayName: string;
  pacificHour: number;
  pacificMinute: number;
  timeString: string;
  routingDestination: "VA_WEBRTC" | "OWNER_IPHONE";
  reason: string;
} {
  // If emergency override is active:
  if (config.emergencyOverride === "FORCE_VA") {
    return {
      isVaShift: true,
      pacificDayName: "Active",
      pacificHour: 10,
      pacificMinute: 0,
      timeString: "Manual VA Override Active",
      routingDestination: "VA_WEBRTC",
      reason: "Owner manually forced all calls to VA WebRTC softphone."
    };
  }

  if (config.emergencyOverride === "FORCE_OWNER") {
    return {
      isVaShift: false,
      pacificDayName: "Active",
      pacificHour: 20,
      pacificMinute: 0,
      timeString: "Manual Owner Override Active",
      routingDestination: "OWNER_IPHONE",
      reason: "Owner manually forced all calls to personal iPhone."
    };
  }

  // Use Intl to extract components in America/Los_Angeles
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: config.timezone || "America/Los_Angeles",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  });

  const parts = formatter.formatToParts(targetDate);
  let weekdayStr = "";
  let hour = 0;
  let minute = 0;

  for (const part of parts) {
    if (part.type === "weekday") weekdayStr = part.value;
    if (part.type === "hour") hour = parseInt(part.value, 10);
    if (part.type === "minute") minute = parseInt(part.value, 10);
  }

  const dayMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  const dayNumber = dayMap[weekdayStr] ?? 0;
  const isAllowedDay = config.vaDays.includes(dayNumber);
  const isAllowedHour = hour >= config.vaStartHour && hour < config.vaEndHour;
  const isVaShift = isAllowedDay && isAllowedHour;

  const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} Pacific (${weekdayStr})`;

  if (isVaShift) {
    return {
      isVaShift: true,
      pacificDayName: weekdayStr,
      pacificHour: hour,
      pacificMinute: minute,
      timeString,
      routingDestination: "VA_WEBRTC",
      reason: `Within VA working shift (Wed-Sun, 8am-4pm Pacific). Routed to VA WebRTC softphone.`
    };
  }

  return {
    isVaShift: false,
    pacificDayName: weekdayStr,
    pacificHour: hour,
    pacificMinute: minute,
    timeString,
    routingDestination: "OWNER_IPHONE",
    reason: `Outside VA hours (${weekdayStr} at ${hour}:${minute.toString().padStart(2, "0")}). Forwarded to Owner personal phone (${config.ownerForwardNumber}).`
  };
}

/**
 * Generates valid Twilio Voice TwiML containing the California two-party consent disclosure
 * played completely BEFORE the dual-channel call recording starts.
 */
export function buildVoiceTwiML(options: {
  disclosureScript: string;
  destination: "VA_WEBRTC" | "OWNER_IPHONE";
  ownerNumber?: string;
  vaClientIdentity?: string;
  callerId: string;
}): string {
  const { disclosureScript, destination, ownerNumber, vaClientIdentity, callerId } = options;

  let dialBlock = "";
  if (destination === "VA_WEBRTC") {
    dialBlock = `  <Dial callerId="${callerId}" record="record-from-answer-dual" recordingStatusCallback="/api/twiml/recording-callback">
    <Client>${vaClientIdentity || "va_sarah_cockpit"}</Client>
  </Dial>`;
  } else {
    dialBlock = `  <Dial callerId="${callerId}" record="record-from-answer-dual" recordingStatusCallback="/api/twiml/recording-callback">
    <Number>${ownerNumber || "+14155550199"}</Number>
  </Dial>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <!-- California Two-Party Consent Disclosure (Penal Code § 632) Plays BEFORE Recording Starts -->
  <Say voice="Polly.Joanna-Neural">${disclosureScript}</Say>
  <Pause length="1"/>
${dialBlock}
</Response>`;
}
