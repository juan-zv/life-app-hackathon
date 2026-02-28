/**
 * walmart.ts — Server-side Walmart search + cart-link builder.
 *
 * This module runs on the server (Node.js) so it can make requests
 * to walmart.com on behalf of the user's browser session.
 *
 * Usage:
 *   import { buildCart } from "./walmart";
 *   const result = await buildCart(["milk", "eggs", "bread"]);
 */

import type { FoundItem, CartResult } from "./types";

const SEARCH_URL = "https://www.walmart.com/search?q=";
const CART_URL = "https://affil.walmart.com/cart/addToCart?items=";

const HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  Referer: "https://www.walmart.com/",
};

const REQUEST_TIMEOUT_MS = 12_000;
const RATE_LIMIT_DELAY_MS = 1_000;

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractPrice(item: Record<string, any>): string {
  try {
    const price = item?.priceInfo?.currentPrice?.price;
    const unit = item?.priceInfo?.currentPrice?.currencyUnit ?? "$";
    if (price) return `${unit}${parseFloat(price).toFixed(2)}`;
  } catch {}

  try {
    const line = item?.priceInfo?.linePrice;
    if (line) return String(line);
  } catch {}

  try {
    const price = item?.price;
    if (price) return `$${parseFloat(price).toFixed(2)}`;
  } catch {}

  return "price unknown";
}

function extractItemsFromNextData(html: string): Record<string, any>[] {
  // Pull the __NEXT_DATA__ JSON blob without a DOM parser (works in Node)
  const marker = '<script id="__NEXT_DATA__" type="application/json">';
  const start = html.indexOf(marker);
  if (start === -1) return [];

  const jsonStart = start + marker.length;
  const jsonEnd = html.indexOf("</script>", jsonStart);
  if (jsonEnd === -1) return [];

  try {
    const data = JSON.parse(html.slice(jsonStart, jsonEnd));
    const stacks: any[] | undefined =
      data?.props?.pageProps?.initialData?.searchResult?.itemStacks;
    if (Array.isArray(stacks)) {
      for (const stack of stacks) {
        if (Array.isArray(stack?.items) && stack.items.length > 0) {
          return stack.items;
        }
      }
    }
  } catch {}

  return [];
}

function fallbackRegexItemId(html: string): string | null {
  let m = html.match(/"usItemId"\s*:\s*"(\d+)"/);
  if (m?.[1]) return m[1];
  m = html.match(/\/ip\/[^/]+\/(\d+)/);
  if (m?.[1]) return m[1];
  return null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Public API ───────────────────────────────────────────────────────────────

export async function searchItem(itemName: string): Promise<FoundItem | null> {
  const url = SEARCH_URL + encodeURIComponent(itemName);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const resp = await fetch(url, {
      headers: HEADERS,
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);

    if (!resp.ok) {
      console.warn(`[walmart] ${itemName}: HTTP ${resp.status}`);
      return null;
    }

    const html = await resp.text();
    const results = extractItemsFromNextData(html);

    for (const result of results) {
      const itemId = String(result?.usItemId ?? result?.id ?? "").trim();
      if (!itemId || !/^\d+$/.test(itemId)) continue;

      return {
        searchedItem: itemName,
        id: itemId,
        name: result?.name ?? result?.displayName ?? itemName,
        price: extractPrice(result),
        url: `https://www.walmart.com/ip/${itemId}`,
      };
    }

    const fallbackId = fallbackRegexItemId(html);
    if (fallbackId) {
      return {
        searchedItem: itemName,
        id: fallbackId,
        name: itemName,
        price: "price unknown",
        url: `https://www.walmart.com/ip/${fallbackId}`,
      };
    }
  } catch (err: any) {
    console.warn(`[walmart] Network error for '${itemName}':`, err.message);
  }

  return null;
}

export async function buildCart(items: string[]): Promise<CartResult> {
  const found: FoundItem[] = [];
  const notFound: string[] = [];

  for (const itemName of items) {
    const result = await searchItem(itemName);
    if (result) {
      found.push(result);
    } else {
      notFound.push(itemName);
    }
    // Rate-limit delay between requests
    await sleep(RATE_LIMIT_DELAY_MS);
  }

  if (found.length === 0) {
    return {
      cartUrl: "",
      itemsFound: 0,
      totalRequested: items.length,
      estimatedTotal: 0,
      found: [],
      notFound,
    };
  }

  let total = 0;
  for (const f of found) {
    const m = f.price.match(/[\d.]+/);
    if (m) total += parseFloat(m[0]);
  }

  const ids = found.map((f) => f.id).join(",");
  const cartUrl = CART_URL + ids;

  return {
    cartUrl,
    itemsFound: found.length,
    totalRequested: items.length,
    estimatedTotal: Math.round(total * 100) / 100,
    found,
    notFound,
  };
}
