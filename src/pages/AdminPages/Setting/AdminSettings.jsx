import { Card, Form, Input, Select, Button, Typography } from 'antd';
import styles from './AdminSettings.module.scss';
import '../GlobalStyles.module.scss';

const { Title } = Typography;
const { Option } = Select;

function AdminSettings() {
  return (
    <div>
      <Title level={3}>Settings</Title>
      <Card className={styles.card}>
        <Form layout="vertical" onFinish={(values) => console.log('Settings updated:', values)}>
          <Form.Item label="Site Name" name="siteName" initialValue="Tickitz">
            <Input placeholder="Tickitz" />
          </Form.Item>
          <Form.Item label="Enable Email Notifications" name="emailNotifications" initialValue={true}>
            <Select>
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">Save Settings</Button>
        </Form>
      </Card>
    </div>
  );
}

export default AdminSettings;