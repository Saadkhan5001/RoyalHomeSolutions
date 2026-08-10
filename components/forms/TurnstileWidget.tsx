"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { TurnstileAction } from "@/lib/turnstileActions";

/**
 * Reusable Cloudflare Turnstile widget.
 *
 * One implementation for every protected form — the seller, buyer, contact and
 * newsletter forms all mount this rather than each embedding their own script
 * tag and render call.
 *
 * Two deliberate behaviours:
 *
 *   - The Cloudflare script is not loaded until a visitor actually interacts
 *     with a form. The footer newsletter sits on every page; loading a
 *     third-party script on every page view to protect a field almost nobody
 *     touches is a poor trade. `activate()` is called on first keystroke.
 *   - `appearance: "interaction-only"` means nothing renders for the vast
 *     majority of visitors. Forms are not redesigned; the checkbox only appears
 *     when Cloudflare actually wants a human to do something.
 *
 * The token this produces is meaningless on its own — the server verifies it
 * against Cloudflare's siteverify endpoint (see `lib/turnstile.ts`).
 */

const SCRIPT_ID = "cf-turnstile-script";
const ONLOAD_CALLBACK = "__cfTurnstileOnLoad";

/** Public by design — the site key is meant to be visible in the browser. */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

interface TurnstileApi {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId?: string): void;
  remove(widgetId?: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    [ONLOAD_CALLBACK]?: () => void;
  }
}

/** Shared across every widget on the page — the script is loaded exactly once. */
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    // Cloudflare's documented explicit-render handshake: the global callback
    // fires once `window.turnstile` is ready, which the script's own `load`
    // event does not reliably guarantee.
    window[ONLOAD_CALLBACK] = () => resolve();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${ONLOAD_CALLBACK}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      // Allow a later attempt to retry rather than caching the failure.
      scriptPromise = null;
      reject(new Error("Failed to load Turnstile."));
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * `blocked` means the challenge cannot run at all — no site key, or the script
 * failed to load (offline, ad-blocker, corporate proxy). Distinct from "still
 * working on it", because the two need different advice.
 */
export type TurnstileStatus = "idle" | "running" | "solved" | "blocked";

export interface TurnstileHandle {
  /** Starts loading the challenge. Safe to call repeatedly. */
  activate(): void;
  /** Discards the current token and asks Cloudflare for a fresh challenge. */
  reset(): void;
  /**
   * Resolves with a token, waiting for the challenge if it is still running.
   * Resolves with "" if no token can be obtained in time — callers treat that
   * as a recoverable failure and let the visitor retry.
   */
  ensureToken(timeoutMs?: number): Promise<string>;
  /** Lets the caller explain *why* there is no token. */
  getStatus(): TurnstileStatus;
}

interface TurnstileWidgetProps {
  /**
   * The operation this widget protects. Stamped into the token and checked
   * server-side against the route's own expectation, so a token from one form
   * cannot be replayed against another.
   */
  action: TurnstileAction;
  /** Match the surrounding card so the challenge doesn't look pasted on. */
  theme?: "auto" | "light" | "dark";
  /**
   * Start the challenge on mount instead of waiting for interaction.
   *
   * Set on the three lead forms: they are the conversion path, and someone who
   * fills a form fast should never be told verification is missing simply
   * because the script was still loading. Left off for the footer newsletter,
   * which sits on every page and should not cost every visitor a third-party
   * script for a field most of them never touch.
   */
  autoActivate?: boolean;
  className?: string;
}

const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  function TurnstileWidget(
    { action, theme = "auto", autoActivate = false, className },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);
    /** Read by `ensureToken`, which must see the value without a re-render. */
    const tokenRef = useRef("");
    const statusRef = useRef<TurnstileStatus>(
      TURNSTILE_SITE_KEY ? "idle" : "blocked",
    );
    const [active, setActive] = useState(autoActivate);

    const activate = useCallback(() => setActive(true), []);

    const getStatus = useCallback(() => statusRef.current, []);

    const reset = useCallback(() => {
      tokenRef.current = "";
      if (statusRef.current === "solved") statusRef.current = "running";
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }, []);

    const ensureToken = useCallback(
      async (timeoutMs = 8_000): Promise<string> => {
        // Read through a call rather than the ref directly: the status is
        // mutated from Cloudflare's callbacks while this loop is awaiting, and
        // TypeScript would otherwise narrow it on the first check and never
        // widen it again.
        const isBlocked = () => statusRef.current === "blocked";

        if (tokenRef.current) return tokenRef.current;
        if (isBlocked()) return "";

        setActive(true);

        // Poll rather than wire up resolver bookkeeping: the widget's callback
        // writes straight to the ref, and a 100ms granularity is invisible next
        // to a network round-trip.
        //
        // This wait is what stops a fast typist being told verification is
        // missing when the challenge simply hadn't finished yet.
        const deadline = Date.now() + timeoutMs;
        while (Date.now() < deadline) {
          if (tokenRef.current) return tokenRef.current;
          // No point waiting out the full deadline once we know it can't work.
          if (isBlocked()) return "";
          await new Promise((r) => setTimeout(r, 100));
        }

        return tokenRef.current;
      },
      [],
    );

    useImperativeHandle(
      ref,
      () => ({ activate, reset, ensureToken, getStatus }),
      [activate, reset, ensureToken, getStatus],
    );

    useEffect(() => {
      if (!active || !TURNSTILE_SITE_KEY) return;
      if (widgetIdRef.current) return;

      let cancelled = false;
      statusRef.current = "running";

      loadTurnstileScript()
        .then(() => {
          if (cancelled || !containerRef.current || !window.turnstile) return;
          if (widgetIdRef.current) return;

          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            action,
            theme,
            size: "flexible",
            // Stays invisible unless Cloudflare decides a human is needed.
            appearance: "interaction-only",
            callback: (token: string) => {
              tokenRef.current = token;
              statusRef.current = "solved";
            },
            "expired-callback": () => {
              tokenRef.current = "";
              statusRef.current = "running";
            },
            "timeout-callback": () => {
              tokenRef.current = "";
              statusRef.current = "running";
            },
            "error-callback": () => {
              // Recoverable: the widget stays mounted and can be retried, and
              // an interactive challenge may now be on screen for the visitor.
              tokenRef.current = "";
              statusRef.current = "running";
            },
          });
        })
        .catch(() => {
          // Script blocked or offline — nothing will ever solve this. Marked
          // blocked so the submit path can say so plainly instead of asking
          // the visitor to complete a check that isn't there.
          tokenRef.current = "";
          statusRef.current = "blocked";
        });

      return () => {
        cancelled = true;
      };
    }, [active, action, theme]);

    // Separate from the render effect so a theme change doesn't tear the
    // widget down mid-challenge.
    useEffect(() => {
      return () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }, []);

    return <div ref={containerRef} className={className} />;
  },
);

export default TurnstileWidget;
