# Better Half Bites
> A double-blind decision tool for couples who suffer from decision fatigue when picking a restaurant[cite: 3].

**Author:** Christian Gonzalez · **Course:** CMP 464/343 Product 1 · **Last updated:** 11-4-2026[cite: 3]

---

## 1. About Me (the User)[cite: 3]

I am a computer science student building a tool to solve a recurring relationship issue: the frustrating back-and-forth negotiation of choosing a date night restaurant with my girlfriend[cite: 3].

**The last 3 times this happened:**[cite: 3]
1. Trying to pick a place for dinner and both repeating "I don't care, you pick" until we gave up and ordered standard takeout[cite: 3]. 
2. Spending 20 minutes texting Yelp links back and forth only to realize neither of us actually wanted sushi, but we were just trying to be polite[cite: 3]. 

**What it costs me:**[cite: 3]
- ⏱️ Time: 20–30 wasted minutes per occurrence[cite: 3]. 
- 💸 Money: Extra $10-15 for service fees if ordering from a food delivery app[cite: 3].
- 🔋 Energy: High mental drain from decision fatigue[cite: 3]. 
- 🙂 Joy: Turns a fun evening into an annoying chore[cite: 3]. 

---

## 2. Problem Statement[cite: 3]

**Gut check:**[cite: 3]
> I need a double-blind decision tool because my girlfriend and I suffer from decision fatigue when picking a restaurant[cite: 3].

**Five Whys:**[cite: 3]
1. Why? Because we both want to eat out but can't agree on a place[cite: 3]. 
2. Why? Because neither of us wants the pressure of making the final choice and risking a bad meal[cite: 3]. 
3. Why? Because we are afraid of picking something the other person won't actually enjoy[cite: 3]. 
4. Why? Because we don't know what the other is truly craving without explicitly negotiating[cite: 3]. 
5. Why? Because human communication about preferences in relationships is often polite rather than honest[cite: 3]. 

**Problem statement:**[cite: 3]
> **When** it is time to go out for dinner, 
> **I struggle to** quickly agree on a restaurant with my partner, 
> **which costs me** 30 minutes of frustrating back-and-forth and mental energy[cite: 3].
> **This happens because** neither of us wants to make a unilateral decision and risk disappointing the other[cite: 3].
> **Right now I** scroll nearby restaurants on Google Maps, **but** there are too many options to go through plus having to find a place we both want to go to[cite: 3].

**I'll know this is solved when:** We can finalize a dining location in under 3 minutes without anyone asking, "What do you want to eat?"[cite: 3]

---

## 3. Existing Solutions[cite: 3]

| What I use or tried | What it does well | Why it falls short *for me* |
|---|---|---|
| Yelp / Google Maps | Directory of local places with accurate photos and distance. | Experience that still requires me to manually pitch options. |
| Texting links | Easy way to share ideas remotely. | Requires manual feedback and negotiation, which is exactly what causes the friction. |
| Spin-the-wheel apps | Extremely fast and removes the burden of choice entirely. | It might randomly select a place neither of us genuinely wants to go to. |

**The gap:** A real-time, double-blind system that only reveals a restaurant choice if *both* people genuinely want it[cite: 3].

---

## 4. Features & Benefits[cite: 3]

| Feature (what it does) | Benefit (how my life gets better) | MVP or Later? |
|---|---|---|
| Double-blind left/right swiping | Allows honest preferences without fear of judgment. | MVP |
| Real-time match triggers | Instantly stops the search the moment an agreement is reached. | MVP |
| Zero-account session URLs | Completely frictionless startup; no login walls for a hungry partner. | MVP |
| Google Places API Integration | Shows high-quality photos and real data so we know what we are swiping on. | Later |

**MVP (2–3 features):**[cite: 3]
- Tinder-style swipe UI (`react-tinder-card`) linked to a shared session URL[cite: 3].
- Real-time mutual match validation using Supabase WebSockets[cite: 3]. 

**Later:**[cite: 3]
- Distance and price filtering[cite: 3]. 
- A history of our past successful matches[cite: 3]. 

**Not doing:**[cite: 3]
- User accounts, passwords, or profiles[cite: 3]. 

---

## 5. Tech Stack[cite: 3]

### Front end[cite: 3]
- **Surface:** Mobile first web app[cite: 3]
- **Tools:** Next.js (App Router), React, Tailwind CSS, `react-tinder-card`[cite: 3]
- **Why:** I need to be able to text a link to my partner and have the UI load instantly on her phone, behaving exactly like a native app gesture-wise without requiring an App Store download[cite: 3].

### Back end[cite: 3]
| Piece | Choice | Why |
|---|---|---|
| Server / API | Next.js Server Routes | Allows secure querying of the Google Places API without exposing the `.env.local` API key to the browser. |
| Data storage | Supabase (PostgreSQL) | Fast, flat-table inserts for tracking raw left/right swipes per session. |
| Outside services | Supabase Realtime & Google Places API | Realtime WebSockets provide instant cross-device match screens; Places API provides the actual restaurant pool. |
| Hosting / deploy | Vercel | Native, zero-config deployment for Next.js applications. |

### Architecture sketch[cite: 3]
```mermaid
flowchart LR
  U["Me & Partner"] --> FE["Front end: Next.js Client"]
  FE --> API["Back end / API: Next.js Server Route (Google API)"]
  FE --> DB[("Data: Supabase Realtime DB")]