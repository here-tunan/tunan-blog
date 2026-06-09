'use client';

import React, { useMemo } from 'react';
import { Alert, Button, Card, Col, Form, Input, Radio, Row, Segmented, Select, Space, Tabs, Tag, Typography } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

interface ArticleEditorFormProps {
  initialValues?: any;
  onFinish: (values: any) => void;
  loading: boolean;
  tagOptions: { label: string; value: string }[];
}

const languages = [
  { key: 'zh-CN', label: '中文', description: 'Chinese' },
  { key: 'en', label: 'English', description: 'English' },
];

const ArticleEditorForm: React.FC<ArticleEditorFormProps> = ({ initialValues, onFinish, loading, tagOptions }) => {
  const [form] = Form.useForm();
  const defaultLanguageCode = Form.useWatch('defaultLanguageCode', form) || initialValues?.defaultLanguageCode || 'zh-CN';

  const handleFinish = (values: any) => {
    const defaultLanguage = values.defaultLanguageCode || 'zh-CN';
    const translations = languages
      .map((language) => ({
        languageCode: language.key,
        title: values.translations?.[language.key]?.title || '',
        slug: values.translations?.[language.key]?.slug || '',
        content: values.translations?.[language.key]?.content || '',
      }));

    const defaultTranslation = translations.find((translation) => translation.languageCode === defaultLanguage);

    onFinish({
      ...values,
      defaultLanguageCode: defaultLanguage,
      title: defaultTranslation?.title,
      slug: defaultTranslation?.slug,
      content: defaultTranslation?.content,
      translations,
    });
  };

  const tabItems = useMemo(() => languages.map((language) => {
    const isDefault = language.key === defaultLanguageCode;
    return {
      key: language.key,
      forceRender: true,
      label: (
        <Space size={6}>
          <span>{language.label}</span>
          {isDefault && <Tag color="blue">Default</Tag>}
        </Space>
      ),
      children: (
        <div style={{ paddingTop: 8 }}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={14}>
              <Form.Item
                name={['translations', language.key, 'title']}
                label="Title"
                rules={isDefault ? [{ required: true, message: 'Please input the default language title!' }] : []}
              >
                <Input placeholder={`${language.description} title`} />
              </Form.Item>
            </Col>

            <Col xs={24} md={10}>
              <Form.Item
                name={['translations', language.key, 'slug']}
                label="Slug"
                rules={isDefault ? [{ required: true, message: 'Please input the default language slug!' }] : []}
              >
                <Input placeholder="url-slug" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={['translations', language.key, 'content']}
            label="Content (Markdown)"
            rules={isDefault ? [{ required: true, message: 'Please input the default language content!' }] : []}
          >
            <TextArea
              rows={22}
              placeholder={`Write ${language.description} markdown content...`}
              style={{ resize: 'vertical', minHeight: 520 }}
            />
          </Form.Item>
        </div>
      ),
    };
  }), [defaultLanguageCode]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ defaultLanguageCode: 'zh-CN', type: 1, ...initialValues }}
      onFinish={handleFinish}
      style={{ maxWidth: 1180 }}
    >
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Card
          bordered={false}
          style={{ borderRadius: 18, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}
          bodyStyle={{ padding: 24 }}
        >
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} lg={10}>
              <Space direction="vertical" size={4}>
                <Text strong style={{ fontSize: 18 }}>Article Settings</Text>
                <Text type="secondary">Choose the article metadata and fallback language.</Text>
              </Space>
            </Col>

            <Col xs={24} lg={14}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={10}>
                  <Form.Item
                    name="defaultLanguageCode"
                    label="Default Language"
                    rules={[{ required: true, message: 'Please select the default language.' }]}
                  >
                    <Segmented
                      block
                      options={languages.map((language) => ({ label: language.label, value: language.key }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={14}>
                  <Form.Item
                    name="type"
                    label="Article Type"
                    rules={[{ required: true, message: 'Please select an article type!' }]}
                  >
                    <Radio.Group>
                      <Radio.Button value={1}>Blog</Radio.Button>
                      <Radio.Button value={2}>Weekly</Radio.Button>
                      <Radio.Button value={3}>Translation</Radio.Button>
                      <Radio.Button value={4}>History</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="tags" label="Tags">
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Select existing or create new tags" options={tagOptions} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Card
          bordered={false}
          style={{ borderRadius: 18, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}
          bodyStyle={{ padding: 24 }}
          title={
            <Space direction="vertical" size={2}>
              <Text strong style={{ fontSize: 18 }}>Content Versions</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>The selected default language is required. Other languages can be added later.</Text>
            </Space>
          }
        >
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="If a visitor opens a language version that does not exist, the article falls back to this article's default language."
          />

          <Tabs
            type="card"
            items={tabItems}
          />
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button type="primary" size="large" htmlType="submit" loading={loading}>
            Save Article
          </Button>
        </div>
      </Space>
    </Form>
  );
};

export default ArticleEditorForm;
