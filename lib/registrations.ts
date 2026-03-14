import { prisma } from "./db";
import type { Registration } from "./types";

export async function saveRegistration(
  reg: Omit<Registration, "id" | "timestamp" | "prize">
): Promise<Registration> {
  const created = await prisma.registration.create({
    data: {
      nombre: reg.nombre,
      telefono: reg.telefono,
      correo: reg.correo,
      edad: reg.edad,
      esEstudiante: reg.esEstudiante,
      especialidad: reg.especialidad || null,
      localidad: reg.localidad || null,
      provincia: reg.provincia || null,
    },
  });

  return {
    id: created.id,
    nombre: created.nombre,
    telefono: created.telefono,
    correo: created.correo,
    edad: created.edad,
    esEstudiante: created.esEstudiante,
    especialidad: created.especialidad || undefined,
    localidad: created.localidad || undefined,
    provincia: created.provincia || undefined,
    timestamp: created.timestamp.toISOString(),
    gameResult: (created.gameResult as "won" | "lost") || undefined,
  };
}

export async function updateRegistrationResult(
  id: string,
  gameResult: "won" | "lost"
): Promise<boolean> {
  try {
    await prisma.registration.update({
      where: { id },
      data: { gameResult },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const rows = await prisma.registration.findMany({
    include: { prize: { include: { branch: true } } },
    orderBy: { timestamp: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    telefono: r.telefono,
    correo: r.correo,
    edad: r.edad,
    esEstudiante: r.esEstudiante,
    especialidad: r.especialidad || undefined,
    localidad: r.localidad || undefined,
    provincia: r.provincia || undefined,
    timestamp: r.timestamp.toISOString(),
    gameResult: (r.gameResult as "won" | "lost") || undefined,
    prize: r.prize
      ? {
          id: r.prize.id,
          code: r.prize.code,
          registrationId: r.prize.registrationId,
          status: r.prize.status as "pending" | "redeemed",
          redeemedAt: r.prize.redeemedAt?.toISOString() || null,
          branchId: r.prize.branchId || null,
          branch: r.prize.branch
            ? {
                id: r.prize.branch.id,
                name: r.prize.branch.name,
                address: r.prize.branch.address,
                active: r.prize.branch.active,
              }
            : null,
          emailSent: r.prize.emailSent,
          emailSentAt: r.prize.emailSentAt?.toISOString() || null,
          createdAt: r.prize.createdAt.toISOString(),
        }
      : null,
  }));
}

export async function clearRegistrations(): Promise<void> {
  await prisma.prize.deleteMany();
  await prisma.registration.deleteMany();
}
