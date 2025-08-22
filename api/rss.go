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
		err := service.RssXmlCreat()
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate RSS",
			})
		}
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "RSS feed generated successfully",
		})
	})

	return app
}

// GenerateRSSAdmin 管理后台生成RSS的接口
func GenerateRSSAdmin(c *fiber.Ctx) error {
	err := service.RssXmlCreat()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to generate RSS",
			"message": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "RSS feed generated successfully",
	})
}
