/**
 * Blog articles.
 *
 * All four articles are ORIGINAL work written for Royal Home Solutions and
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

export const blogPosts: BlogPost[] = [
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
];

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
