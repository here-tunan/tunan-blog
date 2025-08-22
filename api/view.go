package api

import (
	"strconv"
	"strings"
	"tunan-blog/internal/repository"
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

		// 优先从X-Real-IP或X-Forwarded-For获取真实IP
		ipAddress := c.Get("X-Real-IP")
		if ipAddress == "" {
			ipAddress = c.Get("X-Forwarded-For")
			if ipAddress != "" {
				// X-Forwarded-For可能包含多个IP，取第一个
				if idx := strings.Index(ipAddress, ","); idx != -1 {
					ipAddress = strings.TrimSpace(ipAddress[:idx])
				}
			}
		}
		if ipAddress == "" {
			ipAddress = c.IP()
		}
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

func GetAnalyticsViews(c *fiber.Ctx) error {
	// Default to 30 days, allow overriding with a query param
	days, err := strconv.Atoi(c.Query("days", "30"))
	if err != nil {
		days = 30
	}

	results, err := service.GetDailyViews(days)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get analytics data",
		})
	}

	// If there are no results, return an empty array instead of null
	if results == nil {
		return c.JSON([]*repository.DailyViewCount{})
	}

	return c.JSON(results)
}

// GetPathViewAnalytics handles fetching view counts grouped by path.
func GetPathViewAnalytics(c *fiber.Ctx) error {
	results, err := service.GetPathViewCounts()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get path analytics data",
		})
	}

	if results == nil {
		return c.JSON([]*repository.PathViewCount{})
	}

	return c.JSON(results)
}
