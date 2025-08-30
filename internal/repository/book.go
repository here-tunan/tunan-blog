package repository

import (
	"time"
	"tunan-blog/internal/infrastructure"

	"xorm.io/xorm"
)

type Book struct {
	ID          uint      `xorm:"pk autoincr 'id'" json:"id"`
	Name        string    `xorm:"varchar(200) 'name'" json:"name"`
	Author      string    `xorm:"varchar(60) 'author'" json:"author"`
	Category    string    `xorm:"varchar(50) 'category'" json:"category"`
	DoubanLink  string    `xorm:"varchar(200) 'douban_link'" json:"douban_link"`
	MyReview    string    `xorm:"varchar(200) 'my_review'" json:"my_review"`
	Score       int       `xorm:"int 'score'" json:"score"`
	GmtCreate   time.Time `xorm:"datetime 'gmt_create' created" json:"gmt_create"`
	GmtModified time.Time `xorm:"datetime 'gmt_modified' updated" json:"gmt_modified"`
	IsDeleted   bool      `xorm:"bool 'is_deleted'" json:"is_deleted"`
}

func (Book) TableName() string {
	return "book"
}

func FindAllBooks() ([]*Book, error) {
	var books []*Book
	err := infrastructure.GetDB().Where("is_deleted = ?", 0).OrderBy("gmt_modified desc").Find(&books)
	return books, err
}

func GetBookByID(id uint) (*Book, error) {
	var book Book
	has, err := infrastructure.GetDB().Where("is_deleted = ?", 0).ID(id).Get(&book)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, nil // Or return a specific not-found error
	}
	return &book, nil
}

func CreateBook(session *xorm.Session, book *Book) error {
	_, err := session.Insert(book)
	return err
}

func UpdateBook(session *xorm.Session, book *Book) error {
	_, err := session.ID(book.ID).Update(book)
	return err
}

func DeleteBook(id uint) error {
	_, err := infrastructure.GetDB().ID(id).Cols("is_deleted").Update(&Book{IsDeleted: true})
	return err
}
