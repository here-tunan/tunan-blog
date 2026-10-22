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
    <div className="group relative flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-foreground/25">
      {/* Featured 徽标 */}
      {project.featured && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
          Featured
        </span>
      )}

      <h3 className="font-display text-xl leading-snug text-foreground transition-colors group-hover:text-primary">
        {project.name}
      </h3>

      <div className="mt-2 min-h-[4.5rem]">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {displayDescription}
        </p>
      </div>

      {/* GitHub 数据 */}
      <div className="my-4">
        {project.gitHubInfo && project.githubUrl ? (
          <div className="space-y-2 rounded-lg bg-muted/60 p-3 font-mono text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {project.gitHubInfo.language && (
                <span>{project.gitHubInfo.language}</span>
              )}
              <span>★ {project.gitHubInfo.stars}</span>
              <span>{project.gitHubInfo.forks} forks</span>
            </div>
            {project.gitHubInfo.updatedAt && (
              <div>
                Updated {new Date(project.gitHubInfo.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            {project.githubUrl ? 'Loading GitHub info...' : 'No GitHub URL'}
          </div>
        )}
      </div>

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <div className="mb-5 flex-grow">
          <div className="flex flex-wrap gap-2">
            {techStack.slice(0, 5).map((tech: string, index: number) => (
              <span
                key={index}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 5 && (
              <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                +{techStack.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex gap-2 border-t border-border pt-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.04] active:scale-[0.98]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/40 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-accent active:scale-[0.98]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
