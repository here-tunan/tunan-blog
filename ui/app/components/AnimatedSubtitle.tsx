'use client';

import React, { useState, useEffect } from 'react';

const roles = [
  { text: 'Backend Engineer', icon: '⚙️', color: 'from-blue-600 to-cyan-600' },
  { text: 'Full-Stack Explorer', icon: '🚀', color: 'from-purple-600 to-pink-600' },
  { text: 'Open Source Enthusiast', icon: '💡', color: 'from-green-600 to-teal-600' },
];

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
    <div className="mt-4 flex flex-wrap items-center justify-start gap-3 sm:gap-4 ml-8 sm:ml-8">
      {roles.map((role, index) => (
        <React.Fragment key={index}>
          <div
            className={`flex items-center gap-1.5 transition-all duration-1200 ease-out transform ${
              visibleRoles.includes(index)
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-2 scale-95'
            }`}
          >
            <span className="text-base">
              {role.icon}
            </span>
            <span 
              className={`font-medium text-sm bg-gradient-to-r ${role.color} bg-clip-text text-transparent whitespace-nowrap`}
            >
              {role.text}
            </span>
          </div>
          {index < roles.length - 1 && visibleRoles.includes(index) && (
            <span 
              className={`text-gray-300 dark:text-gray-600 transition-opacity duration-700 ${
                visibleRoles.includes(index + 1) ? 'opacity-100' : 'opacity-0'
              }`}
            >
              |
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}