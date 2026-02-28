import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { currentUser } from "@clerk/nextjs/server";
import { CountryCode, Products } from "plaid";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { products } = await req.json().catch(() => ({}));
    
    // Use env defaults if not specified
    const plaidProducts = (products || process.env.PLAID_PRODUCTS || "auth,transactions").split(",") as Products[];
    const plaidCountryCodes = (process.env.PLAID_COUNTRY_CODES || "US").split(",") as CountryCode[];

    const createTokenResponse = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: user.id || "test-user-id",
      },
      client_name: "Life App Hackathon",
      products: plaidProducts,
      country_codes: plaidCountryCodes,
      language: "en",
      // webhook: "https://your-webhook-url.com", // Optional
    });

    return NextResponse.json(createTokenResponse.data);
  } catch (error: any) {
    console.error("Error creating link token:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create link token" },
      { status: 500 }
    );
  }
}
