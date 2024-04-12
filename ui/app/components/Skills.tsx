
const skills = [
  {name: "linux", href: "https://www.linux.org/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg"},
  {name: "java", href: "https://www.java.com", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"},
  {name: "react", href: "https://reactjs.org/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg"},
  {name: "docker", href: "https://www.docker.com/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg"},
  {name: "redis", href: "https://redis.io", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg"},
  {name: "mysql", href: "https://www.mysql.com/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg"},
  {name: "javascript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"},
  {name: "mongodb", href: "https://www.mongodb.com/", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg"},
  {name: "git", href: "https://git-scm.com/", img: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg"},
  {name: "postman", href: "https://postman.com", img: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg"},
  {name: "python", href: "https://www.python.org", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"},
  // {name: "", href: "", img: ""},
]

export default function Skills() {

  return (
    <div>
      <p className="flex flex-wrap">
        {skills.map((item, index) => (
          <a href={item.href} key={index} className="px-1">
            <img src={item.img} width={40} height={40} alt={item.name}/>
          </a>
        ))}
      </p>

    </div>

  );
}