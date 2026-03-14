import { NextResponse } from "next/server";
import { getPrizeByCode, redeemPrize } from "@/lib/prizes";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const prize = await getPrizeByCode(code);

  if (!prize) {
    return NextResponse.json({ error: "Código inválido" }, { status: 404 });
  }

  return NextResponse.json({
    code: prize.code,
    status: prize.status,
    ganador: prize.registration.nombre,
    redeemedAt: prize.redeemedAt?.toISOString() || null,
    branch: prize.branch
      ? { name: prize.branch.name, address: prize.branch.address }
      : null,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { branchId } = await request.json();

  if (!branchId) {
    return NextResponse.json({ error: "branchId es requerido" }, { status: 400 });
  }

  const redeemed = await redeemPrize(code, branchId);
  if (!redeemed) {
    return NextResponse.json(
      { error: "Este premio ya fue retirado o no existe" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
