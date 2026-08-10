# Royal Home Solutions — Project Handover

Real-estate landing page recreating the Framer "Havenly" template, rebuilt as a
clean, production-ready Next.js app. This document reflects the project's status
as of the latest update.

---

## 1. Status at a glance

| Area | Status |
| --- | --- |
| All landing sections (1–10) | ✅ Implemented |
| Responsive (mobile / tablet / desktop) | ✅ |
| Lint (`next lint`) | ✅ No warnings or errors |
| Production build (`next build`) | ✅ Compiles, 4/4 static pages prerendered |
| Tests (`npm test`) | ✅ 105 passing (anti-bot protection) |
| Form spam protection | ✅ Cloudflare Turnstile — **needs env vars set before deploy**, see §9d |
| Deployment-ready (Vercel) | ✅ |

The site is **feature-complete** for all screenshots provided so far. Remaining
work is polish / real backend wiring (see §8).

---

## 2. Tech stack

- **Next.js 14.2.x** (App Router) — pinned to a security-patched 14.2 release
- **TypeScript** (strict mode)
- **Tailwind CSS v3** (custom brand tokens)
- **Framer Motion v11** (scroll reveals, carousels, marquees)
- **lucide-react** (icon system)
- Inter font via `next/font/google`
- Images via `next/image` (Unsplash remote + one local asset)

---

## 3. Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npm test         # vitest — anti-bot protection suite
```

Requires Node 18+ (developed on Node 24).

Copy `.env.example` to `.env.local` before running the forms locally. It ships
with Cloudflare's public **test** Turnstile keys so submissions work out of the
box on a dev machine — see §9d before deploying.

---

## 4. Project structure

```
app/
  layout.tsx          # Root layout, Inter font, metadata, <body>
  page.tsx            # Composes all sections in order
  globals.css         # Tailwind layers + .no-scrollbar utility

components/
  layout/
    Navbar.tsx        # Fixed nav, transparent→ink on scroll, mobile menu
    Footer.tsx        # Links, newsletter form, socials, copyright
  sections/
    HeroSection.tsx
    TrustSection.tsx
    WhyChooseSection.tsx
    PropertyListingsSection.tsx
    BuyingProcessSection.tsx
    ValueSection.tsx
    TestimonialsSection.tsx
    BlogSection.tsx
    CTASection.tsx
  cards/
    PropertyCard.tsx
    FeatureItem.tsx      # "Why choose" list row
    ValueCard.tsx        # Value-grid feature card
    TestimonialCard.tsx
    BlogCard.tsx
  ui/
    Button.tsx           # Pill CTA (yellow / white / dark / ghost), optional arrow
    SectionHeading.tsx   # Animated heading (left / center)
    CarouselControls.tsx # Prev/next circular buttons (outline / yellow)
    StarRating.tsx       # Green stars, supports halves

data/
  properties.ts       # Listing carousel data + Property type
  processSteps.ts     # Buying-process steps + slides
  whyChoose.ts        # Why-choose items, trust stats, gallery images
  valueFeatures.ts    # Value-grid features (left/right) + slider images
  testimonials.ts     # Testimonial carousel data
  blog.ts             # Blog post previews

lib/
  utils.ts            # cn() classname combiner, formatPrice()

public/
  Assets/Images/
    Hero-background.jpeg   # Local hero image
