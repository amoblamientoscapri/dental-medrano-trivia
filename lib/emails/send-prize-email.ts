import { Resend } from "resend";
import type { Branch } from "@/lib/types";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(key);
}

interface SendPrizeEmailParams {
  to: string;
  nombre: string;
  prizeCode: string;
  branches: Branch[];
}

export async function sendPrizeEmail({ to, nombre, prizeCode, branches }: SendPrizeEmailParams): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://trivia.dentalmedrano.com";
  const prizeUrl = `${baseUrl}/premio/${prizeCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(prizeUrl)}`;

  const branchesHtml = branches
    .filter((b) => b.active)
    .map((b) => `<li style="margin-bottom:8px"><strong>${b.name}</strong><br/>${b.address}</li>`)
    .join("");

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: "Dental Medrano <trivia@dentalmedrano.com>",
      to,
      subject: `🎉 ¡Ganaste un premio, ${nombre.split(" ")[0]}!`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="text-align:center;margin-bottom:20px">
            <h1 style="color:#F47920;margin:0">¡Felicitaciones, ${nombre.split(" ")[0]}!</h1>
            <p style="color:#666;font-size:16px">Ganaste un premio en la Trivia Dental Medrano</p>
          </div>

          <div style="background:#f9f9f9;border:2px solid #F47920;border-radius:16px;padding:24px;text-align:center;margin-bottom:20px">
            <p style="color:#666;margin:0 0 8px">Tu código de premio:</p>
            <p style="font-size:32px;font-weight:bold;font-family:monospace;color:#F47920;margin:0;letter-spacing:4px">${prizeCode}</p>
          </div>

          <div style="text-align:center;margin-bottom:20px">
            <p style="color:#666;margin:0 0 8px">Escaneá este QR en la sucursal:</p>
            <img src="${qrUrl}" alt="QR Code" width="200" height="200" style="border-radius:8px" />
          </div>

          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;margin-bottom:20px">
            <h3 style="color:#166534;margin:0 0 8px">Retirá tu premio en:</h3>
            <ul style="color:#333;padding-left:20px;margin:0">${branchesHtml}</ul>
          </div>

          <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;margin-bottom:20px">
            <h3 style="color:#9a3412;margin:0 0 8px">Instrucciones:</h3>
            <ol style="color:#333;padding-left:20px;margin:0">
              <li>Acercate a cualquiera de las sucursales</li>
              <li>Mostrá este email o el código QR</li>
              <li>¡Retirá tu premio!</li>
            </ol>
          </div>

          <div style="text-align:center;color:#999;font-size:12px;margin-top:30px">
            <p>Dental Medrano - dentalmedrano.com</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send prize email:", error);
    return false;
  }
}
