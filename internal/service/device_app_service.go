package service

import (
	"tunan-blog/internal/infrastructure"
	"tunan-blog/internal/repository"
)

type DeviceAppService struct{}

func NewDeviceAppService() *DeviceAppService {
	return &DeviceAppService{}
}

func (s *DeviceAppService) GetAllDeviceApps() ([]*repository.DeviceApp, error) {
	return repository.FindAllDeviceApps()
}

func (s *DeviceAppService) GetDeviceAppsByCategory(category string) ([]*repository.DeviceApp, error) {
	return repository.FindDeviceAppsByCategory(category)
}

func (s *DeviceAppService) GetDeviceAppByID(id int64) (*repository.DeviceApp, error) {
	return repository.GetDeviceAppByID(id)
}

func (s *DeviceAppService) CreateDeviceApp(deviceApp *repository.DeviceApp) error {
	session := infrastructure.Sqlite.NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return err
	}

	if err := repository.CreateDeviceApp(session, deviceApp); err != nil {
		session.Rollback()
		return err
	}

	return session.Commit()
}

func (s *DeviceAppService) UpdateDeviceApp(deviceApp *repository.DeviceApp) error {
	session := infrastructure.Sqlite.NewSession()
	defer session.Close()

	if err := session.Begin(); err != nil {
		return err
	}

	if err := repository.UpdateDeviceApp(session, deviceApp); err != nil {
		session.Rollback()
		return err
	}

	return session.Commit()
}

func (s *DeviceAppService) DeleteDeviceApp(id int64) error {
	return repository.DeleteDeviceApp(id)
}

func (s *DeviceAppService) GetGroupedDeviceApps() (map[string][]*repository.DeviceApp, error) {
	deviceApps, err := repository.FindAllDeviceApps()
	if err != nil {
		return nil, err
	}

	grouped := make(map[string][]*repository.DeviceApp)
	for _, app := range deviceApps {
		grouped[app.Category] = append(grouped[app.Category], app)
	}

	return grouped, nil
}
