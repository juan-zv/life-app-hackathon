import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/api-config"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/categories/${userId}`
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
