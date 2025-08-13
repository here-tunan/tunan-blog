package api

import (
	"github.com/gofiber/fiber/v2"
	"tunan-blog/internal/service"
)

func GetAllBooks(c *fiber.Ctx) error {
	books, err := service.GetAllBooks()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(books)
}
