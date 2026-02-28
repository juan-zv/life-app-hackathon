"use client"

import { useCallback, useEffect, useState } from "react"
import { usePlaidLink } from "react-plaid-link"
import { Button } from "@/components/ui/button"
import { Landmark, Loader2 } from "lucide-react"

interface PlaidLinkButtonProps {
  onSuccess: (accessToken: string, itemId: string) => void
  onError?: (error: string) => void
  className?: string
}

export function PlaidLinkButton({
  onSuccess,
  onError,
  className,
}: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [isCreatingToken, setIsCreatingToken] = useState(false)

  // Step 1: Get a link_token from your server
  const createLinkToken = useCallback(async () => {
    setIsCreatingToken(true)
    try {
      const response = await fetch("/api/plaid/create-link-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const data = await response.json()
      if (data.error) {
        onError?.(data.error)
        return
      }
      setLinkToken(data.link_token)
    } catch (err: any) {
      onError?.(err.message || "Failed to create link token")
    } finally {
      setIsCreatingToken(false)
    }
  }, [onError])

  useEffect(() => {
    createLinkToken()
  }, [createLinkToken])

  // Step 2: On successful Link login, exchange the public_token for an access_token
  const handleOnSuccess = useCallback(
    async (publicToken: string) => {
      try {
        const response = await fetch("/api/plaid/set-access-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token: publicToken }),
        })
        const data = await response.json()
        if (data.error) {
          onError?.(data.error)
          return
        }
        onSuccess(data.access_token, data.item_id)
      } catch (err: any) {
        onError?.(err.message || "Failed to exchange token")
      }
    },
    [onSuccess, onError]
  )

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleOnSuccess,
    onExit: (err) => {
      if (err) {
        onError?.(err.display_message || err.error_message || "Plaid Link exited with error")
      }
    },
  })

  return (
    <Button
      onClick={() => open()}
      disabled={!ready || isCreatingToken}
      className={className}
      size="lg"
    >
      {isCreatingToken ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Landmark className="mr-2 h-4 w-4" />
          Connect Bank Account
        </>
      )}
    </Button>
  )
}
