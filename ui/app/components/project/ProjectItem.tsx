import React from 'react';

interface GitHubInfo {
  name: string;
  description: string;
  htmlUrl: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  techStack: string;
  featured: boolean;
  sortOrder: number;
  gitHubInfo?: GitHubInfo;
}

interface ProjectItemProps {
  project: Project;
}

export function ProjectItem({ project }: ProjectItemProps) {
  const displayDescription = project.gitHubInfo?.description || project.description;
  const techStack = project.techStack ? JSON.parse(project.techStack) : [];
  
  
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1 h-full flex flex-col">
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg animate-pulse">
          ✨ Featured
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow">
        {/* Project Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
          {project.name}
        </h3>
        <div className="h-20">
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed line-clamp-3">
            {displayDescription}
          </p>
        </div>
      </div>

      {/* GitHub Stats - Fixed Height */}
      <div className="mb-6 h-20">
        {project.gitHubInfo && project.githubUrl ? (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3 h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {project.gitHubInfo.language && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{project.gitHubInfo.language}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{project.gitHubInfo.stars}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{project.gitHubInfo.forks}</span>
              </div>
            </div>
          </div>
          {/* Last Updated */}
          {project.gitHubInfo.updatedAt && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span>Updated {new Date(project.gitHubInfo.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          )}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg h-full flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {project.githubUrl ? 'Loading GitHub info...' : 'No GitHub URL'}
            </span>
          </div>
        )}
      </div>

      {/* Tech Stack - Flexible Height in Remaining Space */}
      <div className="flex-grow mb-6">
        {techStack.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {techStack.slice(0, 5).map((tech: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-700 hover:scale-105 transition-transform"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 5 && (
                <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm rounded-full border border-gray-200 dark:border-gray-600">
                  +{techStack.length - 5} more
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-16">
            <span className="text-sm text-gray-500 dark:text-gray-400">No tech stack defined</span>
          </div>
        )}
      </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 text-white text-xs font-medium rounded-lg hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}