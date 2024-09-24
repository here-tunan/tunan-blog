package repository

import (
	"time"
	"tunan-blog/internal/infrastructure"
)

type ArticleTagRelationship struct {
	Id        int64  `json:"id"`
	ArticleId int64  `json:"articleId"`
	TagId     int64  `json:"tagId"`
	Name      string `json:"name"`
	// 系统创建时间
	GmtCreate time.Time `json:"gmtCreate" xorm:"updated"`
}

func (a *ArticleTagRelationship) TableName() string {
	return "article_tag_relationship"
}

func GetArticleTagRelationshipByArticleId(articleId int64) ([]ArticleTagRelationship, error) {

	var articleTagRelationships []ArticleTagRelationship
	err := infrastructure.Sqlite.Where("article_id = ?", articleId).Join("INNER", "article_tag", "article_tag.id = article_tag_relationship.tag_id").Find(&articleTagRelationships)
	return articleTagRelationships, err
}
