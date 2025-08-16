package api

import (
	_ "strconv"
	"tunan-blog/internal/service"

	"github.com/gofiber/fiber/v2"
)

// GetAllBooksAdmin handles fetching all books for the admin panel.
func GetAllBooksAdmin(c *fiber.Ctx) error {
	books, err := service.GetAllBooks()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch books",
		})
	}
	return c.JSON(books)
}

// GetBookAdmin handles fetching a single book by its ID.
func GetBookAdmin(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	book, err := service.GetBookByID(uint(id))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch book"})
	}
	if book == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Book not found"})
	}

	return c.JSON(book)
}

// CreateBookAdmin handles creating a new book.
func CreateBookAdmin(c *fiber.Ctx) error {
	var req service.BookCreationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := service.CreateBook(req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create book"})
	}

	return c.SendStatus(fiber.StatusCreated)
}

// UpdateBookAdmin handles updating an existing book.
func UpdateBookAdmin(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	var req service.BookUpdateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := service.UpdateBook(uint(id), req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update book"})
	}

	return c.SendStatus(fiber.StatusOK)
}

// DeleteBookAdmin handles deleting a book by its ID.
func DeleteBookAdmin(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	if err := service.DeleteBook(uint(id)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete book"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
