'use client';

import React from 'react';
import { Form, Input, Button, Select, Rate } from 'antd';

const { TextArea } = Input;

interface BookEditorFormProps {
  initialValues?: any;
  onFinish: (values: any) => void;
  loading: boolean;
}

const BookEditorForm: React.FC<BookEditorFormProps> = ({ initialValues, onFinish, loading }) => {
  return (
    <Form
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input the book name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="author"
        label="Author"
        rules={[{ required: true, message: 'Please input the author!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="douban_link"
        label="Douban Link"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="score"
        label="My Score"
      >
        <Rate allowHalf={false} />
      </Form.Item>

      <Form.Item
        name="my_review"
        label="My Review"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Book
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookEditorForm;
