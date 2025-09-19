'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Spin, Button, Card, Space } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { apiRequestJson } from '@/lib/api';

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
      try {
        const result = await apiRequestJson<PathViewData[]>('/admin/analytics/path-views');
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

    try {
      const result = await apiRequestJson('/admin/rss/generate', {
        method: 'POST',
      });
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