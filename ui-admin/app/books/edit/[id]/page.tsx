'use client';

import React, { useEffect, useState } from 'react';
import { message, Spin, Typography } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';
import BookEditorForm from '../../components/BookEditorForm';

const { Title } = Typography;

const EditBookPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await fetch(`${API_URL}/admin/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch book');
        }

        const result = await response.json();
        setInitialData(result);
      } catch (error) {
        console.error(error);
        message.error('Could not load book data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    const token = localStorage.getItem('jwt_token');

    try {
      const response = await fetch(`${API_URL}/admin/books/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      message.success('Book updated successfully');
      router.push('/books');
    } catch (error) {
      console.error(error);
      message.error('Could not update book.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Title level={2}>Edit Book</Title>
      {loading || !initialData ? (
        <Spin />
      ) : (
        <BookEditorForm
          initialValues={initialData}
          onFinish={onFinish}
          loading={submitting}
        />
      )}
    </div>
  );
};

export default EditBookPage;
