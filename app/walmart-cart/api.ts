/**
 * api.ts — Client-side helper to call the generate-cart endpoint.
 *
 * Usage:
 *   import { generateCart } from "./walmart-cart/api";
 *   const result = await generateCart(["milk", "eggs"]);
 */

import type { CartResult } from "./types";

const ENDPOINT = "/api/generate-cart";

export async function generateCart(items: string[]): Promise<CartResult> {
  const resp = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? `HTTP ${resp.status}`);
  }

  return resp.json();
}