```

---

## 5. Sections (in page order)

1. **Hero** (`HeroSection`) — full-screen local background image
   (`/Assets/Images/Hero-background.jpeg`), dark gradient overlay, trust badge
   (avatars + stars), headline "Find your dream home with Havenly", yellow CTA.
2. **Trust / Stats** (`TrustSection`) — two-column header, 4 green stats, and a
   **full-bleed horizontal auto-slider** of images (left→right, seamless loop).
3. **Why Choose** (`WhyChooseSection`) — centered heading, overlapping images +
   hand-drawn yellow SVG scribble, vertical dashed-connector feature list.
4. **Property Listings** (`PropertyListingsSection`) — header + "View All
   Properties", data-driven peeking-card carousel with arrow controls.
5. **Buying Process** (`BuyingProcessSection`) — green section, 4-step timeline
   (clickable, fills up to active step), white slide card with checklist + arrow
   controls. Timeline tracks the active slide.
6. **Value** (`ValueSection`) — "Unlock more value", 3-column grid: feature
   cards left/right, **vertical auto-slider** of images in the center.
7. **Testimonials** (`TestimonialsSection`) — centered heading, 2-up centered
   carousel of testimonial cards, arrow controls.
8. **Blog** (`BlogSection`) — header + "View All Blog", 3 article cards.
9. **CTA** (`CTASection`) — dark image banner, "Get in touch – find your dream
   home today!", yellow CTA.
10. **Footer** (`Footer`) — brand + contact, Landings / Information columns,
    working newsletter form (controlled input + success state), social icons,
    Royal Home Solutions copyright.

---

## 6. Design system

Defined in `tailwind.config.ts`:

| Token | Value | Use |
| --- | --- | --- |
| `brand.yellow` | `#F5CE3E` | Primary CTAs, icon circles |
| `brand.yellow-dark` | `#E9BF2A` | Yellow hover |
| `brand.green` | `#22A24B` | Stats, badges, process section, stars |
| `brand.green-dark` | `#1B8C3F` | Green hover |
| `brand.ink` | `#0D0D0D` | Primary text / dark buttons |
| `max-w-8xl` | `88rem` | Page container width |
| `rounded-4xl` | `2rem` | Large card radius |

- Headings: Inter, semibold, tight tracking.
- Section padding rhythm: `py-20 lg:py-28`.
- Reusable primitives (`Button`, `SectionHeading`, `CarouselControls`,
  `StarRating`) are used everywhere — **avoid duplicating card/button markup**.

### Animation patterns
- **Scroll reveals:** `whileInView` fade-up on headings and cards.
- **Horizontal marquee** (Trust): duplicated list, `x: -50% → 0%`, linear infinite.
- **Vertical marquee** (Value): duplicated list, absolutely-positioned track,
  `y: -50% → 0%`, linear infinite. Track is absolute so it doesn't inflate the
  grid row height.
- All marquees respect `prefers-reduced-motion` (disabled when set).

---

## 7. Carousel implementation notes

Two carousel styles are in use:

- **Scroll-based** (Property listings, Testimonials): a horizontal
  `overflow-x-auto` flex track with scroll-snap; arrow buttons call
  `scrollBy()` by one card width. Native swipe works on mobile.
- **Index-based** (Buying process): React state `index`, arrows do modulo
  wrap-around, `AnimatePresence` cross-fades the slide; the step timeline reads
  the same `index`.

When changing card counts/widths, keep card width math consistent
(e.g. `lg:w-[calc((100%-1.5rem)/2)]` for 2-up with a 1.5rem gap).

---

## 8. Content & deviations from the screenshots

Intentional fixes applied (consistent with the "fix obvious errors" request):

- "Hassel-Free" → **"Hassle-Free Purchase"**, "Guaratee" → **"Buyback Guarantee"**.
- "Purshasing" → **"Purchasing"** (testimonial role).
- Duplicate "Market comparison" value card → second renamed **"Risk insights"**
  (its copy is about seismic/flood risk).
- Footer: removed the "Made in Framer" badge and "Template by Themeflow · Powered
  by Framer" credit; uses a Royal Home Solutions copyright and the contact
  address recorded under **Branding** below.
- Added a 4th buying-process slide ("Buy back with confidence") so all four
  timeline steps map 1:1 to slides.

### Branding
- The brand is **Royal Home Solutions, Inc.** The logo
  (`public/Assets/Images/Logo.png`, transparent RGBA) is used in two treatments:
  - **Navbar** (transparent header over the dark hero): rendered as a clean
    white/monochrome mark via Tailwind `brightness-0 invert` — no background box.
  - **Footer** (white background): the original full-color logo, directly placed.
  Use the **full-color** logo only on light/white backgrounds; use the
  **white/inverted** treatment on dark backgrounds. Copyright and page metadata
  use the company name. The old placeholder text-mark has been removed.
- The copy rebrand is complete — no "Havenly" references remain in any component
  or `data/*.ts` file. The mentions elsewhere in this document are describing the
  template the site was rebuilt from, not live copy.
