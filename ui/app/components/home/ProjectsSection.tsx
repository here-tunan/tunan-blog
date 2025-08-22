import React from "react";
import ProjectGrid from "@/app/components/project/ProjectGrid";
import { API_URL } from "@/lib/config";

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

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_URL}/project/featured`, {
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
    console.error("Error fetching featured projects:", error);
  }
  return [];
}

export default async function ProjectsSection() {
  const projects = await getFeaturedProjects();

  return (
    <section className="section">
      <header className="section-header">
        <h3 className="title">My Projects</h3>
        <a href="/projects" className="viewall">
          <span>View all</span>
        </a>
      </header>

      <ProjectGrid projects={projects} />

    </section>
  )
}