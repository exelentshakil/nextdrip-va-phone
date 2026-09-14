import { TwilioLine, CallRecord, SmsThread, ScheduleConfig, ComplianceState } from "./types";

export const TWILIO_LINES_POOL: TwilioLine[] = [
  { id: "line-01", lineIndex: 1, phoneNumber: "+1 (310) 555-0142", e164: "+13105550142", territory: "Beverly Hills", state: "CA", voiceStatus: "ready", callsToday: 14, textsToday: 38, color: "#e11d48" },
  { id: "line-02", lineIndex: 2, phoneNumber: "+1 (310) 555-0158", e164: "+13105550158", territory: "West Hollywood", state: "CA", voiceStatus: "ready", callsToday: 11, textsToday: 29, color: "#f43f5e" },
  { id: "line-03", lineIndex: 3, phoneNumber: "+1 (310) 555-0174", e164: "+13105550174", territory: "Santa Monica", state: "CA", voiceStatus: "ready", callsToday: 19, textsToday: 42, color: "#fb7185" },
  { id: "line-04", lineIndex: 4, phoneNumber: "+1 (949) 555-0112", e164: "+19495550112", territory: "Newport Beach", state: "CA", voiceStatus: "ready", callsToday: 16, textsToday: 34, color: "#ec4899" },
  { id: "line-05", lineIndex: 5, phoneNumber: "+1 (949) 555-0128", e164: "+19495550128", territory: "Laguna Beach", state: "CA", voiceStatus: "ready", callsToday: 9, textsToday: 21, color: "#d946ef" },
  { id: "line-06", lineIndex: 6, phoneNumber: "+1 (619) 555-0193", e164: "+16195550193", territory: "San Diego / La Jolla", state: "CA", voiceStatus: "ready", callsToday: 13, textsToday: 27, color: "#a855f7" },
  { id: "line-07", lineIndex: 7, phoneNumber: "+1 (415) 555-0182", e164: "+14155550182", territory: "San Francisco / Marina", state: "CA", voiceStatus: "ready", callsToday: 12, textsToday: 31, color: "#8b5cf6" },
  { id: "line-08", lineIndex: 8, phoneNumber: "+1 (415) 555-0199", e164: "+14155550199", territory: "Palo Alto / Silicon Valley", state: "CA", voiceStatus: "ready", callsToday: 15, textsToday: 36, color: "#6366f1" },
  { id: "line-09", lineIndex: 9, phoneNumber: "+1 (408) 555-0133", e164: "+14085550133", territory: "San Jose / Santana Row", state: "CA", voiceStatus: "ready", callsToday: 8, textsToday: 19, color: "#3b82f6" },
  { id: "line-10", lineIndex: 10, phoneNumber: "+1 (702) 555-0164", e164: "+17025550164", territory: "Las Vegas / Strip VIP", state: "NV", voiceStatus: "ready", callsToday: 22, textsToday: 54, color: "#0ea5e9" },
  { id: "line-11", lineIndex: 11, phoneNumber: "+1 (702) 555-0181", e164: "+17025550181", territory: "Henderson / Summerlin", state: "NV", voiceStatus: "ready", callsToday: 7, textsToday: 18, color: "#06b6d4" },
  { id: "line-12", lineIndex: 12, phoneNumber: "+1 (480) 555-0189", e164: "+14805550189", territory: "Scottsdale / Paradise Valley", state: "AZ", voiceStatus: "ready", callsToday: 18, textsToday: 41, color: "#14b8a6" },
  { id: "line-13", lineIndex: 13, phoneNumber: "+1 (602) 555-0147", e164: "+16025550147", territory: "Phoenix / Biltmore", state: "AZ", voiceStatus: "ready", callsToday: 10, textsToday: 24, color: "#10b981" },
  { id: "line-14", lineIndex: 14, phoneNumber: "+1 (305) 555-0125", e164: "+13055550125", territory: "Miami / South Beach", state: "FL", voiceStatus: "ready", callsToday: 25, textsToday: 62, color: "#84cc16" },
  { id: "line-15", lineIndex: 15, phoneNumber: "+1 (305) 555-0141", e164: "+13055550141", territory: "Brickell / Downtown Miami", state: "FL", voiceStatus: "ready", callsToday: 17, textsToday: 39, color: "#eab308" },
  { id: "line-16", lineIndex: 16, phoneNumber: "+1 (561) 555-0177", e164: "+15615550177", territory: "Palm Beach Concierge", state: "FL", voiceStatus: "ready", callsToday: 14, textsToday: 33, color: "#f97316" },
  { id: "line-17", lineIndex: 17, phoneNumber: "+1 (212) 555-0118", e164: "+12125550118", territory: "NYC / Tribeca & Soho", state: "NY", voiceStatus: "ready", callsToday: 21, textsToday: 48, color: "#ef4444" },
  { id: "line-18", lineIndex: 18, phoneNumber: "+1 (212) 555-0134", e164: "+12125550134", territory: "NYC / Upper East Side", state: "NY", voiceStatus: "ready", callsToday: 16, textsToday: 35, color: "#f43f5e" },
  { id: "line-19", lineIndex: 19, phoneNumber: "+1 (631) 555-0190", e164: "+16315550190", territory: "The Hamptons Seasonal", state: "NY", voiceStatus: "ready", callsToday: 11, textsToday: 26, color: "#d946ef" },
  { id: "line-20", lineIndex: 20, phoneNumber: "+1 (808) 555-0172", e164: "+18085550172", territory: "Honolulu / Waikiki Luxury", state: "HI", voiceStatus: "ready", callsToday: 6, textsToday: 17, color: "#8b5cf6" }
];

