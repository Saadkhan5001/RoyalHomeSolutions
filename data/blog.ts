/**
 * Blog articles.
 *
 * All six articles are ORIGINAL work written for Royal Home Solutions and
 * aimed at homeowners and buyers.
 *
 * ⚠️ Background, so this is never undone by mistake: the previous Royal Home
 * Solutions website carried four posts bylined "Jonah Stevens" that were in
 * fact syndicated from cthomesllc.com (the old site ran the `cthomes`
 * WordPress theme, and each post ended with a "See more at cthomesllc.com"
 * footer). Those posts were third-party content aimed at Realtors and
 * investors, and were never restored. The articles below replace their topics
 * with original homeowner-facing writing — no CT Homes wording, structure,
 * links, branding or attribution survives.
 *
 * Rules for anything added here:
 *   - No invented statistics, transactions, results or customer stories.
 *   - No legal, tax, lending or financial advice.
 *   - No promise of a fixed closing period, and no "we pay all closing costs".
 *   - No licensed-agent referrals or free pre-qualification (held back; NOD-199).
 *   - Author is "Royal Home Solutions" unless the client confirms in writing
 *     that a named person wrote and approved the piece.
 *   - Reading time is computed from the real word count — never typed by hand.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ADDING A POST (the intended cadence is one or two a month)
 *
 *   1. Append a `BlogPost` object to `articles` below. Only `publishedAt`
 *      controls ordering — `blogPosts` sorts newest-first, so there is no
 *      array position to get right and nothing else to touch.
 *   2. Everything else follows automatically: the /blog index, the homepage
 *      section, `generateStaticParams`, the route metadata and the Article
 *      JSON-LD all read from this file. No new route or component is needed.
 *   3. Reading time is derived from the text, so long posts cannot advertise
 *      a short read.
 *
 * There is deliberately no scheduling: a future `publishedAt` still renders
 * immediately, because the site is statically built and nothing re-runs on a
 * date boundary. To hold a finished draft back, keep it out of the array until
 * it should go live.
 *
 * WHERE A CMS WOULD PLUG IN
 * `getPost()` and `blogPosts` are the only two things the rest of the app
 * imports. Swapping this file for a CMS (Sanity, Contentful, a headless
 * WordPress, MDX files on disk) means re-implementing those two exports
 * against the new source and keeping the `BlogPost` shape — no consumer
 * changes. Scheduled publishing would then come from the CMS plus ISR
 * (`export const revalidate`) on the blog routes.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface BlogSection {
  heading: string;
  /** Paragraphs, rendered in order. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  /** Used for the card, the meta description and the OG description. */
  description: string;
  /** ISO date. Set when the article is approved and published. */
  publishedAt: string;
  author: string;
  /** Lead paragraphs, before the first heading. */
  intro: string[];
  sections: BlogSection[];
}

/**
 * Articles in the order they were written. Do not read this directly —
 * `blogPosts` below is the sorted, exported view.
 */
