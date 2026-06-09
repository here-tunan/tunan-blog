package api

import (
	"github.com/gofiber/fiber/v2"
	"tunan-blog/internal/repository"
	"tunan-blog/internal/service"
)

type SearchItem struct {
	Title string `json:"title"`
	URL   string `json:"url"`
	Type  string `json:"type"`
}

func GetAllSearchItems(c *fiber.Ctx) error {
	languageCode := c.Query("lang")
	if languageCode == "" {
		languageCode = repository.DefaultLanguageCode
	}

	var items []SearchItem

	appendArticles := func(articleType int, itemType string) {
		articles, _, err := service.QueryArticle(repository.ArticleQueryParam{
			Type:         articleType,
			PageSize:     1000,
			PageIndex:    1,
			LanguageCode: languageCode,
		})
		if err != nil {
			return
		}
		for _, article := range articles {
			items = append(items, SearchItem{Title: article.Title, URL: "/blog/" + article.Slug, Type: itemType})
		}
	}

	appendArticles(1, "Blog")
	appendArticles(2, "Weekly")
	appendArticles(3, "Translation")
	appendArticles(4, "History")

	if languageCode == "en" {
		items = append(items, SearchItem{Title: "Home", URL: "/", Type: "Page"})
		items = append(items, SearchItem{Title: "About", URL: "/about", Type: "Page"})
		items = append(items, SearchItem{Title: "Blog", URL: "/blog", Type: "Page"})
		items = append(items, SearchItem{Title: "Weekly", URL: "/weekly", Type: "Page"})
		items = append(items, SearchItem{Title: "Translations", URL: "/translations", Type: "Page"})
		items = append(items, SearchItem{Title: "History", URL: "/history", Type: "Page"})
	} else {
		items = append(items, SearchItem{Title: "首页", URL: "/", Type: "Page"})
		items = append(items, SearchItem{Title: "关于", URL: "/about", Type: "Page"})
		items = append(items, SearchItem{Title: "博客", URL: "/blog", Type: "Page"})
		items = append(items, SearchItem{Title: "周报", URL: "/weekly", Type: "Page"})
		items = append(items, SearchItem{Title: "翻译", URL: "/translations", Type: "Page"})
		items = append(items, SearchItem{Title: "历史", URL: "/history", Type: "Page"})
	}

	return c.JSON(items)
}
