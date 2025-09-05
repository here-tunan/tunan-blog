'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Spin, Button, Space, Modal, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { API_URL } from '@/lib/config';
import { PlusOutlined, ExclamationCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;
const { confirm } = Modal;

interface ArticleData {
  id: number;
  title: string;
  slug: string;
  type: number;
  gmtCreate: string;
}

const getTypeLabel = (type: number) => {
  switch (type) {
    case 1:
      return { label: 'Blog Post', color: '#52c41a' };
    case 2:
      return { label: 'Weekly Report', color: '#1890ff' };
    case 3:
      return { label: 'Translation', color: '#722ed1' };
    case 4:
      return { label: 'Blog History', color: '#fa8c16' };
    default:
      return { label: 'Unknown', color: '#d9d9d9' };
  }
};

const ArticlesPage = () => {
  const [data, setData] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this article?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const token = localStorage.getItem('jwt_token');
        fetch(`${API_URL}/admin/articles/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.ok) {
            message.success('Article deleted successfully');
            setData(data.filter(item => item.id !== id));
          } else {
            throw new Error('Failed to delete article');
          }
        })
        .catch(error => {
          console.error(error);
          message.error('Could not delete article.');
        });
      },
    });
  };

  const columns: TableProps<ArticleData>['columns'] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        const { label, color } = getTypeLabel(type);
        return (
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: `${color}20`,
              color: color,
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            {label}
          </span>
        );
      },
      filters: [
        { text: 'Blog Post', value: 1 },
        { text: 'Weekly Report', value: 2 },
        { text: 'Translation', value: 3 },
        { text: 'Blog History', value: 4 },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Created At',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Link href={`/articles/edit/${record.id}`}>
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
        const response = await fetch(`${API_URL}/admin/articles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error(error);
        message.error('Could not load articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2}>Article Management</Title>
        <Link href="/articles/new">
          <Button type="primary" icon={<PlusOutlined />}>
            New Article
          </Button>
        </Link>
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Spin>
    </div>
  );
};

export default ArticlesPage;
