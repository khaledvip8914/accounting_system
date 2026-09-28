import { prisma } from '@/lib/db';

/**
 * Checks if a given date falls within an open financial year.
 * Throws an error if the date is invalid (no open year found or year is closed).
 */
export async function validateFinancialYear(companyId: string, date: Date | string) {
  const checkDate = new Date(date);
  
  const year = await prisma.financialYear.findFirst({
    where: {
      companyId,
      startDate: { lte: checkDate },
      endDate: { gte: checkDate }
    }
  });

  if (!year) {
    throw new Error('التاريخ المدخل لا ينتمي لأي سنة مالية معرفة. يرجى إعداد السنوات المالية أولاً.');
  }

  if (year.status === 'Closed') {
    throw new Error(`لا يمكن إضافة أو تعديل عمليات في سنة مالية مغلقة (${year.name}).`);
  }

  return year;
}
