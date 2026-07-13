import { Locale } from '@/app/i18n/config';
import { API_URL } from '@/lib/config';

export const ARTICLE_TYPES = {
  blog: 1,
  weekly: 2,
  translation: 3,
  history: 4,
} as const;

export interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  gmtCreate: string;
  tagNames: string[];
  viewNumber: number;
  type?: number;
}

export async function getArticles({
  locale,
  pageIndex,
  pageSize,
  type,
}: {
  locale: Locale;
  pageIndex: number;
  pageSize: number;
  type: number;
}): Promise<Article[]> {
  try {
    const response = await fetch(`${API_URL}/article/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        pageSize,
        pageIndex,
        languageCode: locale,
      }),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (data && data.success) {
      return data.data || [];
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
  return [];
}

async function fetchArticleByParams(params: URLSearchParams): Promise<Article | null> {
  const response = await fetch(`${API_URL}/article?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (data?.success && data.data?.slug && data.data?.title) {
    return data.data;
  }

  return null;
}

export async function getArticle({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}): Promise<Article | null> {
  try {
    const localizedArticle = await fetchArticleByParams(new URLSearchParams({ slug, lang: locale }));
    if (localizedArticle) {
      return localizedArticle;
    }

    return await fetchArticleByParams(new URLSearchParams({ slug }));
  } catch (error) {
    console.error('Failed to fetch article:', error);
  }
  return null;
}
