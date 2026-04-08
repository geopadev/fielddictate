/**
 * Lemon Squeezy Webhook Handler — Supabase Edge Function
 *
 * This file runs on Supabase's Deno runtime (not Node.js).
 * It is kept here as a local reference copy. The live version
 * is deployed directly to Supabase via the MCP or CLI.
 *
 * Webhook URL:
 *   https://dscqnpyxcyrlcwyrgpwj.supabase.co/functions/v1/lemon-squeezy-webhook
 *
 * Required Supabase Secrets:
 *   - LEMONSQUEEZY_WEBHOOK_SECRET
 *   - SUPABASE_URL          (auto-provided)
 *   - SUPABASE_SERVICE_ROLE_KEY (auto-provided)
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET") ?? "";

/**
 * Verifies Lemon Squeezy webhook signature using HMAC-SHA256.
 * The signature is sent in the `x-signature` header.
 */
async function verifySignature(body, signature, secret) {
  if (!secret || !signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(body)
  );

  const hashHex = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex === signature;
}

Deno.serve(async (req) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const body = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  // Reject requests with invalid signatures
  const isValid = await verifySignature(body, signature, WEBHOOK_SECRET);
  if (!isValid) {
    console.error("Invalid webhook signature — request rejected");
    return new Response("Unauthorized", { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const meta = payload?.meta;
  const eventName = meta?.event_name;
  const customData = meta?.custom_data;
  const userId = customData?.user_id;

  // Create a Supabase admin client — bypasses RLS
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Log every event to webhook_logs for auditing
  await supabase.from("webhook_logs").insert({
    event_type: eventName,
    payload: payload,
  });

  // Activate subscription on payment events
  if (
    (eventName === "subscription_created" || eventName === "order_created") &&
    userId
  ) {
    const { error } = await supabase
      .from("users")
      .update({ subscription_active: true })
      .eq("id", userId);

    if (error) {
      console.error("Failed to update subscription_active:", error.message);
      return new Response("DB Error", { status: 500 });
    }

    console.log(`Subscription activated for user: ${userId}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
