"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqs } from "@/data/faqs";
import { cn } from "@/lib/utils";

/**
 * Homepage FAQ accordion.
 *
 * Accessibility notes, since this is the only custom widget on the page:
 *   - Each question is a real <button>, so Enter/Space and focus order come
 *     from the platform rather than being re-implemented. Tab moves between
 *     questions; no roving tabindex or arrow-key handling is added, because
 *     this is a set of independent disclosures rather than a tab list — WAI-ARIA
 *     APG's Disclosure pattern, not Accordion-with-tablist.
 *   - `aria-expanded` on the button and `aria-controls` pointing at the panel
 *     id let a screen reader announce state and jump to the revealed text.
 *   - The panel keeps `role="region"` + `aria-labelledby` so it is reachable as
 *     a landmark once opened.
 *   - Panels are unmounted when closed, so collapsed answers are never read out
 *     or focusable.
 *
 * Multiple panels may be open at once. Closing one to open another loses the
 * reader's place, and there is no layout reason to force it here.
 *
 * ── Why the reveal is CSS and not a height animation ──────────────────────
 * An earlier version animated height 0 → auto with framer-motion. That has a
 * bad failure mode: the panel mounts and `aria-expanded` flips to true, but if
 * the animation never advances the answer stays at zero height. Assistive
 * technology is then told the disclosure is open while nothing is visible —
 * the two sources of truth disagree.
 *
 * Height is no longer animated at all. The panel takes its natural height the
 * moment it mounts, and only opacity/translate are animated, via the `reveal`
 * keyframe in tailwind.config.ts. That keyframe has no fill-mode, so the
 * resting state is "visible": if the animation is skipped for any reason the
 * content still shows. `motion-reduce:animate-none` opts reduced-motion users
 * out of the animation entirely and they see the answer immediately.
 *
 * The full list also renders on /faq as a plain <dl>. That page keeps the
 * FAQPage JSON-LD; it is deliberately not duplicated here (see app/page.tsx).
 */
export default function FAQSection() {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) =>
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <section id="faq" className="scroll-mt-24 bg-neutral-50 py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Sticks alongside the accordion on desktop so the heading stays in
              view while the questions scroll past.

              `self-start` is load-bearing: grid items stretch to the row height
              by default, and an element as tall as its container has nothing to
              stick within. Shrinking it to its content height is what makes
              `sticky` do anything here.

              `top-28` (112px) clears the fixed navbar, which is ~96px tall at
              this breakpoint. Left static below `lg`, where the two columns
              stack and a sticky heading would just cover the answers. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              className="max-w-md"
              title={
                <>
                  Frequently asked
                  <br className="hidden sm:block" /> questions
                </>
              }
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mt-5 max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg"
            >
              Straight answers about selling directly, buying a renovated home,
              and working with us. If yours isn&apos;t here,{" "}
              <Link
                href="/contact"
                className="font-semibold text-brand-ink underline underline-offset-4 hover:no-underline"
              >
                get in touch
              </Link>
              .
            </motion.p>
          </div>

          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-3"
          >
            {faqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              const panelId = `faq-panel-${faq.id}`;
              const buttonId = `faq-trigger-${faq.id}`;

              return (
                <div
                  key={faq.id}
                  className={cn(
                    "overflow-hidden rounded-3xl border bg-white transition-colors",
                    isOpen ? "border-neutral-300" : "border-neutral-200",
                  )}
                >
                  <dt>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(faq.id)}
                      className="flex w-full items-start justify-between gap-5 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 sm:px-7 sm:py-6"
                    >
                      <span className="text-base font-semibold text-brand-ink sm:text-lg">
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                          isOpen
                            ? "bg-brand-yellow text-brand-ink"
                            : "bg-neutral-100 text-neutral-500",
                        )}
                      >
                        <Plus
                          className={cn(
                            // Rotating the plus into an ×. The transition is
                            // dropped under reduced motion; the rotation and
                            // the color change above still signal state, so
                            // nothing depends on the animation running.
                            "h-4 w-4 transition-transform duration-300 motion-reduce:transition-none",
                            isOpen && "rotate-45",
                          )}
                        />
                      </span>
                    </button>
                  </dt>

                  {/* Unmounted when closed, so collapsed answers are never
                      announced or reachable by keyboard. */}
                  {isOpen && (
                    <dd
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="animate-reveal motion-reduce:animate-none"
                    >
                      <p className="px-6 pb-6 text-base leading-relaxed text-neutral-600 sm:px-7 sm:pb-7">
                        {faq.answer}
                      </p>
                    </dd>
                  )}
                </div>
              );
            })}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
