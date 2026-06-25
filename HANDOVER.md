# Homstar — Project Handover

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
    Homstar copyright.

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
  by Framer" credit; uses a Homstar copyright and `hello@homstar.com`.
- Added a 4th buying-process slide ("Buy back with confidence") so all four
  timeline steps map 1:1 to slides.

### Images
- **Hero** uses the local `public/Assets/Images/Hero-background.jpeg`.
- **All other images are Unsplash placeholders** referenced by URL. Allowed host
  is configured in `next.config.mjs` (`images.unsplash.com`). To use licensed
  assets, drop files in `public/Assets/Images/` and update the `image` /
  `src` fields in the relevant `data/*.ts` file (or section component).

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

## 10. Key files to know

- `app/page.tsx` — section order and composition.
- `tailwind.config.ts` — brand colors and design tokens.
- `next.config.mjs` — image remote patterns.
- `data/*.ts` — all editable content.
- `components/ui/*` — shared primitives to reuse before writing new markup.
