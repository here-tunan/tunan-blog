import React from "react";
import SkillsSection from "@/app/components/home/SkillsSection";
import ProjectsSection from "@/app/components/home/ProjectsSection";
import BlogsSection from "@/app/components/home/BlogsSection";

export default function Home() {


  return (
    <main>
      <div className="container">
        <div className="flex items-center gap-1 pt-20 pb-8">
          <header className="w-4/5">
            <h1 className="text-4xl font-mono font-bold">Hi, Welcome! I&apos;m Tunan! </h1>
          </header>
          <div className="rounded-full border-2 overflow-hidden bg-button-base">
            <img src={`https://media.giphy.com/media/WIQ0N0OUvei1OW1h9Z/giphy.gif`} width="100" className="p-3"/>
          </div>
        </div>

        <SkillsSection/>

        <BlogsSection/>

        <ProjectsSection/>

      </div>
    </main>
  );
}
