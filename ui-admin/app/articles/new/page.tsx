'use client';

import React, { useState, useEffect } from 'react';
import { Button, Space, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import ArticleEditorForm from '../components/ArticleEditorForm';
import { apiRequestJson } from '@/lib/api';

const { Title } = Typography;

const NewArticlePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await apiRequestJson<{ name: string }[]>('/admin/tags');
        const tagOptions = data.map((tag) => ({ label: tag.name, value: tag.name }));
        setTags(tagOptions);
      } catch (error) {
        console.error("Failed to fetch tags", error);
      }
    };

    fetchTags();
  }, []);

  const handleFinish = async (values: any) => {
    setLoading(true);

    try {
      await apiRequestJson('/admin/articles', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      message.success('Article created successfully!');
      router.push('/articles');
    } catch (error: any) {
      console.error(error);
      message.error(error.message || 'An error occurred while creating the article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }} align="center">
        <Title level={2} style={{ margin: 0 }}>New Article</Title>
        <Button onClick={() => router.push('/articles')}>Back to list</Button>
      </Space>
      <ArticleEditorForm onFinish={handleFinish} loading={loading} tagOptions={tags} />
    </div>
  );
};

export default NewArticlePage;
