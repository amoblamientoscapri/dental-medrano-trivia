import { NextResponse } from "next/server";
import {
  saveRegistration,
  getAllRegistrations,
  clearRegistrations,
} from "@/lib/registrations";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, telefono, correo, edad, esEstudiante, especialidad, localidad, provincia, campaignId } = body;

    if (!nombre || !telefono || !correo || !edad) {
      return NextResponse.json(
        { error: "Campos requeridos: nombre, telefono, correo, edad" },
        { status: 400 }
      );
    }

    const reg = await saveRegistration({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      correo: correo.trim(),
      edad: Number(edad),
      esEstudiante: Boolean(esEstudiante),
      especialidad: esEstudiante ? undefined : especialidad?.trim() || undefined,
      localidad: localidad?.trim() || undefined,
      provincia: provincia?.trim() || undefined,
      campaignId: campaignId || undefined,
    });

    return NextResponse.json(reg, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al guardar registro" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const registrations = await getAllRegistrations();
  return NextResponse.json(registrations);
}

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await clearRegistrations();
  return NextResponse.json({ ok: true });
}
