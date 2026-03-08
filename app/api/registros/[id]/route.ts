import { NextResponse } from "next/server";
import { updateRegistrationResult } from "@/lib/registrations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { gameResult } = body;

    if (!gameResult || !["won", "lost"].includes(gameResult)) {
      return NextResponse.json(
        { error: "gameResult debe ser 'won' o 'lost'" },
        { status: 400 }
      );
    }

    const updated = await updateRegistrationResult(id, gameResult);
    if (!updated) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar registro" },
      { status: 500 }
    );
  }
}
