package repository

import (
	"tunan-blog/internal/infrastructure"
	"xorm.io/xorm"
)

// NewSession creates and returns a new XORM session.
func NewSession() *xorm.Session {
	return infrastructure.Sqlite.NewSession()
}
