import React from "react";
import ProjectGrid from "@/app/components/project/ProjectGrid";

export default function ProjectsSection() {
  return (
    <section className="section">
      <header className="section-header">
        <h3 className="title">My Projects</h3>
        <a href="/project" className="viewall">
          <span>View all</span>
        </a>
      </header>

      <ProjectGrid />

    </section>
  )
}