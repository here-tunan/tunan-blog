package repository

import (
	"time"
	"tunan-blog/internal/infrastructure"

	"xorm.io/xorm"
)

type FriendLink struct {
	ID          int64     `xorm:"pk autoincr 'id'" json:"id"`
	Title       string    `xorm:"varchar(100) not null 'title'" json:"title"`
	URL         string    `xorm:"varchar(500) not null 'url'" json:"url"`
	Description string    `xorm:"varchar(50) 'description'" json:"description"`
	SortOrder   int       `xorm:"int 'sort_order'" json:"sort_order"`
	IsDeleted   bool      `xorm:"bool 'is_deleted'" json:"is_deleted"`
	GmtCreate   time.Time `xorm:"datetime 'gmt_create' created" json:"gmt_create"`
	GmtModified time.Time `xorm:"datetime 'gmt_modified' updated" json:"gmt_modified"`
}

func (FriendLink) TableName() string {
	return "friend_link"
}

func FindAllFriendLinks() ([]*FriendLink, error) {
	var friendLinks []*FriendLink
	err := infrastructure.GetDB().Where("is_deleted = ?", 0).OrderBy("sort_order, gmt_modified desc").Find(&friendLinks)
	return friendLinks, err
}

func GetFriendLinkByID(id int64) (*FriendLink, error) {
	var friendLink FriendLink
	has, err := infrastructure.GetDB().Where("is_deleted = ?", 0).ID(id).Get(&friendLink)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, nil
	}
	return &friendLink, nil
}

func CreateFriendLink(session *xorm.Session, friendLink *FriendLink) error {
	_, err := session.Insert(friendLink)
	return err
}

func UpdateFriendLink(session *xorm.Session, friendLink *FriendLink) error {
	_, err := session.ID(friendLink.ID).AllCols().Update(friendLink)
	return err
}

func DeleteFriendLink(id int64) error {
	_, err := infrastructure.GetDB().ID(id).Cols("is_deleted").Update(&FriendLink{IsDeleted: true})
	return err
}
