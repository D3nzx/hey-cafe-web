import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import { verifySanityWebhookSignature } from "./sanity-webhook.ts";

describe("verifySanityWebhookSignature", () => {
  it("accepts a valid Sanity signature", () => {
    const secret = "test-secret";
    const payload = JSON.stringify({ type: "publish", documentId: "doc-123" });
    const signature = createHmac("sha256", secret).update(payload).digest("base64");

    assert.equal(verifySanityWebhookSignature(payload, signature, secret), true);
  });

  it("rejects a missing or invalid signature", () => {
    const secret = "test-secret";
    const payload = JSON.stringify({ type: "publish", documentId: "doc-123" });

    assert.equal(verifySanityWebhookSignature(payload, null, secret), false);
    assert.equal(verifySanityWebhookSignature(payload, "invalid", secret), false);
  });
});
