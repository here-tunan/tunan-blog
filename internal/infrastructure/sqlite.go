package infrastructure

import (
	_ "github.com/mattn/go-sqlite3"
	"log"
	"time"
	"tunan-blog/env"
	"xorm.io/xorm"
	"xorm.io/xorm/names"
)

var Sqlite *xorm.Engine

func init() {

	println("sqlite3 connect db file", env.Prop.Sqlite3.File)
	newEngine, err := xorm.NewEngine("sqlite3", env.Prop.Sqlite3.File)

	if err != nil {
		log.Println(err)
		return
	}

	// 设置驼峰转换
	newEngine.SetMapper(names.GonicMapper{})

	// 时区
	newEngine.TZLocation, _ = time.LoadLocation("Asia/Shanghai")

	err = newEngine.Ping()
	if err != nil {
		log.Println(err)
		return
	}

	Sqlite = newEngine
}
