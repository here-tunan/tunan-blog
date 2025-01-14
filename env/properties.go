package env

import (
	"fmt"
	"gopkg.in/yaml.v3"
	"log"
	"os"
)

type Properties struct {
	Sqlite3 struct {
		File string `json:"file"`
	} `json:"sqlite3"`

	Mysql struct {
		Host     string `json:"host"`
		Port     int    `json:"port"`
		Username string `json:"username"`
		Password string `json:"password"`
	} `json:"mysql"`

	Website struct {
		Url          string `json:"url"`
		Title        string `json:"title"`
		Description  string `json:"description"`
		FollowFeedId string `json:"followFeedId" yaml:"follow_feed_id"`
		FollowUserId string `json:"followUserId" yaml:"follow_user_id"`
	} `json:"website"`

	Apikey string `json:"apikey"`
}

var Prop *Properties

// 初始化配置文件
func init() {
	readEncProperties()
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
	// 打印解析后的数据
	// fmt.Printf("%+v\n", prop)

	Prop = prop
}
