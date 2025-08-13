package repository

import (
	"time"
	"tunan-blog/internal/infrastructure"
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
	err := infrastructure.Sqlite.Where("is_deleted = ?", 0).OrderBy("gmt_modified desc").Find(&books)
	return books, err
}
