import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { createCampaign, getAllCampaigns, generateSignedUrl } from "@/lib/campaigns";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) return false;
  return true;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const campaigns = await getAllCampaigns();
  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, flowType, expiresAt } = body;

    if (!name || !slug || !expiresAt) {
      return NextResponse.json(
        { error: "Campos requeridos: name, slug, expiresAt" },
        { status: 400 }
      );
    }

    const campaign = await createCampaign({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      flowType: flowType || "feria",
      expiresAt: new Date(expiresAt),
    });

    const signedUrl = await generateSignedUrl(campaign);

    return NextResponse.json({ campaign, signedUrl }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error al crear campaña";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
