'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Spin, Button, Space, Modal, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { API_URL } from '@/lib/config';
import { PlusOutlined, ExclamationCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;
const { confirm } = Modal;

interface BookData {
  id: number;
  name: string;
  author: string;
  category: string;
  score: number;
}

const BooksPage = () => {
  const [data, setData] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this book?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const token = localStorage.getItem('jwt_token');
        fetch(`${API_URL}/admin/books/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.ok) {
            message.success('Book deleted successfully');
            setData(data.filter(item => item.id !== id));
          } else {
            throw new Error('Failed to delete book');
          }
        })
        .catch(error => {
          console.error(error);
          message.error('Could not delete book.');
        });
      },
    });
  };

  const columns: TableProps<BookData>['columns'] = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Score', dataIndex: 'score', key: 'score' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Link href={`/books/edit/${record.id}`}>
              <Button icon={<EditOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        message.error('Authentication token not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/admin/books`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error(error);
        message.error('Could not load books.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2}>Book Management</Title>
        <Link href="/books/new">
          <Button type="primary" icon={<PlusOutlined />}>
            New Book
          </Button>
        </Link>
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Spin>
    </div>
  );
};

export default BooksPage;
