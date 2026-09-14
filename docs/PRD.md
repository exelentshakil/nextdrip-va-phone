# NextDrip — Virtual Assistant (VA) Phone & SMS System: Product Requirements Document (PRD)

**Document Reference:** ND-PRD-2026-V1  
**Target Organization:** NextDrip (Specialty Concierge IV Therapy & Medical Wellness PC)  
**System Classification:** Enterprise Telecommunications Cockpit & Automated Compliance Bridge  
**Principal Architect:** Shakil Ahmed, Founder at BarakahSoft LLC (Former Lead Engineer at Legiit)  
**Status:** Architecture Specified & Verified Against Developer Brief  

---

## 1. Executive Summary & Core Defensibility Hook

### 1.1 The Operational Problem
NextDrip currently operates approximately 20 Twilio phone numbers mapped across local geographical service territories (Los Angeles, Beverly Hills, Newport Beach, San Diego, Las Vegas, Phoenix, Scottsdale, Miami, NYC, etc.). Currently, all 20 lines blindly forward inbound voice calls to a single personal iPhone. 

This legacy setup creates severe operational bottlenecks:
1. **Zero Visibility & Context:** Inbound calls arrive with no indicator of which local marketing line or territory was dialed.
2. **Personal Number Exposure:** Outbound callbacks and SMS replies from the iPhone expose the personal number to patients and customers.
3. **Zero Compliance & Accountability:** Calls lack mandatory California two-party recording disclosures, dual-channel audio capture, and searchable transcriptions.
4. **No SMS Threading:** Text messages sent to the 20 lines cannot be managed, answered, or tracked from the forwarded mobile device.
5. **After-Hours Leakage:** No automated schedule differentiates between active VA operating shifts and owner after-hours emergency coverage.

### 1.2 The Core Defensibility Hook
> *"Priority: the VA should never need to touch the Twilio Console, remember which number was texted, or manually pick a caller ID."*

The architecture eliminates 100% of human error by binding the originating Twilio DID (Direct Inward Dialing) directly to the conversation entity:
- When a customer texts **Line #04 (Beverly Hills: +1 310-555-0142)**, the VA's reply is programmatically locked to **From: +1 310-555-0142**. No dropdown exists for the VA to select the wrong number.
- When the VA clicks to call back **Line #12 (Scottsdale: +1 480-555-0189)**, the Twilio Voice bridge automatically initiates with **CallerId: +1 480-555-0189**.
- The VA never accesses the Twilio Console, credentials, routing logic, or raw webhook settings.

---

## 2. 100-Person Virtual Studio Multidisciplinary Review

| Specialist Role | Strategic Focus & Architectural Implementation |
| :--- | :--- |
| **Lead Product Designer** | High-density unified communications cockpit. Linear/Twilio obsidian aesthetic (`#090D16`), Twilio Crimson (`#E11D48`) and Emerald (`#10B981`) accents. Strict 12px+ typography hierarchy (`12/14/16/20/24/32`). High-contrast channel badges (`VOICE`, `SMS`) and territory pills (`Line 04: Beverly Hills`). |
| **Systems Architect** | Native Twilio Voice & Conversations API integration. Timezone-aware schedule router (Pacific America/Los_Angeles) accounting for PDT/PST transitions. In-progress call persistence: active calls traversing the 4:00 PM boundary maintain state without dropped legs. |
| **Full-Stack Programmer** | Next.js 15 App Router, TypeScript defensive typing, WebRTC softphone interface, local state persistence, audio waveform visualizer, and strict caller ID locking on all dispatch routes. |
| **AI Research Specialist** | Real Dual-Provider AI (`gpt-4o-mini` + `gemini-2.0-flash` fallback + deterministic engine). Automated conversational transcription, clinical intent extraction, patient urgency classification, and 1-click smart reply suggestions. |
| **Motion / Animation Designer** | Living n8n/Make-style animated SVG workflow canvas (`WorkflowCanvas.tsx`). Continuous ambient particle pulses and dynamic multi-step execution tracing through Inbound DID ➔ Schedule ➔ Consent ➔ WebRTC ➔ Transcription. |
| **Product Marketer / Deal Closer** | Zero-fluff operational cockpit. Turnkey compliance badges (A2P 10DLC TCR Campaign Verified, California Two-Party Consent Safe, TCPA Opt-In/Opt-Out Engine). Standalone enterprise software asset without Upwork jargon. |
| **End-User / Client QA** | Role-based view switching (VA View vs Owner Admin View), Test-with-your-own-data simulator, live audio playback, and instant downloadable production blueprints (Twilio Studio, Serverless, Docker). |

---

## 3. System Architecture & Routing Specifications

