package api

import (
	"github.com/gofiber/fiber/v2"
	"tunan-blog/internal/service"
)

// GetAllTagsAdmin handles fetching all tags for the admin panel.
func GetAllTagsAdmin(c *fiber.Ctx) error {
	tags, err := service.GetAllTags()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch tags",
		})
	}

	if tags == nil {
		return c.JSON([]service.ArticleResponse{})
	}

	return c.JSON(tags)
}
