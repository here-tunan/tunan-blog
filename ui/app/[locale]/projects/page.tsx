import React from "react";
import { API_URL } from "@/lib/config";
import ProjectGrid from "@/app/components/project/ProjectGrid";
import StarHistory from "@/app/components/project/StarHistory";
import { getSafeLocale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

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
      next: { revalidate: 300 },
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

export default async function Projects({ params }: { params: { locale: string } }) {
  const locale = getSafeLocale(params.locale);
  const dictionary = getDictionary(locale);
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
        {/* Hero */}
        <div className="mb-14">
          <h1 className="font-display text-4xl text-foreground md:text-5xl">
            {dictionary.projects.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-8 text-muted-foreground">
            {dictionary.projects.description}
          </p>
          <div className="mt-6 h-px w-12 bg-border" />
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