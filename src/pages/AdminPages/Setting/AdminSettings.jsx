import { useState } from 'react';
import { Card, Form, Input, Select, Button, Typography, message, Row, Col, Space, Spin } from 'antd';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';
import styles from './AdminSettings.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

function AdminSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true);
    // Simulate API call to save settings
    setTimeout(() => {
      console.log('Settings updated:', values);
      message.success('Settings saved successfully');
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    form.resetFields();
    message.info('Form reset to initial values');
  };

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Settings
          </Title>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={24}>
          <Card className={styles.card}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                siteName: 'Tickitz',
                emailNotifications: true,
              }}
            >
              <Title level={4} className={styles.sectionTitle}>
                General Settings
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span className={styles.label}>Site Name</span>}
                    name="siteName"
                    rules={[{ required: true, message: 'Please enter the site name' }]}
                  >
                    <Input placeholder="Enter site name" className={styles.input} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span className={styles.label}>Enable Email Notifications</span>}
                    name="emailNotifications"
                  >
                    <Select className={styles.select}>
                      <Option value={true}>Yes</Option>
                      <Option value={false}>No</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="end" className={styles.formActions}>
                <Space>
                  <Button
                    icon={<UndoOutlined />}
                    onClick={handleReset}
                    className={styles.resetButton}
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    htmlType="submit"
                    loading={loading}
                    className={styles.saveButton}
                  >
                    Save Settings
                  </Button>
                </Space>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminSettings;