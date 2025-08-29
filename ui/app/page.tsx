import React from "react";
import BlogsSection from "@/app/components/home/BlogsSection";
import WeeklySection from "@/app/components/home/WeeklySection";
import AnimatedSubtitle from "@/app/components/AnimatedSubtitle";

export default function Home() {

  return (
    <main className="min-h-screen">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Welcome Section with improved styling */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 mb-8 border-b border-gray-100 dark:border-gray-800">
          <header className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-mono font-bold">
              <span className="text-4xl inline-block animate-wave">👋</span>{' '}
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Hi, Welcome! I&apos;m Tunan!
              </span>
            </h1>
            <AnimatedSubtitle />
          </header>
          <div className="mt-4 sm:mt-0 flex-shrink-0">
            <img 
              src="/assets/beer.jpeg" 
              width="100" 
              className="rounded-full shadow-lg ring-4 ring-white dark:ring-gray-800 transform hover:scale-110 hover:rotate-6 transition-all duration-300 ease-out sm:w-[120px]" 
              alt="cute"
            />
          </div>
        </div>

        {/* Main Content with better spacing */}
        <div className="space-y-12">
          <WeeklySection/>
          <BlogsSection/>
        </div>
        
        {/*<ProjectsSection/>*/}

      </div>
    </main>
  );
}
