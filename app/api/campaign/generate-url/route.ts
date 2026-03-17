import { NextRequest, NextResponse } from "next/server";
import { getCampaign } from "@/lib/kv";
import { signCampaignPayload } from "@/lib/campaign";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const campaign = await getCampaign();

  if (!campaign.slug || !campaign.prizeDeadline || !campaign.active) {
    return NextResponse.json(
      { error: "No hay campaña activa configurada" },
      { status: 400 }
    );
  }

  const sig = signCampaignPayload(campaign.slug, campaign.prizeDeadline);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    request.headers.get("referer")?.replace(/\/[^/]*$/, "") ||
    "http://localhost:3000";

  const url = `${baseUrl}/jugar?campaign=${encodeURIComponent(campaign.slug)}&vto=${campaign.prizeDeadline}&sig=${sig}`;

  return NextResponse.json({ url });
}
