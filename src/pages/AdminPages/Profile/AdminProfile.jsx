import { Row, Col, Card, Form, Input, Button, Avatar, Typography, Statistic } from 'antd';
import { UserOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import styles from './AdminProfile.module.scss';
import '../GlobalStyles.module.scss';

// Static Data
const adminProfile = {
  name: 'Admin User',
  email: 'admin@tickitz.com',
  role: 'Administrator',
  loginCount: 42,
  lastLogin: '2025-05-14',
};

const { Title, Text } = Typography;

function AdminProfile() {
  return (
    <div>
      <Title level={3}>Admin Profile</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={150}
                icon={<UserOutlined />}
                src="https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"
                className={styles.profileImage}
              />
              <Title level={4} style={{ marginTop: 16 }}>{adminProfile.name}</Title>
              <Text type="secondary">{adminProfile.role}</Text>
            </div>
            <div style={{ marginTop: 24 }}>
              <Statistic
                title="Login Count"
                value={adminProfile.loginCount}
                prefix={<SafetyOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Statistic
                title="Last Login"
                value={adminProfile.lastLogin}
                prefix={<MailOutlined />}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Form layout="vertical" onFinish={(values) => console.log('Profile updated:', values)}>
              <Form.Item label="Name" name="name" initialValue={adminProfile.name}>
                <Input placeholder="Admin User" />
              </Form.Item>
              <Form.Item label="Email" name="email" initialValue={adminProfile.email}>
                <Input placeholder="admin@tickitz.com" />
              </Form.Item>
              <Form.Item label="Role" name="role" initialValue={adminProfile.role}>
                <Input placeholder="Administrator" disabled />
              </Form.Item>
              <Button type="primary" htmlType="submit">Update Profile</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminProfile;