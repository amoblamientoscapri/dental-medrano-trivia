import { prisma } from "./db";

export async function getAllBranches(includeInactive = false) {
  return prisma.branch.findMany({
    where: includeInactive ? {} : { active: true },
    orderBy: { name: "asc" },
  });
}

export async function createBranch(name: string, address: string) {
  return prisma.branch.create({
    data: { name, address },
  });
}

export async function updateBranch(id: string, data: { name?: string; address?: string; active?: boolean }) {
  return prisma.branch.update({
    where: { id },
    data,
  });
}

export async function deleteBranch(id: string) {
  return prisma.branch.update({
    where: { id },
    data: { active: false },
  });
}