const articles: BlogPost[] = [
  {
    slug: "what-happens-after-you-request-a-cash-offer",
    title: "What Happens After You Request a Cash Offer for Your Home?",
    description:
      "A step-by-step look at what follows a cash offer request: the information we ask for, the conversation, the property review, how condition affects the offer, and how a closing date gets agreed.",
    publishedAt: "2026-07-30",
    author: "Royal Home Solutions",
    intro: [
      "Requesting a cash offer is a small action with an unclear next step. Most homeowners have sold a house through an agent, or watched someone else do it, so the listing process is at least familiar. A direct sale is different, and the difference is rarely explained before you are asked to hand over your details.",
      "This article walks through what actually happens after you submit your property information to Royal Home Solutions — what we ask for, what we do with it, and where the decision points sit. Nothing here obligates you to anything. Understanding the process is useful whether or not you ever sell to us.",
    ],
    sections: [
      {
        heading: "You share basic property information",
        body: [
          "The first step is short on purpose. We ask for your name, the best way to reach you, the property address, and a rough sense of your timeline. There is an optional message box if there is something we should know up front.",
          "We do not ask for income, bank statements, tax returns or a credit check. None of that is relevant to us — we are buying a property, not lending you money. If a company asks a seller for that kind of financial documentation early in a conversation, it is worth asking why.",
          "The address matters more than anything else on the form. It lets us look at the property's history, its size and layout, and what has happened with comparable homes nearby, before we take up any of your time.",
        ],
      },
      {
        heading: "An initial conversation",
        body: [
          "Next, someone contacts you. This is a conversation, not a pitch. The purpose is to understand the property and the situation around it, because those two things together determine whether a direct sale makes sense.",
          "Useful things to cover include how long you have owned the home, whether anyone is living in it, whether there are tenants, whether you know of any significant repair issues, and what is driving the timing. If you have inherited the property or are managing it on behalf of someone else, that changes the practical steps and is worth mentioning early.",
          "This is also the point to ask us questions. How does the offer get calculated? What happens if you change your mind? What would the next two weeks look like? A company that cannot answer plainly at this stage is unlikely to get clearer later.",
        ],
      },
      {
        heading: "Reviewing the property",
        body: [
          "After the conversation, we review the property properly. That means looking at its condition, its size and layout, what work it would need, and what comparable homes in the area have recently sold for once they were in good condition.",
          "In many cases this includes seeing the property, either in person or through photographs and a video walkthrough. You do not need to clean, stage, repair or prepare anything. A house full of belongings, a house mid-renovation, and a house that has been empty for two years are all normal to us. We are assessing what the property is, not how it presents.",
          "This is the part that takes the most time, and it is the part that makes an offer meaningful rather than a number pulled from an online estimate.",
        ],
      },
      {
        heading: "How condition and renovation needs are considered",
        body: [
          "Condition is the single biggest factor in a direct offer, and it is where a direct sale differs most from a listing.",
          "When a house is listed, the seller typically absorbs the cost of getting it ready — repairs, cleaning, painting, and the time it sits on the market. When we buy directly, we take on that work instead. The offer reflects that transfer.",
          "In practice we are looking at things like:",
        ],
        list: [
          "Structural and system condition — roof, foundation, plumbing, electrical, HVAC",
          "Water, fire or storm damage, and anything that has been left unrepaired for a long time",
          "How dated the kitchen, bathrooms and finishes are",
          "Whether the property needs to be cleared out",
          "Known issues with title, liens or unpaid taxes, which affect the transaction rather than the building",
        ],
      },
      {
        heading: "Receiving a no-obligation offer",
        body: [
          "You then receive an offer, along with an explanation of how we arrived at it. The explanation matters as much as the number. You should be able to see which parts of the figure relate to the property's condition and which relate to the work it needs.",
          "The offer carries no obligation. Reviewing it does not commit you to anything, and there is no fee for receiving one. If you want time to think, take it. If you want to compare it against what an agent thinks the house would list for, that is a reasonable thing to do and we would rather you did it before deciding than after.",
          "It is also fair to say that a direct sale is not right for every homeowner. A property in good condition, in a strong location, with an owner who has the time and money to prepare it and wait for a buyer, will often do better on the open market. If that describes your situation, you should know it.",
        ],
      },
      {
        heading: "Choosing whether to proceed",
        body: [
          "If you decide to move ahead, we put the agreement in writing. If you decide not to, the conversation ends there.",
          "Be cautious of pressure at this stage, from anyone. An offer that expires in an hour, a figure that changes every time you ask a question, or a refusal to put terms in writing are all reasons to slow down rather than speed up. A genuine offer survives you thinking about it overnight.",
        ],
      },
      {
        heading: "Title work and agreeing on a closing date",
        body: [
          "Once terms are agreed, the transaction moves to title. A title search confirms who legally owns the property and surfaces anything attached to it — liens, judgments, unpaid taxes, or errors in how the ownership was recorded. This step protects both sides, and it is standard in property sales generally, not something specific to a direct purchase.",
          "Title issues are common and are usually resolvable, but they are the most frequent reason a closing date moves. This is why we do not quote a fixed number of days. Anyone who guarantees a specific closing timeline before a title search is complete is describing a hope rather than a schedule.",
          "The closing date itself is a conversation. Some sellers want it as early as possible. Others need weeks or months to arrange somewhere to move to, and would rather set a date further out. We would rather agree a date that works and hold it than agree a fast one and move it twice.",
        ],
      },
      {
        heading: "One thing worth being clear about",
        body: [
          "When Royal Home Solutions buys a property directly, we are the buyer. We are not your listing agent, we are not marketing the property to a third party, and there is no listing-agent commission in that transaction.",
          "Some of the homes we purchase are renovated and later offered for sale as move-in-ready properties. That is how the business works, and it is worth knowing when you are weighing an offer: the value we can create through renovation is part of what makes a direct purchase possible.",
        ],
      },
    ],
  },

  {
    slug: "why-clear-communication-matters-selling-directly",
    title: "Why Clear Communication Matters When Selling Your Home Directly",
    description:
      "Forms and automation make it easier to start a home sale, but they don't answer questions. What clear communication looks like in a direct sale, what to ask before accepting an offer, and the warning signs worth noticing.",
    publishedAt: "2026-07-30",
    author: "Royal Home Solutions",
    intro: [
      "Selling a house directly should be simpler than listing it. Often it is. But simpler does not mean automatic, and a process that removes showings and agents also removes the people who would normally explain what is happening at each stage.",
      "That gap gets filled by communication or it does not get filled at all. This article is about what good communication looks like in a direct sale, what to ask before you accept anything, and what should make you pause.",
    ],
    sections: [
      {
        heading: "What technology genuinely helps with",
        body: [
          "A short online form beats a phone call you have to make during working hours. It lets you start the conversation at eleven at night, from your sofa, without committing to anything. Email and text mean you can reply when it suits you rather than when someone happens to call.",
          "Photographs and video walkthroughs are genuinely useful too. They let a buyer understand a property's condition without three separate visits, which matters if the house is tenant-occupied, or if you are managing it from another state.",
          "None of this is remarkable. It is just the sensible use of ordinary tools, and it removes real friction from the early stages.",
        ],
      },
      {
        heading: "What it cannot replace",
        body: [
          "What a form cannot do is answer the question behind the question.",
          "A homeowner asking \"how long does this take?\" is rarely asking for a number. They are usually asking whether they can be out before a lease starts, or whether a sale can complete before a deadline they are facing. An automated reply gives a number. A person can ask what is actually driving the timing and tell you honestly whether it is achievable.",
          "The same applies to the offer itself. A figure on its own tells you very little. A figure with an explanation — this is the condition we assessed, this is the work we think it needs, this is how that affects the number — tells you enough to make a decision. Selling a house is one of the larger financial decisions most people make, and it deserves more than a notification.",
        ],
      },
      {
        heading: "Questions worth asking before you accept an offer",
        body: [
          "You are entitled to ask anything, and the answers tell you as much as the offer does. A reasonable starting set:",
        ],
        list: [
          "How did you arrive at this figure, and which parts of it relate to the property's condition?",
          "What happens between accepting and closing, and who does what?",
          "What could delay the closing date, and how would I hear about it?",
          "Is anything about this offer conditional, and if so, on what?",
          "What costs, if any, come out of the amount I would receive?",
          "What happens if I say no, or if I want to think about it for a week?",
        ],
      },
      {
        heading: "Understanding the timeline honestly",
        body: [
          "A direct sale removes some of the slowest parts of a listing — preparing the house, waiting for a buyer, and waiting for that buyer's mortgage approval. That genuinely shortens things.",
          "It does not remove title work. A title search checks who legally owns the property and whether anything is attached to it, and if something turns up, resolving it takes as long as it takes. This is the most common reason a closing date moves, and it is largely outside either side's control.",
          "This is why we describe timelines as something to agree rather than something to promise. A closing date that is discussed, set realistically and then held is worth more than a fast one that slips twice.",
        ],
      },
      {
        heading: "Pressure and unclear promises",
        body: [
          "Some patterns are worth noticing, wherever you encounter them:",
        ],
        list: [
          "An offer that expires in hours, or a discount that disappears if you do not decide immediately",
          "A number that changes each time you ask how it was calculated",
          "Reluctance to put terms in writing",
          "Guarantees about a closing date given before any title work has started",
          "Vague statements about costs, or an unwillingness to say plainly what you would receive",
          "Discouragement from speaking to an agent, an attorney, or a family member first",
        ],
      },
      {
        heading: "Why responsiveness matters more than speed",
        body: [
          "Responsiveness and speed are not the same thing. Speed is how fast a transaction closes. Responsiveness is whether someone answers when you have a question in the middle of it.",
          "Most of the frustration in a property sale comes from silence rather than from delay. A week of waiting is manageable if you know why you are waiting. The same week is miserable if nobody responds. Knowing who to contact, and roughly when to expect an answer, changes the experience more than any individual date.",
          "This is a reasonable thing to test early. How quickly did someone respond to your first inquiry? Did they answer what you asked, or what they wanted to talk about? Early behavior tends to be the best available prediction of later behavior.",
        ],
      },
      {
        heading: "How we try to work",
        body: [
          "Royal Home Solutions buys properties directly from owners. In that transaction we are the buyer, not a listing agent, and there is no listing-agent commission involved.",
          "That direct relationship is the reason communication matters as much as it does. There is no intermediary to interpret one side to the other, which is an advantage when things are explained clearly and a problem when they are not. We would rather tell a homeowner plainly that a direct sale is not their best option than have them find that out later.",
        ],
      },
    ],
  },

  {
    slug: "how-property-investors-evaluate-and-renovate-homes",
    title: "How Property Investors Evaluate and Renovate Homes",
    description:
      "Why a direct offer differs from a listing price. How condition, necessary repairs, renovation scope, and holding and transaction costs are weighed when a property investor looks at a house.",
    publishedAt: "2026-07-30",
    author: "Royal Home Solutions",
    intro: [
      "One of the most common questions homeowners ask about a direct offer is why it differs from the figure they have seen for similar houses online. It is a fair question, and the answer is not complicated — but it is rarely explained.",
      "This article describes how a property investor looks at a house: what gets assessed, what work gets planned, which costs exist beyond the purchase price, and why the resulting offer is structured the way it is. It is a description of a process, not advice about what you should do.",
    ],
    sections: [
      {
        heading: "It starts with condition",
        body: [
          "Condition is the foundation of the whole assessment. Not the neighborhood, not the square footage, not the online estimate — the actual state of the building.",
          "The assessment usually separates into what must be fixed for the house to be safe and functional, and what should be updated for it to be somewhere people want to live. Both matter, but they carry different weight and different risk.",
        ],
      },
      {
        heading: "Necessary repairs come first",
        body: [
          "Necessary repairs are the ones that are not optional. A roof at the end of its life, failing plumbing, outdated or unsafe electrical work, a compromised foundation, water intrusion, or damage that has been left long enough to affect the structure around it.",
          "These carry more uncertainty than cosmetic work, because they are harder to scope accurately before work begins. Opening up a wall can confirm the estimate or double it. That uncertainty is real and it is priced in, which is one reason a house needing significant structural work sees a larger gap between a direct offer and a retail figure.",
          "This is also the category homeowners most often find impossible to fund. Being told a house needs twenty thousand dollars of work before it can realistically be listed is precisely the situation where a direct sale becomes worth considering.",
        ],
      },
      {
        heading: "Defining the renovation scope",
        body: [
          "Once the necessary work is understood, the question becomes what the property should be when it is finished — and the honest answer varies by property.",
          "Not every house needs everything. Renovating well means matching the work to what the home actually needs and to what the surrounding area supports. Over-renovating is a real mistake: finishes that are out of step with the street add cost without adding value, and the money spent does not come back.",
          "A scope typically covers the necessary repairs, kitchens and bathrooms where they are dated, flooring and paint throughout, and whatever the property specifically needs — a cleared-out interior, a roof, updated systems, or exterior work. The intent is a home that functions properly and is genuinely ready to live in, not a showpiece.",
        ],
      },
      {
        heading: "Costs that exist beyond the purchase price",
        body: [
          "This is the part that is least visible from the outside, and it accounts for much of the gap between a direct offer and a listing price.",
          "Buying a property, holding it while work is carried out, and selling it afterwards all carry costs that have nothing to do with the renovation itself:",
        ],
        list: [
          "Holding costs — property taxes, insurance, utilities and any financing costs for the entire period the property is owned",
          "Transaction costs on both the purchase and the eventual sale",
          "The cost of the renovation work itself, including the contingency that unexpected findings require",
          "Time — a renovation that runs three months longer accrues every holding cost for three additional months",
        ],
      },
      {
        heading: "Why an investor's offer differs from a retail listing price",
        body: [
          "A listing price and a direct offer answer two different questions.",
          "A listing price is an estimate of what a buyer might eventually pay for a house that has already been prepared, marketed and shown — after the seller has funded the repairs, absorbed the carrying costs while it sits on the market, and paid the commissions and costs associated with the sale.",
          "A direct offer is what a buyer will commit to now, for the house exactly as it stands, taking on the repair work, the holding costs, the timeline and the risk that the work turns out to be worse than it looked.",
          "The difference between the two is not a discount applied to the seller. It is the cost and risk moving from one side of the transaction to the other. Whether that trade is worth making depends entirely on the homeowner's situation — which is why the honest comparison is not offer versus listing price, but offer versus what you would realistically net after doing the work, waiting, and paying the costs of a sale.",
        ],
      },
      {
        heading: "What renovation does for the home and the street",
        body: [
          "A house that has been empty or neglected has effects beyond its own boundary. Deferred maintenance tends to worsen rather than hold steady, and a vacant property is a cost to whoever owns it every month it stands empty.",
          "Bringing a property back into good condition puts a maintained, occupied home back on the street. For the buyer, it means a house they can move into without immediately taking on a project. For the surrounding area, it means one fewer property in visible decline.",
          "That is the part of this work worth doing well. A renovation done properly — with the necessary repairs actually addressed rather than covered over — leaves a home that serves the next owner for years. A renovation done badly leaves the next owner with someone else's shortcuts.",
        ],
      },
      {
        heading: "How this applies at Royal Home Solutions",
        body: [
          "Royal Home Solutions buys select properties directly from owners, renovates some of them, and later offers a limited number of move-in-ready homes for sale. Inventory is intentionally small — this is not a listings catalog, and we are not a brokerage marketing other people's houses.",
          "When we make an offer, it reflects the property's condition, the work we expect it to need, the costs of holding and transacting, and the condition the home needs to reach. We would rather explain that reasoning than present a number without one.",
        ],
      },
    ],
  },

  {
    slug: "why-renovated-homes-remain-valuable",
    title: "Why Renovated Homes Remain Valuable to Buyers and Neighborhoods",
    description:
      "What thoughtful renovation actually changes: safe and maintained housing, homes buyers can move into without taking on a project, and the effect of returning neglected properties to use.",
    publishedAt: "2026-07-30",
    author: "Royal Home Solutions",
    intro: [
      "Housing is often discussed as an asset class, in the language of returns and appreciation. That framing misses what a house mostly is, which is somewhere people live — and whether it is a good place to live depends far more on its condition than on any forecast.",
      "This article is about what renovation actually changes: for the person who buys the home, and for the street it sits on. It makes no claims about what property will be worth in the future, because nobody can responsibly make them.",
    ],
    sections: [
      {
        heading: "Safe, maintained housing is the baseline",
        body: [
          "Before a house is an investment or a project, it has to work. The roof has to keep water out. The electrical system has to be safe. The plumbing has to function, and the structure has to be sound.",
          "These are not luxuries and they are not cosmetic. A home failing on any of them is a problem for whoever lives there, and the problems compound — water that gets in damages what it touches, and what it touches costs more to fix the longer it is left.",
          "This is why the unglamorous parts of a renovation matter most. New flooring photographs well. A replaced roof does not, and matters more.",
        ],
      },
      {
        heading: "What thoughtful renovation changes",
        body: [
          "There is a meaningful difference between renovating a house and decorating it.",
          "Decoration addresses what a house looks like. Renovation addresses how it works — whether the kitchen is usable, whether the bathroom is sound, whether the layout suits how people actually live, whether the systems will last. Done properly, the work is matched to what the specific property needs.",
          "Done badly, it is the opposite: fresh paint over unaddressed damp, new units in a kitchen with failing plumbing behind them, cosmetic work that hides the issues a buyer will inherit. A renovation that looks finished but is not costs the next owner far more than an honest fixer-upper would have.",
        ],
      },
      {
        heading: "Why move-in-ready matters to buyers",
        body: [
          "For many buyers, a home that needs work is not a discount — it is an obstacle.",
          "Buying a house tends to consume most of what a household has available. A property needing a new roof or rewiring immediately afterwards asks for money that is no longer there, and financing repairs after closing is harder than people expect. Then there is the practical reality of living somewhere while it is being worked on, which is far more disruptive than it sounds.",
          "A genuinely move-in-ready home removes that. It is a smaller category than it appears, because plenty of homes are presented as ready when they are simply tidy. The distinction that matters to a buyer is whether the things that are expensive to fix have already been dealt with.",
        ],
      },
      {
        heading: "Vacant and neglected properties",
        body: [
          "An empty property does not hold steady. Small problems that would be noticed and fixed in an occupied home go unnoticed in an empty one, and small problems become large ones. Vacancy tends to accelerate decline rather than pause it.",
          "It is also a continuing cost to whoever owns it. Taxes, insurance and basic upkeep continue regardless of whether anyone is living there, which is why inherited properties and long-empty houses so often become a burden for people who never planned to own them.",
          "Returning a property like that to use resolves both problems at once: the decline stops, and the ongoing cost ends for the person carrying it.",
        ],
      },
      {
        heading: "The effect on a neighborhood",
        body: [
          "Housing quality is not confined to individual properties. A street where homes are maintained is a different place to live than one where several are visibly deteriorating, and the difference shows up in ways that have little to do with property values — whether people look after their own homes, whether the street feels cared for.",
          "A single renovated house does not transform an area, and it would be overstating things to suggest otherwise. But the direction matters. A property brought back into good condition and occupied again is one fewer in decline, and those decisions accumulate over time in one direction or the other.",
        ],
      },
      {
        heading: "How Royal Home Solutions works",
        body: [
          "Our model is straightforward. We buy select properties directly from owners, we invest in renovating some of them, and we later offer a limited number of move-in-ready homes for sale.",
          "Each part matters. Buying directly means a homeowner who needs to sell a property in poor condition has a route that does not require funding repairs first. Renovating means the house is genuinely improved rather than passed along. Selling a limited number of homes means we are not a brokerage and this is not a listings site — the homes we offer are ones we own.",
          "We make no claims about what any property will be worth in the future, and we would be skeptical of anyone who did. What can reasonably be said is narrower: a home that is safe, maintained and ready to live in is worth more to the person living in it than one that is not.",
        ],
      },
    ],
  },

  {
    slug: "selling-a-house-that-needs-major-repairs",
    title: "Selling a House That Needs Major Repairs",
    description:
      "What to do when a house needs more work than you can fund: finding out what the repairs actually are, comparing a prepared listing against an as-is sale, and deciding honestly which route fits your situation.",
    publishedAt: "2026-08-06",
    author: "Royal Home Solutions",
    intro: [
      "Plenty of homeowners reach the same point. The house needs work — a roof, a system that has failed, damage that has been left too long — and the money to fix it is not there, or the energy to manage it is not there, or both. Meanwhile every month the problem gets slightly worse and slightly more expensive.",
      "This article is about what your options actually are in that situation, and how to compare them without guessing. It is not an argument for selling directly. For some houses that is clearly the right move, and for others it clearly is not.",
    ],
    sections: [
      {
        heading: "What \"needs repairs\" actually means",
        body: [
          "The phrase covers an enormous range, and the range is the whole point. A house with a dated kitchen and worn carpet is in a completely different position from a house with a failing roof and water in the walls.",
          "The useful division is between work that is cosmetic and work that is structural or systemic. Cosmetic work — paint, flooring, fixtures, tired but functional kitchens — is predictable to price and rarely stops a sale. Structural and systems work — roof, foundation, plumbing, electrical, HVAC, water damage — is harder to price, harder to fund, and much more likely to affect whether a buyer can get a mortgage on the property at all.",
          "If your house only needs cosmetic work, you have more options than you may think, and a traditional listing deserves serious consideration. The rest of this article is mostly about the other category.",
        ],
      },
      {
        heading: "Find out what the work really is before deciding anything",
        body: [
          "The most common mistake is deciding what to do based on a guess about the cost. Homeowners routinely overestimate some repairs and badly underestimate others, and both errors lead to bad decisions.",
          "Getting two or three written estimates from licensed contractors costs you nothing but time, and it converts an anxiety into a number. Even if you never do the work, that number is what lets you compare your options properly. A home inspection is also worth considering — it is the same thing a buyer's inspector would do, and finding out now what they would find later puts you in a stronger position either way.",
          "Be specific about what you are asking for. An estimate to replace a roof is straightforward. An estimate to address water damage is not, because nobody can scope it fully until they open things up. If a contractor cannot tell you what is behind a wall, that uncertainty is real, and it is worth knowing about before you commit to a plan that assumes the best case.",
        ],
      },
      {
        heading: "The funding problem",
        body: [
          "Knowing what the work costs is only half of it. The other half is whether you can pay for it, and when.",
          "Contractors on significant jobs generally want money before and during the work, not after the house sells. That timing is what makes major repairs impossible for a lot of homeowners — not the total figure, but the fact that it is needed now, from savings that are already committed elsewhere.",
          "There are financing routes that exist for this, and whether any of them make sense for you is a question for a lender or a financial professional rather than for us. What we can say plainly is that the timing problem is real and extremely common, and that it is not a sign of having done anything wrong.",
        ],
      },
      {
        heading: "What listing a house that needs work actually involves",
        body: [
          "A traditional listing assumes a prepared house. That assumption is worth making explicit, because it is where the costs hide.",
          "Preparing means completing the repairs, cleaning, often painting, sometimes staging, and then keeping the house in showable condition for as long as it takes to sell. It means being available for showings, which is harder if you have already moved, if tenants are in place, or if the house is a distance away. And it means carrying the property — taxes, insurance, utilities, any mortgage — for the entire period it sits on the market.",
          "There is also the disclosure side. Sellers are generally required to disclose known material defects, and the rules vary by state. A significant known problem does not disappear because the house is listed; it becomes something a buyer's inspector finds, and it typically returns as a price renegotiation or a request that the work be done before closing.",
        ],
      },
      {
        heading: "Listing as-is with an agent is a third option",
        body: [
          "The choice is often framed as repair-and-list versus sell-direct. There is a middle route that gets overlooked: listing the house as-is with a traditional agent.",
          "This can work well when the property is structurally sound but dated, when the area attracts buyers willing to take on a project, or when the price is set realistically for the condition from the start. A good agent will tell you honestly whether your house is a candidate, and it costs nothing to ask one.",
          "Its limits are worth knowing too. The pool of buyers shrinks, because financing gets harder as condition worsens — some loan types will not close on a house with an active roof leak or unsafe wiring. Showings still happen, so the house still has to be accessible. The sale can still fall through at inspection or appraisal. And the commission and carrying costs still apply while it sits.",
          "Ask two or three agents what they would list your house for as it stands, how long they would expect it to take, and what they would net you after costs. Do that before accepting any direct offer, not after.",
        ],
      },
      {
        heading: "Comparing the routes honestly",
        body: [
          "The comparison people usually make is the wrong one. A direct offer for the house as it stands is not comparable to a listing price for the house as it would be after repairs. Those are two different houses.",
          "The honest comparison is between what you would receive from a direct sale, and what you would realistically be left with after listing — which means the eventual sale price minus the repair costs, minus the months of carrying the property, minus the costs of the sale itself, and adjusted for the risk that the work uncovers something worse than expected.",
          "Run that comparison properly and one of two things happens. Either the listing route still comes out clearly ahead, in which case you should list, or the gap narrows to the point where the difference is mostly about how much disruption and risk you want to take on. Both outcomes are useful, and both are better than deciding on instinct.",
        ],
      },
      {
        heading: "The repairs that change the decision most",
        body: [
          "In our experience these are the issues that most often push a house toward an as-is sale, mainly because they are expensive, hard to scope, or affect a buyer's ability to finance the purchase:",
        ],
        list: [
          "A roof at or past the end of its life, particularly where water has already got in",
          "Foundation movement, or structural damage of any kind",
          "Failed or unsafe electrical systems, including outdated wiring a lender may object to",
          "Significant plumbing failures, and any long-running water intrusion or mold",
          "Fire or storm damage that was never fully repaired",
          "A property that needs to be substantially cleared out before anyone could view it",
        ],
      },
      {
        heading: "What you do not need to do before contacting anyone",
        body: [
          "This is worth stating directly, because a surprising number of homeowners delay asking for months out of embarrassment about the state of a house.",
          "You do not need to repair anything, clean anything, clear anything out, or make the property presentable before asking what your options are. A house full of belongings, a house mid-renovation, a house that has stood empty for years — these are ordinary to anyone who buys property directly, and they are not a reason to put off a conversation.",
          "You also do not need to have decided anything. Finding out what a house is worth in its current condition is information, not a commitment.",
        ],
      },
      {
        heading: "How this works with Royal Home Solutions",
        body: [
          "We purchase properties directly from homeowners in the condition they are in, which means the repair work becomes ours rather than yours. Some of those properties are renovated and later offered as move-in-ready homes.",
          "When we make an offer on a house needing significant work, the figure reflects the condition, the work we expect it to need, the uncertainty in scoping that work, and the costs of holding and transacting. We would rather walk you through that reasoning than hand over a number without one.",
          "And if the honest answer is that your house would do better prepared and listed, we would rather say so. A homeowner who sells directly when they did not need to has not been well served, whatever the transaction looked like on paper.",
        ],
      },
    ],
  },

  {
    slug: "selling-an-inherited-property",
    title: "Selling an Inherited Property: What Families Should Know",
    description:
      "Inheriting a house comes with decisions nobody prepares for. Who has authority to sell, the costs that continue while you decide, handling belongings, and how families navigate it when more than one person has inherited.",
    publishedAt: "2026-08-06",
    author: "Royal Home Solutions",
    intro: [
      "Inheriting a property is rarely a windfall in the way people imagine. It usually arrives alongside grief, at a moment when nobody has the appetite for administration, and it comes with a set of decisions that most families have never had to make before.",
      "This article covers the practical shape of that situation — what tends to need resolving, what continues costing money while you decide, and how families commonly approach it. It is deliberately not legal or tax guidance. Inheritance rules differ by state and by circumstance, and the professionals who handle this properly are estate attorneys and tax advisers. What follows is context, so the conversations you have with them are easier.",
    ],
    sections: [
      {
        heading: "First: who actually has authority to sell",
        body: [
          "Before anything else can happen, it has to be clear who is legally entitled to sell the property. This is the step that most often surprises families, because it is not the same as who inherits it.",
          "Depending on how the estate was arranged, authority may sit with an executor named in a will, an administrator appointed by a court, a trustee, or with heirs directly. Whether the estate needs to go through probate — and how long that takes — depends on your state, the value of the estate, and how the property was titled.",
          "This is the part to take to an estate attorney early rather than late. Not because it is necessarily complicated, but because everything else depends on the answer, and a family that spends two months planning a sale before discovering who is entitled to sign has lost two months.",
        ],
      },
      {
        heading: "The costs that continue while you decide",
        body: [
          "An inherited house does not pause while a family works out what to do with it. This is the practical pressure that most often drives the timing of a decision:",
        ],
        list: [
          "Property taxes, which continue regardless of whether anyone lives there",
          "Insurance, which usually needs to change once the property is unoccupied",
          "Utilities, which generally need to stay on to prevent freezing, damp and deterioration",
          "Any remaining mortgage, loan or lien secured against the property",
          "Basic upkeep — lawn, gutters, and enough presence that the house does not look abandoned",
          "Travel, if the property is in a different city or state from the people responsible for it",
        ],
      },
      {
        heading: "Insurance on an empty house is its own issue",
        body: [
          "This one catches families out regularly, so it is worth flagging on its own.",
          "Most standard homeowners policies are written on the assumption that somebody lives in the house. Once a property has been unoccupied for a period — often measured in weeks rather than months — coverage can be reduced or lapse entirely, exactly when the risks of an empty property are highest.",
          "Call the insurer and tell them the situation. There are policies written specifically for vacant properties. Whether you need one is a question for the insurer, but discovering the gap after a burst pipe is considerably worse than asking now.",
        ],
      },
      {
        heading: "When more than one person has inherited",
        body: [
          "Shared inheritance is where most of the difficulty lives, and it is rarely about the house.",
          "Siblings often want genuinely different things, for reasons that are all legitimate. One wants to keep a childhood home. One needs their share of the money. One lives nearby and has absorbed all the practical work while the others have not. One wants it dealt with quickly so they can stop thinking about it. These are not unreasonable positions, and they are hard to reconcile because they are not really about property.",
          "What tends to help is separating the decisions. Whether to sell is one question. What to do with belongings is another. How to divide proceeds is a third, and it is usually governed by the will or by state law rather than by negotiation. Families that treat these as one large argument tend to stall; families that resolve them one at a time tend to get through it.",
          "Where agreement genuinely cannot be reached, that is a question for an attorney. There are established routes through it, and they are better than a stalemate that leaves an empty house costing everyone money for another year.",
        ],
      },
      {
        heading: "Clearing out a lifetime of belongings",
        body: [
          "This is frequently the hardest part, and it has almost nothing to do with the transaction.",
          "Sorting through a parent's home is emotionally heavy work, and it takes far longer than anyone estimates. It is also the task that most often stalls everything else — the house cannot be shown, cannot be prepared, and sometimes cannot be properly assessed until it is done.",
          "It is worth knowing that clearing the property is not a prerequisite for every route. A traditional listing generally requires it, because buyers need to see the house. A direct sale usually does not — we assess properties with belongings still in them regularly, and families often take what matters to them and leave the rest.",
          "If you do clear it, give yourself more time than seems necessary, and do not do it alone if you can avoid it.",
        ],
      },
      {
        heading: "Keep it, rent it, or sell it",
        body: [
          "All three are legitimate, and the right answer depends on things only your family knows.",
          "Keeping it makes sense when someone wants to live there and the property is in reasonable condition. Renting it can work, but it is worth being honest that becoming a landlord is a job, and doing it remotely, on a house that may need work, while an estate is being settled, is a demanding way to start.",
          "Selling makes sense when nobody wants to live in it, the ongoing costs are a burden, the property needs work the family cannot fund, or when the people involved simply want the matter closed. There is no obligation to keep a house out of sentiment, and there is nothing wrong with deciding you would rather not carry it.",
          "There are tax consequences to each of these routes, and they vary considerably by circumstance. That is a conversation for a tax professional before you decide, not after.",
        ],
      },
      {
        heading: "What a direct sale looks like in this situation",
        body: [
          "For inherited properties specifically, the parts of a direct sale that families tend to find useful are the ones that remove work rather than the ones that involve speed.",
          "There is no preparation, so nobody has to fund repairs on a house they never chose to own. There are no showings, which matters when the property is hours away or when the family has no appetite for strangers walking through it. And the house does not need to be cleared out first.",
          "The timeline is a conversation rather than a promise. Estates move at the pace probate and title work allow, and anyone guaranteeing a specific closing date before either is resolved is describing a hope. In our experience families more often want a date they can plan around than the earliest possible one.",
        ],
      },
      {
        heading: "How Royal Home Solutions can and cannot help",
        body: [
          "We purchase properties directly from owners, including inherited properties, in whatever condition they are in. When we buy directly we are the buyer, not a listing agent, and there is no listing-agent commission in that transaction. Some of the homes we purchase are renovated and later offered as move-in-ready properties.",
          "What we cannot do is act as your attorney or your tax adviser, and we would be wary of any property company that offered to. We can tell you what we would pay for a property as it stands and explain how we arrived at it. Questions about probate, authority to sell, how proceeds are divided, or what any of it means for your tax position belong with professionals who are qualified to answer them.",
          "If it helps to have a figure in hand while the rest is being worked out, that is a reasonable thing to ask for, and it commits you to nothing.",
        ],
      },
    ],
  },

  {
    slug: "what-south-florida-homeowners-should-consider-before-selling",
    title:
      "What South Florida Homeowners Should Consider Before Selling a Property",
    description:
      "A practical checklist before you sell: getting clear on your own goal, assessing condition honestly, weighing a listing against a direct sale, and the questions worth asking before you accept anything.",
    publishedAt: "2026-08-07",
    author: "Royal Home Solutions",
    intro: [
      "Most advice about selling a house starts with how to sell. That is the second question. The first is what you actually need out of it — and homeowners who skip that step often end up optimising for something that was never their priority.",
      "This article is a checklist to work through before you commit to a route. It is written with South Florida and East Coast homeowners in mind, where insurance, storm exposure and association rules shape the decision more than they do elsewhere. It is general information, not legal, tax or financial advice; the professionals named throughout are the ones qualified to advise on your specific situation.",
    ],
    sections: [
      {
        heading: "Start with your actual goal, not the sale price",
        body: [
          "Ask what would make this a good outcome, specifically. The honest answer is rarely just the highest number.",
          "For some homeowners it genuinely is the net proceeds, and they have the time and money to pursue it. For others it is certainty — knowing the sale will close rather than fall through. For others it is timing, because a job starts, a lease begins, or a property has become a monthly cost they cannot keep carrying. For plenty it is simply being done with a house that has become a burden.",
          "These lead to different decisions. A homeowner optimising for the highest price should almost certainly prepare the property and list it. A homeowner optimising for certainty and timing may reasonably trade some of that price for both. Neither is wrong, but pursuing one while believing you want the other is how people end up disappointed by an outcome they chose.",
        ],
      },
      {
        heading: "Assess the property's condition honestly",
        body: [
          "Condition drives more of the outcome than almost anything else, and it is the area where homeowners are least objective — you stop seeing the things you have lived alongside for years.",
          "The practical fix is to get outside eyes on it. A pre-listing inspection tells you what a buyer's inspector would find, before it becomes a renegotiation. Written contractor estimates turn a vague worry into a number you can actually plan around. Both cost time rather than much money, and both put you in a stronger position on any route you choose.",
          "In this region a few items carry disproportionate weight, because they affect whether a buyer can insure or finance the property at all:",
        ],
        list: [
          "Roof age and condition — insurers pay close attention here, and an older roof can affect a buyer's ability to get coverage",
          "Windows, shutters and other storm protection, and whether openings meet current requirements",
          "Any history of water intrusion, and whether it was properly repaired or covered over",
          "Electrical panels and wiring of a type insurers or lenders may question",
          "For condos and HOA properties, the association's own condition — reserves, upcoming assessments and inspection status can matter as much as your unit",
        ],
      },
      {
        heading: "Understand what a traditional listing really asks of you",
        body: [
          "A listing is the right route for a lot of properties, and it usually produces the highest gross price. It is worth being clear-eyed about what it requires in exchange.",
          "It assumes a prepared house: repairs completed, cleaned, often painted, sometimes staged, and kept showable for as long as it takes. It assumes you can carry the property meanwhile — taxes, insurance, utilities, any mortgage — for a period nobody can tell you in advance. And it assumes you can absorb the costs of the sale itself, including commissions, at closing.",
          "There is also the buyer-financing variable. A sale that depends on a mortgage depends on an appraisal and an underwriter, and on the property being insurable at a price the buyer can carry. In markets where insurance costs have become a live part of buyers' calculations, that is a real source of deals falling through late.",
        ],
      },
      {
        heading: "Understand what a direct sale really offers",
        body: [
          "A direct sale to a company that buys properties removes most of that. No preparation, no showings, no buyer financing to fall through, and the repair work becomes the buyer's problem rather than yours.",
          "What you give up is the premium a prepared, marketed house can attract from a retail buyer who has fallen in love with it. That premium is real, and any company suggesting otherwise is overselling.",
          "The comparison that matters is not the direct offer against a listing price. It is the direct offer against what you would realistically be left with after listing — sale price, minus repairs, minus months of carrying costs, minus the costs of the sale, adjusted for the chance that a deal falls through and you start again. Run it properly and the answer is usually clear in one direction or the other.",
        ],
      },
      {
        heading: "Weigh timing and convenience as real value, not weakness",
        body: [
          "Homeowners often treat convenience as something they should be embarrassed to want. It is a legitimate thing to buy, and you buy it with price.",
          "It is worth putting rough numbers on. What does another four months of carrying this property cost, in taxes, insurance, utilities and loan payments? What is your time worth across managing contractors, keeping a house showable, and coordinating around showings? If you have already moved, what does managing it from a distance cost in travel and stress?",
          "Once those are on the page, the gap between a listing outcome and a direct offer usually looks different than it did as an abstract comparison — sometimes wider, sometimes much narrower. Either way you are deciding with information rather than instinct.",
        ],
      },
      {
        heading: "Questions worth asking before you accept any offer",
        body: [
          "These apply to anyone making you an offer, us included. The answers tell you as much as the number does:",
        ],
        list: [
          "How did you arrive at this figure, and which parts relate to the property's condition?",
          "Is this offer conditional on anything — an inspection, financing, a partner's approval?",
          "Are you the buyer, or are you assigning this contract to someone else?",
          "What costs come out of the amount I would receive, and what am I responsible for at closing?",
          "What could delay closing, and how would I be told?",
          "What happens if I want a week to think about it, or if I say no?",
          "Will you put all of this in writing?",
        ],
      },
      {
        heading: "Be wary of guaranteed outcomes",
        body: [
          "Some claims should lower your confidence in whoever is making them, not raise it.",
          "Nobody can guarantee a closing date before a title search is done — title issues are common, usually resolvable, and the most frequent reason a date moves. Nobody can guarantee a specific figure before seeing the property. An offer that expires in hours exists to stop you comparing it against anything else. And a number that shifts each time you ask how it was calculated was not calculated.",
          "A genuine offer survives you thinking about it overnight, showing it to a family member, and asking an agent what they would list the house for. Anyone discouraging you from doing those things is telling you something useful about themselves.",
        ],
      },
      {
        heading: "Where to get advice we cannot give",
        body: [
          "Some of this decision sits outside what any property buyer should be advising you on, and we would be wary of one that offered to.",
          "Questions about tax consequences belong with a tax professional. Questions about title, probate, divorce, liens or what you are obliged to disclose belong with an attorney. Questions about insurability and what coverage would cost a future buyer belong with an insurance agent. Questions about what your house would realistically list for, and how long that might take, are worth asking a local agent — including before you accept a direct offer.",
          "Royal Home Solutions purchases properties directly from homeowners, renovates select homes, and resells a limited number of move-in-ready properties. When we make an offer we would rather explain the reasoning behind it than present a number without one — and if a listing would genuinely serve you better, we would rather say so than have you find out afterwards.",
        ],
      },
    ],
  },

  {
    slug: "how-to-sell-an-inherited-property-in-south-florida",
    title: "How to Sell an Inherited Property in South Florida",
    description:
      "The practical mechanics of selling an inherited home in South Florida: confirming who can sign, the costs that keep running, insurance and association obligations, and how a listing compares with a direct sale.",
    publishedAt: "2026-08-07",
    author: "Royal Home Solutions",
    intro: [
      "Selling an inherited house is mostly an administrative problem wearing an emotional one. The grief is real, and so is the pile of paperwork that arrives with it — and in South Florida a few local factors, insurance and association obligations especially, make the second part heavier than families expect.",
      "This article walks through the practical sequence: establishing who can actually sell, understanding what the property costs while you decide, and comparing your routes to a sale. It is general information only — not legal, tax, or financial advice. Inheritance rules turn on details specific to each estate, and an estate attorney and a tax professional are the people qualified to advise on yours.",
    ],
    sections: [
      {
        heading: "Step one: confirm who has authority to sell",
        body: [
          "Nothing else can move until this is settled, and it is not the same question as who inherits.",
          "Authority may rest with a personal representative named in a will, someone appointed by a court, a trustee if the property was held in trust, or with heirs directly. How the deed was titled matters enormously — a property held jointly with rights of survivorship, or with a recorded transfer-on-death arrangement, may pass very differently from one held in the deceased person's name alone.",
          "Get this confirmed by an estate attorney early. It is a short conversation for someone who does this daily, and families that plan a sale for two months before discovering who is entitled to sign have lost two months.",
        ],
      },
      {
        heading: "Probate, in general terms",
        body: [
          "Probate is the court process that confirms authority to deal with a deceased person's assets. Whether an estate needs it, and which form applies, depends on the estate's size, how assets were titled, and whether there is a will. Florida has more than one procedural track, and which one fits is a legal determination — not something to decide from an article.",
          "Two things are worth knowing regardless. First, a property can usually be marketed and put under contract while an estate is still being administered, though the closing itself waits on the authority being in place. Second, probate timelines vary widely and are largely outside anyone's control, which is why no responsible buyer will guarantee a closing date at the outset.",
          "If someone tells you probate can be skipped or hurried in a way your attorney has not confirmed, treat that as a reason for caution.",
        ],
      },
      {
        heading: "When more than one person has inherited",
        body: [
          "Shared inheritance is where most of the friction lives, and it is rarely really about the house.",
          "One sibling wants to keep a childhood home. One needs their share now. One lives nearby and has quietly absorbed every practical task. One wants it finished so they can stop thinking about it. All of these are reasonable, and they are hard to reconcile because they are not primarily financial positions.",
          "What helps is separating the decisions and taking them one at a time: whether to sell, what happens to belongings, and how proceeds are divided — the last usually governed by the will or by law rather than by negotiation. Agree on one person to be the point of contact for anyone outside the family, and put decisions in writing as you go, even informally. Where agreement genuinely cannot be reached, that is a question for an attorney; there are established routes through it, and they beat an empty house costing everyone money for another year.",
        ],
      },
      {
        heading: "Condition and belongings",
        body: [
          "Inherited homes are often behind on maintenance, sometimes by years, because the person who lived there could no longer keep up with it. Deferred work tends to concentrate in exactly the places that matter most here: roofs, air conditioning, plumbing and anything touched by water.",
          "Then there are the contents. Clearing a lifetime of belongings is the task that most often stalls everything else, and it takes far longer than anyone estimates. It is worth knowing that clearing is not required on every route — a traditional listing generally needs it because buyers have to see the house, while a direct sale usually does not. Families frequently take what matters to them and leave the rest.",
          "If you do clear it, give yourself more time than seems necessary, and try not to do it alone.",
        ],
      },
      {
        heading: "The costs that keep running while you decide",
        body: [
          "An inherited property does not pause. These continue from the day it becomes your responsibility, and together they are usually what sets the timeline:",
        ],
        list: [
          "Property taxes, which continue whether or not anyone lives there",
          "Insurance — and note that a policy written for an occupied home may lapse or be reduced once the house sits empty, exactly when the risk is highest. Tell the insurer the situation and ask what is needed for a vacant property",
          "Utilities, which generally need to stay on: air conditioning running at some level is what keeps humidity and mold in check in this climate",
          "Any remaining mortgage, loan, lien or unpaid assessment secured against the property",
          "HOA or condo association dues, which keep accruing — and for condominiums, any special assessment already levied or scheduled",
          "Basic upkeep: lawn, roof debris, and enough presence that the property does not look abandoned",
          "Travel and time, if the property is a flight away from whoever is responsible for it",
        ],
      },
      {
        heading: "If it is a condo or in an association",
        body: [
          "This is where South Florida differs most from other markets, and it catches families out.",
          "For an association property, the buyer is taking on the association as much as the unit. Reserve levels, any assessment already approved, the status of required structural inspections on older buildings, and the association's own insurance all affect what a buyer will pay and, for financed buyers, whether a lender will approve the purchase at all.",
          "Request the association's documents and an estoppel letter early — the estoppel states exactly what is owed on the unit at closing, and it is required for the sale anyway. Getting it early means the number does not surprise anyone late. Rules on approvals, leasing restrictions and transfer fees vary by association, so read them rather than assuming.",
        ],
      },
      {
        heading: "Listing it versus selling directly",
        body: [
          "Both are legitimate, and the right answer depends on the property and on what the family needs.",
          "A traditional listing generally produces the highest gross price, and for a well-maintained home in a desirable location it is usually the right call. It assumes the house is cleared, presentable and accessible for showings, that someone can carry it while it sits, and that a financed buyer can get insurance and an appraisal to line up. It also assumes the family can absorb the costs of the sale at closing.",
          "A direct sale trades some of that price for the removal of nearly all of it: no clearing, no repairs, no showings, no buyer financing to collapse. What you give up is the premium a prepared, marketed home can attract.",
          "Compare them properly. Not the direct offer against a listing price, but the direct offer against what the estate would realistically net after clearing, repairs, months of carrying costs, association dues and the costs of the sale — adjusted for the chance a deal falls through and it starts again. If you want a figure to hold against those numbers, you can [tell us about the property](/sell-your-home) and there is no obligation attached to receiving one.",
        ],
      },
      {
        heading: "Questions to ask before accepting any offer",
        body: [
          "These apply to any buyer, us included. The answers tell you as much as the number:",
        ],
        list: [
          "How did you arrive at this figure, and which parts relate to the property's condition?",
          "Are you the actual buyer, or are you assigning this contract to someone else?",
          "Is the offer conditional on anything — an inspection, financing, a partner's approval?",
          "How will you handle the fact that the estate is still being administered?",
          "What comes out of the amount the estate receives, and what are we responsible for at closing?",
          "What could delay closing, and how would we hear about it?",
          "What happens if we want a week to think, or decide not to proceed?",
          "Will you put all of this in writing?",
        ],
      },
      {
        heading: "Talk to the right professionals",
        body: [
          "Some of this decision sits outside what any property buyer should be advising you on, and we would be wary of one that offered to.",
          "An estate attorney handles authority to sell, probate, and how proceeds are divided. A tax professional handles the tax consequences of selling versus keeping or renting, which vary considerably by circumstance and are worth understanding before you decide rather than after. An insurance agent can tell you what coverage a vacant property needs now. And a local real estate agent can tell you what the house would realistically list for and how long that might take — a conversation worth having before accepting any direct offer, not after.",
          "Royal Home Solutions purchases properties directly from owners, including inherited homes, in whatever condition they are in. We are the buyer in that transaction, not a listing agent, and there is no listing-agent commission involved. We cannot commit to purchasing every property, and we will not tell you a direct sale is right when a listing would serve the estate better. If you have a question and are not sure where it belongs, [get in touch](/contact) and we will tell you honestly whether it is one for us or for your attorney.",
        ],
      },
    ],
  },
];

/**
 * Newest first, everywhere the blog is rendered — the homepage section, the
 * /blog index and the static params all read this. Sorting by date rather than
 * hand-ordering the array means a new article only needs a correct
 * `publishedAt` to land in the right place.
 *
 * Array.prototype.sort is stable, so posts sharing a date keep the authoring
 * order above rather than shuffling between builds.
 */
export const blogPosts: BlogPost[] = [...articles].sort(
  (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
);

/** Words per minute used for the reading-time estimate. */
const WORDS_PER_MINUTE = 225;

/** Every word in a post, so reading time is measured rather than guessed. */
export function wordCount(post: BlogPost): number {
  const text = [
    post.title,
    ...post.intro,
    ...post.sections.flatMap((s) => [s.heading, ...s.body, ...(s.list ?? [])]),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

/** Reading time in whole minutes, minimum 1. */
export function readingMinutes(post: BlogPost): number {
  return Math.max(1, Math.round(wordCount(post) / WORDS_PER_MINUTE));
}

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Long-form date for display, e.g. "30 July 2026". */
export function formatPublished(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
