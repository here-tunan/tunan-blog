import React from "react";
import Skills from "@/app/components/Skills";
import SkillsSection from "@/app/components/home/SkillsSection";

export default function About() {
  return (
    <main>
      <div className="container">
        <p className="pb-20">
          嗨👋，我是图南Tunan，一个想成为全栈工程师的开发者🇨🇳。以后想参与更多的开源项目为社区做贡献。
          <br/>
          <br/>
          梦想是成为一名远程工作者或者数字游民。自己也在持续学习英文中，会尝试使用英文来写一些博客文章。

          <br/>
          <br/>
          <br/>

          I am Tunan who want to be a full stack developer. You can also call me Aaron.
          <br/>
          <br/>
          I would like to participate in more open source projects and contribute to the community.☘️
          <br/>
          <br/>
          🏄‍♂️The dream is to be a remote worker or a digital nomad.
          <br/>
          <br/>
          I am learning English🆎, I will try to write some blog articles in English.
        </p>

        <SkillsSection/>
      </div>
    </main>
  );
}