'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Spin } from 'antd';
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

const PathLeaderboard = () => {
  const [data, setData] = useState<PathViewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        // No need to show error message here as the main page will handle it
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
        message.error('Could not load path leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: '24px' }}>
      <Title level={5}>Page View Leaderboard</Title>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={data} rowKey="path" size="small" />
      </Spin>
    </div>
  );
};

export default PathLeaderboard;
