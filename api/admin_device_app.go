package api

import (
	"strconv"
	"tunan-blog/internal/repository"
	"tunan-blog/internal/service"

	"github.com/gofiber/fiber/v2"
)

func GetAllDeviceAppsAdmin(c *fiber.Ctx) error {
	s := service.NewDeviceAppService()
	deviceApps, err := s.GetAllDeviceApps()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(deviceApps)
}

func GetDeviceAppAdmin(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	s := service.NewDeviceAppService()
	deviceApp, err := s.GetDeviceAppByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if deviceApp == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "device app not found"})
	}
	return c.JSON(deviceApp)
}

func CreateDeviceAppAdmin(c *fiber.Ctx) error {
	var deviceApp repository.DeviceApp
	if err := c.BodyParser(&deviceApp); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	s := service.NewDeviceAppService()
	if err := s.CreateDeviceApp(&deviceApp); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(deviceApp)
}

func UpdateDeviceAppAdmin(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	// First get the existing device app
	s := service.NewDeviceAppService()
	existingDeviceApp, err := s.GetDeviceAppByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if existingDeviceApp == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "device app not found"})
	}

	// Parse the update data
	var updateData repository.DeviceApp
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Update only the fields that should be updated
	existingDeviceApp.Name = updateData.Name
	existingDeviceApp.Category = updateData.Category
	existingDeviceApp.Description = updateData.Description
	existingDeviceApp.Icon = updateData.Icon
	existingDeviceApp.Link = updateData.Link
	existingDeviceApp.SortOrder = updateData.SortOrder

	if err := s.UpdateDeviceApp(existingDeviceApp); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(existingDeviceApp)
}

func DeleteDeviceAppAdmin(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	s := service.NewDeviceAppService()
	if err := s.DeleteDeviceApp(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "device app deleted successfully"})
}
