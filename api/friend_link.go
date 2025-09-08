package api

import (
	"tunan-blog/internal/service"

	"github.com/gofiber/fiber/v2"
)

func GetAllFriendLinks(c *fiber.Ctx) error {
	s := service.NewFriendLinkService()
	friendLinks, err := s.GetAllFriendLinks()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": friendLinks})
}
