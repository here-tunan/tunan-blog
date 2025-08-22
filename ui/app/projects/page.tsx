import React from "react";
import { API_URL } from "@/lib/config";
import ProjectGrid from "@/app/components/project/ProjectGrid";
import StarHistory from "@/app/components/project/StarHistory";

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

async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_URL}/project/list`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.success) {
      return data.data || [];
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
  return [];
}

export default async function Projects() {
  const projects = await getProjects();

  // Extract GitHub repositories from projects
  const githubRepos = projects
    .filter(project => project.githubUrl)
    .map(project => {
      const url = project.githubUrl;
      const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
      return match ? match[1] : null;
    })
    .filter((repo): repo is string => repo !== null);

  const starHistoryLinkUrl = githubRepos.length > 0
    ? `https://www.star-history.com/#${githubRepos.join('&')}&Date`
    : null;

  return (
    <main>
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Featured Projects
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A curated collection of my work spanning web development, open source contributions, and innovative solutions
          </p>
        </div>
        
        <ProjectGrid projects={projects} />
        
        {/* Star History Section */}
        {githubRepos.length > 0 && starHistoryLinkUrl && (
          <StarHistory repos={githubRepos} linkUrl={starHistoryLinkUrl} />
        )}
      </div>
    </main>
  );
}