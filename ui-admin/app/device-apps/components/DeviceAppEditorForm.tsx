'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, InputNumber, Select } from 'antd';
import { API_URL } from '@/lib/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { TextArea } = Input;
const { Option } = Select;

interface DeviceAppFormData {
  name: string;
  category: string;
  description?: string;
  icon?: string;
  link?: string;
  sort_order: number;
}

interface DeviceAppEditorFormProps {
  id?: string;
}

const DeviceAppEditorForm: React.FC<DeviceAppEditorFormProps> = ({ id }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchDeviceApp();
    }
  }, [id]);

  const fetchDeviceApp = async () => {
    const token = localStorage.getItem('jwt_token');
    try {
      const response = await fetch(`${API_URL}/admin/device-apps/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch device app');
      }

      const data = await response.json();
      form.setFieldsValue(data);
    } catch (error) {
      console.error('Error fetching device app:', error);
      message.error('Failed to load device app');
    } finally {
      setInitialLoading(false);
    }
  };

  const onFinish = async (values: DeviceAppFormData) => {
    setLoading(true);
    const token = localStorage.getItem('jwt_token');

    try {
      const url = id 
        ? `${API_URL}/admin/device-apps/${id}`
        : `${API_URL}/admin/device-apps`;
      
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${id ? 'update' : 'create'} device app`);
      }

      message.success(`Device/App ${id ? 'updated' : 'created'} successfully!`);
      router.push('/device-apps');
    } catch (error) {
      console.error('Error saving device app:', error);
      message.error(`Failed to ${id ? 'update' : 'create'} device app`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Card title={id ? 'Edit Device/App' : 'Create New Device/App'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          sort_order: 0,
          category: 'Software',
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input placeholder="Enter device or app name" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select placeholder="Select category">
            <Option value="Hardware">Hardware</Option>
            <Option value="Software">Software</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <TextArea 
            rows={4} 
            placeholder="Enter description (optional)"
          />
        </Form.Item>

        <Form.Item
          label="Icon"
          name="icon"
        >
          <Input placeholder="Enter icon (emoji or URL)" />
        </Form.Item>

        <Form.Item
          label="Link"
          name="link"
        >
          <Input placeholder="Enter link URL (optional)" />
        </Form.Item>

        <Form.Item
          label="Sort Order"
          name="sort_order"
          rules={[{ required: true, message: 'Please input the sort order!' }]}
        >
          <InputNumber 
            min={0} 
            placeholder="Enter sort order"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <div className="flex gap-2">
            <Button type="primary" htmlType="submit" loading={loading}>
              {id ? 'Update' : 'Create'} Device/App
            </Button>
            <Link href="/device-apps">
              <Button>Cancel</Button>
            </Link>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DeviceAppEditorForm;