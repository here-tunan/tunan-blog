package main

import (
	"tunan-blog/api"
)

func main() {
	print("Tunan-blog start!")
	// 启用web服务
	api.Start()
}
