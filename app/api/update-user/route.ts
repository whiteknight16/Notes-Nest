import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const { userId, stripeCustomerId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: userId },
    });

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Database update failed" },
      { status: 500 }
    );
  }
}
