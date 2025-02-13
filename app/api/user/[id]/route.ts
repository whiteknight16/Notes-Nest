import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjust import path

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("id", id);

  if (!id)
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { stripeCustomerId: true, colorScheme: true },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
