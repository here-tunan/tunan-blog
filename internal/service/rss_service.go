package service

import (
	"encoding/xml"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
	"time"
	"tunan-blog/env"
	"tunan-blog/internal/repository"
)

// Item RSS 项结构体
type Item struct {
	Title          string `xml:"title"`
	Link           string `xml:"link"`
	Description    string `xml:"description"`
	ContentEncoded string `xml:"content:encoded"`
	PubDate        string `xml:"pubDate"`
}

// RSS 结构体
type RSS struct {
	XMLName      xml.Name `xml:"rss"`
	Version      string   `xml:"version,attr"`
	Channel      Channel  `xml:"channel"`
	XmlnsDc      string   `xml:"xmlns:dc,attr"`
	XmlnsContent string   `xml:"xmlns:content,attr"`
	XmlnsAtom    string   `xml:"xmlns:atom,attr"`
	XmlnsItunes  string   `xml:"xmlns:itunes,attr"`
}

// Channel RSS 项结构体
type Channel struct {
	Title       string       `xml:"title"`
	Link        string       `xml:"link"`
	Description string       `xml:"description"`
	Follow      FollowChange `xml:"follow_challenge"`
	Items       []Item       `xml:"item"`
}

// FollowChange 用于follow feed 的claim
type FollowChange struct {
	FeedId string `xml:"feedId"`
	UserId string `xml:"userId"`
}

func RssXmlCreat() {
	param := repository.ArticleQueryParam{
		PageSize:  20,
		PageIndex: 1,
	}

	// 查询文章列表
	articleList, _, _ := repository.QueryArticle(param)

	if len(articleList) == 0 {
		return
	}

	var items []Item
	// 遍历列表
	for _, article := range articleList {
		// 使用 Pandoc 转换 Markdown 为 HTML
		cmd := exec.Command("pandoc", "-f", "markdown", "-t", "html")
		cmd.Stdin = strings.NewReader(article.Content)
		htmlOutput, err := cmd.Output()
		if err != nil {
			log.Printf("Pandoc error for ID %d: %v", article.Id, err)
			continue
		}

		// 创建 RSS 项
		item := Item{
			Title:          article.Title,
			Link:           fmt.Sprintf("%s/blog/%s", env.Prop.Website.Url, article.Slug), // 替换成你的链接格式
			Description:    article.Title,
			ContentEncoded: string(htmlOutput),
			PubDate:        article.GmtCreate.Format(time.RFC822),
		}
		items = append(items, item)
	}

	// 创建 RSS 结构体
	rss := RSS{
		Version:      "2.0",
		XmlnsDc:      "http://purl.org/dc/elements/1.1/",
		XmlnsContent: "http://purl.org/rss/1.0/modules/content/",
		XmlnsAtom:    "http://www.w3.org/2005/Atom",
		XmlnsItunes:  "http://www.itunes.com/dtds/podcast-1.0.dtd",
		Channel: Channel{
			Title:       env.Prop.Website.Title,       // 替换成你的 RSS 标题
			Link:        env.Prop.Website.Url,         // 替换成你的 RSS 链接
			Description: env.Prop.Website.Description, // 替换成你的 RSS 描述
			Follow: FollowChange{
				FeedId: env.Prop.Website.FollowFeedId,
				UserId: env.Prop.Website.FollowUserId,
			},
			Items: items,
		},
	}

	// 将 RSS 数据编码为 XML
	xmlData, err := xml.MarshalIndent(rss, "", "  ")
	if err != nil {
		log.Fatal(err)
	}

	// 输出 XML 文件
	err = os.WriteFile("rss.xml", xmlData, 0644)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("RSS feed generated successfully!")
}
