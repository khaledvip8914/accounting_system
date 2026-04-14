import { PrismaClient } from '../generated/client_v7';

// Force re-instantiation after schema update by using a new global key
const globalForPrisma = globalThis as unknown as {
  prisma_v15: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma_v15 ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma_v15 = prisma;
}

export const prisma_latest = prisma;

// Verification log for new modules
if (prisma) {
  if ((prisma as any).salesQuotation) console.log('Prisma Client: SalesQuotation model detected.');
  if ((prisma as any).user) console.log('Prisma Client: User model detected.');
  else console.warn('CRITICAL: User model NOT found in PrismaClient properties!');
}
