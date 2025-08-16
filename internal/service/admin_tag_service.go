package service

import (
	"tunan-blog/internal/repository"
)

// GetAllTags retrieves all existing tags.
func GetAllTags() ([]*repository.ArticleTag, error) {
	return repository.GetAllTags()
}
