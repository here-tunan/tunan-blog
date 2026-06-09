package api

import (
	"strconv"
	"tunan-blog/internal/repository"
	"tunan-blog/internal/service"

	"github.com/gofiber/fiber/v2"
)

// ProjectMount mounts project routes
func ProjectMount() *fiber.App {
	app := fiber.New()

	// Get all projects (public endpoint)
	app.Get("/list", func(c *fiber.Ctx) error {
		projects, err := service.GetAllProjectsWithGitHub()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to get projects",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"data":    projects,
		})
	})

	// Get featured projects (public endpoint)
	app.Get("/featured", func(c *fiber.Ctx) error {
		projects, err := service.GetFeaturedProjectsWithGitHub()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to get featured projects",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"data":    projects,
		})
	})

	// Get project by id (public endpoint)
	app.Get("/:id", func(c *fiber.Ctx) error {
		idStr := c.Params("id")
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid project ID",
			})
		}

		project, err := service.GetProjectByIdWithGitHub(id)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to get project",
			})
		}

		if project == nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Project not found",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"data":    project,
		})
	})

	return app
}

// GetAllProjectsForAdmin gets projects for admin
func GetAllProjectsForAdmin(c *fiber.Ctx) error {
	pageIndex := c.QueryInt("page", 1)
	pageSize := c.QueryInt("pageSize", 10)
	if pageIndex <= 0 {
		pageIndex = 1
	}
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 10
	}

	projects, total, err := service.QueryProject(repository.ProjectQueryParam{PageIndex: pageIndex, PageSize: pageSize})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get projects",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    projects,
		"total":   total,
	})
}

// CreateProjectAdmin creates a new project
func CreateProjectAdmin(c *fiber.Ctx) error {
	var project repository.Project
	if err := c.BodyParser(&project); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	if err := service.CreateProject(&project); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create project",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"data":    project,
	})
}

// UpdateProjectAdmin updates a project
func UpdateProjectAdmin(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	var project repository.Project
	if err := c.BodyParser(&project); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	project.Id = id
	if err := service.UpdateProject(&project); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update project",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    project,
	})
}

// DeleteProjectAdmin deletes a project
func DeleteProjectAdmin(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	if err := service.DeleteProject(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete project",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Project deleted successfully",
	})
}

// GetProjectAdmin gets a project for admin
func GetProjectAdmin(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	project, err := service.GetProjectById(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get project",
		})
	}

	if project == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    project,
	})
}
