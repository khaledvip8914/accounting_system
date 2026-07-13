import { getCompanies } from './actions'
import CompaniesClient from './CompaniesClient'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function SuperAdminCompaniesPage() {
  const companies = await getCompanies()
  const subscriptionPlans = await prisma.subscriptionPlan.findMany({
    orderBy: { maxUsers: 'asc' }
  })
  return <CompaniesClient initialCompanies={companies} subscriptionPlans={subscriptionPlans} />
}
