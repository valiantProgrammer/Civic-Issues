'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PendingReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to user page with pending filter
    router.push('/user');
  }, [router]);

  return null;
}
