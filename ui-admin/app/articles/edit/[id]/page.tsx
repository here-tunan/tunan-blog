'use client';

import React, { useEffect, useState } from 'react';
import { Button, message, Space, Spin, Typography } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { apiRequestJson } from '@/lib/api';
import ArticleEditorForm from '../../components/ArticleEditorForm';

const { Title } = Typography;

const EditArticlePage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    const fetchTags = async () => {
      try {
        const data = await apiRequestJson<{ name: string }[]>('/admin/tags');
        const tagOptions = data.map((tag) => ({ label: tag.name, value: tag.name }));
        setTags(tagOptions);
      } catch (error) {
        console.error("Failed to fetch tags", error);
      }
    };

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const result = await apiRequestJson(`/admin/articles/${id}`);
        const translations = (result.translations || []).reduce((acc: any, translation: any) => {
          acc[translation.languageCode] = {
            title: translation.title,
            slug: translation.slug,
            content: translation.content,
          };
          return acc;
        }, {});

        const defaultLanguageCode = result.defaultLanguageCode || result.languageCode || 'zh-CN';
        if (Object.keys(translations).length === 0) {
          translations[defaultLanguageCode] = {
            title: result.title,
            slug: result.slug,
            content: result.content,
          };
        }

        setInitialData({
          defaultLanguageCode,
          tags: result.tagNames || [],
          type: result.type,
          translations,
        });
      } catch (error) {
        console.error(error);
        message.error('Could not load article data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
    fetchArticle();
  }, [id]);

  const onFinish = async (values: any) => {
    setSubmitting(true);

    try {
      await apiRequestJson(`/admin/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      });

      message.success('Article updated successfully');
      router.push('/articles');
    } catch (error) {
      console.error(error);
      message.error('Could not update article.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }} align="center">
        <Title level={2} style={{ margin: 0 }}>Edit Article</Title>
        <Button onClick={() => router.push('/articles')}>Back to list</Button>
      </Space>
      {loading || !initialData ? (
        <Spin />
      ) : (
        <ArticleEditorForm
          initialValues={initialData}
          onFinish={onFinish}
          loading={submitting}
          tagOptions={tags}
        />
      )}
    </div>
  );
};

export default EditArticlePage;