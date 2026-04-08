<p align="center">
  <img src="https://img.shields.io/badge/FieldDictate-Voice%20Job%20Notes-ef4444?style=for-the-badge&logo=microphone&logoColor=white" alt="FieldDictate" />
</p>

<h1 align="center">FieldDictate</h1>

<p align="center">
  <strong>Voice-to-text job notes for field technicians.</strong><br/>
  Speak your notes. AI formats them. One tap to copy.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-Database_&_Auth-3ecf8e?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285f4?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Lemon_Squeezy-Payments-fbbf24?logo=lemon&logoColor=black" alt="Lemon Squeezy" />
</p>

---

## The Problem

Field technicians — plumbers, electricians, HVAC techs — spend their days on job sites, not at desks. When it's time to log what they did, they're sitting in their van typing notes on a tiny phone keyboard. It's slow, error-prone, and nobody wants to do it.

## The Solution

**FieldDictate** lets techs speak their job notes out loud and get back clean, professionally formatted documentation in seconds. No typing. No templates. Just talk and copy.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎙️ **One-Tap Recording** | Massive, high-contrast record button designed for outdoor use |
| 🤖 **AI Formatting** | Gemini 2.5 Flash transcribes and structures notes with headings, bullet points, and sections |
| 📋 **One-Tap Copy** | Formatted note goes straight to clipboard — paste into any CRM, email, or invoice |
| 📜 **Note History** | Browse and copy previously generated notes |
| 🔐 **Secure Auth** | Email/password authentication via Supabase |
| 💳 **Subscription Billing** | Lemon Squeezy checkout overlay with webhook-driven activation |
| 📱 **Mobile-First** | Designed for phones and tablets — big buttons, high contrast, zero clutter |

---

## 🏗️ Tech Stack

```
Frontend        React 18 + Vite 5 + Tailwind CSS 3
Auth & Database Supabase (PostgreSQL + Row Level Security)
AI Engine       Google Gemini 2.5 Flash (audio → structured text)
Payments        Lemon Squeezy (overlay checkout + webhooks)
Hosting         Vercel (auto-deploy from GitHub)
```

---

## 📁 Project Structure

```
fielddictate/
├── public/
├── src/
│   ├── components/
│   │   └── AuthModal.jsx        # Login / Sign Up modal
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state provider
│   ├── lib/
│   │   ├── gemini.js            # Gemini API integration
│   │   └── supabase.js          # Supabase client
│   ├── pages/
│   │   ├── LandingPage.jsx      # Marketing / hero page
│   │   ├── Dashboard.jsx        # Voice recording + AI processing
│   │   ├── History.jsx          # Past notes viewer
│   │   └── Pricing.jsx          # Free / Pro tier comparison
│   ├── App.jsx                  # Routes + protected route logic
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind base + mobile polish
├── supabase/
│   └── functions/
│       └── lemon-squeezy-webhook/
│           └── index.js         # Webhook handler (runs on Supabase Edge)
├── index.html
├── tailwind.config.js
├── vite.config.js
└── .env.example                 # Required environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Supabase](https://supabase.com/) project
- A [Google AI Studio](https://aistudio.google.com/) API key
- A [Lemon Squeezy](https://lemonsqueezy.com/) store (for payments)

### 1. Clone the repo

```bash
git clone https://github.com/geopadev/fielddictate.git
cd fielddictate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_LEMONSQUEEZY_CHECKOUT_URL=https://your-store.lemonsqueezy.com/checkout/buy/...
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Schema

FieldDictate uses three tables in Supabase with Row Level Security enabled:

```sql
-- Users (auto-synced from Supabase Auth via trigger)
users
├── id (uuid, PK)
├── email (text)
├── subscription_active (boolean, default false)
└── created_at (timestamptz)

-- Voice notes
notes
├── id (uuid, PK)
├── user_id (uuid, FK → users.id)
├── raw_transcript (text)
├── formatted_note (text)
└── created_at (timestamptz)

-- Payment webhook audit trail
webhook_logs
├── id (uuid, PK)
├── event_type (text)
├── payload (jsonb)
└── created_at (timestamptz)
```

---

## 💳 Payment Flow

```
User clicks "Subscribe Now"
        ↓
Lemon Squeezy checkout overlay opens (prefilled with email + user_id)
        ↓
User completes payment
        ↓
Lemon Squeezy fires webhook → Supabase Edge Function
        ↓
Edge Function verifies HMAC-SHA256 signature
        ↓
Sets subscription_active = true on the user
        ↓
Logs event to webhook_logs table
```

---

## 🌐 Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to [Vercel](https://vercel.com/)
2. Add the four `VITE_*` environment variables
3. Deploy — Vercel auto-detects Vite

### Webhook (Supabase Edge Functions)

The webhook function is deployed directly to Supabase. Set the `LEMONSQUEEZY_WEBHOOK_SECRET` in your Supabase project's Edge Function Secrets.

### Post-deploy checklist

- [ ] Update **Supabase Auth → Site URL** to your Vercel domain
- [ ] Add `https://yourdomain.vercel.app/**` to **Supabase Auth → Redirect URLs**
- [ ] Verify Lemon Squeezy webhook URL points to your Supabase Edge Function
- [ ] Test the full flow: Sign up → Record → Copy → Subscribe

---

## 📄 License

This project is proprietary. All rights reserved.

---

<p align="center">
  <strong>Built for the field. Not the office.</strong>
</p>
