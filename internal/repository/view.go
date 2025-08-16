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

// PathViewCount is a struct to hold the result of the GROUP BY query
type PathViewCount struct {
	Path  string `xorm:"path" json:"path"`
	Views int64  `xorm:"views" json:"views"`
}

// DailyViewCount holds the count of views for a specific date.
type DailyViewCount struct {
	Date  string `xorm:"date" json:"date"`
	Views int64  `xorm:"views" json:"views"`
}

func GetViewsGroupedByPath() ([]*PathViewCount, error) {
	var results []*PathViewCount
	sql := "SELECT path, COUNT(*) as views FROM page_views GROUP BY path ORDER BY views DESC"
	err := infrastructure.Sqlite.SQL(sql).Find(&results)
	return results, err
}

// GetDailyViewCounts retrieves the total view count for each of the last N days.
func GetDailyViewCounts(days int) ([]*DailyViewCount, error) {
	var results []*DailyViewCount
	// Calculate the date `days` ago
	startDate := time.Now().AddDate(0, 0, -days)

	// The SQL query for SQLite. The DATE() function extracts the date part.
	sql := "SELECT DATE(created_at) as date, COUNT(*) as views FROM page_views WHERE created_at >= ? GROUP BY date ORDER BY date ASC"

	err := infrastructure.Sqlite.SQL(sql, startDate).Find(&results)
	return results, err
}