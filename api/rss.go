package api

import (
	"github.com/gofiber/fiber/v2"
	"tunan-blog/internal/service"
)

// RssMount RSS 生成的接口
func RssMount() *fiber.App {
	app := fiber.New()

	// 生成RSS XML
	app.Get("", func(ctx *fiber.Ctx) error {
		service.RssXmlCreat()
		return nil
	})

	return app
}
