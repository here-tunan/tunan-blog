package api

import (
	"github.com/gofiber/fiber/v2"
	"tunan-blog/internal/repository"
	"tunan-blog/internal/service"
)

func ArticleMount() *fiber.App {
	app := fiber.New()

	app.Get("", func(ctx *fiber.Ctx) error {
		slug := ctx.Query("slug")
		data, _ := service.QueryArticleBySlug(slug)
		return ctx.JSON(&fiber.Map{
			"success": true,
			"code":    "200",
			"data":    data,
		})
	})

	app.Post("/list", func(ctx *fiber.Ctx) error {
		param := &repository.ArticleQueryParam{}

		err := ctx.BodyParser(param)
		if err != nil {
			return ctx.JSON(&fiber.Map{
				"success": false,
				"code":    "500",
				"error":   err.Error(),
			})
		}

		data, total, err := service.QueryArticle(*param)

		if err != nil {
			return ctx.JSON(&fiber.Map{
				"success": false,
				"code":    "500",
				"error":   err.Error(),
			})
		}

		return ctx.JSON(&fiber.Map{
			"success": true,
			"code":    "200",
			"data":    data,
			"total":   total,
		})
	})

	return app
}
