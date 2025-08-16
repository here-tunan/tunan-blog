'use client';

import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { Spin, Empty, Typography, Radio } from 'antd';
import { API_URL } from '@/lib/config';

const { Title } = Typography;

const ViewsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30); // Default to 30 days

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await fetch(`${API_URL}/admin/analytics/views?days=${days}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]); // Re-fetch when days changes

  const config = {
    data,
    xField: 'date',
    yField: 'views',
    xAxis: {
      label: {
        formatter: (text: string) => text.substring(5), // Show only MM-DD
      },
      tickCount: 5,
    },
    tooltip: {
      formatter: (datum) => {
        return { name: 'Views', value: datum.views, title: datum.date || 'Invalid Date' };
      },
    },
    smooth: true,
    height: 300,
  };

  if (error) {
    return <p>Error loading chart data: {error}</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={5} style={{ margin: 0 }}>Page Views</Title>
        <Radio.Group value={days} onChange={(e) => setDays(e.target.value)}>
          <Radio.Button value={7}>Last 7 Days</Radio.Button>
          <Radio.Button value={30}>Last 30 Days</Radio.Button>
          <Radio.Button value={365}>Last Year</Radio.Button>
        </Radio.Group>
      </div>
      <Spin spinning={loading}>
        {data.length > 0 ? <Line {...config} /> : <Empty description="No view data available for the selected period" />}
      </Spin>
      <details style={{ marginTop: '16px' }}>
        <summary>View Raw Chart Data (for debugging)</summary>
        <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
      </details>
    </div>
  );
};

export default ViewsChart;