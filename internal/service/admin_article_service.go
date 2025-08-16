package service

import (
	"tunan-blog/internal/repository"
)

type ArticleCreationRequest struct {
	Title   string   `json:"title"`
	Slug    string   `json:"slug"`
	Content string   `json:"content"`
	Tags    []string `json:"tags"`
	Type    int      `json:"type"`
}

// CreateArticle handles the business logic of creating a new article and its tags.
func CreateArticle(req ArticleCreationRequest) (*repository.Article, error) {
	session := repository.NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return nil, err
	}

	// 1. Create the article
	article := &repository.Article{
		Title:   req.Title,
		Slug:    req.Slug,
		Content: req.Content,
		Type:    req.Type, // Set the type here
	}

	if err := repository.CreateArticle(session, article); err != nil {
		_ = session.Rollback()
		return nil, err
	}

	// 2. Handle tags
	if len(req.Tags) > 0 {
		tagIDs, err := repository.FindOrCreateTags(session, req.Tags)
		if err != nil {
			_ = session.Rollback()
			return nil, err
		}

		// 3. Create relationships
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

type ArticleUpdateRequest struct {
	Title   string   `json:"title"`
	Slug    string   `json:"slug"`
	Content string   `json:"content"`
	Tags    []string `json:"tags"`
	Type    int      `json:"type"`
}

func UpdateArticle(id int64, req ArticleUpdateRequest) (*repository.Article, error) {
	session := repository.NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return nil, err
	}

	// 1. Update the article
	article := &repository.Article{
		Id:      id,
		Title:   req.Title,
		Slug:    req.Slug,
		Content: req.Content,
		Type:    req.Type,
	}

	if err := repository.UpdateArticle(session, article); err != nil {
		_ = session.Rollback()
		return nil, err
	}

	// 2. Clear existing tag relationships
	if err := repository.DeleteArticleTagRelationshipsByArticleID(session, id); err != nil {
		_ = session.Rollback()
		return nil, err
	}

	// 3. Handle new tags
	if len(req.Tags) > 0 {
		tagIDs, err := repository.FindOrCreateTags(session, req.Tags)
		if err != nil {
			_ = session.Rollback()
			return nil, err
		}

		// 4. Create new relationships
		if err := repository.CreateArticleTagRelationships(session, article.Id, tagIDs); err != nil {
			_ = session.Rollback()
			return nil, err
		}
	}

	return article, session.Commit()
}
