async function verifySignature(rawBody, secret, providedSignature) {
  if (!secret || !providedSignature) {
    return false;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const expectedDigest = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expectedSignature = btoa(
    Array.from(new Uint8Array(expectedDigest))
      .map((value) => String.fromCharCode(value))
      .join(""),
  );

  const provided = encoder.encode(providedSignature);
  const expected = encoder.encode(expectedSignature);

  if (provided.length !== expected.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < provided.length; index += 1) {
    result |= provided[index] ^ expected[index];
  }

  return result === 0;
}

export async function onRequestPost({ request, env }) {
  const rawBody = await request.text();
  const providedSignature =
    request.headers.get("x-sanity-signature") ??
    request.headers.get("x-sanity-webhook-signature");

  if (!env.SANITY_WEBHOOK_SECRET || !env.CLOUDFLARE_DEPLOY_HOOK_URL) {
    return new Response(
      JSON.stringify({
        error: "Missing SANITY_WEBHOOK_SECRET or CLOUDFLARE_DEPLOY_HOOK_URL environment variables.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const validSignature = await verifySignature(
    rawBody,
    env.SANITY_WEBHOOK_SECRET,
    providedSignature,
  );

  if (!validSignature) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: invalid Sanity webhook signature." }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const deployResponse = await fetch(env.CLOUDFLARE_DEPLOY_HOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      triggered: "sanity-webhook",
      receivedAt: new Date().toISOString(),
    }),
  });

  if (!deployResponse.ok) {
    const responseText = await deployResponse.text();
    return new Response(
      JSON.stringify({
        error: "Cloudflare deploy hook rejected the rebuild request.",
        details: responseText,
      }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      status: "Cloudflare deploy hook triggered successfully.",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
