package repository

import (
	"time"
	"tunan-blog/internal/infrastructure"

	"xorm.io/xorm"
)

type DeviceApp struct {
	ID          int64     `xorm:"pk autoincr 'id'" json:"id"`
	Name        string    `xorm:"varchar(255) not null 'name'" json:"name"`
	Category    string    `xorm:"varchar(50) not null 'category'" json:"category"`
	Description string    `xorm:"text 'description'" json:"description"`
	Icon        string    `xorm:"varchar(500) 'icon'" json:"icon"`
	Link        string    `xorm:"varchar(500) 'link'" json:"link"`
	SortOrder   int       `xorm:"int 'sort_order'" json:"sort_order"`
	IsDeleted   bool      `xorm:"bool 'is_deleted'" json:"is_deleted"`
	GmtCreate   time.Time `xorm:"datetime 'gmt_create' created" json:"gmt_create"`
	GmtModified time.Time `xorm:"datetime 'gmt_modified' updated" json:"gmt_modified"`
}

func (DeviceApp) TableName() string {
	return "device_app"
}

func FindAllDeviceApps() ([]*DeviceApp, error) {
	var deviceApps []*DeviceApp
	err := infrastructure.Sqlite.Where("is_deleted = ?", 0).OrderBy("category, sort_order, gmt_modified desc").Find(&deviceApps)
	return deviceApps, err
}

func FindDeviceAppsByCategory(category string) ([]*DeviceApp, error) {
	var deviceApps []*DeviceApp
	err := infrastructure.Sqlite.Where("is_deleted = ? AND category = ?", 0, category).OrderBy("sort_order, gmt_modified desc").Find(&deviceApps)
	return deviceApps, err
}

func GetDeviceAppByID(id int64) (*DeviceApp, error) {
	var deviceApp DeviceApp
	has, err := infrastructure.Sqlite.Where("is_deleted = ?", 0).ID(id).Get(&deviceApp)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, nil
	}
	return &deviceApp, nil
}

func CreateDeviceApp(session *xorm.Session, deviceApp *DeviceApp) error {
	_, err := session.Insert(deviceApp)
	return err
}

func UpdateDeviceApp(session *xorm.Session, deviceApp *DeviceApp) error {
	_, err := session.ID(deviceApp.ID).AllCols().Update(deviceApp)
	return err
}

func DeleteDeviceApp(id int64) error {
	_, err := infrastructure.Sqlite.ID(id).Cols("is_deleted").Update(&DeviceApp{IsDeleted: true})
	return err
}
