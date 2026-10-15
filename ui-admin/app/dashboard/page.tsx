'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Spin, Button, Card, Space } from 'antd';
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

  return (
    <div>
      <Title level={2}>Analytics Dashboard</Title>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="RSS" size="small">
          {/* RSS 是 /rss.xml 实时生成的,不再需要手动触发 */}
          <Button type="link" href="/rss.xml" target="_blank">
            View Current RSS
          </Button>
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