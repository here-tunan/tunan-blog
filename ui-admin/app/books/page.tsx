'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Button, Space, Modal, Tooltip } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';
import { apiRequestJson, apiRequest } from '@/lib/api';
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

interface BookListResponse {
  data: BookData[];
  total: number;
}

const BooksPage = () => {
  const [data, setData] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} books`,
  });

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const result = await apiRequestJson<BookListResponse>(`/admin/books?page=${page}&pageSize=${pageSize}`);
      setData(result.data || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: result.total || 0,
      }));
    } catch (error) {
      console.error(error);
      message.error('Could not load books.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this book?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          const response = await apiRequest(`/admin/books/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success('Book deleted successfully');
            fetchData(pagination.current || 1, pagination.pageSize || 10);
          } else {
            throw new Error('Failed to delete book');
          }
        } catch (error) {
          console.error(error);
          message.error('Could not delete book.');
        }
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
    fetchData(pagination.current || 1, pagination.pageSize || 10);
  }, []);

  const handleTableChange = (nextPagination: TablePaginationConfig) => {
    fetchData(nextPagination.current || 1, nextPagination.pageSize || 10);
  };

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

export default BooksPage;
