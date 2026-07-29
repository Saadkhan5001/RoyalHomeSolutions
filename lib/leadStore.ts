import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { SellerLeadSubmission } from "@/lib/leads";

/**
 * Append-only JSONL store for seller leads — no external database.
 *
 * ⚠️ Persistence depends on the host. On a normal Node server (VPS, Docker,
 * `next start` on a box you control) this file survives restarts and is the
 * durable record. On Vercel and other serverless platforms the filesystem is
 * read-only apart from a per-instance `/tmp` that is wiped between invocations,
 * so writes will either fail or silently vanish — there, the emails in the
 * team's inbox are the durable record. `appendLead` degrades quietly either way
 * and never breaks a submission.
 *
 * JSONL (one JSON object per line) rather than a JSON array so appends are a
 * single atomic write with no read-modify-write race between concurrent leads.
 */

export interface StoredLead extends SellerLeadSubmission {
  id: string;
  receivedAt: string;
  ip: string;
  userAgent: string;
}

function storePath(): string {
  return (
    process.env.LEAD_STORE_PATH ??
    path.join(process.cwd(), ".leads", "seller-leads.jsonl")
  );
}

/** Warn once per process rather than on every submission. */
let warnedUnwritable = false;

/**
 * Appends a lead to the store. Best-effort: returns false and logs on failure
 * instead of throwing, because by the time this runs the lead has already been
 * emailed and must not be reported as failed.
 */
export async function appendLead(
  lead: SellerLeadSubmission,
  context: { ip: string; userAgent: string },
): Promise<StoredLead | null> {
  const record: StoredLead = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    ...lead,
    ip: context.ip,
    userAgent: context.userAgent,
  };

  const file = storePath();

  try {
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, `${JSON.stringify(record)}\n`, "utf8");
    return record;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    const readOnly =
      code === "EROFS" || code === "EACCES" || code === "EPERM";

    if (readOnly && !warnedUnwritable) {
      warnedUnwritable = true;
      console.warn(
        `[leadStore] Filesystem is not writable (${code}) — leads will not be stored on disk. ` +
          `This is expected on serverless hosts like Vercel; the notification emails remain the record of each lead.`,
      );
    } else if (!readOnly) {
      console.error("[leadStore] Failed to append lead:", error);
    }

    return null;
  }
}

/**
 * Reads every stored lead, newest last. Malformed lines are skipped rather
 * than aborting the read, so one bad write can't make the whole file unusable.
 */
export async function readLeads(): Promise<StoredLead[]> {
  try {
    const contents = await readFile(storePath(), "utf8");
    return contents
      .split("\n")
      .filter((line) => line.trim() !== "")
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as StoredLead];
        } catch {
          return [];
        }
      });
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    throw error;
  }
}
