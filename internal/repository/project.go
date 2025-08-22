package repository

import (
	"time"
	"tunan-blog/internal/infrastructure"
)

type Project struct {
	Id          int64     `xorm:"pk autoincr" json:"id"`
	Name        string    `xorm:"varchar(255) notnull" json:"name"`
	Description string    `xorm:"text" json:"description"`
	GithubUrl   string    `xorm:"varchar(500) 'github_url'" json:"githubUrl"`
	DemoUrl     string    `xorm:"varchar(500) 'demo_url'" json:"demoUrl"`
	TechStack   string    `xorm:"json 'tech_stack'" json:"techStack"`
	Featured    bool      `xorm:"tinyint(1) default 0" json:"featured"`
	SortOrder   int       `xorm:"int default 0 'sort_order'" json:"sortOrder"`
	IsDeleted   bool      `xorm:"tinyint(1) default 0" json:"isDeleted"`
	GmtCreate   time.Time `xorm:"created" json:"gmtCreate"`
	GmtModified time.Time `xorm:"updated" json:"gmtModified"`
}

func (p *Project) TableName() string {
	return "project"
}

type ProjectQueryParam struct {
	PageSize  int
	PageIndex int
	Featured  *bool
}

// CreateProject creates a new project
func CreateProject(project *Project) error {
	_, err := infrastructure.Sqlite.Insert(project)
	return err
}

// UpdateProject updates an existing project
func UpdateProject(project *Project) error {
	_, err := infrastructure.Sqlite.ID(project.Id).
		Cols("name", "description", "github_url", "demo_url", "tech_stack", "featured", "sort_order").
		Update(project)
	return err
}

// DeleteProject soft deletes a project
func DeleteProject(id int64) error {
	project := &Project{IsDeleted: true}
	_, err := infrastructure.Sqlite.ID(id).Cols("is_deleted").Update(project)
	return err
}

// GetProjectById gets a project by id
func GetProjectById(id int64) (*Project, error) {
	project := &Project{}
	has, err := infrastructure.Sqlite.ID(id).Where("is_deleted = ?", false).Get(project)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, nil
	}
	return project, nil
}

// QueryProject queries projects with pagination
func QueryProject(param ProjectQueryParam) ([]*Project, int64, error) {
	var projects []*Project
	session := infrastructure.Sqlite.Where("is_deleted = ?", false)

	if param.Featured != nil {
		session = session.And("featured = ?", *param.Featured)
	}

	session = session.OrderBy("sort_order ASC, gmt_create DESC")

	// Get total count
	total, err := session.Count(new(Project))
	if err != nil {
		return nil, 0, err
	}

	// Get paginated results
	if param.PageSize > 0 && param.PageIndex > 0 {
		session = session.Limit(param.PageSize, (param.PageIndex-1)*param.PageSize)
	}

	err = session.Find(&projects)
	return projects, total, err
}

// GetAllProjects gets all non-deleted projects
func GetAllProjects() ([]*Project, error) {
	var projects []*Project
	err := infrastructure.Sqlite.Where("is_deleted = ?", false).
		OrderBy("sort_order ASC, gmt_create DESC").Find(&projects)
	return projects, err
}

// GetFeaturedProjects gets featured projects
func GetFeaturedProjects() ([]*Project, error) {
	var projects []*Project
	err := infrastructure.Sqlite.Where("is_deleted = ? AND featured = ?", false, true).
		OrderBy("sort_order ASC, gmt_create DESC").Find(&projects)
	return projects, err
}
