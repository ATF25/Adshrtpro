import { NextResponse } from "next/server";

// Login is now handled by Clerk. This route exists for backward compatibility.
export async function POST(req: Request) {
  return NextResponse.json(
    { message: "Login is now handled by Clerk. Please use /sign-in instead." },
    { status: 410 }
  );
}
