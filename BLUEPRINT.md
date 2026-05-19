# GGLoadout — Project Blueprint

## What It Is
AI-powered game store copy generator. Indie devs fill in their game details once, get ready-to-paste marketing copy for multiple platforms.

**Tagline:** Your complete launch kit for indie games.

## Secured Assets
- Domain: ggloadout.com (Namecheap, expires May 2027)
- Subreddit: r/ggloadout
- Email: hello@ggloadout.com (to set up via Cloudflare after deploy)
- X/Twitter: @ggloadout (to claim after email is set up)

---

## Target Users
Indie game developers and small studios publishing on:
- Steam
- itch.io
- Google Play
- Apple App Store

## Problem We Solve
Devs are builders, not writers. Writing platform-specific store copy is painful, repetitive, and different for every platform. Most devs just use raw ChatGPT with no formatting. We give them a purpose-built, formatted, compliance-aware tool.

---

## MVP Features (Phase 1)

### Input Form
- Game name
- Genre (dropdown)
- Core gameplay (what do you actually do?)
- Unique angle (what makes it different?)
- Tone/vibe (chips: Dark / Cozy / Funny / Intense / Chill / Epic)
- Key features (bullet list)
- Target audience
- Platform selector (Steam / itch.io / App Store / Google Play)

### Output
- Tabbed by platform
- Each tab: short description + full description + feature bullets + tags/keywords
- One-click copy per section
- Steam AI disclosure statement (auto-generated, ready to paste)

### Auth & Usage
- Google login via Supabase
- Free tier: 3 generations/day
- Pro tier: unlimited

### Paywall
- Stripe subscription — $9/mo
- Prompt shown when free limit hit

---

## Tech Stack
| Layer | Tool |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Auth | Supabase (Google login) |
| Database | Supabase (usage tracking, user data) |
| AI | Gemini 2.0 Flash (free) → Claude Haiku (after revenue) |
| Payments | Stripe |
| Hosting | Vercel |
| Domain | Namecheap → point to Vercel |
| Email | Cloudflare Email Routing → Gmail |

**Monthly running cost at launch: under $10**

---

## Pages
| Route | Purpose |
|---|---|
| `/` | Landing page — what it is, who it's for, pricing, CTA |
| `/app` | Main tool (logged in) |
| `/pricing` | Pricing breakdown |
| `/dashboard` | Usage history (Pro only) |

---

## Monetization
- **Free:** 3 generations/day, all platforms, no credit card needed
- **Pro — $9/mo:** Unlimited generations, saved history, priority output
- **Target:** 100 paying users = $900 MRR

---

## Competitive Edge
- No dominant multi-platform game copy tool exists
- Closest competitor (Steamkit.dev) is Steam-only and analytics-focused, not copy generation
- We include Steam AI disclosure compliance text — competitors don't
- Purpose-built for game devs, not generic AI copy tools

---

## Launch Sequence
```
Week 1-2:   Build MVP
Week 3:     Internal testing, bug fixes
Week 4:     Soft launch — post in r/gamedev, r/indiegaming
Month 2:    Product Hunt launch
Month 2+:   3 SEO blog posts ("how to write Steam store description")
```

## Setup Order
- [x] r/ggloadout created
- [x] ggloadout.com purchased
- [ ] Next.js project initialized
- [ ] Supabase project created
- [ ] Claude API key added
- [ ] Stripe account connected
- [ ] Site deployed to Vercel
- [ ] Domain pointed to Vercel
- [ ] hello@ggloadout.com set up via Cloudflare
- [ ] @ggloadout X account created

---

## Revenue Targets
| Month | Goal |
|---|---|
| 1 | Launch, 0-10 paying users |
| 2 | Product Hunt spike → 20-50 users → $180-450 MRR |
| 3-4 | SEO traffic → 50-100 users → $450-900 MRR |
| 6+ | Compounding → $1,000-2,000 MRR passive |

---

## AI Model Strategy

### Phase 1 — Gemini 2.0 Flash (Free)
- Free tier: 1,500 requests/day, no credit card needed
- Get API key at aistudio.google.com
- Good enough quality for launch and early users
- $0 cost

### Switch Trigger → Claude Haiku
Switch when ANY of these hit:
- Daily requests approaching 1,000+/day (nearing free limit)
- 15+ paying users ($135+ MRR) — revenue covers API cost
- User feedback says copy quality needs improvement
- Estimated switch cost: ~$20-30/month, fully covered by revenue

### How to Switch
Just swap the API key and model name in one env variable. No code rewrite needed (we'll build it that way from the start).

---

## Cost Monitoring (Set Up After Deploy)
Scheduled Claude agent checks weekly:
- Free generations vs paid conversions ratio
- If free usage is high but conversion is low → send warning to Hellie
- If projected monthly API cost > $50 with < 20 paying users → alert
- Fix: lower free limit from 3/day to 1/day via one config change

Tracked in Supabase: daily_free_generations, daily_paid_generations, conversion_rate

---

## Phase 2 (After Validation)
- Mobile ASO module (bigger market)
- Esports team tools module
- Localization / translation output
- Team/agency pricing tier
- Saved project history
