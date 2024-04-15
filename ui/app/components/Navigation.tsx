import React from "react";
import NavButton from "@/app/components/NavButton";

// 导航内容
const items = [
  {
    "name": "Home",
    "href": "/",
    "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAbNJREFUWEdjZCARSEnJ/ydRC4ryZ88eMpKinyTFIIMH3IH8QmZYQ4ib4yXY45MmLSAlADDU5uUlgMW+/hAH0x/fncIbSBiSg9aBMIe1de5C8fWWnX/B/IvHjMD0hg17yArBR4+egPXBQlDf6hyYf2yfJ96QhIfgkHPgtZvsYJ/de/ANbwhKSUHS0rNnkDQKA2ZmqijJZ82a/eC0jR6CMPW4QhJnCA5bB8LSWkiII94QDIy6gRJDuEKS6iE4aByIK+2R6kBYyMHSOnpaJDsEB70DcRWGgyYEB70DYSFFarUCKwdhuZhmaXDQOBDdh7A6mdSQg6lHDzmKQ3DIOJDcECNWH9nlILEWUKqOYgcumWdPqRtQ9Fs5bQfzlRS4UOpkkmsSmKmD1oEwh509tZYqIXjt2h2wObEJ5WA6JukgZSE4aB0I64vA0gQsBJWVZcgKybt3IX0SqoXgqAMpTYOjITgagiTm5ZGTi3GV7Og1CbHlIXrIwQIeVpPA6mSi+8WD3oG4fLR4QSeJqQ6/crJDcNA6EOZfXAOYVA0+PIahj7gSPcI6aBxIL4cQaw/Jo/zEGkwtdQBrbfJHElv02wAAAABJRU5ErkJggg=="
  },
  {
    "name": "Blog",
    "href": "/blog",
    "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAlFJREFUWEfVmT9IQkEcx7XmJ4QRBBItbZGiLc7SVtmQ0GJbRottDRaKRlMQ5BI4SdIgLQk6iAkiRJNiW7VE5WTSoNAiZfi7fuK7ON97vhPu3fJ793535/f3ud/94Wk2MYokSd2eK5VKQQu/3w+Wd73dbptZGnrvmU7DCIwcRiDA6EkUbCwSAxuOhrnUkR6LpCJB4QTi1JZLZQguuB8E6131gs1kM2Dj5/Ghfrq9Ur32UIPxaJL/CBpGYKvVgohqVRIZlumZ6WGLjulLX6VluYwNHXYH+R2tBA0n0OEkkbJKvV4f6rfb7eDPHSfBSo1vsO6zbVk/1TlIExRW4EgJN9DJarXKhggGya6w2SVEX9/fwG5dH4HVTFB4gfQqVit4L+CEps8vU2CRXKVSgbrL5SLEso9gE0+50QgKL1AtMVzFvo056HJ/d0u6fnrArO+uycjF4+QkwtLpdEYjKLxAtVOMOUeTy19OQIxLCxawizukjiV0EIJHvC1pXsXCC1SaYvcyIaJEbna+De3cgR+wF4kq2GKhqI+g8AJZU6w252hym75TiNmzQla3boLCC6SnWG/O4X2y2WjyISi8QJxivTlHB8o9B4UVaLGQE6D1cUMg/J2t9AnB2ucw52w2mwwizozuVWwcgaUvIJAvwCeb/tnK2ueUNnhuOdgnKLpAJPKUnIRHVs4pkeO+DyJBwwikCeE3HHzPWrXox5s3t5OEJiiMQPzsppRTvPyab9TCChwgQjY8qkiSxAuabBzNX1hNJpPwAsdCSuugQ/8C0DrYONr/AqWg4EdKn+XrAAAAAElFTkSuQmCC"
  },
  {
    "name": "About",
    "href": "/about",
    "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAf9JREFUWEflmD9Lw0AYxk1DKYpDJxddFLoE/QDOgiDiIK466RcQCeJncHX1MzgUlQo6OjpULS2KUqlLPoCIEitceAr3ppf3EvPngl2Oa+6SJ788773vnTWh+ZuftYaaQ6Vhr+9DK8k8zNGebJxAKuihcy6BqPgnol99bkn/v936Un/lWGYQl6iSoLECIYwSq/U2BJnG5o+WpZ7OKmPJgqguyRBBYwWqhC066xKJvVY0wZvBpxj/sjslzQNReFSX5IhgaQR27tfEmztLl6JVEdueC0h5X7Zor7yqaEEQ+O68gHj9aFq0126wnCYmaJxA+mlptFKClBxIgSD6lCQ8GdeLVukEImrjek+1OIJkUi+GCBorkAsOVdRyaSU1gsYLRHQh11IPrs58S+sdR45G8589+O8EppVRRlGcNsHcBep6TpVJMvdg4QJRQXO5mBPKfdrMc3HuAvFAFA1csHA5l9aB6KMexP1ry8EV3/cjt76hitp4gSovgsTC6UfkV6bRisHUe42DoBKPTdBYgdSLEEpPENLaF0/WHfHIXrcbSZLdFxsnkJJEH+UYdxZDDUrPZrZ2DsWQx3ZbtP1+P5Kk9tmMcQIpibSO32zbFhvjfdfVIpn7+WBmArkUF/c6FXrRbI71ojbBuAK48cYLxAtAKH0hZJjCCJZGIGeFwglyAn8Bt6aWR2TfwTgAAAAASUVORK5CYII="
  },
  {
    "name": "Projects",
    "href": "/projects",
    "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAXlJREFUWEdjZBjkgHGQu48Bw4FcXFz/B9LR3759Q3HT0HEgesh9DQ1CCUju1evA/K9brFDFfY6B+d8OOKOIcznsBfPPnz+PIn7/9n28ERQUBrEXFpLwEBxyDhzIdEhUCA5aB5qZmWF124cPH6jq5i9fvqCY9+3bNzAfZg/ONDjqQGi4Df8Q3D/VEmuaM4zeTpW0SHEIDnoHwoKJ2rkXZi7FIThkHEgoqg+5e2JNk3Y78adVqoXgoHUgvdIeLPhJrkmGjAOTFiZRpdyDGTIpeBJW88gOwUHvQKoGHwMDA3ruHf5pEOZDq8bDVA3MXcWGsL4HirlEtwfRc/GgdyClwUco7aFXrQRb1NQuB2nuwPNLsde5sPYhrjoZFjJGa1dj7YOgxwzZaXDQO5DcNIir1YLLPLJDcNA7kNhi5li9LdgvbkuWkeSnJW4upPWLyS0HB8yBJAUHljoX1lohZA7d0iCpmYNgQQ1TMDrCSiCOCQ4BE0oj9JYf9KP8AAwOCkcMzeo6AAAAAElFTkSuQmCC"
  },
  {
    "name": "Github",
    "href": "https://github.com/here-tunan",
    "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAlFJREFUWEfVmLtKA0EUhg1iETD2ETtJbATFlHaxtLFSMAHB0sZOsPLSCGkkCj5BougrCNamWBMrQ6JdRDshEawk4pn9zcwwl911i9k0k90zc+afb8+cuaTG9L+hb0oZ6sRhMvZj6txZgSSsXNokOrX6JShhMBAelZ7gx9AP+VcRTJbAp3abRuJ5D1RixMAHe1Ccsh/ZvwzNStAlgcKnDUsmKEFdvUH/k0ydbkeIeZ5gMgViZP8lhPaZqUmlq8gEEyOQi41YYBYKS+RHBhA6BhXo3RKIvPV1dxSLMDhJFw/or0wyNEFnBWIN7jevBXKZxXXhedC6MZLV1Z/4YCuUTBJAsKJo82DiBILE7doyjfzq+Z3Kau1ESdBWP3aCtg5llbb6EQSO+0vdBvVVq7PY6zfZfhAdbs/PClpsBHX1RwKP/dm8QKXnPfr+vyn8uBhMuEBbErw/rAaKTZAb5cOYCDogEBLMn9omVGcPSw5+FDtq9wRqjpfhhO6W9wV4F+dbSpjpIou5fI5lg073RZi1cqNfgokRqPvsNIB8Li+NOFo0jsiJZw+dN56gmwKzjSERWjkrkUDuJsGPFUYu7p+879MSdF4glEPo9E6BXmFfhthDPZzKdIepoHZ532eKQbI5L5AbAcVktsGyT6Y8589eNutwN4ObB/lQFdZuI6m9m3FZIGBK+e8vb5EdpzEFAWpns9vuBXU5j49VtwRWeiwf7s2ob4UrPRaTMdiNN7VcP+KO2lmBEIZve/oqZqS3FnuurLISdrxH7bB2tJP9yPkw5brAHy6QY3VmdklZAAAAAElFTkSuQmCC"
  },

]

const themeIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAYlJREFUWEftmDFuwkAQRe0rRIECWpSWs+QE1ClzDgpKak6QU0TQ0kZROigSixMggbD9LXms4a/HcZhFoVnh3WX/vBnPzpAmHT+jh+R07Sf2hyTtckSnzZeD3QqUwnafiwLUz2s+ZB+jfJzO9jWAbYmaCboXKONKE5y9z2tLQTSUpJlgdAI1wSw2GclfIxidQAhGbFpJ9kYweoEwQOZLGZM3I+hGYFdX907wbgR+bY65Lc/L73xELLoh+C+QFaUsYd+MoCZMppn4Bcp6jlUZzKWh6QXrKMFoBKLqGE+K3sJKMjT2WhP0L3Bd2jQoujSQhKUaUdZEybeWkcN8dZNULvEucLsq+tnHp3o/myhEYWlVMeNB2R9r5MwE3QqUeUsVioUl0SofBhILJdeIwWgFajdGI0bLhegxtH24MTAv6z+5r1EP4m2Gi90JlK7Gdya4LTGWV9UYjEagJCJvireXoQat9hwxFkqMxqB2qnuBjKhmmLUaojHI/Mf+m7a61OxiJriv+T/ri60GnAG1B7A4DYusaQAAAABJRU5ErkJggg=="

interface NavigationProps {
  themeToggleHandler: () => void
}

export default function Navigation({themeToggleHandler}: NavigationProps) {

  return (
    <div className="container">
      <div className="flex items-center mx-auto p-1 h-auto place-content-between">
        <nav className="flex items-center gap-3">
          {items.map((item, i) => (
            <NavButton item={item} key={i}/>
          ))}
        </nav>
        <button className="p-3 rounded-full border-button-base border bg-button-base" onClick={themeToggleHandler}>
          <img src={themeIcon} alt="Theme" height="20px" width="20px"></img>
        </button>
      </div>
    </div>

  );
}