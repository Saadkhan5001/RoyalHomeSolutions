"use client";

import { useCallback, useRef, useState } from "react";
import {
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  TURNSTILE_FIELD,
} from "@/lib/botProtection";
import type { TurnstileHandle } from "@/components/forms/TurnstileWidget";

/**
 * Client half of the anti-bot gate, shared by every protected form.
 *
 * Keeps the three moving parts — honeypot value, render timestamp, Turnstile
 * token — in one place so a form only has to: render `<HoneypotField>` and
 * `<TurnstileWidget>`, call `activate()` on first interaction, and spread
 * `await collect()` into its request body.
 *
 * None of this is security on its own. Everything here is re-checked server
 * side, where the token is verified against Cloudflare.
 */
export function useFormProtection() {
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [honeypot, setHoneypot] = useState("");
  const renderedAtRef = useRef(Date.now());

  /** Called on first interaction so the challenge is ready before submit. */
  const activate = useCallback(() => {
    turnstileRef.current?.activate();
  }, []);

  /**
   * Gathers the protection fields, waiting for the challenge if it is still
   * running. Returns an empty token when none could be obtained — the caller
   * surfaces that as a retryable error rather than posting a doomed request.
   */
  const collect = useCallback(async () => {
    const token = (await turnstileRef.current?.ensureToken()) ?? "";
    return {
      [HONEYPOT_FIELD]: honeypot,
      [ELAPSED_FIELD]: Date.now() - renderedAtRef.current,
      [TURNSTILE_FIELD]: token,
      hasToken: Boolean(token),
      /** True when the challenge cannot run at all, rather than being slow. */
      verificationBlocked: turnstileRef.current?.getStatus() === "blocked",
    };
  }, [honeypot]);

  /**
   * Returns the form to a submittable state after a failure.
   *
   * A Turnstile token is single-use: without this, a visitor whose submission
   * failed for any reason would be stuck replaying a spent token. The render
   * clock restarts too, so retrying doesn't look suspiciously fast.
   */
  const reset = useCallback(() => {
    turnstileRef.current?.reset();
    renderedAtRef.current = Date.now();
  }, []);

  return {
    turnstileRef,
    honeypot,
    setHoneypot,
    activate,
    collect,
    reset,
  };
}

/**
 * Shown when the challenge is on screen but unsolved — `collect()` already
 * waited for it, so reaching this means it genuinely needs the visitor.
 */
export const VERIFICATION_PENDING =
  "Please complete the verification check above the button, then submit again.";

/** Shown when the challenge could not load at all. Different advice needed. */
export const VERIFICATION_BLOCKED =
  "The security check couldn't load. Please check your connection or disable any ad blocker for this page, then try again.";

/** Picks the right message for why no token was produced. */
export function verificationMessage(blocked: boolean): string {
  return blocked ? VERIFICATION_BLOCKED : VERIFICATION_PENDING;
}
