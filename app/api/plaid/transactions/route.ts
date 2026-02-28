import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

async function getTransactionsWithRetry(
  accessToken: string,
  startDate: string,
  endDate: string,
  retries = 3,
  delayMs = 3000
) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: { count: 100, offset: 0 },
      });
      return response.data;
    } catch (error: any) {
      const errorCode = error?.response?.data?.error_code;
      if (errorCode === "PRODUCT_NOT_READY" && attempt < retries) {
        console.log(
          `Transactions not ready, retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw error;
    }
  }
}

export async function POST(req: Request) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json(
        { error: "access_token is required" },
        { status: 400 }
      );
    }

    // Get transactions from the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const startDate = thirtyDaysAgo.toISOString().split("T")[0];
    const endDate = now.toISOString().split("T")[0];

    const data = await getTransactionsWithRetry(access_token, startDate, endDate);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching transactions:", error?.response?.data || error);
    return NextResponse.json(
      {
        error:
          error?.response?.data?.error_message || "Failed to fetch transactions",
      },
      { status: 500 }
    );
  }
}
