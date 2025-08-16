package repository

import (
	"time"
	"tunan-blog/internal/infrastructure"

	"xorm.io/xorm"
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

// CreateArticleTagRelationships creates relationship records in a transaction.
func CreateArticleTagRelationships(session *xorm.Session, articleId int64, tagIds []int64) error {
	var relationships []ArticleTagRelationship
	for _, tagId := range tagIds {
		relationships = append(relationships, ArticleTagRelationship{
			ArticleId: articleId,
			TagId:     tagId,
		})
	}

	if len(relationships) > 0 {
		_, err := session.Cols("article_id", "tag_id").Insert(relationships)
		return err
	}

	return nil
}

// DeleteArticleTagRelationshipsByArticleID deletes all relationships for a given article ID in a transaction.
func DeleteArticleTagRelationshipsByArticleID(session *xorm.Session, articleId int64) error {
	_, err := session.Where("article_id = ?", articleId).Delete(&ArticleTagRelationship{})
	return err
}
