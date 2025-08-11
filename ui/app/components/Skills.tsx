
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
    <div>
      <div>
        <h3 className="font-bold text-lg mb-4">Proficient</h3>
        <div className="grid grid-cols-8 gap-4">
          {proficientSkills.map((item, index) => (
            <a href={item.href} key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <img src={item.img} width={40} height={40} alt={item.name}/>
            </a>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Experienced</h3>
        <div className="grid grid-cols-8 gap-4">
          {experiencedSkills.map((item, index) => (
            <a href={item.href} key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <img src={item.img} width={40} height={40} alt={item.name}/>
            </a>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Familiar</h3>
        <div className="grid grid-cols-8 gap-4">
          {familiarSkills.map((item, index) => (
            <a href={item.href} key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <img src={item.img} width={40} height={40} alt={item.name}/>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}