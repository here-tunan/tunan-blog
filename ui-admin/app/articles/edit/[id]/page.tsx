'use client';

import React, { useEffect, useState } from 'react';
import { message, Spin, Typography } from 'antd';
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
        setInitialData({
          title: result.title,
          slug: result.slug,
          content: result.content,
          tags: result.tagNames || [],
          type: result.type,
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
      <Title level={2}>Edit Article</Title>
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