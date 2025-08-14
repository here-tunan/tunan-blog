'use client';

import { useEffect, useState } from 'react';

const START_DATE = new Date('2024-05-01T00:00:00Z');

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function SiteUptime() {
  const [duration, setDuration] = useState('...');

  useEffect(() => {
    const calculateDuration = () => {
      const now = new Date();
      const diff = now.getTime() - START_DATE.getTime();
      setDuration(formatDuration(diff));
    };

    // Set initial duration
    calculateDuration();

    // Update every second
    const intervalId = setInterval(calculateDuration, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return <span>{duration}</span>;
}
