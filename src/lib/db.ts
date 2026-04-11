import { PrismaClient } from '../generated/client';

// Force re-instantiation after schema update by using a new global key
const globalForPrisma = globalThis as unknown as {
  prisma_v8: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma_v8 ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma_v8 = prisma;
}

// Verification log for new modules
if (prisma) {
  if ((prisma as any).salesQuotation) console.log('Prisma Client: SalesQuotation model detected.');
  if ((prisma as any).user) console.log('Prisma Client: User model detected.');
  else console.warn('CRITICAL: User model NOT found in PrismaClient properties!');
}
