import { getCompanies } from './actions'
import CompaniesClient from './CompaniesClient'

export const dynamic = 'force-dynamic'

export default async function SuperAdminCompaniesPage() {
  const companies = await getCompanies()
  return <CompaniesClient initialCompanies={companies} />
}
