import { NextResponse } from "next/server";
import * as storage from "@/lib/storage";
import { requireAuth } from "@/lib/server/auth";

export async function POST(req: Request) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;
  const { user } = authResult;

  const { linkId } = await req.json();
  if (!linkId) {
    return NextResponse.json({ message: "Link ID is required" }, { status: 400 });
  }

  const link = await storage.getLink(linkId);
  if (!link) {
    return NextResponse.json({ message: "Link not found" }, { status: 404 });
  }

  if (link.userId !== user.id && !user.isAdmin) {
    return NextResponse.json({ message: "Not authorized to unlock analytics for this link" }, { status: 403 });
  }

  const expiry = new Date(Date.now() + 60 * 60 * 1000);
  await storage.setLinkUnlock(user.id, linkId, expiry);

  return NextResponse.json({ message: "Analytics unlocked", linkId, expiry: expiry.toISOString() });
}
