'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getActiveBranch } from '@/lib/branch';

async function getCompanyId() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }
  return session.user.companyId;
}

export async function getInventoryValuation() {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();

    const whereClause: any = { companyId };
    if (branchId) whereClause.branchId = branchId;

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        categoryRef: true
      },
      orderBy: { name: 'asc' }
    });

    const reportData = products.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      nameAr: p.nameAr,
      category: p.categoryRef?.name || p.category || '',
      stockQuantity: p.stockQuantity,
      costPrice: p.costPrice,
      salePrice: p.salePrice,
      totalCostValue: p.stockQuantity * p.costPrice,
      totalSaleValue: p.stockQuantity * p.salePrice
    }));

    return { success: true, data: reportData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getStockMovement(startDate: string, endDate: string) {
  try {
    const companyId = await getCompanyId();
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const logs = await prisma.inventoryLog.findMany({
      where: {
        companyId,
        date: { gte: start, lte: end }
      },
      include: {
        product: true,
        warehouse: true
      },
      orderBy: { date: 'desc' }
    });

    const reportData = logs.map(l => ({
      id: l.id,
      date: l.date,
      type: l.type,
      referenceId: l.referenceId,
      description: l.description,
      quantity: l.quantity,
      productName: l.product.name,
      productNameAr: l.product.nameAr,
      sku: l.product.sku,
      warehouseName: l.warehouse?.name || '',
      warehouseNameAr: l.warehouse?.nameAr || ''
    }));

    return { success: true, data: reportData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLowStockAlerts() {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();

    const whereClause: any = { companyId };
    if (branchId) whereClause.branchId = branchId;

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { categoryRef: true }
    });

    const alerts = products
      .filter(p => p.reorderPoint > 0 && p.stockQuantity <= p.reorderPoint)
      .map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        nameAr: p.nameAr,
        category: p.categoryRef?.name || p.category || '',
        stockQuantity: p.stockQuantity,
        reorderPoint: p.reorderPoint,
        deficit: p.reorderPoint - p.stockQuantity
      }))
      .sort((a, b) => b.deficit - a.deficit);

    return { success: true, data: alerts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExpiryTracking() {
  try {
    const companyId = await getCompanyId();
    const branchId = await getActiveBranch();

    const whereClause: any = { 
      companyId
    };
    if (branchId) whereClause.branchId = branchId;

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { categoryRef: true },
      orderBy: { expiryDate: 'asc' }
    });

    const now = new Date();
    
    const reportData = products.map(p => {
      let daysToExpiry = null;
      let status = 'Not Available';

      if (p.expiryDate) {
        const expDate = new Date(p.expiryDate);
        const msDiff = expDate.getTime() - now.getTime();
        daysToExpiry = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
        
        status = 'Valid';
        if (daysToExpiry < 0) status = 'Expired';
        else if (daysToExpiry <= 30) status = 'Expiring Soon (<= 30 days)';
        else if (daysToExpiry <= 90) status = 'Expiring Soon (<= 90 days)';
      }

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        nameAr: p.nameAr,
        category: p.categoryRef?.name || p.category || '',
        stockQuantity: p.stockQuantity,
        expiryDate: p.expiryDate,
        daysToExpiry,
        status
      };
    });

    return { success: true, data: reportData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
