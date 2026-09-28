'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function getBranches(companyId: string) {
  return await prisma.branch.findMany({
    where: { companyId },
    orderBy: { createdAt: 'asc' }
  });
}

export async function createBranch(data: any) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    include: { subscriptionPlan: true, _count: { select: { branches: true } } }
  });

  if (!company) throw new Error('Company not found');

  const maxBranches = company.subscriptionPlan?.maxBranches || 1;
  if (company._count.branches >= maxBranches) {
    throw new Error('MAX_BRANCHES_REACHED');
  }

  const branch = await prisma.branch.create({
    data: {
      companyId: session.user.companyId,
      name: data.name,
      nameAr: data.nameAr,
      isMain: data.isMain || false,
      address: data.address,
      taxNumber: data.taxNumber,
      commercialRegistry: data.commercialRegistry,
      workLat: data.workLat !== undefined && data.workLat !== '' ? parseFloat(data.workLat) : null,
      workLng: data.workLng !== undefined && data.workLng !== '' ? parseFloat(data.workLng) : null,
      workRadius: data.workRadius !== undefined && data.workRadius !== '' ? parseFloat(data.workRadius) : 100
    }
  });

  revalidatePath('/settings/branches');
  revalidatePath('/'); // Revalidate app shell
  return branch;
}

export async function updateBranch(id: string, data: any) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const branch = await prisma.branch.update({
    where: { id, companyId: session.user.companyId },
    data: {
      name: data.name,
      nameAr: data.nameAr,
      address: data.address,
      taxNumber: data.taxNumber,
      commercialRegistry: data.commercialRegistry,
      workLat: data.workLat !== undefined ? (data.workLat !== '' && data.workLat !== null ? parseFloat(data.workLat) : null) : undefined,
      workLng: data.workLng !== undefined ? (data.workLng !== '' && data.workLng !== null ? parseFloat(data.workLng) : null) : undefined,
      workRadius: data.workRadius !== undefined ? (data.workRadius !== '' && data.workRadius !== null ? parseFloat(data.workRadius) : 100) : undefined
    }
  });

  revalidatePath('/settings/branches');
  revalidatePath('/'); 
  return branch;
}

export async function deleteBranch(id: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const branch = await prisma.branch.findUnique({ where: { id, companyId: session.user.companyId } });
  if (branch?.isMain) throw new Error('CANNOT_DELETE_MAIN_BRANCH');

  await prisma.branch.delete({
    where: { id, companyId: session.user.companyId }
  });

  revalidatePath('/settings/branches');
  revalidatePath('/'); 
}
