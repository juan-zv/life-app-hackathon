import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      )
    }

    // Build Walmart cart URL with items as search query
    // This creates a link to Walmart's search with all items
    const searchQuery = items.join(" ")
    const cartUrl = `https://www.walmart.com/search?q=${encodeURIComponent(searchQuery)}`

    // Return the cart URL and item list
    return NextResponse.json({
      cartUrl,
      items: items.map((name: string) => ({ name })),
    })
  } catch (error) {
    console.error("Error generating cart:", error)
    return NextResponse.json(
      { error: "Failed to generate cart" },
      { status: 500 }
    )
  }
}
