package repository

import (
	"strings"
	"time"
	"tunan-blog/internal/infrastructure"

	"xorm.io/xorm"
)

const DefaultLanguageCode = "zh-CN"

type ArticleTranslation struct {
	Id             int64     `json:"id"`
	ArticleId      int64     `json:"articleId" xorm:"article_id"`
	LanguageCode   string    `json:"languageCode" xorm:"language_code"`
	Title          string    `json:"title"`
	Slug           string    `json:"slug"`
	Content        string    `json:"content"`
	SeoTitle       string    `json:"seoTitle" xorm:"seo_title"`
	SeoDescription string    `json:"seoDescription" xorm:"seo_description"`
	IsPublished    bool      `json:"isPublished" xorm:"is_published"`
	PublishedAt    time.Time `json:"publishedAt" xorm:"published_at"`
	GmtCreate      time.Time `json:"gmtCreate" xorm:"created"`
	GmtModified    time.Time `json:"gmtModified" xorm:"updated"`
}

func (a *ArticleTranslation) TableName() string {
	return "article_translation"
}

type ArticleWithTranslation struct {
	ArticleId           int64     `xorm:"article_id"`
	TranslationId       int64     `xorm:"translation_id"`
	ViewNumber          int       `xorm:"view_number"`
	LikeNumber          int       `xorm:"like_number"`
	Type                int       `xorm:"type"`
	ArticleGmtCreate    time.Time `xorm:"article_gmt_create"`
	DefaultLanguageCode string    `xorm:"default_language_code"`
	LanguageCode        string    `xorm:"language_code"`
	Title               string    `xorm:"title"`
	Slug                string    `xorm:"slug"`
	Content             string    `xorm:"content"`
	TranslationCreate   time.Time `xorm:"translation_gmt_create"`
	TranslationUpdate   time.Time `xorm:"translation_gmt_modified"`
}

type ArticleLanguageSummary struct {
	LanguageCode string `json:"languageCode" xorm:"language_code"`
	Slug         string `json:"slug"`
	Title        string `json:"title"`
}

type countResult struct {
	Total int64 `xorm:"total"`
}

func normalizeLanguageCode(languageCode string) string {
	if languageCode == "" {
		return DefaultLanguageCode
	}
	return languageCode
}

func (row ArticleWithTranslation) ToArticle() Article {
	return Article{
		Id:                  row.ArticleId,
		ViewNumber:          row.ViewNumber,
		LikeNumber:          row.LikeNumber,
		Type:                row.Type,
		GmtCreate:           row.ArticleGmtCreate,
		DefaultLanguageCode: row.DefaultLanguageCode,
	}
}

func (row ArticleWithTranslation) ToTranslation() ArticleTranslation {
	return ArticleTranslation{
		Id:           row.TranslationId,
		ArticleId:    row.ArticleId,
		LanguageCode: row.LanguageCode,
		Title:        row.Title,
		Slug:         row.Slug,
		Content:      row.Content,
		GmtCreate:    row.TranslationCreate,
		GmtModified:  row.TranslationUpdate,
	}
}

func GetArticleBySlugAndLanguage(slug string, languageCode string) (Article, ArticleTranslation, error) {
	languageCode = normalizeLanguageCode(languageCode)
	var row ArticleWithTranslation
	has, err := infrastructure.GetDB().SQL(
		"SELECT "+articleTranslationSelectColumns("article_translation", true)+" "+articleTranslationBaseSQL("article_translation")+
			" AND article_translation.slug = ? AND article_translation.language_code = ? LIMIT 1",
		slug,
		languageCode,
	).Get(&row)
	if err != nil || !has {
		return Article{}, ArticleTranslation{}, err
	}
	return row.ToArticle(), row.ToTranslation(), nil
}

func GetArticleBySlugAndDefaultLanguage(slug string) (Article, ArticleTranslation, error) {
	var row ArticleWithTranslation
	has, err := infrastructure.GetDB().SQL(
		"SELECT "+articleTranslationSelectColumns("default_translation", true)+" FROM article "+
			"INNER JOIN article_translation default_translation ON article.id = default_translation.article_id AND default_translation.language_code = COALESCE(NULLIF(article.default_language_code, ''), ?) AND default_translation.is_published = 1 "+
			"WHERE article.is_deleted = 0 AND default_translation.slug = ? LIMIT 1",
		DefaultLanguageCode,
		slug,
	).Get(&row)
	if err != nil || !has {
		return Article{}, ArticleTranslation{}, err
	}
	return row.ToArticle(), row.ToTranslation(), nil
}

func QueryArticleByLanguage(param ArticleQueryParam) ([]ArticleWithTranslation, int64, error) {
	languageCode := normalizeLanguageCode(param.LanguageCode)
	where, args := articleTranslationWhere(param)

	countArgs := append([]interface{}{}, args...)
	var count countResult
	_, err := infrastructure.GetDB().SQL(
		"SELECT COUNT(*) AS total FROM article "+
			"INNER JOIN article_translation default_translation ON article.id = default_translation.article_id AND default_translation.language_code = COALESCE(NULLIF(article.default_language_code, ''), ?) AND default_translation.is_published = 1 "+
			"WHERE "+strings.Join(where, " AND "),
		append([]interface{}{DefaultLanguageCode}, countArgs...)...,
	).Get(&count)
	if err != nil {
		return nil, 0, err
	}

	query := "SELECT " + articleFallbackSelectColumns(!param.IgnoreContent) +
		" FROM article " +
		"INNER JOIN article_translation default_translation ON article.id = default_translation.article_id AND default_translation.language_code = COALESCE(NULLIF(article.default_language_code, ''), ?) AND default_translation.is_published = 1 " +
		"LEFT JOIN article_translation requested_translation ON article.id = requested_translation.article_id AND requested_translation.language_code = ? AND requested_translation.is_published = 1 " +
		"WHERE " + strings.Join(where, " AND ") +
		" ORDER BY article.gmt_create DESC"

	queryArgs := append([]interface{}{DefaultLanguageCode, languageCode}, args...)
	if param.PageSize != 0 && param.PageIndex != 0 {
		query += " LIMIT ? OFFSET ?"
		queryArgs = append(queryArgs, param.PageSize, (param.PageIndex-1)*param.PageSize)
	}

	var articles []ArticleWithTranslation
	err = infrastructure.GetDB().SQL(query, queryArgs...).Find(&articles)
	return articles, count.Total, err
}

