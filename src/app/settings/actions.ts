'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

async function getAuthContext() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }
  return {
    companyId: session.user.companyId,
    name: session.user.name || 'Company'
  };
}

export async function getCompanyProfile() {
  try {
    const { companyId, name } = await getAuthContext();
    
    let profile = await prisma.companyProfile.findFirst({
      where: { companyId }
    });

    if (!profile) {
      profile = await prisma.companyProfile.create({
        data: { 
          id: `profile-${companyId}`,
          companyId, 
          name, 
          nameAr: 'شركتي' 
        }
      });
    }
    return profile;
  } catch (error) {
    console.error('Failed to get company profile:', error);
    return null;
  }
}

export async function updateCompanyProfile(data: any) {
  try {
    const { companyId } = await getAuthContext();
    
    const existing = await prisma.companyProfile.findFirst({
      where: { companyId }
    });

    // Sanitize data to prevent companyId or ID tampering
    const { id, companyId: _, ...updateData } = data;

    let updated;
    if (existing) {
      updated = await prisma.companyProfile.update({
        where: { id: existing.id, companyId },
        data: updateData
      });
    } else {
      updated = await prisma.companyProfile.create({
        data: { ...updateData, companyId, id: `profile-${companyId}` }
      });
    }

    revalidatePath('/settings');
    return { success: true, profile: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
