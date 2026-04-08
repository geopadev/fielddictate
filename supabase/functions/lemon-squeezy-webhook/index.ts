import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET") ?? "";

/**
 * Verifies Lemon Squeezy webhook signature using HMAC-SHA256.
 * The signature is sent in the `x-signature` header.
 */
async function verifySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
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

Deno.serve(async (req: Request) => {
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

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const meta = payload?.meta as Record<string, unknown>;
  const eventName = meta?.event_name as string;
  const customData = meta?.custom_data as Record<string, unknown>;
  const userId = customData?.user_id as string;

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
