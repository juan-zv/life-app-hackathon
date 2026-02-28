/**
 * useWalmartCart.ts — React hook that wires GroceryForm + CartResults together.
 *
 * Usage:
 *   import { useWalmartCart } from "./walmart-cart/useWalmartCart";
 *
 *   function MyPage() {
 *     const { result, error, isLoading, submit } = useWalmartCart();
 *     return (
 *       <>
 *         <GroceryForm onSubmit={submit} isLoading={isLoading} />
 *         {error && <p style={{ color: "red" }}>{error}</p>}
 *         {result && <CartResults result={result} />}
 *       </>
 *     );
 *   }
 */

"use client";

import { useState } from "react";
import { generateCart } from "./api";
import type { CartResult } from "./types";

export function useWalmartCart() {
  const [result, setResult] = useState<CartResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (items: string[]) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const cart = await generateCart(items);
      setResult(cart);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { result, error, isLoading, submit };
}
