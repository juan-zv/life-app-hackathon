/**
 * route.ts — Server-side API route handler for the Walmart cart feature.
 *
 * Drop this into your server framework of choice. Examples below for
 * Express, Next.js App Router, and Next.js Pages API.
 *
 * ─── Express ────────────────────────────────────────────────────────
 *   import { handleGenerateCart } from "./walmart-cart/route";
 *   app.post("/api/generate-cart", handleGenerateCart);
 *
 * ─── Next.js App Router (app/api/generate-cart/route.ts) ────────────
 *   export { POST } from "@/walmart-cart/route";
 *
 * ─── Next.js Pages API (pages/api/generate-cart.ts) ─────────────────
 *   export { pagesApiHandler as default } from "@/walmart-cart/route";
 */

import { buildCart } from "./walmart";
import type { GenerateCartRequest, CartResult } from "./types";

// ── Framework-agnostic core ──────────────────────────────────────────────────

async function processRequest(
  items: string[]
): Promise<{ status: number; body: CartResult | { error: string } }> {
  if (!Array.isArray(items) || items.length === 0) {
    return { status: 400, body: { error: "items must be a non-empty array of strings." } };
  }

  if (items.length > 50) {
    return { status: 400, body: { error: "Maximum 50 items per request." } };
  }

  try {
    const result = await buildCart(items);

    if (!result.cartUrl) {
      return { status: 404, body: { error: "No items could be found on Walmart." } };
    }

    return { status: 200, body: result };
  } catch (err: any) {
    console.error("[generate-cart] Unexpected error:", err);
    return { status: 500, body: { error: "Internal server error." } };
  }
}

// ── Express / Connect handler ────────────────────────────────────────────────

export async function handleGenerateCart(req: any, res: any) {
  const { items } = req.body as GenerateCartRequest;
  const { status, body } = await processRequest(items);
  return res.status(status).json(body);
}

// ── Next.js App Router (POST handler) ────────────────────────────────────────

export async function POST(request: Request) {
  const { items } = (await request.json()) as GenerateCartRequest;
  const { status, body } = await processRequest(items);
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ── Next.js Pages API handler ────────────────────────────────────────────────

export async function pagesApiHandler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { items } = req.body as GenerateCartRequest;
  const { status, body } = await processRequest(items);
  return res.status(status).json(body);
}