export const DEFAULT_SCHEDULE_CONFIG: ScheduleConfig = {
  vaDays: [0, 3, 4, 5, 6], // Wednesday (3), Thursday (4), Friday (5), Saturday (6), Sunday (0)
  vaStartHour: 8, // 8:00 AM
  vaEndHour: 16, // 4:00 PM (16:00)
  timezone: "America/Los_Angeles", // Pacific Time (handles PDT vs PST automatically)
  ownerForwardNumber: "+1 (415) 555-0199",
  disclosureScript: "This call may be recorded for quality assurance, patient safety, and clinical compliance.",
  optInText: "NextDrip: Reply YES to confirm booking updates & medical concierge alerts. Msg&data rates may apply. Reply STOP to cancel.",
  emergencyOverride: "SCHEDULE"
};

export const INITIAL_COMPLIANCE_STATE: ComplianceState = {
  a2pBrandStatus: "VERIFIED",
  a2pTrustScore: 84,
  campaignStatus: "APPROVED",
  campaignId: "CMP-ND-2026-A2P",
  messagingServiceSid: "MG9a884c0128fa77b09c8112d8a0f912c4",
  registeredNumbersCount: 20,
  tcpaConsentRecordsCount: 1482,
  optOutKeywords: ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"]
};

export const INITIAL_CALL_RECORDS: CallRecord[] = [
  {
    id: "call-001",
    lineId: "line-01",
    lineNumber: "+1 (310) 555-0142",
    lineTerritory: "Beverly Hills",
    customerNumber: "+1 (310) 894-2201",
    customerName: "Victoria Sterling",
    direction: "INBOUND",
    status: "COMPLETED",
    durationSeconds: 184,
    audioDurationStr: "3:04",
    timestamp: "10:14 AM Pacific",
    consentDisclosurePlayed: true,
    routedTo: "VA_WEBRTC",
    clinicalIntent: "NAD_PRICING",
    sentiment: "POSITIVE",
    summary: "Patient inquired about high-dose 750mg NAD+ mobile infusion for tomorrow morning at the Peninsula Hotel. Quoted $850 concierge rate, confirmed nurse availability for 10:30 AM.",
    actionItems: [
      "Book Registered Nurse assigned to Peninsula Beverly Hills for 10:30 AM",
      "Send digital intake & consent form link via SMS to +1 (310) 894-2201",
      "Process $200 deposit hold via Stripe card-on-file"
    ],
    transcription: `[00:00] NextDrip Automated Disclosure: This call may be recorded for quality assurance, patient safety, and clinical compliance.
[00:06] Virtual Assistant (Sarah): Good morning, thank you for calling NextDrip Beverly Hills. My name is Sarah, how may I assist your wellness routine today?
[00:13] Victoria: Hi Sarah, I'm staying at the Peninsula Beverly Hills and looking to get a high-dose NAD+ IV tomorrow morning before an afternoon conference. What is the turnaround and dosing?
[00:24] Virtual Assistant (Sarah): Absolutely, Victoria. We offer our cellular longevity NAD+ infusion in 500mg and 750mg protocols administered by a licensed ICU-certified Registered Nurse. For the 750mg concierge treatment in-suite, the rate is $850 all-inclusive with compounding hydration vitamins.
[00:41] Victoria: Perfect. Let's do the 750mg. Can someone be here at 10:30 AM sharp?
[00:47] Virtual Assistant (Sarah): Yes, our concierge nurse Elena is on Beverly Hills dispatch and can be at your suite at 10:30 AM. I will text you our clinical health intake link right now to confirm medical clearance.`
  },
  {
    id: "call-002",
    lineId: "line-14",
    lineNumber: "+1 (305) 555-0125",
    lineTerritory: "Miami / South Beach",
    customerNumber: "+1 (786) 441-9034",
    customerName: "Marcus Vance",
    direction: "INBOUND",
    status: "COMPLETED",
    durationSeconds: 132,
    audioDurationStr: "2:12",
    timestamp: "9:22 AM Pacific",
    consentDisclosurePlayed: true,
    routedTo: "VA_WEBRTC",
    clinicalIntent: "HYDRATION_APPOINTMENT",
    sentiment: "URGENT",
    summary: "Group hangover & recovery IV request for 4 guests on a yacht docked at Miami Beach Marina. Booked Myers Cocktail plus Glutathione push for 11:30 AM.",
    actionItems: [
      "Dispatch Miami Mobile Rig with 4 Myers Cocktail kits to South Beach Marina",
      "Collect waiver signatures for Marcus and 3 guests upon nurse arrival"
    ],
    transcription: `[00:00] NextDrip Automated Disclosure: This call may be recorded for quality assurance, patient safety, and clinical compliance.
[00:05] Virtual Assistant (Sarah): NextDrip Miami concierge, Sarah speaking. How can we help you feel revitalized?
[00:10] Marcus: Hey, we need urgent recovery drips for 4 people out on a catamaran at South Beach Marina. Everyone is exhausted after Art Basel events.
[00:21] Virtual Assistant (Sarah): We have our rapid-response mobile team ready in Miami Beach. We can provide our Executive Myers Cocktail with 2000mg Glutathione pushes for all four in parallel. Can we dispatch for 11:30 AM?
[00:34] Marcus: Yes, exactly what we need. Please send them down to Slip B-14.`
  },
  {
    id: "call-003",
    lineId: "line-08",
    lineNumber: "+1 (415) 555-0199",
    lineTerritory: "Palo Alto / Silicon Valley",
    customerNumber: "+1 (650) 382-7109",
    customerName: "Dr. Aris Thorne",
    direction: "INBOUND",
    status: "COMPLETED",
    durationSeconds: 98,
    audioDurationStr: "1:38",
    timestamp: "Yesterday 8:40 PM Pacific (After-Hours)",
    consentDisclosurePlayed: true,
    routedTo: "OWNER_IPHONE",
    clinicalIntent: "MEMBERSHIP_INQUIRY",
    sentiment: "POSITIVE",
    summary: "After-hours call routed directly to Owner's iPhone. Biotech founder asking about monthly corporate biohacking retainer for executive team. Owner scheduled Zoom consultation.",
    actionItems: [
      "Owner to send corporate partnership deck to aris@thornebio.com",
      "Follow up with custom proposal for bi-weekly 10-person on-site clinic"
    ],
    transcription: `[00:00] NextDrip Automated Disclosure: This call may be recorded for quality assurance, patient safety, and clinical compliance.
[00:06] Owner Personal Forward (Dr. Julian): Hello, this is Julian with NextDrip Executive Concierge.
[00:11] Dr. Thorne: Good evening Julian, I know it's after hours. Our venture firm in Palo Alto wants to set up bi-weekly NAD+ and peptide therapy for our 8 managing partners.
[00:22] Owner: Excellent Dr. Thorne. We handle several Silicon Valley firms with dedicated RN teams and medical director oversight. Let me email you our enterprise protocol packet tonight.`
  },
  {
    id: "call-004",
    lineId: "line-12",
    lineNumber: "+1 (480) 555-0189",
    lineTerritory: "Scottsdale / Paradise Valley",
    customerNumber: "+1 (480) 902-3341",
    customerName: "Courtney Miller",
    direction: "OUTBOUND",
    status: "COMPLETED",
    durationSeconds: 145,
    audioDurationStr: "2:25",
    timestamp: "8:35 AM Pacific",
    consentDisclosurePlayed: true,
    routedTo: "VA_WEBRTC",
    clinicalIntent: "POST_TREATMENT_FOLLOWUP",
    sentiment: "POSITIVE",
    summary: "VA initiated outbound callback using Scottsdale caller ID (+1 480-555-0189) to check on post-infusion hydration status following yesterday's Iron infusion.",
    actionItems: [
      "Document zero adverse reactions or vein irritation in patient EHR",
      "Schedule next booster for 3 weeks out"
    ],
    transcription: `[00:00] NextDrip Automated Disclosure: This call may be recorded for quality assurance, patient safety, and clinical compliance.
[00:05] Courtney: Hello?
[00:06] Virtual Assistant (Sarah): Hi Courtney, this is Sarah following up from NextDrip Scottsdale on your infusion yesterday with Nurse David. Calling to see how you're feeling this morning!
[00:15] Courtney: Oh thank you Sarah! I feel fantastic, completely energized and zero bruising at the IV site. Thank you for checking in!`
  }
];

