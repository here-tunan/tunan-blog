import { ProjectItem } from "@/app/components/project/ProjectItem";

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

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mb-6">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Projects Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Projects will appear here once they`&apos;re added to the collection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-8 ${projects.length === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 
      projects.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto' : 
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
      {projects.map((project) => (
        <ProjectItem 
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}