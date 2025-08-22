package service

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
	"tunan-blog/internal/repository"
)

// GitHubRepo represents GitHub repository information for frontend
type GitHubRepo struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	HtmlUrl     string `json:"htmlUrl"`
	Language    string `json:"language"`
	Stars       int    `json:"stars"`
	Forks       int    `json:"forks"`
	UpdatedAt   string `json:"updatedAt"`
}

// GitHubAPIResponse represents the GitHub API response structure
type GitHubAPIResponse struct {
	Name            string `json:"name"`
	Description     string `json:"description"`
	HtmlUrl         string `json:"html_url"`
	Language        string `json:"language"`
	StargazersCount int    `json:"stargazers_count"`
	ForksCount      int    `json:"forks_count"`
	UpdatedAt       string `json:"updated_at"`
}

// ProjectWithGitHubInfo represents a project with GitHub information
type ProjectWithGitHubInfo struct {
	*repository.Project
	GitHubInfo *GitHubRepo `json:"gitHubInfo,omitempty"`
}

// CreateProject creates a new project
func CreateProject(project *repository.Project) error {
	return repository.CreateProject(project)
}

// UpdateProject updates an existing project
func UpdateProject(project *repository.Project) error {
	return repository.UpdateProject(project)
}

// DeleteProject deletes a project
func DeleteProject(id int64) error {
	return repository.DeleteProject(id)
}

// GetProjectById gets a project by id
func GetProjectById(id int64) (*repository.Project, error) {
	return repository.GetProjectById(id)
}

// GetProjectByIdWithGitHub gets a project with GitHub info
func GetProjectByIdWithGitHub(id int64) (*ProjectWithGitHubInfo, error) {
	project, err := repository.GetProjectById(id)
	if err != nil || project == nil {
		return nil, err
	}

	result := &ProjectWithGitHubInfo{Project: project}

	if project.GithubUrl != "" {
		gitHubInfo, err := fetchGitHubInfo(project.GithubUrl)
		if err == nil {
			result.GitHubInfo = gitHubInfo
		}
	}

	return result, nil
}

// QueryProject queries projects with pagination
func QueryProject(param repository.ProjectQueryParam) ([]*repository.Project, int64, error) {
	return repository.QueryProject(param)
}

// GetAllProjects gets all projects
func GetAllProjects() ([]*repository.Project, error) {
	return repository.GetAllProjects()
}

// GetAllProjectsWithGitHub gets all projects with GitHub info
func GetAllProjectsWithGitHub() ([]*ProjectWithGitHubInfo, error) {
	projects, err := repository.GetAllProjects()
	if err != nil {
		return nil, err
	}

	var result []*ProjectWithGitHubInfo
	for _, project := range projects {
		projectWithGitHub := &ProjectWithGitHubInfo{Project: project}

		if project.GithubUrl != "" {
			gitHubInfo, err := fetchGitHubInfo(project.GithubUrl)
			if err == nil {
				projectWithGitHub.GitHubInfo = gitHubInfo
			}
		}

		result = append(result, projectWithGitHub)
	}

	return result, nil
}

// GetFeaturedProjects gets featured projects
func GetFeaturedProjects() ([]*repository.Project, error) {
	return repository.GetFeaturedProjects()
}

// GetFeaturedProjectsWithGitHub gets featured projects with GitHub info
func GetFeaturedProjectsWithGitHub() ([]*ProjectWithGitHubInfo, error) {
	projects, err := repository.GetFeaturedProjects()
	if err != nil {
		return nil, err
	}

	var result []*ProjectWithGitHubInfo
	for _, project := range projects {
		projectWithGitHub := &ProjectWithGitHubInfo{Project: project}

		if project.GithubUrl != "" {
			gitHubInfo, err := fetchGitHubInfo(project.GithubUrl)
			if err == nil {
				projectWithGitHub.GitHubInfo = gitHubInfo
			}
		}

		result = append(result, projectWithGitHub)
	}

	return result, nil
}

// fetchGitHubInfo fetches repository information from GitHub API
func fetchGitHubInfo(githubUrl string) (*GitHubRepo, error) {
	// Extract owner and repo from GitHub URL
	// e.g., https://github.com/user/repo -> user/repo
	parts := strings.Split(githubUrl, "/")
	if len(parts) < 5 || parts[2] != "github.com" {
		return nil, fmt.Errorf("invalid GitHub URL format")
	}

	owner := parts[3]
	repo := parts[4]

	// GitHub API URL
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s", owner, repo)

	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	// Make request
	resp, err := client.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("GitHub API returned status: %d", resp.StatusCode)
	}

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Parse JSON from GitHub API
	var apiResponse GitHubAPIResponse
	err = json.Unmarshal(body, &apiResponse)
	if err != nil {
		return nil, err
	}

	// Convert to frontend-friendly format
	gitHubRepo := &GitHubRepo{
		Name:        apiResponse.Name,
		Description: apiResponse.Description,
		HtmlUrl:     apiResponse.HtmlUrl,
		Language:    apiResponse.Language,
		Stars:       apiResponse.StargazersCount,
		Forks:       apiResponse.ForksCount,
		UpdatedAt:   apiResponse.UpdatedAt,
	}

	return gitHubRepo, nil
}
