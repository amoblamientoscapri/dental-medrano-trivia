import { NextResponse } from "next/server";
import { getAllBranches, createBranch } from "@/lib/branches";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const branches = await getAllBranches();
  return NextResponse.json(branches);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { name, address } = await request.json();
    if (!name || !address) {
      return NextResponse.json({ error: "name y address son requeridos" }, { status: 400 });
    }
    const branch = await createBranch(name, address);
    return NextResponse.json(branch, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear sucursal" }, { status: 500 });
  }
}
