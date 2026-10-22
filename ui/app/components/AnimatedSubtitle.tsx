'use client';

import React, { useState, useEffect } from 'react';

const roles = ['Backend Engineer', 'Full-Stack Explorer', 'Open Source Enthusiast'];

export default function AnimatedSubtitle() {
  const [visibleRoles, setVisibleRoles] = useState<number[]>([]);

  useEffect(() => {
    // Clear any existing state first
    setVisibleRoles([]);

    // Stagger the appearance of each role with a slight delay at start
    const timeouts: NodeJS.Timeout[] = [];

    roles.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleRoles(prev => {
          if (!prev.includes(index)) {
            return [...prev, index];
          }
          return prev;
        });
      }, 500 + (index * 600)); // Start after 500ms, then 600ms between each for slower animation

      timeouts.push(timeout);
    });

    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 ml-8 sm:ml-8 text-sm text-muted-foreground">
      {roles.map((role, index) => (
        <React.Fragment key={role}>
          <span
            className={`whitespace-nowrap transition-all duration-700 ease-out ${
              visibleRoles.includes(index)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-1.5'
            }`}
          >
            {role}
          </span>
          {index < roles.length - 1 && (
            <span aria-hidden="true" className="text-border">·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
