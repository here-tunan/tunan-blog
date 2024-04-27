package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"log"
	"strings"
)

var authWhiteList = []string{"login", "validToken", "refreshToken", "category_analysis", "category_immigrate"}

func Start() {

	app := fiber.New(fiber.Config{
		//EnablePrintRoutes: true,
	})

	app.Use(cors.New())

	// 定义一个中间件来进行token验证
	validateMiddleware := func(c *fiber.Ctx) error {
		api := c.Path()
		println("validateMiddleware: ", api)

		return c.Next()
	}

	app.Use(validateMiddleware)

	app.Get("/test", func(ctx *fiber.Ctx) error {
		return ctx.SendString("ha!")
	})

	// 设置根路径
	root := app.Group("/api")

	root.Mount("/article", ArticleMount())

	log.Fatal(app.Listen(":3002"))
}

func isNotNeedAuth(api string) bool {
	for _, s := range authWhiteList {
		if strings.HasSuffix(api, s) {
			return true
		}
	}
	return false
}
