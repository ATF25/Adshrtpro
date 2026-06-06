import { NextResponse } from "next/server";
import * as storage from "@/lib/storage";
import { requireAdmin } from "@/lib/server/auth";

// Admin: Validate referral
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const { isValid } = await req.json();
  
  const referral = await storage.getReferral(id);
  if (!referral) {
    return NextResponse.json({ message: "Referral not found" }, { status: 404 });
  }

  if (referral.status === "rewarded") {
    return NextResponse.json({ message: "Referral already rewarded" }, { status: 400 });
  }

  if (isValid) {
    try {
      await storage.rewardReferral(id);
    } catch (err: any) {
      return NextResponse.json({ message: err?.message || "Failed to reward referral" }, { status: 400 });
    }
  } else {
    await storage.updateReferral(id, { status: "invalid" });
  }

  return NextResponse.json({ message: isValid ? "Referral validated - both users rewarded" : "Referral marked as invalid" });
}
