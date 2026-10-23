import React from "react";
import Skills from "@/app/components/Skills";
import {Comments} from "@/app/components/blog/comment";
import SectionHeader from "@/app/components/SectionHeader";
import { getSafeLocale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

export default async function About({ params }: { params: { locale: string } }) {
    const locale = getSafeLocale(params.locale);
    const dictionary = getDictionary(locale);

    const focusTags = [dictionary.about.focusBackend, dictionary.about.focusFullStack, dictionary.about.focusWriting];

    return (
        <main>
            <div className="container">
                <div className="space-y-24 pb-10">
                    {/* Hero: 无卡编辑部位 */}
                    <section className="grid gap-12 pt-6 lg:grid-cols-[1fr_300px] lg:gap-20">
                        <div>
                            <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
                                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                                {dictionary.about.eyebrow}
                            </p>

                            <h1 className="mt-5 font-display text-4xl text-foreground sm:text-5xl">
                                {dictionary.about.title}
                            </h1>

                            <p className="mt-5 max-w-xl font-display text-xl leading-relaxed text-foreground sm:text-2xl">
                                {dictionary.about.subtitle}
                            </p>

                            <p className="mt-6 max-w-xl text-[15px] leading-8 text-muted-foreground">
                                {dictionary.about.intro}
                            </p>

                            <p className="mt-4 max-w-xl text-[15px] leading-8 text-muted-foreground">
                                {dictionary.about.background}
                            </p>

                            <p className="mt-4 max-w-xl text-[15px] leading-8 text-muted-foreground">
                                <span className="mr-2 inline-flex -translate-y-px items-center rounded-full border border-primary/30 bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                                    INFJ
                                </span>
                                {dictionary.about.personality}
                            </p>

                            <div className="mt-7 flex flex-wrap gap-2">
                                {focusTags.map((item) => (
                                    <span key={item} className="rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-accent-foreground">
                                        {item}
                                    </span>
                                ))}
                                {dictionary.about.backgroundTags.map((item) => (
                                    <span key={item} className="rounded-full border border-border px-3 py-1 text-[13px] text-muted-foreground">
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
                                <a href={`/${locale}/blog`} className="group inline-flex items-center gap-1.5 text-primary transition-colors hover:text-accent-foreground">
                                    {dictionary.about.readBlog}
                                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                                </a>
                                <a href={`/${locale}/architecture`} className="group inline-flex items-center gap-1.5 text-primary transition-colors hover:text-accent-foreground">
                                    {dictionary.about.seeHow}
                                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                                </a>
                                <a href={`/${locale}/books`} className="group inline-flex items-center gap-1.5 text-primary transition-colors hover:text-accent-foreground">
                                    {dictionary.about.seeBooks}
                                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                                </a>
                                <a href={`/${locale}/uses`} className="group inline-flex items-center gap-1.5 text-primary transition-colors hover:text-accent-foreground">
                                    {dictionary.about.seeUses}
                                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                                </a>
                                <a
                                    href="https://beeneverywhere.net/user/47551"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-1.5 text-primary transition-colors hover:text-accent-foreground"
                                >
                                    {dictionary.about.seePlaces}
                                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
                                </a>
                            </div>
                        </div>

                        <figure className="mx-auto w-60 max-w-full sm:w-64 lg:mx-0 lg:w-full lg:max-w-[300px] lg:justify-self-end lg:pt-2">
                            <div className="rounded-xl border border-border bg-background p-2 shadow-[0_1px_3px_rgba(0,0,0,0.10)]">
                                <img
                                    src="/assets/me-hero.jpeg"
                                    alt={dictionary.about.title}
                                    width={472}
                                    height={590}
                                    className="h-auto w-full rounded-lg"
                                />
                            </div>
                        </figure>
                    </section>

                    <section>
                        <SectionHeader title={dictionary.about.skills} sub={dictionary.about.skillsSub} />
                        <Skills/>
                    </section>

                    <section>
                        <SectionHeader title={dictionary.about.commentsTitle} sub={dictionary.about.commentsSub} />
                        <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
                            <Comments showHeader={false}/>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
