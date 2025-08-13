package api

import (
	"github.com/gofiber/fiber/v2"
	"tunan-blog/internal/repository"
)

type SearchItem struct {
	Title string `json:"title"`
	URL   string `json:"url"`
	Type  string `json:"type"`
}

func GetAllSearchItems(c *fiber.Ctx) error {
	var items []SearchItem

	// Fetch blogs
	blogs, _, _ := repository.QueryArticle(repository.ArticleQueryParam{Type: 1, PageSize: 1000})
	for _, blog := range blogs {
		items = append(items, SearchItem{Title: blog.Title, URL: "/blog/" + blog.Slug, Type: "Blog"})
	}

	// Fetch weeklies
	weeklies, _, _ := repository.QueryArticle(repository.ArticleQueryParam{Type: 2, PageSize: 1000})
	for _, weekly := range weeklies {
		items = append(items, SearchItem{Title: weekly.Title, URL: "/weekly/" + weekly.Slug, Type: "Weekly"})
	}

	// Add static pages
	items = append(items, SearchItem{Title: "Home", URL: "/", Type: "Page"})
	items = append(items, SearchItem{Title: "About", URL: "/about", Type: "Page"})
	items = append(items, SearchItem{Title: "Blog", URL: "/blog", Type: "Page"})
	items = append(items, SearchItem{Title: "Weekly", URL: "/weekly", Type: "Page"})

	return c.JSON(items)
}
