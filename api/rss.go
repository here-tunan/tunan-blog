package api

import (
	"github.com/gofiber/fiber/v2"
	"tunan-blog/internal/service"
)

// RssMount RSS 生成的接口
func RssMount() *fiber.App {
	app := fiber.New()

	// 实时生成并返回 RSS XML(经 apikey 中间件鉴权,/rss.xml 由 Caddy 转译到这里)
	app.Get("", func(ctx *fiber.Ctx) error {
		data, err := service.RssXmlBytes()
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate RSS",
			})
		}
		ctx.Set("Content-Type", "application/rss+xml; charset=utf-8")
		return ctx.Status(fiber.StatusOK).Send(data)
	})

	return app
}