- The footer contact address is `jonah@royalhomesolutions.com` and the stated
  location is **Florida**. `leads@royalhomesolutions.com` is a *sending*
  identity in Resend with Receiving deliberately disabled, so it is not a valid
  destination for footer contact mail.

### Images
- **Hero** uses the local `public/Assets/Images/Hero-background.jpeg`.
- **Most other images are Unsplash placeholders** referenced by URL. Allowed host
  is configured in `next.config.mjs` (`images.unsplash.com`). To use licensed
  assets, drop files in `public/Assets/Images/` and update the `image` /
  `src` fields in the relevant `data/*.ts` file (or section component).

  > ⚠️ **Not all of these are equivalent.** Some placeholders are photographs of
  > **real people presented as named customers** — the four testimonial authors in
  > `data/testimonials.ts` and the hero "trust badge" avatars in
  > `HeroSection.tsx`. Swapping in different stock photos does not fix that; the
  > testimonials themselves need to be real (with permission to use the person's
  > likeness) or removed. Tracked in NOD-110.

- **Local photo assets are web-sized.** Source photos were resized to a 2000px
  long edge at quality 82 (mozjpeg), which cut 14 MB from the repo — the largest
  was an 8300×5536 / 12.5 MB portrait being served as a 36px avatar. Full-
  resolution originals remain in git history if they are ever needed. Keep new
  photography under ~2000px; `next/image` handles per-viewport resizing from
  there.

### Icons & link previews
- `app/icon.png` (512×512) and `app/apple-icon.png` (180×180) — the graphic mark
  cropped out of `Logo-mark.png`, which is a full lockup whose wordmark is
  illegible at favicon sizes.
- `app/opengraph-image.png` (1200×630) plus `app/opengraph-image.alt.txt`.
  Next.js picks these up by filename convention and emits the `og:`/`twitter:`
  tags automatically; they apply to every route unless a route adds its own.
  A route-level `opengraph-image.tsx` generated via `next/og` was tried first and
  **reverted** — `@vercel/og` fails on Windows resolving its bundled default
  font (`ERR_INVALID_URL` on a `.\file:\…noto-sans…ttf` path), so it could not be
  verified locally. If you switch to dynamic generation later, pass an explicit
  `fonts:` array to `ImageResponse` to avoid that code path.
- Root metadata sets `metadataBase` from `NEXT_PUBLIC_SITE_URL` (falling back to
  the production domain) so `og:image` and canonical URLs resolve absolutely.
  Set that env var on preview deployments if you want them to self-reference.

### Sample data
All listing, testimonial, blog, value, and process content lives in `data/`.
Edit those files to change copy — no markup changes needed.

---

## 9. Suggested next steps (not yet done)

- Replace remaining Unsplash placeholders with licensed photography.
- Build out real routes the footer/nav point to (`/property`, `/agent`, `/blog`,
  a `404`) — currently anchor links to on-page sections.
- Wire the newsletter form to a real endpoint (currently client-only success state).
- Optional: optimize the hero JPEG source size for faster first load.
- Optional: add metadata/OG images and a favicon for production polish.

---

## 9b. Lead capture & seller page

- **`components/forms/SellerLeadForm.tsx`** — reusable, controlled seller
  lead-capture form (frosted glass: `bg-white/85 backdrop-blur-md`, border,
  shadow, rounded). Fields: first/last name, phone, email, property address,
  "how soon to sell" select, optional message. On submit it POSTs to
  `/api/seller-leads` and renders one of three states: submitting (disabled
  button, spinner), success (inline confirmation), or error (inline alert with
  the entered values preserved so nothing is retyped). The Meta Pixel `Lead`
  event fires only on a successful response. Optional `id` prop for an anchor
  target. Used in the seller page hero — single source, no duplication.
- **`lib/leads.ts`** — the `SellerLead` type, the `timelineOptions` list and
  `validateSellerLead()`. Shared by the form and the API route so both validate
  against the same rules; the route never trusts the client's `required`
  attributes.
- **`lib/leadEmails.ts`** — the two HTML email bodies. Inline-styled tables
  (Outlook/Gmail strip `<style>`, flexbox and grid), and all lead input passes
  through `escapeHtml()` before it reaches the markup.
