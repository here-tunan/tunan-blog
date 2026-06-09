package service

import (
	"errors"
	"tunan-blog/internal/repository"
)

type ArticleTranslationRequest struct {
	LanguageCode   string `json:"languageCode"`
	Title          string `json:"title"`
	Slug           string `json:"slug"`
	Content        string `json:"content"`
	SeoTitle       string `json:"seoTitle"`
	SeoDescription string `json:"seoDescription"`
}

type ArticleCreationRequest struct {
	Title               string                      `json:"title"`
	Slug                string                      `json:"slug"`
	Content             string                      `json:"content"`
	Tags                []string                    `json:"tags"`
	Type                int                         `json:"type"`
	DefaultLanguageCode string                      `json:"defaultLanguageCode"`
	Translations        []ArticleTranslationRequest `json:"translations"`
}

type ArticleUpdateRequest struct {
	Title               string                      `json:"title"`
	Slug                string                      `json:"slug"`
	Content             string                      `json:"content"`
	Tags                []string                    `json:"tags"`
	Type                int                         `json:"type"`
	DefaultLanguageCode string                      `json:"defaultLanguageCode"`
	Translations        []ArticleTranslationRequest `json:"translations"`
}

func normalizeDefaultLanguageCode(defaultLanguageCode string) string {
	if defaultLanguageCode == "" {
		return repository.DefaultLanguageCode
	}
	return defaultLanguageCode
}

func findDefaultTranslation(translations []ArticleTranslationRequest, defaultLanguageCode string) (ArticleTranslationRequest, bool) {
	for _, translation := range translations {
		if translation.LanguageCode == defaultLanguageCode {
			return translation, true
		}
	}
	return ArticleTranslationRequest{}, false
}

func isEmptyTranslation(translation ArticleTranslationRequest) bool {
	return translation.Title == "" && translation.Slug == "" && translation.Content == ""
}

func applyDefaultTranslation(article *repository.Article, translations []ArticleTranslationRequest) error {
	if len(translations) == 0 {
		return nil
	}

	defaultTranslation, ok := findDefaultTranslation(translations, article.DefaultLanguageCode)
	if !ok || defaultTranslation.Title == "" || defaultTranslation.Slug == "" || defaultTranslation.Content == "" {
		return errors.New("default language translation is required")
	}

	article.Title = defaultTranslation.Title
	article.Slug = defaultTranslation.Slug
	article.Content = defaultTranslation.Content
	return nil
}

func CreateArticle(req ArticleCreationRequest) (*repository.Article, error) {
	session := repository.NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return nil, err
	}

	article := &repository.Article{
		Title:               req.Title,
		Slug:                req.Slug,
		Content:             req.Content,
		Type:                req.Type,
		DefaultLanguageCode: normalizeDefaultLanguageCode(req.DefaultLanguageCode),
	}

	if err := applyDefaultTranslation(article, req.Translations); err != nil {
		_ = session.Rollback()
		return nil, err
	}

	if err := repository.CreateArticle(session, article); err != nil {
		_ = session.Rollback()
		return nil, err
	}

	if len(req.Translations) > 0 {
		for _, t := range req.Translations {
			if isEmptyTranslation(t) {
				continue
			}
			translation := &repository.ArticleTranslation{
				ArticleId:    article.Id,
				LanguageCode: t.LanguageCode,
				Title:        t.Title,
				Slug:         t.Slug,
				Content:      t.Content,
				IsPublished:  true,
			}
			if err := repository.UpsertArticleTranslation(session, translation); err != nil {
				_ = session.Rollback()
				return nil, err
			}
		}
	} else {
		if err := repository.UpsertDefaultArticleTranslation(session, article); err != nil {
			_ = session.Rollback()
			return nil, err
		}
	}

	if len(req.Tags) > 0 {
		tagIDs, err := repository.FindOrCreateTags(session, req.Tags)
		if err != nil {
			_ = session.Rollback()
			return nil, err
		}

		if err := repository.CreateArticleTagRelationships(session, article.Id, tagIDs); err != nil {
			_ = session.Rollback()
			return nil, err
		}
	}

	return article, session.Commit()
}

func DeleteArticle(id int64) error {
	return repository.DeleteArticleById(id)
}

func UpdateArticle(id int64, req ArticleUpdateRequest) (*repository.Article, error) {
	session := repository.NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return nil, err
	}

	article := &repository.Article{
		Id:                  id,
		Title:               req.Title,
		Slug:                req.Slug,
		Content:             req.Content,
		Type:                req.Type,
		DefaultLanguageCode: normalizeDefaultLanguageCode(req.DefaultLanguageCode),
	}

	if err := applyDefaultTranslation(article, req.Translations); err != nil {
		_ = session.Rollback()
		return nil, err
	}

	if err := repository.UpdateArticle(session, article); err != nil {
		_ = session.Rollback()
		return nil, err
	}

	if len(req.Translations) > 0 {
		for _, t := range req.Translations {
			if isEmptyTranslation(t) {
				if t.LanguageCode != article.DefaultLanguageCode {
					if err := repository.DeleteArticleTranslation(session, id, t.LanguageCode); err != nil {
						_ = session.Rollback()
						return nil, err
					}
				}
				continue
			}
			translation := &repository.ArticleTranslation{
				ArticleId:    id,
				LanguageCode: t.LanguageCode,
				Title:        t.Title,
				Slug:         t.Slug,
				Content:      t.Content,
				IsPublished:  true,
			}
			if err := repository.UpsertArticleTranslation(session, translation); err != nil {
				_ = session.Rollback()
				return nil, err
			}
		}
	} else {
		if err := repository.UpsertDefaultArticleTranslation(session, article); err != nil {
			_ = session.Rollback()
			return nil, err
		}
	}

	if err := repository.DeleteArticleTagRelationshipsByArticleID(session, id); err != nil {
		_ = session.Rollback()
		return nil, err
	}

	if len(req.Tags) > 0 {
		tagIDs, err := repository.FindOrCreateTags(session, req.Tags)
		if err != nil {
			_ = session.Rollback()
			return nil, err
		}

		if err := repository.CreateArticleTagRelationships(session, article.Id, tagIDs); err != nil {
			_ = session.Rollback()
			return nil, err
		}
	}

	return article, session.Commit()
}
