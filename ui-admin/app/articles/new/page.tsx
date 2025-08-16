'use client';

import React, { useState, useEffect } from 'react';
import { Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import ArticleEditorForm from '../components/ArticleEditorForm';
import { API_URL } from '@/lib/config';

const { Title } = Typography;

const NewArticlePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await fetch(`${API_URL}/admin/tags`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const tagOptions = data.map((tag: { name: string }) => ({ label: tag.name, value: tag.name }));
          setTags(tagOptions);
        }
      } catch (error) {
        console.error("Failed to fetch tags", error);
      }
    };

    fetchTags();
  }, []);

  const handleFinish = async (values: any) => {
    setLoading(true);
    const token = localStorage.getItem('jwt_token');

    try {
      const response = await fetch(`${API_URL}/admin/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Article created successfully!');
        router.push('/articles');
      } else {
        const errorData = await response.json();
        message.error(`Failed to create article: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while creating the article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>New Article</Title>
      <ArticleEditorForm onFinish={handleFinish} loading={loading} tagOptions={tags} />
    </div>
  );
};

export default NewArticlePage;
