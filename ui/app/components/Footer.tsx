'use client';

import React from "react";
import { SiteUptime } from "@/app/components/SiteUptime";
import { TotalViews } from "@/app/components/TotalViews";
import { useLocale } from "@/app/i18n/locale-context";

export default function Footer() {
  const { dictionary } = useLocale();

  return (
    <footer className="footer py-10">
        <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">

            {/* Uptime */}
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                <span>🚀</span>
                <span className="font-mono"><SiteUptime/></span>
            </div>

            {/* Total Views */}
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                <span>🔥</span>
                <span className="font-mono"><TotalViews/></span>
                <span className="hidden sm:inline">{dictionary.footer.totalViews}</span>
            </div>


            {/* Playful Text */}
            <p className="animated-gradient-text font-bold text-lg tracking-wider">
                {dictionary.footer.slogan}
            </p>

        </div>
    </footer>
  );
}