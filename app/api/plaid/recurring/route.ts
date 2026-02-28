import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

/**
 * Fetches recurring transactions (subscriptions) from Plaid.
 * Uses transactionsRecurringGet which analyzes transaction history
 * and identifies recurring streams (e.g. Netflix, Spotify, rent).
 */
export async function POST(req: Request) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json(
        { error: "access_token is required" },
        { status: 400 }
      );
    }

    // Retry logic — recurring data depends on transactions being ready
    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await plaidClient.transactionsRecurringGet({
          access_token,
          options: {
            include_personal_finance_category: true,
          },
        });

        // Map to a cleaner format with just what we need
        const outflowStreams = (response.data.outflow_streams || []).map(
          (stream: any) => ({
            stream_id: stream.stream_id,
            merchant_name: stream.merchant_name || stream.description,
            description: stream.description,
            amount: Math.abs(stream.average_amount?.amount || stream.last_amount?.amount || 0),
            frequency: stream.frequency,
            category: stream.personal_finance_category?.primary || stream.category?.[0] || "Other",
            last_date: stream.last_date,
            next_date: stream.predicted_next_date,
            is_active: stream.is_active,
            status: stream.status,
          })
        );

        const inflowStreams = (response.data.inflow_streams || []).map(
          (stream: any) => ({
            stream_id: stream.stream_id,
            merchant_name: stream.merchant_name || stream.description,
            description: stream.description,
            amount: Math.abs(stream.average_amount?.amount || stream.last_amount?.amount || 0),
            frequency: stream.frequency,
            category: stream.personal_finance_category?.primary || stream.category?.[0] || "Income",
            last_date: stream.last_date,
            next_date: stream.predicted_next_date,
            is_active: stream.is_active,
            status: stream.status,
          })
        );

        return NextResponse.json({
          outflow_streams: outflowStreams,
          inflow_streams: inflowStreams,
        });
      } catch (error: any) {
        lastError = error;
        const errorCode = error?.response?.data?.error_code;
        if (errorCode === "PRODUCT_NOT_READY" && attempt < 2) {
          console.log(
            `Recurring transactions not ready, retrying in 3s (attempt ${attempt + 1}/3)...`
          );
          await new Promise((resolve) => setTimeout(resolve, 3000));
          continue;
        }
        throw error;
      }
    }

    throw lastError;
  } catch (error: any) {
    console.error(
      "Error fetching recurring transactions:",
      error?.response?.data || error
    );
    return NextResponse.json(
      {
        error:
          error?.response?.data?.error_message ||
          "Failed to fetch recurring transactions",
      },
      { status: 500 }
    );
  }
}
