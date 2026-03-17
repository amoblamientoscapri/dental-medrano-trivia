import type { Branch } from "@/lib/types";

interface SendPrizeEmailParams {
  to: string;
  nombre: string;
  prizeCode: string;
  branches: Branch[];
}

function getEmblueApiKey() {
  const key = process.env.EMBLUE_API_KEY;
  if (!key) throw new Error("EMBLUE_API_KEY is not configured");
  return key;
}

function buildPrizeEmailHtml({
  nombre,
  prizeCode,
  qrUrl,
  branches,
}: {
  nombre: string;
  prizeCode: string;
  qrUrl: string;
  branches: Branch[];
}): string {
  const firstName = nombre.split(" ")[0];
  const activeBranches = branches.filter((b) => b.active);

  const branchRows = activeBranches
    .map(
      (b) =>
        `<tr>
          <td style="padding:10px 16px;border-bottom:1px solid #fef3e2">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="padding-right:10px;vertical-align:top;color:#F47920;font-size:16px">&#9679;</td>
              <td>
                <span style="font-weight:600;color:#1a1a1a;font-size:14px">${b.name}</span><br/>
                <span style="color:#666;font-size:13px">${b.address}</span>
              </td>
            </tr></table>
          </td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#fdf6f0;font-family:'Segoe UI',Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdf6f0;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(244,121,32,0.08)">

        <!-- Header con gradiente -->
        <tr><td style="background:linear-gradient(135deg,#F47920 0%,#ff9a44 100%);padding:32px 24px;text-align:center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
            <div style="width:56px;height:56px;background:rgba(255,255,255,0.25);border-radius:50%;margin:0 auto 12px;line-height:56px;font-size:28px">&#127942;</div>
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700">${firstName}, &iexcl;&iexcl;GANASTE!!</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:15px">&iexcl;Felicitaciones! Gan&aacute;s un premio en la Trivia Dental Medrano</p>
          </td></tr></table>
        </td></tr>

        <!-- Codigo de premio + QR -->
        <tr><td style="padding:28px 24px 0">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fffbf5;border:2px solid #F47920;border-radius:16px;overflow:hidden">
            <tr><td style="padding:24px;text-align:center">
              <p style="margin:0 0 4px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:1px">Tu c&oacute;digo de premio</p>
              <p style="margin:0 0 20px;font-size:34px;font-weight:800;font-family:'Courier New',monospace;color:#F47920;letter-spacing:6px">${prizeCode}</p>
              <img src="${qrUrl}" alt="C&oacute;digo QR de tu premio" width="200" height="200" style="border-radius:12px;border:3px solid #F47920" />
              <p style="margin:14px 0 0;color:#F47920;font-size:15px;font-weight:600">&#128242; Present&aacute; este QR para retirar tu premio</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Locales adheridos -->
        <tr><td style="padding:24px 24px 0">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;overflow:hidden">
            <tr><td style="background:#dcfce7;padding:12px 16px">
              <h3 style="margin:0;color:#166534;font-size:15px;font-weight:700">&#127978; Retir&aacute; tu premio en cualquiera de nuestros locales adheridos:</h3>
            </td></tr>
            ${branchRows}
          </table>
        </td></tr>

        <!-- Instrucciones -->
        <tr><td style="padding:24px 24px 0">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;overflow:hidden">
            <tr><td style="background:#ffedd5;padding:12px 16px">
              <h3 style="margin:0;color:#9a3412;font-size:15px;font-weight:700">&#128221; &iquest;C&oacute;mo retiro mi premio?</h3>
            </td></tr>
            <tr><td style="padding:16px">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:6px 0;color:#333;font-size:14px">
                    <span style="display:inline-block;width:24px;height:24px;background:#F47920;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;margin-right:8px">1</span>
                    Acerc&aacute;te a cualquiera de nuestros locales adheridos
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#333;font-size:14px">
                    <span style="display:inline-block;width:24px;height:24px;background:#F47920;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;margin-right:8px">2</span>
                    Mostr&aacute; este email o escane&aacute; el c&oacute;digo QR
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#333;font-size:14px">
                    <span style="display:inline-block;width:24px;height:24px;background:#F47920;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;margin-right:8px">3</span>
                    &iexcl;Retir&aacute; tu premio!
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Terminos y condiciones legales -->
        <tr><td style="padding:24px 24px 0">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:10px">
            <tr><td style="padding:14px 16px">
              <p style="margin:0 0 6px;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">T&eacute;rminos y Condiciones</p>
              <ul style="margin:0;padding-left:16px;color:#9ca3af;font-size:11px;line-height:1.6">
                <li>Este premio es personal e intransferible.</li>
                <li>El c&oacute;digo es v&aacute;lido por &uacute;nica vez y no es canjeable por dinero en efectivo.</li>
                <li>Para retirar el premio se deber&aacute; presentar este email o el c&oacute;digo QR en cualquiera de los locales adheridos.</li>
                <li>Dental Medrano se reserva el derecho de verificar la identidad del ganador.</li>
                <li>La promoci&oacute;n no es acumulable con otras ofertas o descuentos vigentes.</li>
                <li>Consultar disponibilidad y vigencia en el local.</li>
              </ul>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:28px 24px;text-align:center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="border-top:1px solid #f0f0f0;padding-top:20px;text-align:center">
              <p style="margin:0 0 4px;color:#F47920;font-size:14px;font-weight:700">Dental Medrano</p>
              <p style="margin:0 0 2px;color:#999;font-size:12px">
                <a href="https://dentalmedrano.com" style="color:#F47920;text-decoration:none">dentalmedrano.com</a>
                &nbsp;&bull;&nbsp;
                <a href="https://instagram.com/dentalmedrano" style="color:#F47920;text-decoration:none">@dentalmedrano</a>
              </p>
              <p style="margin:10px 0 0;color:#ccc;font-size:10px">Este email fue enviado autom&aacute;ticamente. No responder a esta direcci&oacute;n.</p>
            </td></tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendPrizeEmail({
  to,
  nombre,
  prizeCode,
  branches,
}: SendPrizeEmailParams): Promise<boolean> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://trivia.dentalmedrano.com";
  const prizeUrl = `${baseUrl}/premio/${prizeCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(prizeUrl)}`;
  const firstName = nombre.split(" ")[0];
  const activeBranches = branches.filter((b) => b.active);

  const htmlContent = buildPrizeEmailHtml({
    nombre,
    prizeCode,
    qrUrl,
    branches,
  });

  try {
    const apiKey = getEmblueApiKey();
    const eventName = process.env.EMBLUE_EVENT_NAME || "premio_trivia";

    const requestBody = {
      email: to,
      eventName,
      attributes: {
        nombre: firstName,
        nombre_completo: nombre,
        codigo_premio: prizeCode,
        qr_url: qrUrl,
        premio_url: prizeUrl,
        sucursales: activeBranches
          .map((b) => `${b.name} - ${b.address}`)
          .join(" | "),
        html_content: htmlContent,
      },
    };

    console.log("emBlue request URL:", "https://track.embluemail.com/contacts/event");
    console.log("emBlue request body (sin html_content):", JSON.stringify({ ...requestBody, attributes: { ...requestBody.attributes, html_content: "[HTML OMITTED]" } }));
    console.log("emBlue API key (primeros 10 chars):", apiKey.substring(0, 10) + "...");

    const response = await fetch(
      "https://track.embluemail.com/contacts/event",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseText = await response.text();
    console.log("emBlue response status:", response.status);
    console.log("emBlue response headers:", JSON.stringify(Object.fromEntries(response.headers.entries())));
    console.log("emBlue response body:", responseText);

    if (!response.ok) {
      console.error("emBlue API error:", response.status, responseText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send prize email:", error);
    return false;
  }
}
