package service

import (
	"time"
	"tunan-blog/internal/repository"
)

type ArticleResponse struct {
	Id         int64     `json:"id"`
	Title      string    `json:"title"`
	Slug       string    `json:"slug"`
	Content    string    `json:"content"`
	ViewNumber int       `json:"viewNumber"`
	LikeNumber int       `json:"likeNumber"`
	Type       int       `json:"type"`
	TagNames   []string  `json:"tagNames"`
	GmtCreate  time.Time `json:"gmtCreate"`
}

func QueryArticle(param repository.ArticleQueryParam) ([]ArticleResponse, int64, error) {
	articles, total, err := repository.QueryArticle(param)
	if err != nil {
		return nil, 0, err
	}
	var resList = make([]ArticleResponse, 0)
	for _, article := range articles {
		var res ArticleResponse
		res.Id = article.Id
		res.Title = article.Title
		res.Slug = article.Slug
		res.Content = article.Content
		res.ViewNumber = article.ViewNumber
		res.LikeNumber = article.LikeNumber
		res.Type = article.Type
		res.GmtCreate = article.GmtCreate
		res.TagNames = []string{}

		tags, err := repository.GetArticleTagRelationshipByArticleId(article.Id)
		if err != nil {

		}
		for _, tag := range tags {
			res.TagNames = append(res.TagNames, tag.Name)
		}
		resList = append(resList, res)
	}
	return resList, total, nil
}

func QueryArticleBySlug(slug string) (ArticleResponse, error) {
	article, err := repository.GetArticleBySlug(slug)
	if err != nil || article.Id == 0 {
		return ArticleResponse{}, err
	}

	var res ArticleResponse
	res.Id = article.Id
	res.Title = article.Title
	res.Slug = article.Slug
	res.Content = article.Content
	res.ViewNumber = article.ViewNumber
	res.LikeNumber = article.LikeNumber
	res.Type = article.Type
	res.GmtCreate = article.GmtCreate
	res.TagNames = []string{}

	tags, err := repository.GetArticleTagRelationshipByArticleId(article.Id)
	if err != nil {
		return res, err
	}
	// 从tags中收集tagNames
	for _, tag := range tags {
		res.TagNames = append(res.TagNames, tag.Name)
	}
	return res, nil
}

func QueryArticleByID(id int64) (ArticleResponse, error) {
	article, err := repository.GetArticleByID(id)
	if err != nil || article.Id == 0 {
		return ArticleResponse{}, err
	}

	var res ArticleResponse
	res.Id = article.Id
	res.Title = article.Title
	res.Slug = article.Slug
	res.Content = article.Content
	res.ViewNumber = article.ViewNumber
	res.LikeNumber = article.LikeNumber
	res.Type = article.Type
	res.GmtCreate = article.GmtCreate
	res.TagNames = []string{}

	tags, err := repository.GetArticleTagRelationshipByArticleId(article.Id)
	if err != nil {
		return res, err
	}
	for _, tag := range tags {
		res.TagNames = append(res.TagNames, tag.Name)
	}
	return res, nil
}