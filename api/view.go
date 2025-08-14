package api

import (
	"tunan-blog/internal/service"

	"github.com/gofiber/fiber/v2"
)

type TrackViewRequest struct {
	Path string `json:"path"`
}

func ViewMount() *fiber.App {
	app := fiber.New()

	// 接口：记录一次页面访问
	app.Post("/track", func(c *fiber.Ctx) error {
		var req TrackViewRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Cannot parse JSON",
			})
		}

		ipAddress := c.IP()
		userAgent := string(c.Request().Header.UserAgent())

		if err := service.TrackView(req.Path, ipAddress, userAgent); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to track view",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "View tracked successfully",
		})
	})

	// 接口：根据路径获取浏览量
	app.Get("/count", func(c *fiber.Ctx) error {
		path := c.Query("path")
		if path == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "path query parameter is required",
			})
		}

		count, err := service.GetViewsByPath(path)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to get view count",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"path":  path,
			"views": count,
		})
	})

	// 接口：获取全站总访问量
	app.Get("/total", func(c *fiber.Ctx) error {
		count, err := service.GetTotalViews()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to get total view count",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"total_views": count,
		})
	})

	return app
}
