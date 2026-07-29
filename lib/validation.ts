/** Validation helpers shared by the API routes. */

// Deliberately permissive: stricter patterns reject valid real-world addresses,
// and actually delivering to the address is the only real proof anyway.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Longest address allowed by RFC 5321. */
export const MAX_EMAIL_LENGTH = 254;

export function isValidEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && emailPattern.test(value);
}
