'use client';

import React, { useState } from 'react';
import { Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import BookEditorForm from '../components/BookEditorForm';
import { apiRequestJson } from '@/lib/api';

const { Title } = Typography;

const NewBookPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: any) => {
    setLoading(true);

    try {
      await apiRequestJson('/admin/books', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      message.success('Book created successfully!');
      router.push('/books');
    } catch (error: any) {
      console.error(error);
      message.error(error.message || 'An error occurred while creating the book.');
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
