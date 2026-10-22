'use client';

import React from "react";
import { SiteUptime } from "@/app/components/SiteUptime";
import { TotalViews } from "@/app/components/TotalViews";
import { useLocale } from "@/app/i18n/locale-context";

export default function Footer() {
  const { dictionary } = useLocale();

  return (
    <footer className="footer mt-16 py-12">
      <div className="container">
        <div className="border-t border-border pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
          {/* Uptime */}
          <div className="font-mono text-sm text-muted-foreground">
            <SiteUptime/>
          </div>

          {/* Total Views */}
          <div className="font-mono text-sm text-muted-foreground">
            <TotalViews/>
            <span className="hidden sm:inline"> {dictionary.footer.totalViews}</span>
          </div>

          {/* Slogan */}
          <p className="font-display text-lg text-foreground">
            {dictionary.footer.slogan}
          </p>
        </div>
      </div>
    </footer>
  );
}
