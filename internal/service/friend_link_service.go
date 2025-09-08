package service

import (
	"tunan-blog/internal/infrastructure"
	"tunan-blog/internal/repository"
)

type FriendLinkService struct{}

func NewFriendLinkService() *FriendLinkService {
	return &FriendLinkService{}
}

func (s *FriendLinkService) GetAllFriendLinks() ([]*repository.FriendLink, error) {
	return repository.FindAllFriendLinks()
}

func (s *FriendLinkService) GetFriendLinkByID(id int64) (*repository.FriendLink, error) {
	return repository.GetFriendLinkByID(id)
}

func (s *FriendLinkService) CreateFriendLink(friendLink *repository.FriendLink) error {
	session := infrastructure.GetDB().NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return err
	}

	if err := repository.CreateFriendLink(session, friendLink); err != nil {
		session.Rollback()
		return err
	}

	return session.Commit()
}

func (s *FriendLinkService) UpdateFriendLink(friendLink *repository.FriendLink) error {
	session := infrastructure.GetDB().NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return err
	}

	if err := repository.UpdateFriendLink(session, friendLink); err != nil {
		session.Rollback()
		return err
	}

	return session.Commit()
}

func (s *FriendLinkService) DeleteFriendLink(id int64) error {
	return repository.DeleteFriendLink(id)
}
