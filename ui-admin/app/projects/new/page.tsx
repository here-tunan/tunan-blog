'use client';

import React, { useState } from 'react';
import { Form, Input, Switch, InputNumber, Button, message, Space, Tag } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';

const { TextArea } = Input;

interface ProjectForm {
  name: string;
  description: string;
  github_url: string;
  demo_url: string;
  tech_stack: string[];
  featured: boolean;
  sort_order: number;
}

const NewProjectPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const router = useRouter();

  const handleSubmit = async (values: ProjectForm) => {
    setLoading(true);
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      message.error('Authentication token not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const projectData = {
        name: values.name,
        description: values.description,
        githubUrl: values.github_url,
        demoUrl: values.demo_url,
        techStack: JSON.stringify(techStack),
        featured: values.featured,
        sortOrder: values.sort_order,
      };

      const response = await fetch(`${API_URL}/admin/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const result = await response.json();
      if (result.success) {
        message.success('Project created successfully!');
        router.push('/projects');
      } else {
        throw new Error(result.error || 'Failed to create project');
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleTechInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTech();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <h2 className="text-xl font-semibold mb-0">Create New Project</h2>
      </div>

      <div className="max-w-2xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            featured: false,
            sort_order: 0,
          }}
        >
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please input project name!' }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input project description!' }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe your project..."
            />
          </Form.Item>

          <Form.Item
            name="github_url"
            label="GitHub URL"
            rules={[
              { required: true, message: 'Please input GitHub URL!' },
              { type: 'url', message: 'Please enter a valid URL!' }
            ]}
          >
            <Input placeholder="https://github.com/username/repository" />
          </Form.Item>

          <Form.Item
            name="demo_url"
            label="Demo URL (Optional)"
            rules={[{ type: 'url', message: 'Please enter a valid URL!' }]}
          >
            <Input placeholder="https://your-demo-site.com" />
          </Form.Item>

          <Form.Item label="Tech Stack">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={handleTechInputKeyPress}
                  placeholder="Add technology (e.g., React, Node.js)"
                  style={{ flex: 1 }}
                />
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={addTech}
                  disabled={!techInput.trim()}
                >
                  Add
                </Button>
              </div>
              
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => removeTech(tech)}
                      color="blue"
                    >
                      {tech}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item
            name="featured"
            label="Featured Project"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="sort_order"
            label="Sort Order"
            tooltip="Lower numbers appear first"
          >
            <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Project
              </Button>
              <Button onClick={() => router.back()}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default NewProjectPage;