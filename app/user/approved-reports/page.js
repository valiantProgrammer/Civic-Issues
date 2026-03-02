'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ApprovedReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to user page with approved filter
    router.push('/user');
  }, [router]);

  return null;
}
