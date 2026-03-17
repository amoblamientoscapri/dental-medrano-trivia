import { NextResponse } from "next/server";
import { sendPrizeEmail } from "@/lib/emails/send-prize-email";
import { getAllBranches } from "@/lib/branches";

export async function POST(request: Request) {
  try {
    const { email, nombre } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Falta el campo 'email'" }, { status: 400 });
    }

    const branches = await getAllBranches();
    const testCode = "DM-TEST01";

    console.log("=== TEST EMAIL ===");
    console.log("Enviando a:", email);
    console.log("Nombre:", nombre || "Test User");
    console.log("Branches:", branches.length);
    console.log("EMBLUE_API_KEY configurada:", !!process.env.EMBLUE_API_KEY);
    console.log("EMBLUE_EVENT_NAME:", process.env.EMBLUE_EVENT_NAME || "premio_trivia (default)");

    const sent = await sendPrizeEmail({
      to: email,
      nombre: nombre || "Test User",
      prizeCode: testCode,
      branches,
    });

    console.log("Resultado envío:", sent);
    console.log("=== FIN TEST EMAIL ===");

    return NextResponse.json({
      ok: sent,
      details: {
        email,
        code: testCode,
        branchCount: branches.length,
        emblueKeyConfigured: !!process.env.EMBLUE_API_KEY,
        eventName: process.env.EMBLUE_EVENT_NAME || "premio_trivia",
      },
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
