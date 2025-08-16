package service

import (
	"tunan-blog/internal/repository"
)

// BookCreationRequest defines the structure for creating a new book.
type BookCreationRequest struct {
	Name       string `json:"name"`
	Author     string `json:"author"`
	Category   string `json:"category"`
	DoubanLink string `json:"douban_link"`
	MyReview   string `json:"my_review"`
	Score      int    `json:"score"`
}

// BookUpdateRequest defines the structure for updating an existing book.
type BookUpdateRequest struct {
	Name       string `json:"name"`
	Author     string `json:"author"`
	Category   string `json:"category"`
	DoubanLink string `json:"douban_link"`
	MyReview   string `json:"my_review"`
	Score      int    `json:"score"`
}

func GetAllBooks() ([]*repository.Book, error) {
	return repository.FindAllBooks()
}

func GetBookByID(id uint) (*repository.Book, error) {
	return repository.GetBookByID(id)
}

func CreateBook(req BookCreationRequest) error {
	session := repository.NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return err
	}

	book := &repository.Book{
		Name:       req.Name,
		Author:     req.Author,
		Category:   req.Category,
		DoubanLink: req.DoubanLink,
		MyReview:   req.MyReview,
		Score:      req.Score,
	}

	if err := repository.CreateBook(session, book); err != nil {
		_ = session.Rollback()
		return err
	}

	return session.Commit()
}

func UpdateBook(id uint, req BookUpdateRequest) error {
	session := repository.NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return err
	}

	book := &repository.Book{
		ID:         id,
		Name:       req.Name,
		Author:     req.Author,
		Category:   req.Category,
		DoubanLink: req.DoubanLink,
		MyReview:   req.MyReview,
		Score:      req.Score,
	}

	if err := repository.UpdateBook(session, book); err != nil {
		_ = session.Rollback()
		return err
	}

	return session.Commit()
}

func DeleteBook(id uint) error {
	return repository.DeleteBook(id)
}