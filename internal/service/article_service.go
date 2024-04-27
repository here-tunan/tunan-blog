package service

import "tunan-blog/internal/repository"

func QueryArticle(param repository.ArticleQueryParam) ([]repository.Article, int64, error) {
	return repository.QueryArticle(param)
}
