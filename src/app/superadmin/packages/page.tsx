import { getPackages } from './actions'
import PackagesClient from './PackagesClient'

export const dynamic = 'force-dynamic'

export default async function SuperAdminPackagesPage() {
  const packages = await getPackages()
  return <PackagesClient initialPackages={packages} />
}
