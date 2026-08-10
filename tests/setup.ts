/**
 * Global test environment.
 *
 * Every value here is fake. Nothing in this suite may reach Cloudflare, Resend,
 * or any other network service — `resend` is mocked at the module level in the
 * route tests, and `fetch` is stubbed per-test for Turnstile's siteverify.
 */

process.env.RESEND_API_KEY = "re_test_key_not_real";
process.env.LEAD_NOTIFY_EMAIL = "leads@example.test";
process.env.CONTACT_NOTIFY_EMAIL = "contact@example.test";
process.env.LEAD_FROM_EMAIL = "Royal Home Solutions <noreply@example.test>";
process.env.RESEND_AUDIENCE_ID = "aud_test";

// Cloudflare's published "always passes" test secret. The suite never actually
// calls Cloudflare — this only has to be non-empty so the route doesn't bail
// out as unconfigured before the mocked fetch is consulted.
process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";

// Hostname and action binding are enforced here exactly as they are in
// production, so the tests exercise the strict path rather than a lenient one
// that only development ever sees.
process.env.TURNSTILE_STRICT_BINDING = "true";
process.env.TURNSTILE_ALLOWED_HOSTNAMES = "royalhomesolutions.com";

// `lib/leadStore` is mocked in the route tests, so nothing writes to disk.
