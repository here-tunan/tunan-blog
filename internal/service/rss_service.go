package service

import (
	"encoding/xml"
	"fmt"
	_ "log"
	"os"
	"regexp"
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

// generateSummary 生成文章摘要
func generateSummary(content string, maxLength int) string {
	// 移除 Markdown 标记
	re := regexp.MustCompile(`[#*_\[\]()` + "`" + `]`)
	cleaned := re.ReplaceAllString(content, "")

	// 移除多余的空格和换行
	re = regexp.MustCompile(`\s+`)
	cleaned = re.ReplaceAllString(cleaned, " ")
	cleaned = strings.TrimSpace(cleaned)

	// 截断到指定长度
	if len(cleaned) > maxLength {
		// 尝试在句号处截断
		if idx := strings.Index(cleaned[maxLength-50:maxLength+50], "。"); idx != -1 && idx < 100 {
			return cleaned[:maxLength-50+idx+3] + "..."
		}
		// 否则直接截断
		return cleaned[:maxLength] + "..."
	}

	return cleaned
}

func RssXmlCreat() error {
	param := repository.ArticleQueryParam{
		PageSize:  20,
		PageIndex: 1,
	}

	// 查询文章列表
	articleList, _, _ := repository.QueryArticle(param)

	if len(articleList) == 0 {
		return fmt.Errorf("no articles found")
	}

	var items []Item
	// 遍历列表
	for _, article := range articleList {
		// 生成文章摘要（约200字符）
		summary := generateSummary(article.Content, 200)

		// 创建 RSS 项
		item := Item{
			Title:          article.Title,
			Link:           fmt.Sprintf("%s/blog/%s", env.Prop.Website.Url, article.Slug),
			Description:    summary,         // 使用摘要而不是标题
			ContentEncoded: article.Content, // 使用完整内容
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
		return fmt.Errorf("failed to marshal RSS XML: %v", err)
	}

	// 输出 XML 文件
	err = os.WriteFile("rss.xml", xmlData, 0644)
	if err != nil {
		return fmt.Errorf("failed to write RSS file: %v", err)
	}

	fmt.Println("RSS feed generated successfully!")
	return nil
}
