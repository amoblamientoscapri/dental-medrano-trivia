import { NextResponse } from "next/server";
import { updateRegistrationResult } from "@/lib/registrations";
import { createPrize } from "@/lib/prizes";
import { getAllBranches } from "@/lib/branches";
import { sendPrizeEmail } from "@/lib/emails/send-prize-email";
import { prisma } from "@/lib/db";

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

    if (gameResult === "won") {
      const prize = await createPrize(id);
      const branches = await getAllBranches();

      // Send email in background (don't block response)
      const registration = await prisma.registration.findUnique({ where: { id } });
      if (registration && prize) {
        sendPrizeEmail({
          to: registration.correo,
          nombre: registration.nombre,
          prizeCode: prize.code,
          branches,
        }).then(async (sent) => {
          if (sent) {
            await prisma.prize.update({
              where: { id: prize.id },
              data: { emailSent: true, emailSentAt: new Date() },
            });
          }
        }).catch(() => {});
      }

      return NextResponse.json({
        ok: true,
        prize: { code: prize.code },
        branches,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar registro" },
      { status: 500 }
    );
  }
}
