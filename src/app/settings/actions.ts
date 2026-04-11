'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getCompanyProfile() {
  try {
    let profile = await prisma.companyProfile.findUnique({
      where: { id: 'default' }
    });
    if (!profile) {
      profile = await prisma.companyProfile.create({
        data: { id: 'default', name: 'My Company', nameAr: 'شركتي' }
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
    const updated = await prisma.companyProfile.upsert({
      where: { id: 'default' },
      update: data,
      create: { ...data, id: 'default' }
    });
    revalidatePath('/settings');
    return { success: true, profile: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
