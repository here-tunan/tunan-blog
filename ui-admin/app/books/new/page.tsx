'use client';

import React, { useState } from 'react';
import { Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import BookEditorForm from '../components/BookEditorForm';
import { API_URL } from '@/lib/config';

const { Title } = Typography;

const NewBookPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: any) => {
    setLoading(true);
    const token = localStorage.getItem('jwt_token');

    try {
      const response = await fetch(`${API_URL}/admin/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Book created successfully!');
        router.push('/books');
      } else {
        const errorData = await response.json();
        message.error(`Failed to create book: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while creating the book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>New Book</Title>
      <BookEditorForm onFinish={handleFinish} loading={loading} />
    </div>
  );
};

export default NewBookPage;
