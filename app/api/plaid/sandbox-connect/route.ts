import { NextResponse } from "next/server"
import { plaidClient } from "@/lib/plaid"
import { Products, SandboxItemFireWebhookRequestWebhookCodeEnum } from "plaid"

/**
 * Sandbox-only: Creates a public_token using sandboxPublicTokenCreate,
 * then immediately exchanges it for an access_token.
 * Also fires the SYNC_UPDATES_AVAILABLE webhook so transactions become
 * available right away (fixes PRODUCT_NOT_READY).
 */
export async function POST() {
  try {
    const products = (process.env.PLAID_PRODUCTS || "transactions")
      .split(",")
      .map((p) => p.trim() as Products)

    // Step 1: Create a sandbox public token (simulates Link flow)
    const createResponse = await plaidClient.sandboxPublicTokenCreate({
      institution_id: "ins_109508", // "First Platypus Bank" — Plaid's test institution
      initial_products: products,
      options: {
        override_username: "custom_zurita",
        override_password: "any",
      },
    })

    const publicToken = createResponse.data.public_token

    // Step 2: Exchange for access_token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })

    const accessToken = exchangeResponse.data.access_token

    // Step 3: Fire the webhook to force transactions to be ready immediately
    try {
      await plaidClient.sandboxItemFireWebhook({
        access_token: accessToken,
        webhook_code:
          SandboxItemFireWebhookRequestWebhookCodeEnum.SyncUpdatesAvailable,
      })
    } catch {
      // Non-fatal — transactions will still work after a short delay
      console.warn("Could not fire sandbox webhook (non-fatal)")
    }

    // Step 4: Small delay to let sandbox process the webhook
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      access_token: accessToken,
      item_id: exchangeResponse.data.item_id,
    })
  } catch (error: any) {
    console.error("Sandbox connect error:", error?.response?.data || error.message)
    return NextResponse.json(
      {
        error:
          error?.response?.data?.error_message ||
          error.message ||
          "Sandbox connect failed",
      },
      { status: 500 }
    )
  }
}
