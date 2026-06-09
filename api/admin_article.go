package api

import (
	"tunan-blog/internal/repository"
	"tunan-blog/internal/service"

	"github.com/gofiber/fiber/v2"
)

// GetAllArticlesForAdmin handles fetching articles for the admin panel.
func GetAllArticlesForAdmin(c *fiber.Ctx) error {
	pageIndex := c.QueryInt("page", 1)
	pageSize := c.QueryInt("pageSize", 10)
	if pageIndex <= 0 {
		pageIndex = 1
	}
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 10
	}

	param := repository.ArticleQueryParam{PageSize: pageSize, PageIndex: pageIndex, LanguageCode: repository.DefaultLanguageCode}

	articles, total, err := service.QueryArticle(param)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch articles",
		})
	}

	if articles == nil {
		articles = []service.ArticleResponse{}
	}

	return c.JSON(fiber.Map{
		"data":  articles,
		"total": total,
	})
}

// CreateArticleAdmin handles creating a new article from the admin panel.
func CreateArticleAdmin(c *fiber.Ctx) error {
	var req service.ArticleCreationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	article, err := service.CreateArticle(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(article)
}

// DeleteArticleAdmin handles deleting an article by its ID.
func DeleteArticleAdmin(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	if err := service.DeleteArticle(int64(id)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete article"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

// UpdateArticleAdmin handles updating an existing article.
func UpdateArticleAdmin(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	var req service.ArticleUpdateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	article, err := service.UpdateArticle(int64(id), req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(article)
}

// GetArticleAdmin handles fetching a single article by its ID for the admin panel.
func GetArticleAdmin(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	article, err := service.QueryArticleByID(int64(id))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch article"})
	}

	translations, err := repository.GetArticleTranslationsByArticleId(int64(id))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch article translations"})
	}

	return c.JSON(fiber.Map{
		"id":                  article.ArticleId,
		"title":               article.Title,
		"slug":                article.Slug,
		"content":             article.Content,
		"type":                article.Type,
		"tagNames":            article.TagNames,
		"gmtCreate":           article.GmtCreate,
		"languageCode":        article.LanguageCode,
		"defaultLanguageCode": article.DefaultLanguageCode,
		"availableLanguages":  article.AvailableLanguages,
		"translations":        translations,
	})
}
