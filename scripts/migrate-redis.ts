import { Redis } from "@upstash/redis";
import { PrismaClient } from "@prisma/client";

async function migrate() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.error("Missing KV_REST_API_URL or KV_REST_API_TOKEN env vars");
    process.exit(1);
  }

  const redis = new Redis({ url, token });
  const prisma = new PrismaClient();

  console.log("Reading registrations from Redis...");
  const raw = await redis.lrange<string>("registrations", 0, -1);

  if (raw.length === 0) {
    console.log("No registrations found in Redis.");
    await prisma.$disconnect();
    return;
  }

  console.log(`Found ${raw.length} registrations. Migrating...`);

  let migrated = 0;
  let skipped = 0;

  for (const item of raw) {
    const reg = typeof item === "string" ? JSON.parse(item) : item;

    try {
      await prisma.registration.create({
        data: {
          id: reg.id,
          nombre: reg.nombre || "",
          telefono: reg.telefono || "",
          correo: reg.correo || "",
          edad: Number(reg.edad) || 0,
          esEstudiante: Boolean(reg.esEstudiante),
          especialidad: reg.especialidad || null,
          localidad: reg.localidad || null,
          provincia: reg.provincia || null,
          gameResult: reg.gameResult || null,
          timestamp: reg.timestamp ? new Date(reg.timestamp) : new Date(),
        },
      });
      migrated++;
    } catch (error) {
      console.warn(`Skipped registration ${reg.id}: ${error}`);
      skipped++;
    }
  }

  console.log(`Migration complete: ${migrated} migrated, ${skipped} skipped.`);
  await prisma.$disconnect();
}

migrate().catch(console.error);
