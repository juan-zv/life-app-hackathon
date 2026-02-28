# Walmart Cart — React + TypeScript Components

Drop-in feature module that lets users type a grocery list and get a single Walmart add-to-cart link back.

## Structure

```
walmart-cart/
├── index.ts            # Barrel exports
├── types.ts            # Shared TypeScript interfaces
├── walmart.ts          # Server-side Walmart search + cart builder (Node.js)
├── route.ts            # API route handler (Express / Next.js)
├── api.ts              # Client-side fetch wrapper
├── GroceryForm.tsx     # Grocery list input form
├── CartResults.tsx     # Results display (table, link, not-found list)
└── useWalmartCart.ts    # React hook (state + API call)
```

## Installation

No additional packages are required — the module uses only `fetch` (built into Node 18+ and all modern browsers) and React.

Copy the `walmart-cart/` folder into your project's source directory.

## Server-Side Setup

The search logic runs on your server (Node.js) to avoid CORS issues and bot detection. Wire the API route for your framework:

### Express

```ts
import express from "express";
import { handleGenerateCart } from "./walmart-cart/route";

const app = express();
app.use(express.json());
app.post("/api/generate-cart", handleGenerateCart);
```

### Next.js App Router

Copy or re-export from `app/api/generate-cart/route.ts`:

```ts
export { POST } from "@/walmart-cart/route";
```

### Next.js Pages API

Create `pages/api/generate-cart.ts`:

```ts
export { pagesApiHandler as default } from "@/walmart-cart/route";
```

## Client-Side Usage

### Quick Start (with hook)

```tsx
import { GroceryForm, CartResults, useWalmartCart } from "./walmart-cart";

function WalmartCartPage() {
  const { result, error, isLoading, submit } = useWalmartCart();

  return (
    <div>
      <h1>Walmart Cart Builder</h1>
      <GroceryForm onSubmit={submit} isLoading={isLoading} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <CartResults result={result} />}
    </div>
  );
}
```

### Using Components Individually

#### `<GroceryForm />`

Text area input where users enter one grocery item per line.

| Prop | Type | Description |
|---|---|---|
| `onSubmit` | `(items: string[]) => void` | Called with the parsed list of items |
| `isLoading` | `boolean` | Disables the form while a request is in progress |

#### `<CartResults />`

Displays the generated cart link, a table of matched products, estimated total, and any items that weren't found.

| Prop | Type | Description |
|---|---|---|
| `result` | `CartResult` | The response object from the API |

#### `useWalmartCart()` Hook

Manages loading, error, and result state. Returns:

| Field | Type | Description |
|---|---|---|
| `result` | `CartResult \| null` | The latest successful result |
| `error` | `string \| null` | Error message if the request failed |
| `isLoading` | `boolean` | Whether a request is in flight |
| `submit` | `(items: string[]) => void` | Trigger a new cart build |

## API Reference

### `POST /api/generate-cart`

**Request body:**

```json
{
  "items": ["whole milk gallon", "sourdough bread", "cheddar cheese"]
}
```

- `items`: array of 1–50 search strings.

**Success response (200):**

```json
{
  "cartUrl": "https://affil.walmart.com/cart/addToCart?items=12345,67890",
  "itemsFound": 2,
  "totalRequested": 3,
  "estimatedTotal": 7.98,
  "found": [
    {
      "searchedItem": "whole milk gallon",
      "id": "12345",
      "name": "Great Value Whole Milk, 1 Gallon",
      "price": "$3.48",
      "url": "https://www.walmart.com/ip/12345"
    }
  ],
  "notFound": ["dragonfruit"]
}
```

**Error responses:**

| Status | Reason |
|---|---|
| `400` | Empty or invalid items array, or more than 50 items |
| `404` | No items could be matched on Walmart |
| `500` | Unexpected server error |

## Types

```ts
interface FoundItem {
  searchedItem: string;
  id: string;
  name: string;
  price: string;
  url: string;
}

interface CartResult {
  cartUrl: string;
  itemsFound: number;
  totalRequested: number;
  estimatedTotal: number;
  found: FoundItem[];
  notFound: string[];
}
```

## Notes

- The server makes sequential requests to Walmart with a 1-second delay between each to avoid rate limiting.
- A request with many items will take roughly `N` seconds (one per item).
- Walmart may serve CAPTCHA pages from cloud datacenter IPs. Running the server locally or on a residential IP works best. For production, consider integrating the [Walmart Affiliate API](https://affiliates.walmart.com) by replacing the logic inside `walmart.ts`.
