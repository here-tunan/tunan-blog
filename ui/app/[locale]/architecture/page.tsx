import React from "react";
import ArchitectureDiagram from "@/app/components/about/ArchitectureDiagram";
import { getSafeLocale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = getSafeLocale(params.locale);
  const dictionary = getDictionary(locale);
  return { title: `${dictionary.architecture.title} · Tunan` };
}

export default async function Architecture({ params }: { params: { locale: string } }) {
  const locale = getSafeLocale(params.locale);
  const dictionary = getDictionary(locale);

  return (
    <main>
      <div className="container">
        <header className="mb-8">
          <h1 className="font-display text-3xl text-foreground md:text-4xl">
            {dictionary.architecture.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            {dictionary.architecture.description}
          </p>
          <div className="mt-5 h-px w-12 bg-border" />
        </header>

        <ArchitectureDiagram locale={locale} />
      </div>
    </main>
  );
}
