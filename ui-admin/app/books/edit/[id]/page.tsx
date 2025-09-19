'use client';

import React, { useEffect, useState } from 'react';
import { message, Spin, Typography } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { apiRequestJson } from '@/lib/api';
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
      try {
        const result = await apiRequestJson(`/admin/books/${id}`);
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

    try {
      await apiRequestJson(`/admin/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      });

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
