// app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server"; // App Router purity—no Pages ghosts
import { addTask, deleteTask, getAllTasks, updateTask } from "@/lib/db";
import { Task } from "@/lib/tasks";

export async function GET() {
  const tasks = getAllTasks();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = addTask(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as { id: number } & Partial<Task>;
  updateTask(body.id, body);
  return NextResponse.json({ success: true, body });
}

export async function DELETE(req: NextRequest) {
  const { id } = (await req.json()) as { id: number };
  deleteTask(id);
  return NextResponse.json({ success: true });
}
