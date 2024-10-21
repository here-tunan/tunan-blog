package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"log"
	"strings"
	"tunan-blog/env"
)

var authList = []string{"rss"}

func Start() {

	app := fiber.New(fiber.Config{
		//EnablePrintRoutes: true,
	})

	app.Use(cors.New())

	// 定义一个中间件来进行token验证
	validateMiddleware := func(c *fiber.Ctx) error {
		api := c.Path()
		println("validateMiddleware: ", api)
		if !isNeedAuth(api) {
			return c.Next()
		}

		// 否则需要进行token验证
		apiKey := c.Query("apiKey")
		if apiKey != env.Prop.Apikey {
			return c.Status(401).SendString("Invalid apiKey")
		}
		return c.Next()
	}

	app.Use(validateMiddleware)

	app.Get("/test", func(ctx *fiber.Ctx) error {
		return ctx.SendString("ha!")
	})

	// 设置根路径
	root := app.Group("/api")

	root.Mount("/article", ArticleMount())
	root.Mount("/rss", RssMount())

	log.Fatal(app.Listen(":3002"))
}

func isNeedAuth(api string) bool {
	for _, s := range authList {
		if strings.HasSuffix(api, s) {
			return true
		}
	}
	return false
}
