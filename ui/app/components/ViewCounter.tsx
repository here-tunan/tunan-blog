'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';

interface ViewCounterProps {
  path: string;
  className?: string;
}

export function ViewCounter({ path, className }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!path) return;

    fetch(`${API_URL}/view/count?path=${encodeURIComponent(path)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then(data => {
        setViews(data.views);
      })
      .catch(err => {
        console.error(`Failed to get views for ${path}:`, err);
        setError(true);
      });
  }, [path]);

  if (error) {
    return <span className={className}>-</span>;
  }

  if (views === null) {
    return <span className={className}>...</span>;
  }

  return <span className={className}>{views}</span>;
}
