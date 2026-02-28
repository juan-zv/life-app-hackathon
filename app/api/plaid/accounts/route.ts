import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST(req: Request) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json(
        { error: "access_token is required" },
        { status: 400 }
      );
    }

    const accountsResponse = await plaidClient.accountsGet({
      access_token,
    });

    return NextResponse.json(accountsResponse.data);
  } catch (error: any) {
    console.error("Error fetching accounts:", error?.response?.data || error);
    return NextResponse.json(
      { error: error?.response?.data?.error_message || "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}
