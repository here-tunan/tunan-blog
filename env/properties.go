package env

import (
	"fmt"
	"log"
	"os"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gopkg.in/yaml.v3"
)

type Properties struct {
	DatabaseType string `json:"database_type" yaml:"database_type"`

	Sqlite3 struct {
		File string `json:"file"`
	} `json:"sqlite3"`

	Mysql struct {
		Host     string `json:"host"`
		Port     int    `json:"port"`
		Username string `json:"username"`
		Password string `json:"password"`
		Database string `json:"database"`
	} `json:"mysql"`

	Website struct {
		Url          string `json:"url"`
		Title        string `json:"title"`
		Description  string `json:"description"`
		FollowFeedId string `json:"followFeedId" yaml:"follow_feed_id"`
		FollowUserId string `json:"followUserId" yaml:"follow_user_id"`
	} `json:"website"`

	Apikey string `json:"apikey"`

	Auth struct {
		AdminPassword string `json:"admin_password" yaml:"admin_password"`
		JwtSecret     string `json:"jwt_secret" yaml:"jwt_secret"`
	} `json:"auth"`

	Github struct {
		Token string `json:"token" yaml:"token"`
	} `json:"github"`
}

var Prop *Properties

// 初始化配置文件
func init() {
	readEncProperties()
	hashedPasswordIfNeeded()
}

func readEncProperties() {

	envFilePath := "./env/dev.yaml"

	// 根据环境变量解析配置文件
	appEnv := os.Getenv("GO_TUNAN_BLOG_ENV")
	if appEnv == "dev" || appEnv == "" {
		fmt.Println("Start go-tunan-blog app in development environment!")
		envFilePath = "./env/dev.yaml"
	} else if appEnv == "prod" {
		fmt.Println("Start go-tunan-blog app in production environment!")
		envFilePath = "./env/prod.yaml"
	} else {
		fmt.Println("Start go-tunan-blog app in unknown environment! Maybe cause errors!")
	}

	// 读取YAML文件内容
	envFile, err := os.ReadFile(envFilePath)
	if err != nil {
		log.Fatalf("Failed to read YAML file: %v", err)
	}

	prop := &Properties{}

	// 解析YAML文件
	err = yaml.Unmarshal(envFile, prop)
	if err != nil {
		log.Fatalf("Failed to unmarshal YAML: %v", err)
	}

	Prop = prop
}

// hashedPasswordIfNeeded checks if the admin password is plaintext.
// If it is, it hashes it, prints the hash for the user to update their config,
// and uses the hash for the current session.
func hashedPasswordIfNeeded() {
	if Prop != nil && Prop.Auth.AdminPassword != "" && !strings.HasPrefix(Prop.Auth.AdminPassword, "$2a$") {
		log.Println("Plaintext admin password detected. Generating bcrypt hash...")
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(Prop.Auth.AdminPassword), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Failed to hash admin password: %v", err)
		}

		log.Println("------------------------------------------------------------------------")
		log.Printf("IMPORTANT: Please update your dev.yaml with the new hashed password:\nauth:\n  admin_password: \"%s\"", string(hashedPassword))
		log.Println("------------------------------------------------------------------------")

		// Use the hashed password for the current application lifecycle
		Prop.Auth.AdminPassword = string(hashedPassword)
	}
}
