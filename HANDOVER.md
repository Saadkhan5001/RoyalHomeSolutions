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
```

Requires Node 18+ (developed on Node 24).

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
- The footer contact address is `jonah@nodevision.ai`. This is the **Node Vision
  agency** address, used as an interim contact — swap it for a Royal Home
  Solutions mailbox once one is ready to receive. Note `leads@royalhomesolutions.com`
  is a *sending* identity in Resend with Receiving deliberately disabled, so it
  is not a valid destination for footer contact mail.

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

## 10. Key files to know

- `app/page.tsx` — section order and composition.
- `tailwind.config.ts` — brand colors and design tokens.
- `next.config.mjs` — image remote patterns.
- `data/*.ts` — all editable content.
- `components/ui/*` — shared primitives to reuse before writing new markup.
