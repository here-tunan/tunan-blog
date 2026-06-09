package service

import (
	"time"
	"tunan-blog/internal/repository"
)

type ArticleLanguageSummary struct {
	LanguageCode string `json:"languageCode"`
	Slug         string `json:"slug"`
	Title        string `json:"title"`
}

type ArticleResponse struct {
	Id                  int64                    `json:"id"`
	ArticleId           int64                    `json:"articleId"`
	LanguageCode        string                   `json:"languageCode"`
	DefaultLanguageCode string                   `json:"defaultLanguageCode"`
	Title               string                   `json:"title"`
	Slug                string                   `json:"slug"`
	Content             string                   `json:"content"`
	ViewNumber          int                      `json:"viewNumber"`
	LikeNumber          int                      `json:"likeNumber"`
	Type                int                      `json:"type"`
	TagNames            []string                 `json:"tagNames"`
	AvailableLanguages  []ArticleLanguageSummary `json:"availableLanguages"`
	GmtCreate           time.Time                `json:"gmtCreate"`
}

func QueryArticle(param repository.ArticleQueryParam) ([]ArticleResponse, int64, error) {
	if param.LanguageCode == "" {
		param.LanguageCode = repository.DefaultLanguageCode
	}
	return queryArticleByLanguage(param)
}

func QueryArticleByDefaultLanguage(param repository.ArticleQueryParam) ([]ArticleResponse, int64, error) {
	articles, total, err := repository.QueryArticleByDefaultLanguage(param)
	if err != nil {
		return nil, 0, err
	}

	var resList = make([]ArticleResponse, 0)
	for _, item := range articles {
		res, err := buildArticleResponse(item.ToArticle(), item.ToTranslation())
		if err != nil {
			return nil, 0, err
		}
		resList = append(resList, res)
	}
	return resList, total, nil
}

func queryArticleByLanguage(param repository.ArticleQueryParam) ([]ArticleResponse, int64, error) {
	articles, total, err := repository.QueryArticleByLanguage(param)
	if err != nil {
		return nil, 0, err
	}

	var resList = make([]ArticleResponse, 0)
	for _, item := range articles {
		res, err := buildArticleResponse(item.ToArticle(), item.ToTranslation())
		if err != nil {
			return nil, 0, err
		}
		resList = append(resList, res)
	}
	return resList, total, nil
}

func QueryArticleBySlug(slug string) (ArticleResponse, error) {
	return QueryArticleBySlugAndLanguage(slug, "")
}

func QueryArticleBySlugAndLanguage(slug string, languageCode string) (ArticleResponse, error) {
	if languageCode != "" {
		article, translation, err := repository.GetArticleBySlugAndLanguage(slug, languageCode)
		if err == nil && article.Id != 0 {
			return buildArticleResponse(article, translation)
		}

		article, translation, err = repository.GetArticleBySlugAndDefaultLanguage(slug)
		if err == nil && article.Id != 0 {
			return buildArticleResponse(article, translation)
		}
	}

	article, translation, err := repository.GetArticleBySlugAndDefaultLanguage(slug)
	if err != nil || article.Id == 0 {
		return ArticleResponse{}, err
	}

	return buildArticleResponse(article, translation)
}

func QueryArticleByID(id int64) (ArticleResponse, error) {
	article, err := repository.GetArticleByID(id)
	if err != nil || article.Id == 0 {
		return ArticleResponse{}, err
	}
	translation, err := repository.GetDefaultArticleTranslationByArticleId(article.Id, article.DefaultLanguageCode)
	if err != nil {
		return ArticleResponse{}, err
	}
	return buildArticleResponse(article, translation)
}

func buildArticleResponse(article repository.Article, translation repository.ArticleTranslation) (ArticleResponse, error) {
	res := ArticleResponse{
		Id:                  article.Id,
		ArticleId:           article.Id,
		ViewNumber:          article.ViewNumber,
		LikeNumber:          article.LikeNumber,
		Type:                article.Type,
		GmtCreate:           article.GmtCreate,
		TagNames:            []string{},
		LanguageCode:        article.DefaultLanguageCode,
		DefaultLanguageCode: article.DefaultLanguageCode,
	}

	if res.LanguageCode == "" {
		res.LanguageCode = repository.DefaultLanguageCode
	}

	if translation.Id != 0 {
		res.ArticleId = translation.ArticleId
		res.LanguageCode = translation.LanguageCode
		res.Title = translation.Title
		res.Slug = translation.Slug
		res.Content = translation.Content
	}

	tags, err := repository.GetArticleTagRelationshipByArticleId(article.Id)
	if err != nil {
		return res, err
	}
	for _, tag := range tags {
		res.TagNames = append(res.TagNames, tag.Name)
	}

	languages, err := repository.GetAvailableArticleLanguages(article.Id)
	if err == nil {
		for _, language := range languages {
			res.AvailableLanguages = append(res.AvailableLanguages, ArticleLanguageSummary{
				LanguageCode: language.LanguageCode,
				Slug:         language.Slug,
				Title:        language.Title,
			})
		}
	}
	return res, nil
}
