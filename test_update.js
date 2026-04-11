
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function testUpdate() {
    try {
        console.log("Checking for existing CostCenters...");
        const ccs = await prisma.costCenter.findMany({ include: { items: true } });
        if (ccs.length === 0) {
            console.log("No CostCenters found. Please create one in the UI first.");
            return;
        }

        const target = ccs[0];
        console.log(`Testing update for CostCenter ID: ${target.id} (${target.name})`);

        // Mock data for update
        const updateData = {
            code: target.code,
            name: target.name + " UPDATED",
            nameAr: target.nameAr,
            description: target.description,
            productId: target.productId,
            yieldWeight: 500, // Change yield weight
            items: target.items.map(it => ({
                productId: it.productId,
                unitId: it.unitId,
                quantity: it.quantity + 1, // Increase quantity
                costPrice: it.costPrice
            }))
        };

        // Simulate updateCostCenter logic
        console.log("Executing transaction...");
        await prisma.$transaction(async (tx) => {
            await tx.costCenterItem.deleteMany({ where: { costCenterId: target.id } });
            
            await tx.costCenter.update({
                where: { id: target.id },
                data: {
                    name: updateData.name,
                    yieldWeight: updateData.yieldWeight
                }
            });

            await tx.costCenterItem.createMany({
                data: updateData.items.map(item => ({
                    costCenterId: target.id,
                    productId: item.productId,
                    unitId: item.unitId,
                    quantity: item.quantity,
                    costPrice: item.costPrice
                }))
            });
        });

        console.log("Update applied. Verifying...");
        const updated = await prisma.costCenter.findUnique({
            where: { id: target.id },
            include: { items: true }
        });

        console.log("Updated CC Name:", updated.name);
        console.log("Updated CC yieldWeight:", updated.yieldWeight);
        console.log("New Items count:", updated.items.length);
        console.log("Example Item Qty:", updated.items[0]?.quantity);

        if (updated.name.includes("UPDATED") && updated.yieldWeight === 500) {
            console.log("SUCCESS: Database update worked.");
        } else {
            console.log("FAILURE: Database update did not persist as expected.");
        }

    } catch (err) {
        console.error("Error during test:", err);
    } finally {
        await prisma.$disconnect();
    }
}

testUpdate();
