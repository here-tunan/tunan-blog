package repository

import (
	"time"
	"tunan-blog/internal/infrastructure"
)

type View struct {
	Id        int64     `xorm:"pk autoincr"`
	Path      string    `xorm:"varchar(255) notnull index"`
	IPAddress string    `xorm:"varchar(45)"`
	UserAgent string    `xorm:"text"`
	CreatedAt time.Time `xorm:"created"`
}

func (v *View) TableName() string {
	return "page_views"
}

func CreateView(view *View) error {
	_, err := infrastructure.Sqlite.Insert(view)
	return err
}

func CountByPath(path string) (int64, error) {
	count, err := infrastructure.Sqlite.Where("path = ?", path).Count(new(View))
	return count, err
}

func CountTotalViews() (int64, error) {
	count, err := infrastructure.Sqlite.Count(new(View))
	return count, err
}
