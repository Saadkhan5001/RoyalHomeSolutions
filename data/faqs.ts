/**
 * Published FAQ content for `/faq`.
 *
 * Client-approved wording (NOD-201). Answers are rendered verbatim on the page
 * and reused to build the FAQPage JSON-LD, so the structured data can never
 * drift from what a visitor actually reads.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * HELD BACK — archived FAQ claims deliberately NOT published.
 *
 * The 2018 royalhomesolutionsinc.com FAQ made the claims below. Each needs
 * current client confirmation before it can be restored, because each is a
 * commitment the business would be held to:
 *
 *   1. "In some cases we will pay you up to $1,000 for a referral"
 *      → a specific financial promise; amount and terms unverified.
 *   2. Free lender pre-qualification ("We can arrange to have this done for
 *      you at no cost")  → depends on a lender relationship that may not exist.
 *   3. Licensed-agent referrals ("we can and will connect you with a
 *      recommended licensed agent")  → also held back in NOD-199.
 *   4. Foreclosure / bankruptcy assistance  → implies specialist competence
 *      and risks reading as legal or financial advice.
 *   5. Short-sale approval assistance (archived Agents page)  → see NOD-205.
 *   6. "We pay all closing costs" / no costs of any kind.
 *   7. Any guaranteed closing timeline (e.g. "close in 7 days").
 *
 * Do not add any of the above without written client confirmation.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    id: "are-you-realtors",
    question: "Are you Realtors or listing agents?",
    answer:
      "In a direct purchase, Royal Home Solutions is the buyer — not your listing agent. We purchase properties directly from owners, so there is no traditional listing process or agent commission.",
  },
  {
    id: "property-types",
    question: "What types of properties do you buy?",
    answer:
      "We consider single-family homes, townhomes, condominiums, multifamily properties, inherited homes, vacant properties, rentals, and houses that need repairs. Every situation is reviewed individually.",
  },
  {
    id: "repairs",
    question: "Do I need to make repairs before selling?",
    answer:
      "No. We buy properties as-is, so you do not need to renovate, clean out the house, or prepare it for showings before contacting us.",
  },
  {
    // Scoped to agent commission and listing fees only. The archived site's
    // broader "no fees, up front costs, commissions, or anything else" claim is
    // NOT restored — other transaction costs have not been confirmed.
    id: "commissions",
    question: "Are there agent commissions or listing fees?",
    answer:
      "No agent commission or listing fee is charged when Royal Home Solutions purchases the property directly from you.",
  },
  {
    id: "obligation",
    question: "Do I have to accept the offer?",
    answer:
      "No. Reviewing an offer does not obligate you to accept it. You can consider the information and decide whether the direct-sale option is right for you.",
  },
  {
    // No fixed number of days — the archived site implied speed but the
    // business cannot guarantee a timeline it does not control (title work).
    id: "timeline",
    question: "How quickly can the sale close?",
    answer:
      "The timeline depends on the property, title work, and the seller's situation. Royal Home Solutions works with sellers to agree on a practical closing date.",
  },
  {
    // Verified against the implementation (NOD-201): submissions POST to
    // /api/seller-leads, are emailed to the team via Resend, and are not
    // shared or sold onward. Note the site also fires a Meta Pixel "Lead"
    // conversion event on success — it transmits no form field values, but a
    // privacy policy page should be added to disclose analytics/advertising
    // tracking generally.
    id: "privacy",
    question: "Will my information remain private?",
    answer:
      "Information you submit through the form is used to review your property and respond to your enquiry. We do not sell the information you submit.",
  },
  {
    id: "what-happens-next",
    question: "What happens after I submit my property information?",
    answer:
      "Royal Home Solutions reviews the details, contacts the seller to learn more, and determines whether the property may be a fit for a direct purchase. If appropriate, the next step is a no-obligation offer.",
  },
];
