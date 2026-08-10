import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  MAX_REQUEST_BYTES,
  TURNSTILE_FIELD,
} from "@/lib/botProtection";
import { resetRateLimits } from "@/lib/rateLimit";
import { routeSources } from "@/lib/formSources";
import { turnstileActions, type TurnstileAction } from "@/lib/turnstileActions";

/**
 * The contract that matters: no path through any public endpoint reaches Resend
 * unless Turnstile passed server-side.
 *
 * Resend and Cloudflare are both mocked. Nothing here touches a real API, and
 * the assertion in almost every case is the same one — `expect(sent).toBe(0)`.
 */

const { sendMock, contactsCreateMock, appendLeadMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  contactsCreateMock: vi.fn(),
  appendLeadMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
    contacts = { create: contactsCreateMock };
  },
}));

vi.mock("@/lib/leadStore", () => ({ appendLead: appendLeadMock }));

import { POST as sellerLeads } from "@/app/api/seller-leads/route";
import { POST as buyerInterest } from "@/app/api/buyer-interest/route";
import { POST as contact } from "@/app/api/contact/route";
import { POST as newsletter } from "@/app/api/newsletter/route";

const VALID_TOKEN = "cf-token-that-cloudflare-will-approve";

/** Fields every protected form sends alongside its own data. */
const protection = {
  [HONEYPOT_FIELD]: "",
  [ELAPSED_FIELD]: 8_000,
  [TURNSTILE_FIELD]: VALID_TOKEN,
};

interface RouteCase {
  name: string;
  handler: (request: Request) => Promise<Response>;
  path: string;
  body: Record<string, unknown>;
  /** How many Resend calls a fully successful submission makes. */
  expectedSends: number;
  /** A payload that fails server validation but is otherwise well-formed. */
  invalid: Record<string, unknown>;
  /** The action this route must demand from siteverify. */
  action: TurnstileAction;
  /** The attribution the route assigns itself, regardless of the payload. */
  source: string;
}

const routes: RouteCase[] = [
  {
    name: "seller-leads",
    handler: sellerLeads,
    path: "/api/seller-leads",
    expectedSends: 2,
    action: turnstileActions.sellerLead,
    source: routeSources.sellerLeads,
    body: {
      firstName: "Ada",
      lastName: "Lovelace",
      phone: "(555) 123-4567",
      email: "ada@example.com",
      propertyAddress: "1 Main Street, Orlando FL",
      timeline: "ASAP",
      message: "Looking to move soon.",
      source: "sell_your_home_page",
      ...protection,
    },
    invalid: {
      firstName: "",
      lastName: "",
      phone: "12",
      email: "not-an-email",
      propertyAddress: "",
      timeline: "Whenever",
      ...protection,
    },
  },
  {
    name: "buyer-interest",
    handler: buyerInterest,
    path: "/api/buyer-interest",
    expectedSends: 2,
    action: turnstileActions.buyerInterest,
    source: routeSources.buyerInterest,
    body: {
      firstName: "Grace",
      lastName: "Hopper",
      phone: "(555) 987-6543",
      email: "grace@example.com",
      priceRange: "Not sure yet",
      timeline: "Ready now",
      interestedProperty: "",
      message: "",
      source: "buy_a_home_page",
      ...protection,
    },
    invalid: {
      firstName: "Grace",
      lastName: "Hopper",
      phone: "(555) 987-6543",
      email: "grace@example.com",
      priceRange: "A billion dollars",
      timeline: "Ready now",
      ...protection,
    },
  },
  {
    name: "contact",
    handler: contact,
    path: "/api/contact",
    expectedSends: 2,
    action: turnstileActions.contact,
    source: routeSources.contact,
    body: {
      name: "Alan Turing",
      email: "alan@example.com",
      phone: "",
      inquiryType: "general",
      message: "Do you buy in Tampa?",
      source: "contact_page",
      ...protection,
    },
    invalid: {
      name: "Alan Turing",
      email: "alan@example.com",
      inquiryType: "not-a-real-type",
      message: "Do you buy in Tampa?",
      ...protection,
    },
  },
];

/** The newsletter uses `contacts.create` rather than `emails.send`. */
const newsletterCase = {
  path: "/api/newsletter",
  body: { email: "subscriber@example.com", ...protection },
};

