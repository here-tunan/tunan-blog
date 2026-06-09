'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Button, Space, Modal, Tooltip } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';
import { apiRequestJson, apiRequest } from '@/lib/api';
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

interface ArticleListResponse {
  data: ArticleData[];
  total: number;
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
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} articles`,
  });

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const result = await apiRequestJson<ArticleListResponse>(`/admin/articles?page=${page}&pageSize=${pageSize}`);
      setData(result.data || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: result.total || 0,
      }));
    } catch (error) {
      console.error(error);
      message.error('Could not load articles.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this article?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          const response = await apiRequest(`/admin/articles/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success('Article deleted successfully');
            fetchData(pagination.current || 1, pagination.pageSize || 10);
          } else {
            throw new Error('Failed to delete article');
          }
        } catch (error) {
          console.error(error);
          message.error('Could not delete article.');
        }
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
    fetchData(pagination.current || 1, pagination.pageSize || 10);
  }, []);

  const handleTableChange = (nextPagination: TablePaginationConfig) => {
    fetchData(nextPagination.current || 1, nextPagination.pageSize || 10);
  };

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
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ArticlesPage;
