import { NextRequest, NextResponse } from "next/server";
import { getQuestions, setQuestions } from "@/lib/kv";
import { verifyToken } from "@/lib/auth";

// PATCH: update a question
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const questions = await getQuestions();
  const index = questions.findIndex((q) => q.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Pregunta no encontrada" }, { status: 404 });
  }

  questions[index] = { ...questions[index], ...body, id };
  await setQuestions(questions);

  return NextResponse.json(questions[index]);
}

// DELETE: remove a question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const questions = await getQuestions();
  const filtered = questions.filter((q) => q.id !== id);

  if (filtered.length === questions.length) {
    return NextResponse.json({ error: "Pregunta no encontrada" }, { status: 404 });
  }

  await setQuestions(filtered);
  return NextResponse.json({ success: true });
}
