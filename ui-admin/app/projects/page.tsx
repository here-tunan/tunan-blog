'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Switch, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { TablePaginationConfig, TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { apiRequestJson } from '@/lib/api';

interface Project {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  techStack: string;
  featured: boolean;
  sortOrder: number;
  gmtCreate: string;
  gmtModified: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `Total ${total} projects`,
  });
  const router = useRouter();

  const columns: TableProps<Project>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.description && (
            <div className="text-gray-500 text-sm mt-1 truncate max-w-xs">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Links',
      key: 'links',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.githubUrl && (
            <a href={record.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
              GitHub
            </a>
          )}
          {record.demoUrl && (
            <a href={record.demoUrl} target="_blank" rel="noopener noreferrer" className="text-green-600">
              Demo
            </a>
          )}
        </Space>
      ),
    },
    {
      title: 'Tech Stack',
      dataIndex: 'techStack',
      key: 'techStack',
      render: (techStack) => {
        if (!techStack) return null;
        try {
          const technologies = JSON.parse(techStack);
          return (
            <Space wrap>
              {technologies.slice(0, 3).map((tech: string, index: number) => (
                <Tag key={index} color="blue" className="text-xs">
                  {tech}
                </Tag>
              ))}
              {technologies.length > 3 && (
                <Tag color="default" className="text-xs">
                  +{technologies.length - 3}
                </Tag>
              )}
            </Space>
          );
        } catch {
          return null;
        }
      },
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured, record) => (
        <Switch
          checked={featured}
          onChange={(checked) => handleToggleFeatured(record.id, checked)}
        />
      ),
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      sorter: (a, b) => a.sortOrder - b.sortOrder,
    },
    {
      title: 'Created',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/projects/view/${record.id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/projects/edit/${record.id}`)}
          />
          <Popconfirm
            title="Delete Project"
            description="Are you sure you want to delete this project?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchProjects = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const result = await apiRequestJson(`/admin/projects?page=${page}&pageSize=${pageSize}`);
      if (result.success) {
        setProjects(result.data || []);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: result.total || 0,
        }));
      }
    } catch (error) {
      console.error(error);
      message.error('Could not load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (id: number, featured: boolean) => {
    try {
      const project = projects.find(p => p.id === id);
      if (!project) return;

      await apiRequestJson(`/admin/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...project,
          featured,
        }),
      });

      setProjects(prev => prev.map(p =>
        p.id === id ? { ...p, featured } : p
      ));
      message.success('Project updated successfully');
    } catch (error) {
      console.error(error);
      message.error('Failed to update project');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiRequestJson(`/admin/projects/${id}`, {
        method: 'DELETE',
      });

      message.success('Project deleted successfully');
      fetchProjects(pagination.current || 1, pagination.pageSize || 10);
    } catch (error) {
      console.error(error);
      message.error('Failed to delete project');
    }
  };

  useEffect(() => {
    fetchProjects(pagination.current || 1, pagination.pageSize || 10);
  }, []);

  const handleTableChange = (nextPagination: TablePaginationConfig) => {
    fetchProjects(nextPagination.current || 1, nextPagination.pageSize || 10);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/projects/new')}
        >
          New Project
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ProjectsPage;