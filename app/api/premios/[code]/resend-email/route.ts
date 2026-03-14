import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { getPrizeByCode } from "@/lib/prizes";
import { getAllBranches } from "@/lib/branches";
import { sendPrizeEmail } from "@/lib/emails/send-prize-email";
import { prisma } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { code } = await params;
  const prize = await getPrizeByCode(code);
  if (!prize) {
    return NextResponse.json({ error: "Premio no encontrado" }, { status: 404 });
  }

  const branches = await getAllBranches();
  const sent = await sendPrizeEmail({
    to: prize.registration.correo,
    nombre: prize.registration.nombre,
    prizeCode: prize.code,
    branches,
  });

  if (sent) {
    await prisma.prize.update({
      where: { id: prize.id },
      data: { emailSent: true, emailSentAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Error al enviar email" }, { status: 500 });
}
