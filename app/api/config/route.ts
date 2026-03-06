import { NextRequest, NextResponse } from "next/server";
import { getConfig, setConfig } from "@/lib/kv";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { questionsPerRound, winMessage } = body;

  if (!questionsPerRound || !winMessage) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const config = { questionsPerRound: Number(questionsPerRound), winMessage };
  await setConfig(config);

  return NextResponse.json(config);
}
