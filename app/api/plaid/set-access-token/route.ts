import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { public_token } = await req.json();

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // TODO: In a real app, save accessToken and itemId to your database 
    // associated with the user.id.
    // For this hackathon/demo, we might just return it or log it.
    console.log(`[Success] Access Token for User ${user.id}:`, accessToken);

    return NextResponse.json({ 
        success: true, 
        access_token: accessToken, // Removing this in prod is safer
        item_id: itemId 
    });

  } catch (error: any) {
    console.error("Error exchanging public token:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to exchange token" },
      { status: 500 }
    );
  }
}
