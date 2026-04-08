# AGENTS.md - System Directive: "FieldDictate"

## 1. Vision & Scope
* **Application Name:** FieldDictate
* **Target Audience:** Field technicians (plumbers, electricians, HVAC) who need to log detailed job notes from their vans using mobile devices.
* **Minimum Viable Product (MVP) Boundaries:** A mobile-responsive web application that allows users to record their voice, uses an AI API to transcribe and format the speech into structured, professional job notes, and allows one-click copying to their clipboard or CRM.
* **Constraint:** Do not build internal CRMs or complex project management features. The core utility is strict, fast voice-to-text formatting. [cite_start]This prevents feature creep.

## 2. Design System
* **Framework:** React with Tailwind CSS.
* [cite_start]**Typography:** Inter or Roboto for maximum legibility.
* **UI/UX Philosophy:** "Big buttons, high contrast." Technicians are using this outdoors or in trucks.
* **Color Palette:** * Background: Slate-50 (Clean, low glare)
    * Primary Action (Record): Red-500 (Obvious, standard recording color)
    * Secondary Action (Copy/Export): Emerald-600 
    * Text: Slate-900
* [cite_start]**Agent Instruction:** Ensure all UI components match this aesthetic consistently across all pages.

## 3. Data Structure
* [cite_start]**Database:** Supabase or Neon (to be integrated via Antigravity MCP)[cite: 83].
* [cite_start]**Schema Rules:** Provide a rigid framework for backend logic to minimize connection errors[cite: 68].
* **Tables:**
    1.  `users`: id, email, created_at, subscription_active (boolean)
    2.  `notes`: id, user_id, raw_transcript, formatted_note, created_at
    3.  `webhook_logs`: id, event_type, payload (For Lemon Squeezy integration)

## 4. Component Trees & Routing
* [cite_start]**Instruction:** Build interconnected pages that correctly route data without human intervention[cite: 68].
* `/` (Landing Page): Value proposition and Login/Signup button.
* `/dashboard` (Core App): 
    * Massive "Tap to Record" microphone button component.
    * Loading state component (while AI processes).
    * Result text area with a "Copy to Clipboard" button.
* `/history`: A simple list view of past generated notes fetched from the database.
* [cite_start]`/pricing`: A simple tier page to trigger the Lemon Squeezy checkout overlay[cite: 167].

## 5. Monetization & Execution Rules
* **Payment Gateway:** Lemon Squeezy.
* [cite_start]**Webhook Requirement:** Listen for `subscription_created` or `payment_success` webhooks to automatically update the user's `subscription_active` status to `true`[cite: 174, 176].
* [cite_start]**Agent Execution Workflow:** Execute tasks using a "Plan-and-Execute" topology[cite: 72]. Before writing code, propose a step-by-step plan. [cite_start]Wait for human authorization via artifact review before proceeding to the next step[cite: 74, 75].