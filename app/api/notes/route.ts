import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  const { title, content, userId } = await req.json();

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return NextResponse.json({ message: newNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
