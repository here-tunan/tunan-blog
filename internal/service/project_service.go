package service

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
	"sync"
	"time"
	"tunan-blog/env"
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

// GitHub info cache
type GitHubCache struct {
	data  map[string]*GitHubCacheItem
	mutex sync.RWMutex
}

type GitHubCacheItem struct {
	data      *GitHubRepo
	timestamp time.Time
}

var githubCache = &GitHubCache{
	data: make(map[string]*GitHubCacheItem),
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

	fmt.Printf("Found %d projects to process\n", len(projects))
	var result []*ProjectWithGitHubInfo
	for _, project := range projects {
		projectWithGitHub := &ProjectWithGitHubInfo{Project: project}

		fmt.Printf("Processing project: %s, GitHub URL: '%s'\n", project.Name, project.GithubUrl)
		if project.GithubUrl != "" {
			fmt.Printf("Fetching GitHub info for: %s\n", project.GithubUrl)
			gitHubInfo, err := fetchGitHubInfo(project.GithubUrl)
			if err == nil {
				fmt.Printf("✅ Successfully fetched GitHub info for %s\n", project.Name)
				projectWithGitHub.GitHubInfo = gitHubInfo
			} else {
				fmt.Printf("❌ Failed to fetch GitHub info for %s: %v\n", project.Name, err)
			}
		} else {
			fmt.Printf("⚠️  No GitHub URL for project: %s\n", project.Name)
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

	fmt.Printf("Found %d featured projects to process\n", len(projects))
	var result []*ProjectWithGitHubInfo
	for _, project := range projects {
		projectWithGitHub := &ProjectWithGitHubInfo{Project: project}

		fmt.Printf("Processing featured project: %s, GitHub URL: '%s'\n", project.Name, project.GithubUrl)
		if project.GithubUrl != "" {
			fmt.Printf("Fetching GitHub info for featured project: %s\n", project.GithubUrl)
			gitHubInfo, err := fetchGitHubInfo(project.GithubUrl)
			if err == nil {
				fmt.Printf("✅ Successfully fetched GitHub info for featured project %s\n", project.Name)
				projectWithGitHub.GitHubInfo = gitHubInfo
			} else {
				fmt.Printf("❌ Failed to fetch GitHub info for featured project %s: %v\n", project.Name, err)
			}
		} else {
			fmt.Printf("⚠️  No GitHub URL for featured project: %s\n", project.Name)
		}

		result = append(result, projectWithGitHub)
	}

	return result, nil
}

// fetchGitHubInfo fetches repository information from GitHub API with caching
func fetchGitHubInfo(githubUrl string) (*GitHubRepo, error) {
	// Check cache first
	githubCache.mutex.RLock()
	if cached, exists := githubCache.data[githubUrl]; exists {
		// Cache is valid for 1 hour
		if time.Since(cached.timestamp) < time.Hour {
			fmt.Printf("Using cached GitHub info for: %s\n", githubUrl)
			githubCache.mutex.RUnlock()
			return cached.data, nil
		}
	}
	githubCache.mutex.RUnlock()
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

	// Create request with headers
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, err
	}

	// Add User-Agent header (required by GitHub API)
	req.Header.Set("User-Agent", "Tunan-Blog/1.0")

	// Add GitHub token if available (recommended to avoid rate limiting)
	githubToken := env.Prop.Github.Token
	if githubToken != "" {
		req.Header.Set("Authorization", "token "+githubToken)
		fmt.Printf("Using GitHub token for API request\n")
	} else {
		fmt.Printf("No GitHub token found, using unauthenticated requests (limited to 60/hour)\n")
	}

	// Make request
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)

	if resp.StatusCode != 200 {
		// Handle different error status codes
		switch resp.StatusCode {
		case 403:
			// Check if it's rate limiting
			if resp.Header.Get("X-RateLimit-Remaining") == "0" {
				return nil, fmt.Errorf("GitHub API rate limit exceeded. Try again later")
			}
			return nil, fmt.Errorf("GitHub API access forbidden (403). Consider adding a GitHub token")
		case 404:
			return nil, fmt.Errorf("GitHub repository not found (404)")
		default:
			return nil, fmt.Errorf("GitHub API returned status: %d", resp.StatusCode)
		}
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

	// Cache the result
	githubCache.mutex.Lock()
	githubCache.data[githubUrl] = &GitHubCacheItem{
		data:      gitHubRepo,
		timestamp: time.Now(),
	}
	githubCache.mutex.Unlock()

	return gitHubRepo, nil
}
