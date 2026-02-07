import { NextResponse } from "next/server";

// Registration is now handled by Clerk. This route exists for backward compatibility.
export async function POST(req: Request) {
  return NextResponse.json(
    { message: "Registration is now handled by Clerk. Please use /sign-up instead." },
    { status: 410 }
  );
}
