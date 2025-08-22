'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Spin, Button, Card, Space } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { API_URL } from '@/lib/config';

const { Title } = Typography;

interface PathViewData {
  path: string;
  views: number;
}

const columns: TableProps<PathViewData>['columns'] = [
  {
    title: 'Path',
    dataIndex: 'path',
    key: 'path',
    sorter: (a, b) => a.path.localeCompare(b.path),
  },
  {
    title: 'Views',
    dataIndex: 'views',
    key: 'views',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.views - b.views,
  },
];

const DashboardPage = () => {
  const [data, setData] = useState<PathViewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [rssLoading, setRssLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        message.error('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/admin/analytics/path-views`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error(error);
        message.error('Could not load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateRSS = async () => {
    setRssLoading(true);
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      message.error('Authentication token not found. Please log in again.');
      setRssLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/rss/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate RSS');
      }

      const result = await response.json();
      message.success(result.message || 'RSS feed generated successfully!');
    } catch (error) {
      console.error(error);
      message.error('Failed to generate RSS feed.');
    } finally {
      setRssLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Analytics Dashboard</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="RSS Management" size="small">
          <Space>
            <Button 
              type="primary" 
              icon={<CloudDownloadOutlined />}
              loading={rssLoading}
              onClick={handleGenerateRSS}
            >
              Generate RSS Feed
            </Button>
            <Button 
              type="link" 
              href="/rss.xml" 
              target="_blank"
            >
              View Current RSS
            </Button>
          </Space>
        </Card>

        <Card title="Page Views Analytics" size="small">
          <Spin spinning={loading}>
            <Table columns={columns} dataSource={data} rowKey="path" />
          </Spin>
        </Card>
      </Space>
    </div>
  );
};

export default DashboardPage;