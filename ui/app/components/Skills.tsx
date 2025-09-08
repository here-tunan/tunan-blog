import React from "react";

const skills = [
    {
        name: "java",
        href: "https://www.java.com",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
    },
    {
        name: "spring",
        href: "https://spring.io/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg"
    },
    {
        name: "linux",
        href: "https://www.linux.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg"
    },
    {
        name: "redis",
        href: "https://redis.io",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg"
    },
    {
        name: "mysql",
        href: "https://www.mysql.com/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg"
    },
    {
        name: "mongodb",
        href: "https://www.mongodb.com/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg"
    },
    {name: "git", href: "https://git-scm.com/", img: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg"},
    {
        name: "docker",
        href: "https://www.docker.com/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg"
    },
    {
        name: "kubernetes",
        href: "https://kubernetes.io",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg"
    },
    {
        name: "python",
        href: "https://www.python.org",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"
    },
    {
        name: "go",
        href: "https://golang.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg"
    },
    {
        name: "vuejs",
        href: "https://vuejs.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg"
    },
    {
        name: "react",
        href: "https://reactjs.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg"
    },
    {
        name: "javascript",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
    },
];

export default function Skills() {
    return (
        <div className="space-y-4">
            <h3 className="font-mono font-bold text-2xl pb-4">🛠️ Skills</h3>

            <div>
                <div className="grid grid-cols-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-4">
                    {skills.map((item, index) => (
                        <a href={item.href} key={index}
                           className="p-1.5 rounded-md flex items-center justify-center hover:shadow-lg transition-shadow">
                            <img src={item.img} width={40} height={40} alt={item.name}/>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}