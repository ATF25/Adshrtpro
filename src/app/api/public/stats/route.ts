import { NextResponse } from "next/server";
import * as storage from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const [platformStats, withdrawals] = await Promise.all([
      storage.getPlatformStats(),
      storage.getAllWithdrawalRequests(),
    ]);

    const totalPaidOut = withdrawals
      .filter((w) => w.status === "paid" || w.status === "completed")
      .reduce((sum, w) => sum + parseFloat(w.amountUsd || "0"), 0);

    return NextResponse.json({
      totalUsers: platformStats.totalUsers,
      totalLinks: platformStats.totalLinks,
      totalPaidOut: totalPaidOut.toFixed(2),
    });
  } catch (error) {
    console.error("/api/public/stats error:", error);
    return NextResponse.json(
      { totalUsers: 0, totalLinks: 0, totalPaidOut: "0.00" },
      { status: 500 }
    );
  }
}
