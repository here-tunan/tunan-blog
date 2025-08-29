package api

import (
	"github.com/gofiber/fiber/v2"
	"tunan-blog/internal/service"
)

func GetAllDeviceApps(c *fiber.Ctx) error {
	s := service.NewDeviceAppService()
	deviceApps, err := s.GetAllDeviceApps()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(deviceApps)
}

func GetGroupedDeviceApps(c *fiber.Ctx) error {
	s := service.NewDeviceAppService()
	grouped, err := s.GetGroupedDeviceApps()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(grouped)
}

func GetDeviceAppsByCategory(c *fiber.Ctx) error {
	category := c.Params("category")
	if category == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "category is required"})
	}

	s := service.NewDeviceAppService()
	deviceApps, err := s.GetDeviceAppsByCategory(category)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(deviceApps)
}