- **`app/api/seller-leads/route.ts`** — validates the payload, then sends via
  Resend: an internal notification to `LEAD_NOTIFY_EMAIL` (reply-to set to the
  seller, so hitting reply reaches them directly), and a confirmation to the
  seller. The internal send decides the response — if it fails the visitor gets
  an error and can retry. The seller confirmation is best-effort and only
  logged on failure, since the lead is already delivered by that point.
  Requires `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL` and `LEAD_FROM_EMAIL`; see
  `.env.example`. The `from` domain must be verified in Resend or sending
  fails. Rate limited per IP (default 5 per 10 minutes) before parsing, so a
  flood costs as little work as possible; a blocked caller gets a 429 with a
  `Retry-After` header and a plain-English message shown in the form.
- **`lib/rateLimit.ts`** — dependency-free in-memory sliding window, shared by
  both API routes. Process-local: a hard limit on a single long-running server,
  but **per-instance on serverless**, so several Vercel instances each allow
  their own quota. Enough to stop a naive script; swap in Redis/Upstash if a
  distributed limit is ever needed.

  Checking and counting are deliberately separate. `checkRateLimit()` runs
  before the body is parsed so a flood is rejected cheaply, but
  `recordRateLimitHit()` is only called once a request is valid and about to do
  real work. Without that split, a visitor who mistypes their email twice burns
  their allowance on validation errors and is locked out of their first correct
  attempt. Blocked requests are never counted either, so hammering can't extend
  a lockout.
- **`lib/validation.ts`** — `isValidEmail()` and `MAX_EMAIL_LENGTH`, shared by
  the lead and newsletter routes so the address rules can't drift apart.
- **`app/api/newsletter/route.ts`** — footer newsletter signup. Adds the address
  to a Resend audience via `contacts.create`, reusing `RESEND_API_KEY` and
  needing `RESEND_AUDIENCE_ID` (create one at resend.com/audiences). Resend was
  chosen over a separate email platform simply because it is already configured
  — swapping to Mailchimp/ConvertKit later only touches the create call.
  Rate limited at 3 valid signups per IP per 10 minutes. An address already on
  the list is treated as success: it is the truth from the visitor's side, and
  saying otherwise would leak who is subscribed. `Footer.tsx` renders
  submitting / success / error states and keeps the typed address on failure.
- **`lib/leadStore.ts`** — append-only JSONL at `.leads/seller-leads.jsonl`
  (gitignored — it holds personal data and must never be committed). Override
  with `LEAD_STORE_PATH`. JSONL rather than a JSON array so each append is one
  atomic write with no read-modify-write race between concurrent leads.
  `readLeads()` reads them back, skipping malformed lines. Writes happen after
  the notification email succeeds, so a visitor retrying a failed send leaves
  no duplicate.

  > ⚠️ **The store does not persist on Vercel.** Serverless filesystems are
  > read-only apart from a per-instance `/tmp` that is wiped between
  > invocations, so on the current deploy target the JSONL file is effectively
  > a no-op and **the emails in the team's inbox are the durable record**.
  > `appendLead` detects the read-only filesystem, warns once per process and
  > returns null — it never fails a submission. To get real persistence either
  > deploy to a host with a writable disk (VPS, Docker, Fly, Render) where the
  > file works as-is, or add a hosted store (Vercel Postgres/KV, Supabase,
  > Airtable, a CRM) behind the same `appendLead` call.
- **`app/sell-your-home/page.tsx`** — `/sell-your-home` landing page (server
  component with its own metadata): hero with the lead form, value cards
  (reuses `ValueCard`), a 4-step "how selling works" section, and a final CTA
  banner. Footer reused.
- **Navbar** now includes **Sell Your Home** → `/sell-your-home`. Homepage
  anchors are page-absolute (`/#about`, etc.) so they work from any route, and
  the desktop/mobile breakpoint moved to `lg` (room for the larger logo + extra
  link).

## 9c. Interior routes

`components/layout/PageHero.tsx` is the shared hero for interior pages —
shorter than the homepage and seller heroes, which are full-screen because they
carry a conversion action. These sit above real content, so the content starts
above the fold.

