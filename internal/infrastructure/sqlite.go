package infrastructure

import (
	_ "github.com/mattn/go-sqlite3"
	"time"
	"tunan-blog/env"
	"xorm.io/xorm"
	"xorm.io/xorm/names"
)

var Sqlite *xorm.Engine

func init() {

	println("sqlite3 connect db file", env.Prop.Sqlite3.File)
	newEngine, _ := xorm.NewEngine("sqlite3", env.Prop.Sqlite3.File)

	// println(err)

	// 设置驼峰转换
	newEngine.SetMapper(names.GonicMapper{})

	// 时区
	newEngine.TZLocation, _ = time.LoadLocation("Asia/Shanghai")

	err := newEngine.Ping()
	if err != nil {
		println("sqlite3 connect failed", err)
		return
	}

	Sqlite = newEngine
}
