'use client';

import React from 'react';
import { Form, Input, Button, Select, Radio } from 'antd';

const { TextArea } = Input;

interface ArticleEditorFormProps {
  initialValues?: any;
  onFinish: (values: any) => void;
  loading: boolean;
  tagOptions: { label: string; value: string }[];
}

const ArticleEditorForm: React.FC<ArticleEditorFormProps> = ({ initialValues, onFinish, loading, tagOptions }) => {
  return (
    <Form
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input the title!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="slug"
        label="Slug"
        rules={[{ required: true, message: 'Please input the slug!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="tags"
        label="Tags"
      >
        <Select mode="tags" style={{ width: '100%' }} placeholder="Select existing or create new tags" options={tagOptions} />
      </Form.Item>

      <Form.Item
        name="type"
        label="Article Type"
        initialValue={1} // Default to Blog Post
        rules={[{ required: true, message: 'Please select an article type!' }]}
      >
        <Radio.Group>
          <Radio value={1}>Blog Post</Radio>
          <Radio value={2}>Weekly Report</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="content"
        label="Content (Markdown)"
        rules={[{ required: true, message: 'Please input the content!' }]}
      >
        <TextArea rows={20} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Article
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ArticleEditorForm;