function post(path: string, body: unknown, ip = "203.0.113.7"): Request {
  return new Request(`https://royalhomesolutions.com${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
      host: "royalhomesolutions.com",
      origin: "https://royalhomesolutions.com",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

/** Total Resend calls of any kind. The number this suite exists to check. */
function resendCalls(): number {
  return sendMock.mock.calls.length + contactsCreateMock.mock.calls.length;
}

/**
 * Stubs siteverify. `hostname` defaults to ours so a test only has to state
 * the part it cares about.
 */
function cloudflareSays(
  payload: Record<string, unknown>,
  status = 200,
): void {
  const body = { hostname: "royalhomesolutions.com", ...payload };
  // A fresh Response per call — a body can only be consumed once, and the
  // rate-limit tests call siteverify five times in a row.
  fetchMock.mockImplementation(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      }),
  );
}

/** The everything-is-fine answer for a given operation. */
function cloudflareApproves(action: TurnstileAction): void {
  cloudflareSays({ success: true, action });
}

beforeEach(() => {
  vi.clearAllMocks();
  resetRateLimits();

  sendMock.mockResolvedValue({ data: { id: "email_1" }, error: null });
  contactsCreateMock.mockResolvedValue({ data: { id: "c_1" }, error: null });
  appendLeadMock.mockResolvedValue(null);

  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  // Keep the run readable; individual tests re-spy when they assert on output.
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe.each(routes)("$name", (route) => {
  // Cloudflare answers with the action this route is supposed to demand.
  beforeEach(() => cloudflareApproves(route.action));

  it("sends email when Turnstile passes and the payload is valid", async () => {
    const response = await route.handler(post(route.path, route.body));

    expect(response.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(route.expectedSends);
  });

  it("verifies the token with Cloudflare before sending anything", async () => {
    await route.handler(post(route.path, route.body));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("challenges.cloudflare.com");
    expect(new URLSearchParams(init.body as string).get("response")).toBe(
      VALID_TOKEN,
    );
  });

  it("sends nothing when the Turnstile token is missing", async () => {
    const { [TURNSTILE_FIELD]: _omitted, ...withoutToken } = route.body;

    const response = await route.handler(post(route.path, withoutToken));

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends nothing for a client-supplied 'captchaPassed' boolean", async () => {
    const { [TURNSTILE_FIELD]: _omitted, ...rest } = route.body;

    const response = await route.handler(
      post(route.path, { ...rest, captchaPassed: true, turnstileToken: true }),
    );

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("sends nothing when Cloudflare rejects the token", async () => {
    cloudflareSays({ success: false, "error-codes": ["invalid-input-response"] });

    const response = await route.handler(post(route.path, route.body));

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("sends nothing when Cloudflare cannot be reached", async () => {
    fetchMock.mockRejectedValue(new Error("ENOTFOUND"));

    const response = await route.handler(post(route.path, route.body));

    expect(response.status).toBe(503);
    expect(resendCalls()).toBe(0);
  });

  it("sends nothing when TURNSTILE_SECRET_KEY is unset", async () => {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;

    const response = await route.handler(post(route.path, route.body));
    process.env.TURNSTILE_SECRET_KEY = secret;

    expect(response.status).toBe(503);
    expect(resendCalls()).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends nothing when the honeypot is filled, while looking like success", async () => {
    const response = await route.handler(
      post(route.path, {
        ...route.body,
        [HONEYPOT_FIELD]: "https://cheap-pills.example",
      }),
    );

    // Deliberately a 200: a bot must not learn the hidden field is a trap.
    expect(response.status).toBe(200);
    expect(resendCalls()).toBe(0);
    // Rejected before Cloudflare is troubled with it.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("marks the honeypot response so the browser suppresses conversion tracking", async () => {
    const response = await route.handler(
      post(route.path, { ...route.body, [HONEYPOT_FIELD]: "bot" }),
    );

    // `delivered: false` is what stops SellerLeadForm firing a Meta Pixel
    // Lead event for a submission that created nothing.
    await expect(response.json()).resolves.toEqual({
      ok: true,
      delivered: false,
    });
  });

  it("sends nothing when the token was solved on another hostname", async () => {
    cloudflareSays({
      success: true,
      action: route.action,
      hostname: "phishing-royalhomesolutions.example",
    });

    const response = await route.handler(post(route.path, route.body));

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("sends nothing when the token carries a different action", async () => {
    // A token minted by the footer newsletter widget, replayed here.
    cloudflareSays({ success: true, action: turnstileActions.newsletter });

    const response = await route.handler(post(route.path, route.body));

    expect(response.status).toBe(route.action === turnstileActions.newsletter ? 200 : 400);
    if (route.action !== turnstileActions.newsletter) {
      expect(resendCalls()).toBe(0);
    }
  });

  it("sends nothing when the token carries no action at all", async () => {
    cloudflareSays({ success: true });

    const response = await route.handler(post(route.path, route.body));

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("sends nothing for an implausibly fast submission", async () => {
    const response = await route.handler(
      post(route.path, { ...route.body, [ELAPSED_FIELD]: 40 }),
    );

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("still accepts a submission with no timing information at all", async () => {
    const { [ELAPSED_FIELD]: _omitted, ...withoutTiming } = route.body;

    const response = await route.handler(post(route.path, withoutTiming));

    expect(response.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(route.expectedSends);
  });

  it("sends nothing for an invalid payload", async () => {
    const response = await route.handler(post(route.path, route.invalid));

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
    // Validation runs before Turnstile, so no siteverify call is spent either.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ignores a client-supplied source and stamps its own", async () => {
    const response = await route.handler(
      post(route.path, { ...route.body, source: "injected_by_a_bot" }),
    );

    expect(response.status).toBe(200);

    // Attribution reaches the inbox from the server's constant, never the
    // caller's field, so nothing a bot sends can change what Jonah reads.
    const internal = sendMock.mock.calls[0][0] as { text: string };
    expect(internal.text).toContain(route.source);
    expect(internal.text).not.toContain("injected_by_a_bot");
  });

  it("sends nothing for an oversized payload", async () => {
    const response = await route.handler(
      post(route.path, {
        ...route.body,
        message: "x".repeat(MAX_REQUEST_BYTES + 100),
      }),
    );

    expect(response.status).toBe(413);
    expect(resendCalls()).toBe(0);
  });

  it("sends nothing for a malformed body", async () => {
    const response = await route.handler(post(route.path, "{not json"));

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("sends nothing once the caller is rate limited", async () => {
    const ip = "198.51.100.9";

    // Default allowance is 5 per window.
    for (let i = 0; i < 5; i += 1) {
      const ok = await route.handler(post(route.path, route.body, ip));
      expect(ok.status).toBe(200);
    }

    const sendsBefore = resendCalls();
    const blocked = await route.handler(post(route.path, route.body, ip));

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    expect(resendCalls()).toBe(sendsBefore);
  });

  it("does not let bot traffic burn a real customer's submission allowance", async () => {
    // The scenario that matters: an office or mobile-carrier NAT where a bot
    // and a genuine customer share one public address.
    const ip = "198.51.100.22";
    const spam = { ...route.body, [HONEYPOT_FIELD]: "spam" };

    for (let i = 0; i < 10; i += 1) {
      await route.handler(post(route.path, spam, ip));
    }
    expect(resendCalls()).toBe(0);

    // The customer behind the same IP is still served.
    const genuine = await route.handler(post(route.path, route.body, ip));
    expect(genuine.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(route.expectedSends);
  });

  it("still stops an IP hammering the endpoint", async () => {
    const ip = "198.51.100.33";
    const junk = "{not json";

    // The coarse abuse ceiling counts every request, valid or not.
    for (let i = 0; i < 30; i += 1) {
      await route.handler(post(route.path, junk, ip));
    }

    const blocked = await route.handler(post(route.path, route.body, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    expect(resendCalls()).toBe(0);
  });

  it("gives the same generic message for timing and Turnstile failures", async () => {
    const tooFast = await route.handler(
      post(route.path, { ...route.body, [ELAPSED_FIELD]: 5 }),
    );
    resetRateLimits();

    cloudflareSays({ success: false, "error-codes": ["invalid-input-response"] });
    const badToken = await route.handler(post(route.path, route.body));

    const messages = await Promise.all(
      [tooFast, badToken].map(async (r) => (await r.json()).error),
    );

    expect(new Set(messages).size).toBe(1);
  });
});

describe("newsletter", () => {
  beforeEach(() => cloudflareApproves(turnstileActions.newsletter));

  it("subscribes when Turnstile passes", async () => {
    const response = await newsletter(
      post(newsletterCase.path, newsletterCase.body),
    );

    expect(response.status).toBe(200);
    expect(contactsCreateMock).toHaveBeenCalledTimes(1);
  });

  it("adds nobody when the Turnstile token is missing", async () => {
    const { [TURNSTILE_FIELD]: _omitted, ...withoutToken } =
      newsletterCase.body;

    const response = await newsletter(post(newsletterCase.path, withoutToken));

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("adds nobody when Cloudflare rejects the token", async () => {
    cloudflareSays({ success: false, "error-codes": ["invalid-input-response"] });

    const response = await newsletter(
      post(newsletterCase.path, newsletterCase.body),
    );

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("adds nobody when the honeypot is filled, while looking like success", async () => {
    const response = await newsletter(
      post(newsletterCase.path, {
        ...newsletterCase.body,
        [HONEYPOT_FIELD]: "bot",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      delivered: false,
    });
    expect(resendCalls()).toBe(0);
  });

  it("adds nobody for a token minted by a different form", async () => {
    cloudflareSays({ success: true, action: turnstileActions.sellerLead });

    const response = await newsletter(
      post(newsletterCase.path, newsletterCase.body),
    );

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("adds nobody for a token solved on another hostname", async () => {
    cloudflareSays({
      success: true,
      action: turnstileActions.newsletter,
      hostname: "evil.example",
    });

    const response = await newsletter(
      post(newsletterCase.path, newsletterCase.body),
    );

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("adds nobody for an invalid email", async () => {
    const response = await newsletter(
      post(newsletterCase.path, { ...newsletterCase.body, email: "nope" }),
    );

    expect(response.status).toBe(400);
    expect(resendCalls()).toBe(0);
  });

  it("adds nobody for an oversized payload", async () => {
    const response = await newsletter(
      post(newsletterCase.path, {
        ...newsletterCase.body,
        padding: "x".repeat(MAX_REQUEST_BYTES),
      }),
    );

    expect(response.status).toBe(413);
    expect(resendCalls()).toBe(0);
  });

  it("allows a quick single-field signup that the lead forms would reject", async () => {
    const response = await newsletter(
      post(newsletterCase.path, { ...newsletterCase.body, [ELAPSED_FIELD]: 700 }),
    );

    expect(response.status).toBe(200);
    expect(contactsCreateMock).toHaveBeenCalledTimes(1);
  });
});

describe("security logging", () => {
  it("never writes the Turnstile secret or the full token to the log", async () => {
    vi.restoreAllMocks();
    const lines: string[] = [];
    const capture = (...args: unknown[]) => void lines.push(args.join(" "));
    vi.spyOn(console, "warn").mockImplementation(capture);
    vi.spyOn(console, "info").mockImplementation(capture);
    vi.spyOn(console, "error").mockImplementation(capture);

    cloudflareSays({ success: false, "error-codes": ["invalid-input-response"] });
    await buyerInterest(
      post("/api/buyer-interest", routes[1].body, "203.0.113.42"),
    );

    const output = lines.join("\n");
    expect(output).toContain("form_rejected: turnstile_failed");
    expect(output).not.toContain(process.env.TURNSTILE_SECRET_KEY as string);
    expect(output).not.toContain(VALID_TOKEN);
    expect(output).not.toContain(process.env.RESEND_API_KEY as string);
  });

  it("logs only the network prefix of an IP, never the full address", async () => {
    vi.restoreAllMocks();
    const lines: string[] = [];
    const capture = (...args: unknown[]) => void lines.push(args.join(" "));
    vi.spyOn(console, "warn").mockImplementation(capture);
    vi.spyOn(console, "info").mockImplementation(capture);
    vi.spyOn(console, "error").mockImplementation(capture);

    await buyerInterest(
      post(
        "/api/buyer-interest",
        { ...routes[1].body, [HONEYPOT_FIELD]: "bot" },
        "203.0.113.42",
      ),
    );

    const output = lines.join("\n");
    expect(output).toContain("203.0.113.x");
    // The limiter still keys on the full address in memory; it just isn't
    // written down where it would be retained.
    expect(output).not.toContain("203.0.113.42");
  });

  it("does not log the visitor's email, phone or message", async () => {
    vi.restoreAllMocks();
    const lines: string[] = [];
    const capture = (...args: unknown[]) => void lines.push(args.join(" "));
    vi.spyOn(console, "warn").mockImplementation(capture);
    vi.spyOn(console, "info").mockImplementation(capture);
    vi.spyOn(console, "error").mockImplementation(capture);

    await contact(
      post("/api/contact", { ...routes[2].body, [HONEYPOT_FIELD]: "bot" }),
    );

    const output = lines.join("\n");
    expect(output).not.toContain("alan@example.com");
    expect(output).not.toContain("Do you buy in Tampa?");
  });
});
