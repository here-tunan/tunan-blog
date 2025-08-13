package service

import (
	"tunan-blog/internal/repository"
)

func GetAllBooks() ([]*repository.Book, error) {
	return repository.FindAllBooks()
}
