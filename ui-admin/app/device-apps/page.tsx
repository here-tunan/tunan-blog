'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Spin, Button, Space, Modal, Tooltip, Tag } from 'antd';
import type { TableProps } from 'antd';
import { API_URL } from '@/lib/config';
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

const DeviceAppsPage = () => {
  const [data, setData] = useState<DeviceAppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this device/app?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const token = localStorage.getItem('jwt_token');
        fetch(`${API_URL}/admin/device-apps/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.ok) {
            message.success('Device/App deleted successfully');
            setData(data.filter(item => item.id !== id));
          } else {
            throw new Error('Failed to delete device/app');
          }
        })
        .catch(error => {
          console.error(error);
          message.error('Failed to delete device/app');
        });
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
    const fetchData = async () => {
      const token = localStorage.getItem('jwt_token');
      
      try {
        const response = await fetch(`${API_URL}/admin/device-apps`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to load device apps');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            showQuickJumper: true,
          }}
        />
      )}
    </div>
  );
};

export default DeviceAppsPage;