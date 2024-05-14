# tunan-blog
Personal blog system.

## 1. how to start go backend
- build the linux execute file locally： `CGO_ENABLED=0  GOOS=linux  GOARCH=amd64 go build -o tunan-blog cmd/tunan-blog/main.go`
- upload the file to your server, like here：`/home/xxx/my-app/tunan-blog`
- add prod.yaml file as the prod config file(following the env file folder)：`/home/yaodao/my-app/tunan-blog/env/prod.yaml`
- config the env variable：`export GO_TUNAN_BLOG_ENV=prod`
- start：`nohup ./home/xxx/my-app/tunan-blog/tunan-blog &`

## 2. how to start next.js frontend
- git clone or download the frontend code at your server
- cd /tunan-blog/ui
- modify the `const apiUrl = process.env.NODE_ENV === 'production' ? "https://yourprod.com" : "http://127.0.0.1:3002/api";` code
- npm install
- npm run start&