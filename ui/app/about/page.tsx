import React from "react";
import Skills from "@/app/components/Skills";
import {Comments} from "@/app/components/blog/comment";
import DevicesAndApps from "@/app/components/DevicesAndApps";
import Books from "@/app/components/Books";

export default function About() {
    return (
        <main>
            <div className="container">
                <div className="space-y-20">
                    <div>
                        <h3 className="font-mono font-bold text-3xl pb-10">About Me</h3>
                        <div className="prose dark:prose-invert max-w-none">
                            <p>为什么不写中文介绍？ emm... 这是一个值得思考的问题...🤔</p>

                            <h4 className="font-mono font-bold text-xl pt-5 pb-5">Who I Am</h4>
                            <p>
                                Hello there! I&apos;m Tunan, but you can also call me Aaron. I&apos;m a Java Backend Development Engineer from
                                China 🇨🇳 and a passionate developer on a journey to become a full-stack engineer.
                            </p>

                            <h4 className="font-mono font-bold text-xl pt-5 pb-5">Background</h4>
                            <p>
                                I graduated from <strong>Hohai University</strong> with a degree in <strong>Computer
                                Science and Technology</strong>, which laid a solid foundation for my career in tech.
                            </p>

                            <h4 className="font-mono font-bold text-xl pt-5 pb-5">Personality</h4>
                            <p>
                                My personality, as measured by the Myers-Briggs Type Indicator, falls between <strong>INTJ
                                and INFJ</strong>. This blend gives me a unique perspective, combining a love for
                                strategic thinking and problem-solving with a deep-seated desire to make a positive
                                impact on the world.
                            </p>

                            <h4 className="font-mono font-bold text-xl pt-5 pb-5">Aspirations</h4>
                            <p>
                                My ambition is to contribute meaningfully to the open-source community and collaborate
                                on exciting projects. Ultimately, I dream of embracing the lifestyle of a remote worker
                                or a digital nomad, which will allow me to explore the 🌍 while continuing to grow
                                professionally.
                            </p>

                            <h4 className="font-mono font-bold text-xl pt-5 pb-5">On this Blog</h4>
                            <p>
                                I&apos;m continuously improving my English 📚 and will be sharing my thoughts and technical
                                explorations on this blog. Thanks for stopping by! 😊
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-mono font-bold text-3xl pb-10">🛠️ Languages & Tools</h3>
                        <Skills/>
                    </div>

                    <div>
                        <h3 className="font-mono font-bold text-3xl pb-6">📱 Devices & Apps</h3>
                        <DevicesAndApps/>
                    </div>

                    <div>
                        <h3 className="font-mono font-bold text-3xl pb-6">📚 My Books</h3>
                        <Books/>
                    </div>

                    <div>
                        <h3 className="font-mono font-bold text-3xl">🐳 Why not leave a comment?</h3>
                        <Comments/>
                    </div>
                </div>
            </div>
        </main>
    );
}