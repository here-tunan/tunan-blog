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
		apiKey := c.Query("apikey")
		if apiKey != env.Prop.Apikey {
			// 打印apikey 和 配置文件中的apikey
			log.Printf("apikey: %s, config apikey: %s", apiKey, env.Prop.Apikey)
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
	root.Mount("/book", BookMount())
	root.Mount("/view", ViewMount())

	root.Get("/search", GetAllSearchItems)

	// --- Authentication routes ---
	auth := app.Group("/api/auth")
	auth.Post("/login", Login)

	// --- Admin routes ---
	admin := app.Group("/api/admin")
	admin.Use(JWTMiddleware()) // Protect all routes in this group

	// Example of a protected admin route
	admin.Get("/test", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "Welcome Admin!"})
	})

	// Analytics routes
	admin.Get("/analytics/views", GetAnalyticsViews)

	// Article management routes
	admin.Get("/articles", GetAllArticlesForAdmin)
	admin.Post("/articles", CreateArticleAdmin)
	admin.Delete("/articles/:id", DeleteArticleAdmin)
	admin.Put("/articles/:id", UpdateArticleAdmin)
	admin.Get("/articles/:id", GetArticleAdmin)
	admin.Get("/tags", GetAllTagsAdmin)

	// Book management routes
	admin.Get("/books", GetAllBooksAdmin)
	admin.Post("/books", CreateBookAdmin)
	admin.Get("/books/:id", GetBookAdmin)
	admin.Put("/books/:id", UpdateBookAdmin)
	admin.Delete("/books/:id", DeleteBookAdmin)

	// Analytics routes
	admin.Get("/analytics/views", GetAnalyticsViews)
	admin.Get("/analytics/path-views", GetPathViewAnalytics)

	log.Fatal(app.Listen(":3002"))
}

func BookMount() *fiber.App {
	book := fiber.New()
	book.Get("/list", GetAllBooks)
	return book
}

func isNeedAuth(api string) bool {
	for _, s := range authList {
		if strings.HasSuffix(api, s) {
			return true
		}
	}
	return false
}