- **`/property`** — *Properties We Buy*. Criteria, **not listings**: property
  types (`data/propertyTypes.ts`), conditions that don't block a sale, and the
  seller situations reused from `data/sellerSituations.ts` so the homepage and
  this page can't drift apart. Royal Home Solutions buys houses rather than
  selling them, so there is no inventory — same reasoning already recorded in
  `sellerSituations.ts`: no prices, no fake houses for sale.
- **`/agent`** — founder profile for Jonah Stevens. The visible bio is written
  at company level and asserts only what the rest of the site already claims;
  there is a `TODO` in the file marking where his real bio belongs. **Do not
  add years of experience, deal counts, or credentials without confirming
  them** — this is a page about a real person on a site that takes leads.
- **`/blog`** — index of `data/blog.ts`. Cards are intentionally **not links**:
  the data holds titles, categories and authors but no article bodies, so there
  is nothing to route to. Add a `/blog/[slug]` route once posts have content.
- **`app/not-found.tsx`** — branded 404 with Navbar/Footer and four onward
  links. Returns a real HTTP 404, which the default Next.js page also did but
  without the branding or the routes back into the funnel.

Link wiring: the nav's **About** now points at `/agent` rather than the
`/#about` anchor, and the footer's **Resources** became **Homeowner Resources**
→ `/blog`. **Properties We Buy** → `/property` was added to both. All remaining
`/#...` anchors still resolve to real homepage sections (`#home`, `#process`,
`#about`, `#situations`, `#blog`, `#contact`) and were left alone.

## 9d. Anti-bot protection (form-spam incident)

### Root cause

Every public form posted JSON to an unauthenticated API route with **no bot
challenge of any kind**. Validation confirmed the payload was *well-formed*, not
that a *person* sent it: a name, a syntactically valid email, ten phone digits
and a valid `timeline`/`priceRange` option are all trivial for a script to
generate. The only obstacle was `lib/rateLimit.ts`, which is in-memory and
therefore **per-instance on Vercel** — a bot rotating IPs or simply hitting
different serverless instances never came close to the limit.

Each accepted submission then did exactly what it was built to do: an internal
notification to Jonah and a confirmation email to the bot-supplied address. The
reported payloads carried `Source: buy_a_home_page`, which matches the internal
email built in `lib/buyerEmails.ts` — so `/api/buyer-interest` was the entry
point, but all four endpoints were equally open.

Resend was never the source. It was the amplifier.

### Protected forms and routes

| Form | Page | Endpoint | Side effects behind the gate |
| --- | --- | --- | --- |
| `SellerLeadForm` | `/sell-your-home` | `POST /api/seller-leads` | internal email, `appendLead()`, seller confirmation, Meta Pixel `Lead` |
| `BuyerInterestForm` | `/buy-a-home` | `POST /api/buyer-interest` | internal email, buyer confirmation |
| `GeneralContactForm` | `/contact` | `POST /api/contact` | internal email, visitor confirmation |
| Footer newsletter | every page | `POST /api/newsletter` | Resend audience `contacts.create` |

### Processing order

Every protected route now runs the same sequence, cheapest check first, and
**nothing with a side effect happens until the last gate passes**:

```
rate limit → bounded body read → server validation
           → honeypot → timing → Turnstile (server-side)
           → business processing → internal email → confirmation email
```

### Turnstile flow (the primary control)

1. The browser mounts `components/forms/TurnstileWidget.tsx`. The three lead
   forms pass `autoActivate`, so the challenge is warm before anyone can reach
   the submit button. The footer newsletter loads it on **first interaction**
   instead — it sits on every page and should not cost every visitor a
   third-party script for a field most of them never touch.
2. The widget uses `appearance: "interaction-only"`, so it is invisible unless
   Cloudflare actually wants a human check. No form was redesigned.
3. On submit, `useFormProtection().collect()` **waits** for a challenge still in
   progress (up to 8s) before giving up, so a fast typist is never told
   verification is missing just because the script was still loading. If it
   genuinely cannot produce a token, the form says which problem it is — the
   check needs completing, or it could not load at all — and keeps every
   entered value.
4. `lib/botProtection.ts` → `lib/turnstile.ts` POSTs the token to Cloudflare's
   siteverify endpoint with a 5s timeout and only then allows the route to
   continue.

**Three things are checked on the siteverify response, not one:**

