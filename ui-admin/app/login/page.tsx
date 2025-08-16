'use client';

import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: values.password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jwt_token', data.token);
        message.success('Login successful!');
        router.push('/dashboard');
      } else {
        message.error('Login failed. Please check your password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('An error occurred during login.');
    }
  };

  // Temporarily removed the full-screen centering div for debugging
  return (
    <Card title="Admin Login" style={{ width: 400, margin: '40px auto' }}>
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage;