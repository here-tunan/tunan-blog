'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';

export function TotalViews() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/view/total`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then(data => {
        setViews(data.total_views);
      })
      .catch(err => {
        console.error(`Failed to get total views:`, err);
        setViews(0); // Fallback to 0 on error
      });
  }, []);

  if (views === null) {
    return <span>...</span>;
  }

  return <span>{views.toLocaleString('en-US')}</span>;
}
