import { createHmac, timingSafeEqual } from "node:crypto";

const SANITY_WEBHOOK_SIGNATURE_HEADERS = [
  "x-sanity-signature",
  "x-sanity-webhook-signature",
];

export function getSanityWebhookSignature(
  headers: Headers | Record<string, string | undefined> | undefined,
): string | null {
  if (!headers) {
    return null;
  }

  if (headers instanceof Headers) {
    for (const headerName of SANITY_WEBHOOK_SIGNATURE_HEADERS) {
      const value = headers.get(headerName);
      if (value) {
        return value;
      }
    }

    return null;
  }

  for (const [key, value] of Object.entries(headers)) {
    if (SANITY_WEBHOOK_SIGNATURE_HEADERS.includes(key.toLowerCase()) && value) {
      return value;
    }
  }

  return null;
}

export function computeSanityWebhookSignature(rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(rawBody).digest("base64");
}

export function verifySanityWebhookSignature(
  rawBody: string,
  providedSignature: string | null,
  secret: string,
): boolean {
  if (!secret || !providedSignature) {
    return false;
  }

  const expectedSignature = computeSanityWebhookSignature(rawBody, secret);
  const actual = Buffer.from(providedSignature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}