| Field | Why |
| --- | --- |
| `success` | The token is genuine and has not been used before |
| `hostname` | The token was solved **on our site**. The site key is public, so anyone can embed the widget on their own page and farm genuinely-solved tokens; without this that works |
| `action` | The token was minted **for this operation**. Without it, a token from the footer newsletter widget can be replayed against `/api/seller-leads` |

Actions live in `lib/turnstileActions.ts` (`seller_lead`, `buyer_interest`,
`contact`, `newsletter`) and are imported by both the widget and the route, so
the two cannot drift. **The route decides which action it expects** — it is
never read from the request body.

Hostname and action binding are enforced whenever `NODE_ENV === "production"`.
They are off elsewhere because Cloudflare's official test keys answer with a
placeholder hostname and no action; `TURNSTILE_STRICT_BINDING` overrides either
way, and `TURNSTILE_ALLOWED_HOSTNAMES` is how a Vercel preview deployment on
`*.vercel.app` gets accepted.

**Fails closed.** A missing token, an invalid token, a replayed token, a token
from the wrong host or the wrong form, an unreachable Cloudflare, a timeout, or
a missing `TURNSTILE_SECRET_KEY` all result in zero Resend calls and zero stored
leads. A client-supplied boolean (`captchaPassed: true`) is meaningless — only
Cloudflare's answer counts.

### Attribution is server-owned

`source` is a business value that lands in Jonah's inbox, and each route already
knows its own answer, so the browser is not asked. `lib/formSources.ts` maps one
route to one source and the route stamps it after validation. A `source` in the
request body is ignored entirely.

If a route ever legitimately serves several capture points, that is the moment
to accept a client value again — and to validate it against a list. Until then,
one route means one source. Email copy is unchanged: the same three values reach
the same templates.

### Honeypot and timing (free secondary signals)

- `components/forms/HoneypotField.tsx` renders a decoy `companyWebsite` input,
  positioned off-screen rather than `display:none` (simple bots skip fields the
  browser reports as hidden). `aria-hidden`, `tabIndex={-1}` and
  `autoComplete="off"` keep it away from screen readers, keyboard navigation and
  password managers. Any value in it rejects the submission.

  A honeypot hit answers **`200 {ok: true, delivered: false}`** — deliberately
  indistinguishable from success, and the only check that behaves this way. A
  400 would teach a bot that the hidden field is a trap and invite it to retry
  without it; a filled honeypot is also never a recoverable human mistake, so
  there is nobody to give an actionable error to. `delivered: false` is how the
  browser knows to suppress the Meta Pixel `Lead` event — a fake success must
  never be counted as a conversion. A bot posting straight to the API never
  reads that field and learns nothing.

  The trade-off: if a browser extension ever fills the honeypot for a real
  person, they see success while nothing was sent. That is why the field is
  hidden four different ways rather than one.
- Submission timing is sent as `formElapsedMs`. Below 1200ms (500ms for the
  single-field newsletter) the submission is rejected. It is client-supplied and
  spoofable, so a **missing or nonsensical value is deliberately not a
  rejection** — assistive tech, autofill and prefetched pages must not be
  punished. Turnstile remains authoritative.
- Origin/Referer mismatch is **logged as a signal only**, never used to
  authorise anything; both headers are attacker-controlled.

Timing and Turnstile failures return the same generic message so a script cannot
learn which layer caught it.

### Rate limiter — two buckets, still not the main control

`lib/rateLimit.ts` keeps its original design: dependency-free, in-memory, 429 +
`Retry-After`. It is a **secondary** defense. What changed is that it now keys
two separate buckets, because one bucket cannot answer two different questions:

| Bucket | Limit | Charged when | Question it answers |
| --- | --- | --- | --- |
| submission | 5 / 10 min (3 for newsletter) | only when a submission **succeeds** | "has this person already sent us five leads?" |
| abuse | 30 / 10 min | **every** request that reaches the route | "is this address hammering us?" |

This is the fix for a real hazard in the first pass, where bot-gate rejections
consumed the same allowance as real submissions: five malformed requests from an
office or mobile-carrier NAT would have locked out every legitimate customer
behind that address. Now junk costs only the loose bucket, and a valid customer
sharing an IP with a bot is still served. `tests/apiRoutes.test.ts` asserts
exactly that — 10 honeypot hits followed by a genuine submission that succeeds.

