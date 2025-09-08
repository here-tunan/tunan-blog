package api

import (
	"log"
	"strings"
	"tunan-blog/env"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

var authList = []string{"rss"}

func Start() {

	app := fiber.New(fiber.Config{
		//EnablePrintRoutes: true,
		EnableTrustedProxyCheck: true,
		TrustedProxies:          []string{"127.0.0.1", "::1"}, // 信任本地nginx
		ProxyHeader:             fiber.HeaderXForwardedFor,    // 使用X-Forwarded-For头
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "https://www.tunan.fun,https://tunan.fun,http://localhost:3000,http://localhost:3001",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

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
	root.Mount("/project", ProjectMount())
	root.Mount("/device-app", DeviceAppMount())
	root.Mount("/friend-links", FriendLinksMount())

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

	// Project management routes
	admin.Get("/projects", GetAllProjectsForAdmin)
	admin.Post("/projects", CreateProjectAdmin)
	admin.Get("/projects/:id", GetProjectAdmin)
	admin.Put("/projects/:id", UpdateProjectAdmin)
	admin.Delete("/projects/:id", DeleteProjectAdmin)

	// Analytics routes
	admin.Get("/analytics/views", GetAnalyticsViews)
	admin.Get("/analytics/path-views", GetPathViewAnalytics)

	// RSS generation route
	admin.Post("/rss/generate", GenerateRSSAdmin)

	// Device App management routes
	admin.Get("/device-apps", GetAllDeviceAppsAdmin)
	admin.Post("/device-apps", CreateDeviceAppAdmin)
	admin.Get("/device-apps/:id", GetDeviceAppAdmin)
	admin.Put("/device-apps/:id", UpdateDeviceAppAdmin)
	admin.Delete("/device-apps/:id", DeleteDeviceAppAdmin)

	// Friend Links management routes
	admin.Get("/friend-links", GetAllFriendLinksAdmin)
	admin.Post("/friend-links", CreateFriendLinkAdmin)
	admin.Get("/friend-links/:id", GetFriendLinkAdmin)
	admin.Put("/friend-links/:id", UpdateFriendLinkAdmin)
	admin.Delete("/friend-links/:id", DeleteFriendLinkAdmin)

	log.Fatal(app.Listen(":3002"))
}

func BookMount() *fiber.App {
	book := fiber.New()
	book.Get("/list", GetAllBooks)
	return book
}

func DeviceAppMount() *fiber.App {
	deviceApp := fiber.New()
	deviceApp.Get("/list", GetAllDeviceApps)
	deviceApp.Get("/grouped", GetGroupedDeviceApps)
	deviceApp.Get("/category/:category", GetDeviceAppsByCategory)
	return deviceApp
}

func FriendLinksMount() *fiber.App {
	friendLinks := fiber.New()
	friendLinks.Get("/", GetAllFriendLinks)
	return friendLinks
}

func isNeedAuth(api string) bool {
	for _, s := range authList {
		if strings.HasSuffix(api, s) {
			return true
		}
	}
	return false
}
