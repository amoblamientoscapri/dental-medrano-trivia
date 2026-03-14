import { NextResponse } from "next/server";
import localidades from "@/lib/data/localidades.json";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const normalized = normalize(q);
  const results = (localidades as { nombre: string; provincia: string }[])
    .filter((loc) => normalize(loc.nombre).includes(normalized))
    .slice(0, 10);

  return NextResponse.json(results);
}
