import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

import { verifySanityWebhookSignature } from "../sanity-webhook";

describe("verifySanityWebhookSignature", () => {
  const secret = "test-secret";
  const payload = JSON.stringify({ type: "publish", documentId: "doc-123" });
  const validSignature = createHmac("sha256", secret).update(payload).digest("base64");

  it("accepts a valid Sanity signature", () => {
    expect(verifySanityWebhookSignature(payload, validSignature, secret)).toBe(true);
  });

  it("rejects a missing signature", () => {
    expect(verifySanityWebhookSignature(payload, null, secret)).toBe(false);
  });

  it("rejects invalid signatures and signatures for a different payload", () => {
    expect(verifySanityWebhookSignature(payload, "invalid", secret)).toBe(false);
    expect(verifySanityWebhookSignature(`${payload} `, validSignature, secret)).toBe(false);
  });
});