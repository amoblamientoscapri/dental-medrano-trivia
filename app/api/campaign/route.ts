import { NextRequest, NextResponse } from "next/server";
import { getCampaign, setCampaign } from "@/lib/kv";
import { verifyToken } from "@/lib/auth";
import type { CampaignConfig } from "@/lib/types";

export async function GET() {
  const campaign = await getCampaign();
  return NextResponse.json(campaign);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { name, prizeDeadline, active } = body;

  if (!name || !prizeDeadline) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const campaign: CampaignConfig = {
    name,
    slug: slugify(name),
    prizeDeadline,
    active: Boolean(active),
  };

  await setCampaign(campaign);
  return NextResponse.json(campaign);
}
