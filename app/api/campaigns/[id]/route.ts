import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { updateCampaign, deleteCampaign } from "@/lib/campaigns";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) return false;
  return true;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.flowType !== undefined) data.flowType = body.flowType;
    if (body.expiresAt !== undefined) data.expiresAt = new Date(body.expiresAt);
    if (body.active !== undefined) data.active = body.active;

    const campaign = await updateCampaign(id, data);
    return NextResponse.json(campaign);
  } catch {
    return NextResponse.json({ error: "Error al actualizar campaña" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const campaign = await deleteCampaign(id);
    return NextResponse.json(campaign);
  } catch {
    return NextResponse.json({ error: "Error al desactivar campaña" }, { status: 500 });
  }
}
