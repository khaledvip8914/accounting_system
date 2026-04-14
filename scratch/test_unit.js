const { PrismaClient } = require('../src/generated/client');

async function getUnitWeightInGramsServer(qty, unitId, productId = null, db) {
  if (!unitId) return qty;
  const u = await db.unitOfMeasure.findUnique({ where: { id: unitId } });
  if (!u) return qty;
  const name = (u.name || '').toLowerCase().trim();
  const nameAr = (u.nameAr || '').trim();
  
  if (name === 'kilogram' || name === 'kg' || nameAr === 'كيلو' || nameAr === 'كجم') return qty * 1000;
  if (name === 'gram' || name === 'g' || name === 'gm' || nameAr === 'جرام' || nameAr === 'جم') return qty;
  if (name === 'liter' || name === 'ltr' || name === 'l' || nameAr === 'لتر') return qty * 1000;
  if (name === 'milliliter' || name === 'ml' || nameAr === 'ملي') return qty;
  
  if (name.includes('kilogram') || name.includes('كيلو')) return qty * 1000;
  if (name.includes('liter') || name.includes('لتر')) return qty * 1000;

  if (productId) {
      const prod = await db.product.findUnique({ where: { id: productId } });
      if (prod && unitId === prod.unitId && prod.subUnitId) {
          const subWeight = await getUnitWeightInGramsServer(1, prod.subUnitId, null, db);
          return qty * (prod.unitQuantity || 1) * subWeight;
      }
  }

  if (u.conversionFactor && u.conversionFactor > 1 && !name.includes('gram') && !name.includes('ml')) {
      return qty * u.conversionFactor;
  }
  return qty;
}

async function computeBaseUnitQty(usedQty, usedUnitId, productId, db) {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return usedQty;
    const mainUnitWeightG = await getUnitWeightInGramsServer(1, product.unitId, productId, db);
    const usedUnitWeightG = await getUnitWeightInGramsServer(1, usedUnitId, productId, db);
    
    console.log(`mainUnitWeightG: ${mainUnitWeightG}, usedUnitWeightG: ${usedUnitWeightG}`);
    
    if (mainUnitWeightG > 0) {
        return (usedQty * usedUnitWeightG) / mainUnitWeightG;
    }
    return usedQty;
}

async function testUnit() {
  const prisma = new PrismaClient({ datasources: { db: { url: 'file:../prisma/dev.db' } } });
  try {
    const qty = 5;
    const usedUnitId = 'cmnkns90n0001vr5k5zhde3cq'; // kg
    const productId = 'cmnlexgf5004ovrqgmmy6tn3v'; // Premium Flour
    
    const baseQty = await computeBaseUnitQty(qty, usedUnitId, productId, prisma);
    console.log(`Base Qty Result: ${baseQty}`);
  } catch(e) { } finally { await prisma.$disconnect(); }
}
testUnit();
