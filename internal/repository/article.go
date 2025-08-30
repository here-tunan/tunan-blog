package repository

import (
	"log"
	"time"
	"tunan-blog/internal/infrastructure"

	"xorm.io/xorm"
)

type Article struct {
	Id         int64  `json:"id"`
	Title      string `json:"title"`
	Slug       string `json:"slug"`
	Content    string `json:"content"`
	ViewNumber int    `json:"viewNumber"`
	LikeNumber int    `json:"likeNumber"`
	Type       int    `json:"type"`
	// 是否删除
	IsDeleted bool `json:"isDeleted"`
	// 系统创建时间
	GmtCreate time.Time `json:"gmtCreate" xorm:"updated"`
	// 系统更新时间
	GmtModified time.Time `json:"gmtModified" xorm:"updated"`
}

type ArticleQueryParam struct {
	StartTime     string `json:"startTime"`
	EndTime       string `json:"endTime"`
	PageSize      int    `json:"pageSize"`
	PageIndex     int    `json:"pageIndex"`
	Type          int    `json:"type"`
	IgnoreContent bool   `json:"ignoreContent"`
}

func GetArticleBySlug(slug string) (Article, error) {
	session := infrastructure.GetDB().Where("is_deleted = 0")
	session.And("slug = ?", slug)
	var article Article

	_, err := session.Get(&article)
	if err != nil {
		return Article{}, err
	}
	return article, err
}

func GetArticleByID(id int64) (Article, error) {
	var article Article
	_, err := infrastructure.GetDB().Where("is_deleted = 0").ID(id).Get(&article)
	return article, err
}

// QueryArticle 查询符合查询参数的文章
func QueryArticle(param ArticleQueryParam) ([]Article, int64, error) {
	session := infrastructure.GetDB().Where("is_deleted = 0")
	if param.Type != 0 {
		session = session.And("type = ?", param.Type)
	}

	// 格式是 2023-09-12
	if param.StartTime != "" {
		transactionStartTime, _ := time.Parse("2006-01-02", param.StartTime)
		session = session.And("gmt_create >= ?", transactionStartTime)
	}
	if param.EndTime != "" {
		transactionEndTime, _ := time.Parse("2006-01-02", param.EndTime)
		transactionEndTime = transactionEndTime.Add(24 * time.Hour)
		// 记得加一天
		session = session.And("gmt_create < ?", transactionEndTime)
	}

	// 保存查询条件
	conditions := session.Conds()

	// 执行完会重置查询条件
	total, _ := session.Count(new(Article))

	session.And(conditions)
	if param.PageSize != 0 && param.PageIndex != 0 {
		session = session.Limit(param.PageSize, (param.PageIndex-1)*param.PageSize)
	}

	// 排序
	session.Desc("gmt_create")

	var articles []Article
	columns := []string{"id", "title", "slug", "view_number", "like_number", "gmt_create"}
	if !param.IgnoreContent {
		columns = append(columns, "content")
	}
	err := session.Cols(columns...).Find(&articles)
	if err != nil {
		log.Println(err)
		return articles, total, err
	}
	return articles, total, nil
}

func CreateArticle(session *xorm.Session, article *Article) error {
	_, err := session.Insert(article)
	return err
}

func DeleteArticleById(id int64) error {
	_, err := infrastructure.GetDB().ID(id).Cols("is_deleted").Update(&Article{IsDeleted: true})
	return err
}

func UpdateArticle(session *xorm.Session, article *Article) error {
	_, err := session.ID(article.Id).Update(article)
	return err
}
