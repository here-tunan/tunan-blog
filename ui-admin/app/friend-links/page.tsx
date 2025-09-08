'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, LinkOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { API_URL } from '@/lib/config';

interface FriendLink {
  id: number;
  title: string;
  url: string;
  description?: string;
  sort_order: number;
  gmt_create?: string;
  gmt_modified?: string;
}

const FriendLinksPage: React.FC = () => {
  const [friendLinks, setFriendLinks] = useState<FriendLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<FriendLink | null>(null);
  const [form] = Form.useForm();

  // 获取友链列表
  const fetchFriendLinks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_URL}/admin/friend-links`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFriendLinks(data.data || []);
      } else {
        message.error('获取友链列表失败');
      }
    } catch (error) {
      message.error('获取友链列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendLinks();
  }, []);

  // 新增或编辑友链
  const handleSave = async (values: any) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const url = editingLink ? `${API_URL}/admin/friend-links/${editingLink.id}` : `${API_URL}/admin/friend-links`;
      const method = editingLink ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(editingLink ? '友链更新成功' : '友链创建成功');
        setIsModalOpen(false);
        setEditingLink(null);
        form.resetFields();
        fetchFriendLinks();
      } else {
        message.error(editingLink ? '友链更新失败' : '友链创建失败');
      }
    } catch (error) {
      message.error(editingLink ? '友链更新失败' : '友链创建失败');
    }
  };

  // 删除友链
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_URL}/admin/friend-links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success('友链删除成功');
        fetchFriendLinks();
      } else {
        message.error('友链删除失败');
      }
    } catch (error) {
      message.error('友链删除失败');
    }
  };

  // 编辑友链
  const handleEdit = (link: FriendLink) => {
    setEditingLink(link);
    form.setFieldsValue(link);
    setIsModalOpen(true);
  };

  // 新增友链
  const handleAdd = () => {
    setEditingLink(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 表格列定义
  const columns: ColumnsType<FriendLink> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: FriendLink) => (
        <Space>
          <LinkOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-500">
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
      render: (value: number) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'gmt_create',
      key: 'gmt_create',
      width: 180,
      render: (text: string) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record: FriendLink) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个友链吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增友链
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={friendLinks}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingLink ? '编辑友链' : '新增友链'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingLink(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="title"
            label="友链标题"
            rules={[
              { required: true, message: '请输入友链标题' },
              { max: 100, message: '标题长度不能超过100个字符' }
            ]}
          >
            <Input placeholder="请输入友链标题" />
          </Form.Item>

          <Form.Item
            name="url"
            label="友链地址"
            rules={[
              { required: true, message: '请输入友链地址' },
              { type: 'url', message: '请输入有效的URL地址' },
              { max: 500, message: 'URL长度不能超过500个字符' }
            ]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>

          <Form.Item
            name="description"
            label="友链描述"
            rules={[
              { max: 50, message: '描述长度不能超过50个字符' }
            ]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入友链描述（不超过50字）" 
              showCount 
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            name="sort_order"
            label="排序"
            initialValue={0}
          >
            <InputNumber 
              placeholder="数字越小排序越靠前" 
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FriendLinksPage;