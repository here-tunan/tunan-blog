package infrastructure

import (
	"xorm.io/xorm"
)

var Mysql *xorm.Engine

// init函数已废弃，数据库初始化现在在db.go中统一处理
// func init() {
//	// 数据库初始化已移至 db.go
// }