func articleTranslationBaseSQL(alias string) string {
	return "FROM article INNER JOIN article_translation " + alias + " ON article.id = " + alias + ".article_id WHERE article.is_deleted = 0 AND " + alias + ".is_published = 1"
}

func articleTranslationWhere(param ArticleQueryParam) ([]string, []interface{}) {
	where := []string{"article.is_deleted = 0"}
	args := []interface{}{}

	if param.Type != 0 {
		where = append(where, "article.type = ?")
		args = append(args, param.Type)
	}

	if param.StartTime != "" {
		transactionStartTime, _ := time.Parse("2006-01-02", param.StartTime)
		where = append(where, "article.gmt_create >= ?")
		args = append(args, transactionStartTime)
	}
	if param.EndTime != "" {
		transactionEndTime, _ := time.Parse("2006-01-02", param.EndTime)
		transactionEndTime = transactionEndTime.Add(24 * time.Hour)
		where = append(where, "article.gmt_create < ?")
		args = append(args, transactionEndTime)
	}
	return where, args
}

func articleTranslationSelectColumns(alias string, includeContent bool) string {
	columns := "article.id AS article_id, article.view_number, article.like_number, article.type, article.gmt_create AS article_gmt_create, article.default_language_code, " +
		alias + ".id AS translation_id, " + alias + ".language_code, " + alias + ".title, " + alias + ".slug, " +
		alias + ".gmt_create AS translation_gmt_create, " + alias + ".gmt_modified AS translation_gmt_modified"
	if includeContent {
		columns += ", " + alias + ".content"
	}
	return columns
}

func articleFallbackSelectColumns(includeContent bool) string {
	columns := "article.id AS article_id, article.view_number, article.like_number, article.type, article.gmt_create AS article_gmt_create, article.default_language_code, " +
		"COALESCE(requested_translation.id, default_translation.id) AS translation_id, " +
		"COALESCE(requested_translation.language_code, default_translation.language_code) AS language_code, " +
		"COALESCE(requested_translation.title, default_translation.title) AS title, " +
		"COALESCE(requested_translation.slug, default_translation.slug) AS slug, " +
		"COALESCE(requested_translation.gmt_create, default_translation.gmt_create) AS translation_gmt_create, " +
		"COALESCE(requested_translation.gmt_modified, default_translation.gmt_modified) AS translation_gmt_modified"
	if includeContent {
		columns += ", COALESCE(requested_translation.content, default_translation.content) AS content"
	}
	return columns
}

func GetAvailableArticleLanguages(articleId int64) ([]ArticleLanguageSummary, error) {
	var languages []ArticleLanguageSummary
	err := infrastructure.GetDB().Table("article_translation").
		Cols("language_code", "slug", "title").
		Where("article_id = ?", articleId).
		And("is_published = ?", true).
		Find(&languages)
	return languages, err
}

func GetArticleTranslationsByArticleId(articleId int64) ([]ArticleTranslation, error) {
	var translations []ArticleTranslation
	err := infrastructure.GetDB().Where("article_id = ?", articleId).Find(&translations)
	return translations, err
}

func DeleteArticleTranslation(session *xorm.Session, articleId int64, languageCode string) error {
	_, err := session.Where("article_id = ?", articleId).
		And("language_code = ?", languageCode).
		Delete(&ArticleTranslation{})
	return err
}

func UpsertArticleTranslation(session *xorm.Session, translation *ArticleTranslation) error {
	existing := &ArticleTranslation{}
	has, err := session.Where("article_id = ?", translation.ArticleId).
		And("language_code = ?", translation.LanguageCode).
		Get(existing)
	if err != nil {
		return err
	}

	if has {
		translation.Id = existing.Id
		if existing.PublishedAt.IsZero() {
			translation.PublishedAt = time.Now()
		} else {
			translation.PublishedAt = existing.PublishedAt
		}
		_, err = session.ID(existing.Id).Update(translation)
		return err
	}

	if translation.IsPublished && translation.PublishedAt.IsZero() {
		translation.PublishedAt = time.Now()
	}
	_, err = session.Insert(translation)
	return err
}

func UpsertDefaultArticleTranslation(session *xorm.Session, article *Article) error {
	translation := &ArticleTranslation{}
	has, err := session.Where("article_id = ?", article.Id).
		And("language_code = ?", DefaultLanguageCode).
		Get(translation)
	if err != nil {
		return err
	}

	if has {
		translation.Title = article.Title
		translation.Slug = article.Slug
		translation.Content = article.Content
		translation.IsPublished = true
		if translation.PublishedAt.IsZero() {
			translation.PublishedAt = time.Now()
		}
		_, err = session.ID(translation.Id).Update(translation)
		return err
	}

	translation = &ArticleTranslation{
		ArticleId:    article.Id,
		LanguageCode: DefaultLanguageCode,
		Title:        article.Title,
		Slug:         article.Slug,
		Content:      article.Content,
		IsPublished:  true,
		PublishedAt:  time.Now(),
	}
	_, err = session.Insert(translation)
	return err
}
