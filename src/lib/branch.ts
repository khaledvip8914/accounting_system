import { cookies } from 'next/headers';

export async function getActiveBranch() {
  const cookieStore = await cookies();
  const branchId = cookieStore.get('NX_BRANCH')?.value;
  return branchId || null;
}