export const INITIAL_SMS_THREADS: SmsThread[] = [
  {
    id: "thread-001",
    lineId: "line-01",
    lineNumber: "+1 (310) 555-0142",
    lineTerritory: "Beverly Hills",
    customerNumber: "+1 (310) 492-8819",
    customerName: "Camilla DeLuca",
    lastMessage: "Can the nurse arrive 15 minutes earlier to our Rodeo Dr suite?",
    lastTimestamp: "10:32 AM",
    unreadCount: 1,
    optOutStatus: "OPTED_IN",
    consentTimestamp: "2026-09-12T14:20:10Z",
    consentMethod: "Online Booking Checkbox (TCPA-Compliant)",
    messages: [
      {
        id: "msg-101",
        threadId: "thread-001",
        lineId: "line-01",
        from: "+13105550142",
        to: "+13104928819",
        body: "NextDrip Beverly Hills: Your Beauty Glow IV appointment is confirmed for today at 11:00 AM with Nurse Chloe. Reply HELP for info or STOP to opt out.",
        timestamp: "9:00 AM",
        sender: "SYSTEM",
        deliveryStatus: "DELIVERED"
      },
      {
        id: "msg-102",
        threadId: "thread-001",
        lineId: "line-01",
        from: "+13104928819",
        to: "+13105550142",
        body: "Can the nurse arrive 15 minutes earlier to our Rodeo Dr suite? We have a 12:30 lunch meeting.",
        timestamp: "10:32 AM",
        sender: "CUSTOMER",
        deliveryStatus: "RECEIVED"
      }
    ]
  },
  {
    id: "thread-002",
    lineId: "line-04",
    lineNumber: "+1 (949) 555-0112",
    lineTerritory: "Newport Beach",
    customerNumber: "+1 (949) 882-1405",
    customerName: "Harrison Vance",
    lastMessage: "Yes, please send the pricing for the 5-pack athletic recovery package.",
    lastTimestamp: "10:15 AM",
    unreadCount: 0,
    optOutStatus: "OPTED_IN",
    consentTimestamp: "2026-09-14T09:12:44Z",
    consentMethod: "Web Form Consent",
    messages: [
      {
        id: "msg-201",
        threadId: "thread-002",
        lineId: "line-04",
        from: "+19498821405",
        to: "+19495550112",
        body: "Hi! Do you have packages for triathletes training in Newport?",
        timestamp: "9:45 AM",
        sender: "CUSTOMER",
        deliveryStatus: "RECEIVED"
      },
      {
        id: "msg-202",
        threadId: "thread-002",
        lineId: "line-04",
        from: "+19495550112",
        to: "+19498821405",
        body: "Hi Harrison! NextDrip Newport has our Tri-Endurance 5-pack (high electrolytes, Amino Acids, L-Carnitine + Toradol add-on) for $1,250 ($250 savings). Would you like me to send the details?",
        timestamp: "9:58 AM",
        sender: "VA",
        deliveryStatus: "DELIVERED"
      },
      {
        id: "msg-203",
        threadId: "thread-002",
        lineId: "line-04",
        from: "+19498821405",
        to: "+19495550112",
        body: "Yes, please send the pricing for the 5-pack athletic recovery package.",
        timestamp: "10:15 AM",
        sender: "CUSTOMER",
        deliveryStatus: "RECEIVED"
      }
    ]
  },
  {
    id: "thread-003",
    lineId: "line-10",
    lineNumber: "+1 (702) 555-0164",
    lineTerritory: "Las Vegas / Strip VIP",
    customerNumber: "+1 (702) 419-7720",
    customerName: "Travis Bennett",
    lastMessage: "STOP",
    lastTimestamp: "9:50 AM",
    unreadCount: 0,
    optOutStatus: "OPTED_OUT",
    consentTimestamp: "2026-08-20T11:00:00Z",
    consentMethod: "In-Suite Intake",
    messages: [
      {
        id: "msg-301",
        threadId: "thread-003",
        lineId: "line-10",
        from: "+17025550164",
        to: "+17024197720",
        body: "NextDrip Vegas: We hope you enjoyed your recovery drip at Wynn Las Vegas. Use code VEGASVIP for 15% off next month. Reply STOP to opt out.",
        timestamp: "9:48 AM",
        sender: "SYSTEM",
        deliveryStatus: "DELIVERED"
      },
      {
        id: "msg-302",
        threadId: "thread-003",
        lineId: "line-10",
        from: "+17024197720",
        to: "+17025550164",
        body: "STOP",
        timestamp: "9:50 AM",
        sender: "CUSTOMER",
        deliveryStatus: "RECEIVED"
      },
      {
        id: "msg-303",
        threadId: "thread-003",
        lineId: "line-10",
        from: "+17025550164",
        to: "+17024197720",
        body: "NETWORK COMPLIANCE: NextDrip notifications have been disabled for this number across all 20 lines. Reply START to resubscribe.",
        timestamp: "9:50 AM",
        sender: "SYSTEM",
        deliveryStatus: "DELIVERED"
      }
    ]
  },
  {
    id: "thread-004",
    lineId: "line-17",
    lineNumber: "+1 (212) 555-0118",
    lineTerritory: "NYC / Tribeca & Soho",
    customerNumber: "+1 (917) 604-3391",
    customerName: "Samantha Brooke",
    lastMessage: "Could we do a Myers drip at 4:30 PM today at our Franklin St loft?",
    lastTimestamp: "10:05 AM",
    unreadCount: 1,
    optOutStatus: "OPTED_IN",
    consentTimestamp: "2026-09-10T18:30:15Z",
    consentMethod: "Web Concierge Chat",
    messages: [
      {
        id: "msg-401",
        threadId: "thread-004",
        lineId: "line-17",
        from: "+19176043391",
        to: "+12125550118",
        body: "Could we do a Myers drip at 4:30 PM today at our Franklin St loft?",
        timestamp: "10:05 AM",
        sender: "CUSTOMER",
        deliveryStatus: "RECEIVED"
      }
    ]
  }
];