Validation failures still cost nothing on the submission bucket, so a visitor
fixing a typo is never locked out of their first correct attempt.

> ⚠️ On Vercel each serverless instance keeps its own counters, so both limits
> are per-instance rather than global. They stop a naive script hammering one
> connection; they do not stop a distributed flood. That is exactly why
> Turnstile — not this — is the primary protection. **Do not** replace it with
> Redis/Upstash: that introduces a paid dependency this project deliberately
> avoids, and Turnstile already covers the gap.

### Security logging

`lib/securityLog.ts` emits one greppable line per decision:

```
form_rejected: honeypot            form_rejected: turnstile_missing
form_rejected: too_fast            form_rejected: turnstile_failed
form_rejected: validation          form_rejected: turnstile_unavailable
form_rejected: rate_limit          form_rejected: turnstile_unconfigured
form_rejected: payload_too_large   form_accepted
```

Never logged: the Resend key, the Turnstile secret, any Turnstile token (length
only), or the visitor's name, email, phone or message.

**IP addresses are anonymised before logging.** The limiter keys on the full
address in memory because it has to; what gets *written down* is the network
prefix only — `203.0.113.x`, or the /64 for IPv6, via `anonymizeIp()`. That
still answers the operational question ("one source or many?") without retaining
personal data in a log drain. A raw address is never logged.

### Content Security Policy

There is none — no `headers()` in `next.config.mjs`, no middleware, no
`vercel.json`. Nothing blocks the Turnstile script today. **If a CSP is ever
added**, it needs:

```
script-src  https://challenges.cloudflare.com
frame-src   https://challenges.cloudflare.com
connect-src https://challenges.cloudflare.com
```

### Environment variables

| Variable | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | browser | Public by design |
| `TURNSTILE_SECRET_KEY` | server only | Never prefix with `NEXT_PUBLIC_`, never log |
| `TURNSTILE_ALLOWED_HOSTNAMES` | server, optional | Defaults to the two royalhomesolutions.com hosts. Required for preview deploys |
| `TURNSTILE_STRICT_BINDING` | server, optional | Defaults to on in production. Debugging only |
| `TURNSTILE_TIMEOUT_MS` | server, optional | Defaults to 5000 |
| `LEAD_ABUSE_LIMIT` / `NEWSLETTER_ABUSE_LIMIT` | server, optional | Coarse request ceiling, default 30 |

Cloudflare Turnstile's **Free plan covers this entirely**. No paid service, no
Redis/Upstash, no paid Vercel WAF rule was added.

### Local development and testing

`.env.example` ships Cloudflare's published test keys
(`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`), which
always pass — copy it to `.env.local` and the forms work immediately. They
provide **no protection**, so they must never reach production.

To watch a real challenge appear locally, swap in the "always challenges" site
key `3x00000000000000000000FF`. To confirm the gate rejects, use the
"always fails" secret `2x0000000000000000000000000000000AA`.

`npm test` covers the whole matrix — valid submission sends email; missing,
invalid, replayed, wrong-hostname, wrong-action and unverifiable tokens send
nothing; honeypot, fast submission, invalid payload, oversized payload and
rate-limited requests send nothing. The suite runs with binding enforcement
**on**, so it exercises the same path production does rather than a lenient one.
Cloudflare and Resend are both mocked; no test touches a real API.

`tests/protectionContract.test.ts` is the guard rail for the future. A new
`app/api/**/route.ts` that imports Resend or the lead store **fails the suite**
unless it goes through `verifySubmission`, names an expected action, stamps its
own `source`, and logs `ipPrefix` rather than a raw IP. A new form that posts to
`/api/` fails unless it supplies a token, honeypot and timing, uses a shared
action constant, and does not claim its own attribution.

---

## 10. Key files to know

- `app/page.tsx` — section order and composition.
- `tailwind.config.ts` — brand colors and design tokens.
- `next.config.mjs` — image remote patterns.
- `data/*.ts` — all editable content.
- `components/ui/*` — shared primitives to reuse before writing new markup.
- `lib/botProtection.ts` — the one gate every public form endpoint must pass
  through. Start here before adding any new public endpoint (§9d).
