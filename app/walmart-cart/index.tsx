"use client"

import { useState, useCallback } from "react"
import { ExternalLink, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CartResult {
  cartUrl: string
  items: Array<{
    name: string
    price?: number
    quantity?: number
  }>
  totalEstimate?: number
}

export function useWalmartCart() {
  const [result, setResult] = useState<CartResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const submit = useCallback(async (items: string[]) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/generate-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate cart")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { result, error, isLoading, submit }
}

export function CartResults({ result }: { result: CartResult }) {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(result.cartUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-primary/5 rounded-lg border">
        <p className="text-sm font-medium mb-2">Your Cart Link</p>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <a href={result.cartUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Walmart
            </a>
          </Button>
          <Button variant="outline" size="icon" onClick={copyLink}>
            {copied ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {result.items && result.items.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Items Added ({result.items.length})</p>
          <ScrollArea className="h-[250px] border rounded-md p-3">
            <ul className="space-y-2">
              {result.items.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm py-1 border-b last:border-0">
                  <span>{item.name}</span>
                  {item.price && (
                    <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}

      {result.totalEstimate && (
        <div className="flex justify-between items-center p-3 bg-muted rounded-md">
          <span className="font-medium">Estimated Total</span>
          <span className="text-lg font-bold">${result.totalEstimate.toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}

// Placeholder for GroceryForm if needed in the future
export function GroceryForm() {
  return null
}
