import React from 'react';
import { cookies } from 'next/headers';
import SalariesClient from './SalariesClient';
import Layout from '../layout';

export default async function SalariesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';

  return (
    <SalariesClient lang={lang} />
  );
}
