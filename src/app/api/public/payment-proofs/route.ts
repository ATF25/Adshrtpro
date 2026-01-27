import { NextResponse } from "next/server";
import * as storage from "@/lib/storage";

export async function GET() {
  try {
    const withdrawals = await storage.getAllWithdrawalRequests();

    const proofs = await Promise.all(
      withdrawals
        .filter((w) => w.status === "paid" || w.status === "completed")
        .slice(0, 50)
        .map(async (w) => {
          const user = await storage.getUser(w.userId);
          const date = w.processedAt || w.requestedAt;
          return {
            id: w.id,
            date: date,
            username: user?.email?.split("@")[0] || user?.email || w.userId,
            amount: w.amountUsd,
            paymentMethod: w.coinType,
          };
        })
    );

    return NextResponse.json(proofs);
  } catch (error) {
    console.error("/api/public/payment-proofs error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
