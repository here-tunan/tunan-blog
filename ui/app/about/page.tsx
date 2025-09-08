import React from "react";
import Skills from "@/app/components/Skills";
import {Comments} from "@/app/components/blog/comment";
import DevicesAndApps from "@/app/components/DevicesAndApps";
import Books from "@/app/components/Books";
import {API_URL} from "@/lib/config";

async function getBooks() {
    try {
        const response = await fetch(`${API_URL}/book/list`, {
            method: 'GET',
            cache: 'no-store', // Or a revalidation strategy
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}

async function getDevicesAndApps() {
    try {
        const response = await fetch(`${API_URL}/device-app/grouped`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching device apps:', error);
        return [];
    }
}

export default async function About() {
    const books = await getBooks();
    const deviceApps = await getDevicesAndApps();

    return (
        <main>
            <div className="container">
                <div className="space-y-12">
                    <div>
                        <h3 className="font-mono font-bold text-2xl pb-6">About Me</h3>
                        <div className="prose dark:prose-invert max-w-none">
                            <p>为什么不写中文介绍？ emm... 这是一个值得思考的问题...🤔</p>

                            <h4 className="font-mono font-bold text-lg pt-4 pb-3">Who I Am</h4>
                            <p>
                                Hello there! I&apos;m Tunan, but you can also call me Aaron. I&apos;m a Java Backend
                                Development Engineer from
                                China 🇨🇳 and a passionate developer on a journey to become a full-stack engineer.
                            </p>

                            <h4 className="font-mono font-bold text-lg pt-4 pb-3">Background</h4>
                            <p>
                                I graduated from <strong>HoHai University</strong> with a degree in <strong>Computer
                                Science and Technology</strong>, which laid a solid foundation for my career in tech.
                            </p>

                            <h4 className="font-mono font-bold text-lg pt-4 pb-3">Personality</h4>
                            <p>
                                My personality, as measured by the Myers-Briggs Type Indicator, falls between <strong>INTJ
                                and INFJ</strong>. This blend gives me a unique perspective, combining a love for
                                strategic thinking and problem-solving with a deep-seated desire to make a positive
                                impact on the world.
                            </p>

                            <h4 className="font-mono font-bold text-lg pt-4 pb-3">Aspirations</h4>
                            <p>
                                My ambition is to contribute meaningfully to the open-source community and collaborate
                                on exciting projects. Ultimately, I dream of embracing the lifestyle of a remote worker
                                or a digital nomad, which will allow me to explore the 🌍 while continuing to grow
                                professionally.
                            </p>

                            <h4 className="font-mono font-bold text-lg pt-4 pb-3">On this Blog</h4>
                            <p>
                                I&apos;m continuously improving my English 📚 and will be sharing my thoughts and
                                technical
                                explorations on this blog. Thanks for stopping by! 😊
                            </p>
                        </div>
                    </div>

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