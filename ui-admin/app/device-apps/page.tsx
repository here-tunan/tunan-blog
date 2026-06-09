'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Button, Space, Modal, Tooltip, Tag } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';
import { apiRequestJson, apiRequest } from '@/lib/api';
import { PlusOutlined, ExclamationCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;
const { confirm } = Modal;

interface DeviceAppData {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  link: string;
  sort_order: number;
}

interface DeviceAppListResponse {
  data: DeviceAppData[];
  total: number;
}

const DeviceAppsPage = () => {
  const [data, setData] = useState<DeviceAppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  });

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const result = await apiRequestJson<DeviceAppListResponse>(`/admin/device-apps?page=${page}&pageSize=${pageSize}`);
      setData(result.data || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: result.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load device apps');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this device/app?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          await apiRequest(`/admin/device-apps/${id}`, {
            method: 'DELETE',
          });
          message.success('Device/App deleted successfully');
          fetchData(pagination.current || 1, pagination.pageSize || 10);
        } catch (error) {
          console.error(error);
          message.error('Failed to delete device/app');
        }
      },
    });
  };

  const columns: TableProps<DeviceAppData>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DeviceAppData) => (
        <Space>
          {record.icon && <span>{record.icon}</span>}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={category === 'Hardware' ? 'blue' : 'green'}>
          {category}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      ellipsis: true,
      render: (link: string) => (
        link ? <a href={link} target="_blank" rel="noopener noreferrer">Link</a> : '-'
      ),
    },
    {
      title: 'Sort Order',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Link href={`/device-apps/edit/${record.id}`}>
            <Tooltip title="Edit">
              <Button type="text" icon={<EditOutlined />} />
            </Tooltip>
          </Link>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Device & Apps Management</Title>
        <Link href="/device-apps/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Device/App
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

export default DeviceAppsPage;
