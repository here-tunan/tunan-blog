package api

import (
	"strconv"
	"tunan-blog/internal/repository"
	"tunan-blog/internal/service"

	"github.com/gofiber/fiber/v2"
)

func GetAllFriendLinksAdmin(c *fiber.Ctx) error {
	s := service.NewFriendLinkService()
	friendLinks, err := s.GetAllFriendLinks()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": friendLinks})
}

func GetFriendLinkAdmin(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	s := service.NewFriendLinkService()
	friendLink, err := s.GetFriendLinkByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if friendLink == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "friend link not found"})
	}
	return c.JSON(friendLink)
}

func CreateFriendLinkAdmin(c *fiber.Ctx) error {
	var friendLink repository.FriendLink
	if err := c.BodyParser(&friendLink); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	s := service.NewFriendLinkService()
	if err := s.CreateFriendLink(&friendLink); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(friendLink)
}

func UpdateFriendLinkAdmin(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	// First get the existing friend link
	s := service.NewFriendLinkService()
	existingFriendLink, err := s.GetFriendLinkByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if existingFriendLink == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "friend link not found"})
	}

	// Parse the update data
	var updateData repository.FriendLink
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Update only the fields that should be updated
	existingFriendLink.Title = updateData.Title
	existingFriendLink.URL = updateData.URL
	existingFriendLink.Description = updateData.Description
	existingFriendLink.SortOrder = updateData.SortOrder

	if err := s.UpdateFriendLink(existingFriendLink); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(existingFriendLink)
}

func DeleteFriendLinkAdmin(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	s := service.NewFriendLinkService()
	if err := s.DeleteFriendLink(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "friend link deleted successfully"})
}
