import React from "react";
import BlogsSection from "@/app/components/home/BlogsSection";

export default function Home() {

  return (
    <main>
      <div className="container">
        <div className="flex items-center gap-1 pb-8">
          <header className="w-4/5">
            <h1 className="text-4xl font-mono font-bold">👋 Hi, Welcome! I&apos;m Tunan! 🐻‍</h1>
          </header>
          <img src="/assets/beer.jpeg" width="160" className="p-3 rounded-full transform hover:rotate-12 transition delay-200 ease-in-out" alt="cute"/>
        </div>

        <BlogsSection/>
        {/*<ProjectsSection/>*/}

      </div>
    </main>
  );
}
