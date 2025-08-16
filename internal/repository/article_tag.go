package repository

import (
	"time"
	"tunan-blog/internal/infrastructure"

	"xorm.io/xorm"
)

// ArticleTag represents the article_tag table
type ArticleTag struct {
	Id        int64     `json:"id" xorm:"pk autoincr"`
	Name      string    `json:"name" xorm:"varchar(100) unique"`
	GmtCreate time.Time `json:"gmtCreate" xorm:"created"`
}

func (at *ArticleTag) TableName() string {
	return "article_tag"
}

// FindOrCreateTags finds existing tags or creates new ones if they don't exist.
// It returns a slice of tag IDs.
func FindOrCreateTags(session *xorm.Session, tagNames []string) ([]int64, error) {
	var tagIDs []int64

	for _, name := range tagNames {
		tag := &ArticleTag{Name: name}
		has, err := session.Where("name = ?", name).Get(tag)
		if err != nil {
			return nil, err
		}

		if has {
			tagIDs = append(tagIDs, tag.Id)
		} else {
			// Tag does not exist, create it
			_, err := session.Insert(&ArticleTag{Name: name})
			if err != nil {
				return nil, err
			}
			// We need to get the ID of the newly inserted tag
			newTag := &ArticleTag{}
			_, err = session.Where("name = ?", name).Get(newTag)
			if err != nil {
				return nil, err
			}
			tagIDs = append(tagIDs, newTag.Id)
		}
	}

	return tagIDs, nil
}

func GetAllTags() ([]*ArticleTag, error) {
	var tags []*ArticleTag
	err := infrastructure.Sqlite.Find(&tags)
	return tags, err
}
