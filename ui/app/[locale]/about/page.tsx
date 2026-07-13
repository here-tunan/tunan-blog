import React from "react";
import Skills from "@/app/components/Skills";
import {Comments} from "@/app/components/blog/comment";
import DevicesAndApps from "@/app/components/DevicesAndApps";
import Books from "@/app/components/Books";
import {API_URL} from "@/lib/config";
import { getSafeLocale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

async function getBooks() {
    try {
        const response = await fetch(`${API_URL}/book/list`, {
            method: 'GET',
            next: { revalidate: 3600 },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}

async function getDevicesAndApps() {
    try {
        const response = await fetch(`${API_URL}/device-app/grouped`, {
            next: { revalidate: 3600 },
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching device apps:', error);
        return [];
    }
}

export default async function About({ params }: { params: { locale: string } }) {
    const locale = getSafeLocale(params.locale);
    const dictionary = getDictionary(locale);
    const books = await getBooks();
    const deviceApps = await getDevicesAndApps();

    const focusTags = [dictionary.about.focusBackend, dictionary.about.focusFullStack, dictionary.about.focusWriting];

    return (
        <main>
            <div className="container">
                <div className="space-y-12">
                    <section className="relative overflow-hidden rounded-[2rem] border border-gray-100/80 dark:border-gray-800 bg-gradient-to-br from-blue-50/70 via-white/70 to-purple-50/70 dark:from-blue-950/20 dark:via-gray-900/40 dark:to-purple-950/20 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
                        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-300/20 blur-3xl" />
                        <div className="absolute -bottom-20 left-1/4 h-52 w-52 rounded-full bg-purple-300/20 blur-3xl" />

                        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 dark:border-blue-900 bg-white/60 dark:bg-gray-900/50 px-3 py-1 text-xs font-mono text-blue-600 dark:text-blue-300 shadow-sm">
                                    <span>👋</span>
                                    <span>{dictionary.about.eyebrow}</span>
                                </div>

                                <h1 className="mt-5 text-4xl sm:text-5xl font-bold font-mono leading-tight bg-gradient-to-r from-gray-950 via-blue-700 to-purple-700 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                                    {dictionary.about.title}
                                </h1>

                                <p className="mt-4 max-w-2xl text-lg sm:text-xl leading-8 text-gray-700 dark:text-gray-300">
                                    {dictionary.about.subtitle}
                                </p>

                                <p className="mt-5 max-w-2xl leading-8 text-gray-600 dark:text-gray-400">
                                    {dictionary.about.intro}
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    {focusTags.map((item) => (
                                        <span key={item} className="rounded-full bg-gray-950 text-white dark:bg-white dark:text-gray-950 px-3 py-1 text-sm font-medium shadow-sm">
                                            {item}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {dictionary.about.backgroundTags.map((item) => (
                                        <span key={item} className="rounded-full bg-white/70 dark:bg-gray-900/60 px-3 py-1 text-sm shadow-sm border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="relative mx-auto flex h-56 w-56 items-center justify-center lg:mx-0 lg:justify-self-end">
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-500 to-purple-500 opacity-15 rotate-6" />
                                <div className="absolute inset-4 rounded-[2rem] border border-white/70 dark:border-white/10 bg-white/60 dark:bg-gray-900/50 shadow-xl backdrop-blur-md" />
                                <div className="relative text-center">
                                    <div className="text-6xl">🌱</div>
                                    <div className="mt-4 rounded-full bg-gray-950 text-white dark:bg-white dark:text-gray-950 px-4 py-2 text-sm font-semibold shadow-lg">
                                        INFJ
                                    </div>
                                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                                        {dictionary.about.personalityLabel}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*<GitHubActivity/>*/}

                    <Skills/>

                    <DevicesAndApps devicesAndApps={deviceApps}/>

                    <Books books={books}/>

                    <Comments/>
                </div>
            </div>
        </main>
    );
}