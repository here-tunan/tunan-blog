package service

import "tunan-blog/internal/repository"

func TrackView(path, ipAddress, userAgent string) error {
	view := &repository.View{
		Path:      path,
		IPAddress: ipAddress,
		UserAgent: userAgent,
	}
	return repository.CreateView(view)
}

func GetViewsByPath(path string) (int64, error) {
	return repository.CountByPath(path)
}

func GetTotalViews() (int64, error) {
	return repository.CountTotalViews()
}

func GetPathViewCounts() ([]*repository.PathViewCount, error) {
	return repository.GetViewsGroupedByPath()
}

func GetDailyViews(days int) ([]*repository.DailyViewCount, error) {
	return repository.GetDailyViewCounts(days)
}
