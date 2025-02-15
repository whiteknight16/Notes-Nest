import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("id", id);
  if (!id) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }
  try {
    const data = await prisma.note.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
  }
  try {
    const note = await prisma.note.delete({ where: { id } });
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { title, content } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
  }
  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
