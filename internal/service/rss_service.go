package service

import (
	"encoding/xml"
	"fmt"
	"regexp"
	"strings"
	"time"
	"tunan-blog/env"
	"tunan-blog/internal/repository"
)

// Item RSS 项结构体
type Item struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	PubDate     string `xml:"pubDate"`
}

// RSS 结构体
type RSS struct {
	XMLName   xml.Name `xml:"rss"`
	Version   string   `xml:"version,attr"`
	XmlnsAtom string   `xml:"xmlns:atom,attr"`
	Channel   Channel  `xml:"channel"`
}

// Channel RSS 频道
type Channel struct {
	Title       string       `xml:"title"`
	Link        string       `xml:"link"`
	Description string       `xml:"description"`
	Follow      FollowChange `xml:"follow_challenge"`
	Items       []Item       `xml:"item"`
}

// FollowChange 用于 follow feed 的 claim
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

// RssXmlBytes 实时生成 RSS XML。
// 旧实现写 rss.xml 文件到进程目录并调用外部 pandoc,新架构下由
// /api/rss 直接返回字节流,Caddy 把 /rss.xml 转译到这个接口。
func RssXmlBytes() ([]byte, error) {
	param := repository.ArticleQueryParam{
		PageSize:  20,
		PageIndex: 1,
	}

	param.LanguageCode = repository.DefaultLanguageCode

	// 查询文章列表
	articleList, _, _ := QueryArticle(param)

	if len(articleList) == 0 {
		return nil, fmt.Errorf("no articles found")
	}

	var items []Item
	for _, article := range articleList {
		item := Item{
			Title:       article.Title,
			Link:        fmt.Sprintf("%s/%s/blog/%s", env.Prop.Website.Url, repository.DefaultLanguageCode, article.Slug),
			Description: generateSummary(article.Content, 200),
			PubDate:     article.GmtCreate.Format(time.RFC822),
		}
		items = append(items, item)
	}

	rss := RSS{
		Version:   "2.0",
		XmlnsAtom: "http://www.w3.org/2005/Atom",
		Channel: Channel{
			Title:       env.Prop.Website.Title,
			Link:        env.Prop.Website.Url,
			Description: env.Prop.Website.Description,
			Follow: FollowChange{
				FeedId: env.Prop.Website.FollowFeedId,
				UserId: env.Prop.Website.FollowUserId,
			},
			Items: items,
		},
	}

	xmlData, err := xml.MarshalIndent(rss, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("failed to marshal RSS XML: %v", err)
	}

	return []byte(xml.Header + string(xmlData)), nil
}
