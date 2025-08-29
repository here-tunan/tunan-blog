
const proficientSkills = [
  {name: "java", href: "https://www.java.com", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"},
  {name: "spring", href: "https://spring.io/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg"},
  {name: "linux", href: "https://www.linux.org/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg"},
  {name: "redis", href: "https://redis.io", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg"},
  {name: "mysql", href: "https://www.mysql.com/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg"},
  {name: "mongodb", href: "https://www.mongodb.com/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg"},
  {name: "git", href: "https://git-scm.com/", img: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg"},
];

const experiencedSkills = [
  {name: "docker", href: "https://www.docker.com/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg"},
  {name: "kubernetes", href: "https://kubernetes.io", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg"},
  {name: "python", href: "https://www.python.org", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"},
  {name: "go", href: "https://golang.org/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg"},
];

const familiarSkills = [
  {name: "vuejs", href: "https://vuejs.org/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg"},
  {name: "react", href: "https://reactjs.org/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg"},
  {name: "javascript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"},
];

export default function Skills() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-base mb-2 text-gray-700 dark:text-gray-300">Proficient</h4>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {proficientSkills.map((item, index) => (
            <a href={item.href} key={index} className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center hover:shadow-sm transition-shadow">
              <img src={item.img} width={30} height={30} alt={item.name}/>
            </a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-base mb-2 text-gray-700 dark:text-gray-300">Experienced</h4>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {experiencedSkills.map((item, index) => (
            <a href={item.href} key={index} className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center hover:shadow-sm transition-shadow">
              <img src={item.img} width={30} height={30} alt={item.name}/>
            </a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-base mb-2 text-gray-700 dark:text-gray-300">Familiar</h4>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {familiarSkills.map((item, index) => (
            <a href={item.href} key={index} className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center hover:shadow-sm transition-shadow">
              <img src={item.img} width={30} height={30} alt={item.name}/>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}