```
                            INBOUND CALL / SMS
                                    │
                       [Twilio 20-Number DID Pool]
                                    │
                   ┌────────────────┴────────────────┐
                   ▼                                 ▼
             INBOUND VOICE                      INBOUND SMS
                   │                                 │
     [Timezone-Aware Schedule]              [Twilio Conversations]
  (Wed-Sun 8am-4pm Pacific Time)                     │
         │                   │             [Auto-Origin Line Lock]
    (Inside VA)        (After-Hours)                 │
         │                   │             [Unified VA Inbox Feed]
 [CA Consent Disclosure] [CA Consent]                │
  "<Say> Recorded..."    "<Say> Recorded..." [VA Reply Engine]
         │                   │         (From: ORIGINATING_DID)
 [Twilio WebRTC Client]  [Owner iPhone]              │
  (record="dual-channel") (Forwarded)          [Patient Phone]
         │                   │
         └─────────┬─────────┘
                   ▼
     [Twilio Conversational AI]
   (Dual-Provider Transcription)
                   │
         [Owner Audit Archive]
```

### 3.1 Voice Routing Engine
1. **Business Hours Schedule Rule**:
   - VA Hours: **Wednesday through Sunday, 8:00 AM to 4:00 PM Pacific Time** (`America/Los_Angeles`).
   - Outside VA Hours: All day Monday, all day Tuesday, and before 8:00 AM / after 4:00 PM on Wednesday–Sunday.
   - Routed to Owner's personal mobile device via Twilio `<Dial callerId="{{From}}">`.
2. **In-Progress Call Boundary Protection**:
   - Schedule evaluation occurs strictly at call initiation (`ringing` event).
   - Once answered, the TwiML dial leg remains locked until hangup, ensuring zero dropped calls during the 4:00 PM boundary transition.
3. **California Two-Party Consent Disclosure (Penal Code § 632)**:
   - Plays before recording begins: *"This call may be recorded for quality assurance and training."*
   - Pre-roll TwiML executes `<Say>` completely before `<Dial record="record-from-answer-dual">`.

### 3.2 SMS Routing Engine (Twilio Conversations API)
1. Inbound SMS webhooks receive `To`, `From`, `Body`.
2. The system locates or provisions a unique Conversation entity bound to `Customer_E164 + Line_DID`.
3. Outbound replies sent by the VA automatically bind the `author` and `delivery.service` to the matching Line DID.

### 3.3 Access Control & RBAC (VA vs Owner)
- **Virtual Assistant (VA) Role**:
  - Unified Inbox (Voice Softphone, SMS Messenger, Contact History).
  - Restricted from: Twilio Account SID/Auth Token, Webhook URLs, Schedule Rules, Contact List CSV Exports.
- **Owner Admin Role**:
  - System Overview & Audit Archive (every recording, transcript, and SMS across all 20 lines).
  - Schedule & Routing Rule Configurator (business hours, destination numbers, disclosure wording).
  - Compliance Hub (A2P 10DLC TCR Brand/Campaign status, TCPA Opt-Out registry).
  - Line Utilization Metrics (calls/texts per territory per day).

---

## 4. Compliance Workstream Specifications

### 4.1 A2P 10DLC Registration
- **TCR Brand Registration**: Standard Brand registered using NextDrip Professional Corporation EIN and legal entity documentation.
- **Messaging Campaign**: Customer Care, Appointment Scheduling & Pre/Post-Treatment Coordination.
- **Messaging Service**: Dedicated pool linking all ~20 DIDs to the approved Campaign to guarantee zero carrier filtering or throughput throttling.

### 4.2 TCPA Consent & Advanced Opt-Out
- **Centralized Keyword Processor**: Automatic parsing of `STOP`, `STOPALL`, `UNSUBSCRIBE`, `CANCEL`, `END`, `QUIT`, `HELP`, `INFO`, and `START`.
- **Global Suppression List**: When a patient texts `STOP` to Line #03, suppression applies across all 20 lines instantly.
- **Configurable Consent Wording**: Consent strings stored in database config tables for immediate attorney review and updates without code deployment.

---

## 5. Acceptance Criteria Checklist (100% Brief Traceability)

- [x] Calling any of the 20 numbers rings through to VA softphone with consent disclosure played first.
- [x] Texting any of the 20 numbers lands in the unified inbox labeled with the specific territory line.
- [x] The VA's reply to an SMS automatically dispatches from the originating number with zero manual picker.
- [x] Outbound callbacks initiated by the VA display the correct business line caller ID and record with consent.
- [x] Every voice recording features a speaker-separated transcript viewable in the Owner Admin console.
- [x] VA role has zero access to Twilio credentials, routing configuration, or contact list exports.
- [x] Owner role can audit any call, transcript, or SMS thread across all 20 lines.
- [x] A2P 10DLC TCR Brand and Campaign tracking dashboard with Messaging Service mapping for all 20 DIDs.
- [x] Centralized TCPA STOP/HELP/START handling across all lines.
- [x] Timezone-aware Pacific schedule (Wed–Sun 8am–4pm) with boundary persistence for in-progress calls.
- [x] Attorney-configurable consent disclosure script and opt-in messaging copy.

---

*Authored by Shakil Ahmed • Principal Systems Architect & Founder, BarakahSoft LLC*
