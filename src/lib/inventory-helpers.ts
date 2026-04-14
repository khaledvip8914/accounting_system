import { prisma as defaultPrisma } from './db';

/**
 * Calculates the weight of a given quantity in grams, 
 * using the product's defined conversion factors.
 */
export async function getUnitWeightInGramsServer(qty: number, unitId: string | null, productId: string | null = null, tx?: any): Promise<number> {
  const db = tx || defaultPrisma;
  if (!unitId) return qty;
  
  const u = await db.unitOfMeasure.findUnique({ where: { id: unitId } });
  if (!u) return qty;

  // 1. Product-specific conversion logic (High Priority)
  if (productId) {
      const prod = await db.product.findUnique({ where: { id: productId } });
      if (prod && unitId === prod.unitId && prod.subUnitId) {
          const subWeight = await getUnitWeightInGramsServer(1, prod.subUnitId, null, db);
          return qty * (prod.unitQuantity || 1) * subWeight;
      }
  }

  const name = (u.name || '').toLowerCase().trim();
  const nameAr = (u.nameAr || '').trim();
  
  // 2. Exact matches
  if (name === 'kilogram' || name === 'kg' || nameAr === 'كيلو' || nameAr === 'كجم' || nameAr === 'كيلوجرام') return qty * 1000;
  if (name === 'gram' || name === 'g' || name === 'gm' || nameAr === 'جرام' || nameAr === 'جم') return qty;
  if (name === 'liter' || name === 'ltr' || name === 'l' || nameAr === 'لتر') return qty * 1000;
  if (name === 'milliliter' || name === 'ml' || nameAr === 'ملي' || nameAr === 'مليلتر') return qty;
  
  // 3. Broad matches
  if (name.includes('kilogram') || name.includes('kg') || nameAr.includes('كيلو')) return qty * 1000;
  if (name.includes('liter') || name.includes('ltr') || nameAr.includes('لتر')) return qty * 1000;

  if (u.conversionFactor && u.conversionFactor > 1 && !name.includes('gram') && !name.includes('ml')) {
      return qty * u.conversionFactor;
  }

  return qty;
}

/**
 * Converts a used quantity (in any unit) to the product's BASE unit quantity.
 */
export async function computeBaseUnitQty(usedQty: number, usedUnitId: string | null, productId: string, tx?: any): Promise<number> {
    const db = tx || defaultPrisma;
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return usedQty;

    const mainUnitWeightG = await getUnitWeightInGramsServer(1, product.unitId, productId, db);
    const usedUnitWeightG = await getUnitWeightInGramsServer(1, usedUnitId, productId, db);

    if (mainUnitWeightG > 0) {
        return (usedQty * usedUnitWeightG) / mainUnitWeightG;
    }
    return usedQty;
}
