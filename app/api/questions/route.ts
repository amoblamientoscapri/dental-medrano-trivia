import { NextRequest, NextResponse } from "next/server";
import { getQuestions, setQuestions } from "@/lib/kv";
import { verifyToken } from "@/lib/auth";
import type { Question } from "@/lib/types";

// GET: return all questions (admin) or random subset (public)
export async function GET(request: NextRequest) {
  const questions = await getQuestions();
  return NextResponse.json(questions);
}

// POST: add a new question (admin only)
export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { text, options, correctIndex } = body;

  if (!text || !options || options.length !== 3 || correctIndex === undefined) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const questions = await getQuestions();
  const newQuestion: Question = {
    id: `q${Date.now()}`,
    text,
    options,
    correctIndex,
  };

  questions.push(newQuestion);
  await setQuestions(questions);

  return NextResponse.json(newQuestion, { status: 201 });
}
