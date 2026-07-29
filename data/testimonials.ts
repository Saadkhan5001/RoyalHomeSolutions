/**
 * Genuine customer testimonials, transcribed from the archived Royal Home
 * Solutions website (Wayback Machine capture of
 * royalhomesolutionsinc.com/testimonial/ — identical in the 2018 and 2019
 * captures). These are the only two reviews the business has on record;
 * Jonah confirmed they are real and should appear on the modern site.
 *
 * Do NOT add testimonials here without a real customer and a record of
 * permission — an earlier revision of this file carried four invented
 * reviews with stock portraits, which is exactly what NOD-197/NOD-198 removed.
 *
 * No photos on purpose: we have no authorised customer imagery, so the UI
 * renders an initials monogram instead of a portrait.
 */
export interface Testimonial {
  id: string;
  name: string;
  /** Shown in the monogram circle in place of a photo. */
  initials: string;
  quote: string;
  /**
   * Only published testimonials render on the site. Flip to true once the
   * client has approved the entry.
   */
  published: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "marie-and-carlos",
    name: "Marie and Carlos",
    initials: "M&C",
    quote:
      "Royal Home Solutions has been phenomenal to work with! They made the process super easy, and were always available to make me and my husband feel comfortable. We had a tight timeline, but they helped us close early! It was truly a wonderful experience working with Royal Home Solutions — they really did make us feel like royalty! Thank you from the bottom of our hearts!!",
    published: true,
  },
  {
    // Editorial note (NOD-198): the archived review opened with "Carolina,
    // you are the best!" — it originally praised Carolina by name. The name
    // was replaced with "Jonah Stevens" at the client's direction
    // (2026-07-29); every other word is unchanged apart from the same
    // punctuation/spacing cleanup applied to the first testimonial.
    id: "yasmina-m",
    name: "Yasmina M.",
    initials: "YM",
    quote:
      "Jonah Stevens, you are the best! Thank you so much for helping me find my dream home! I know I was anxious at first, but you were always there and guided me every step of the way, “trust the process” and “you're in the best hands you can be in” haha you were right, you never let me down. You are a real estate queen and always knew how to navigate the system! My daughter even loves you. Keep up the great work and thank you again — for everything!",
    published: true,
  },
];

/** The testimonials that actually render on the site. */
export const publishedTestimonials = testimonials.filter((t) => t.published);
