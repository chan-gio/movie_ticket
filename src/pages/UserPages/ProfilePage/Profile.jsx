import { useState } from 'react';
import { Card, Row, Col, Avatar, Typography, Progress, Tabs, Form, Input, Button, Tag, Select, Alert, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './Profile.module.scss';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '1234567890',
  picture: null, // Set to null to use default avatar
  loyaltyPoints: 320,
};

const orderHistory = [
  {
    id: 1,
    date: 'Tuesday, 07 July 2020 - 04:30pm',
    movie: 'Spider-Man: Homecoming',
    cinemaLogo: 'https://via.placeholder.com/50x21?text=CineOne',
    status: 'active',
  },
  {
    id: 2,
    date: 'Monday, 14 June 2020 - 02:00pm',
    movie: 'Avengers: End Game',
    cinemaLogo: 'https://via.placeholder.com/50x43?text=EBV',
    status: 'used',
  },
  {
    id: 3,
    date: 'Monday, 10 March 2020 - 04:00pm',
    movie: 'Thor: Ragnarok',
    cinemaLogo: 'https://via.placeholder.com/50x43?text=EBV',
    status: 'used',
  },
];

function Profile() {
  const [form] = Form.useForm();
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = (values) => {
    setIsLoading(true);
    // Mock submission
    setTimeout(() => {
      setAlert({
        show: true,
        type: 'success',
        message: 'Profile updated successfully!',
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.profile}>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        {/* User Info */}
        <Col xs={24} md={8}>
          <Card className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <Paragraph className={styles.infoLabel}>INFO</Paragraph>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.0013 16.3333C15.29 16.3333 16.3346 15.2887 16.3346 14C16.3346 12.7113 15.29 11.6667 14.0013 11.6667C12.7126 11.6667 11.668 14C11.668 15.2887 12.7126 16.3333 14.0013 16.3333Z"
                  fill="#5F2EEA"
                />
                <path
                  d="M22.1654 16.3333C23.454 16.3333 24.4987 15.2887 24.4987 14C24.4987 12.7113 23.454 11.6667 22.1654 11.6667C20.8767 11.6667 19.832 14C19.832 15.2887 20.8767 16.3333 22.1654 16.3333Z"
                  fill="#5F2EEA"
                />
                <path
                  d="M5.83333 16.3333C7.122 16.3333 8.16667 15.2887 8.16667 14C8.16667 12.7113 7.122 11.6667 5.83333 11.6667C4.54467 11.6667 3.5 14C3.5 15.2887 4.54467 16.3333 5.83333 16.3333Z"
                  fill="#5F2EEA"
                />
              </svg>
            </div>
            <div className={styles.profileInfo}>
              <Avatar
                size={150}
                src={
                  userData.picture ||
                  'https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg'
                }
                icon={<UserOutlined />}
                className={styles.profileImage}
              />
              <Title level={4} className={styles.userName}>
                {userData.firstName} {userData.lastName}
              </Title>
              <Paragraph className={styles.userRole}>Moviegoers</Paragraph>
            </div>
            <div className={styles.divider} />
            <div className={styles.loyaltySection}>
              <Paragraph className={styles.loyaltyLabel}>Loyalty Points</Paragraph>
              <Card className={styles.loyaltyCard}>
                <Title level={5} className={styles.loyaltyTitle}>Moviegoers</Title>
                <Space>
                  <Paragraph className={styles.points}>{userData.loyaltyPoints}</Paragraph>
                  <Paragraph className={styles.pointsLabel}>points</Paragraph>
                </Space>
              </Card>
              <Paragraph className={styles.progressText}>
                180 points become a master
              </Paragraph>
              <Progress
                percent={(userData.loyaltyPoints / 500) * 100} // Assuming 500 points to become a master
                showInfo={false}
                strokeColor="#5f2eea"
                className={styles.progressBar}
              />
            </div>
          </Card>
        </Col>

        {/* Account Profile */}
        <Col xs={24} md={16}>
          <Card className={styles.accountCard}>
            <Tabs defaultActiveKey="settings" className={styles.tabs}>
              <TabPane tab="Account Settings" key="settings">
                <div className={styles.tabContent}>
                  {alert.show && (
                    <Alert
                      message={alert.message}
                      type={alert.type}
                      showIcon
                      closable
                      onClose={() => setAlert({ ...alert, show: false })}
                      className={styles.alert}
                    />
                  )}
                  <Card className={styles.detailCard}>
                    <Title level={4}>Details Information</Title>
                    <div className={styles.divider} />
                    <Form
                      form={form}
                      onFinish={handleUpdate}
                      layout="vertical"
                      initialValues={userData}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[
                              { required: true, message: 'Required' },
                              { min: 2, message: 'Too Short!' },
                              { max: 30, message: 'Too Long!' },
                            ]}
                          >
                            <Input placeholder="Write your first name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[
                              { required: true, message: 'Required' },
                              { min: 2, message: 'Too Short!' },
                              { max: 30, message: 'Too Long!' },
                            ]}
                          >
                            <Input placeholder="Write your last name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="E-mail"
                            name="email"
                            rules={[
                              { required: true, message: 'Required' },
                              { type: 'email', message: 'Invalid email' },
                            ]}
                          >
                            <Input placeholder="Write your email" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[
                              { required: true, message: 'Required' },
                              { pattern: /^\d+$/, message: 'Must be a number' },
                            ]}
                          >
                            <Input addonBefore="+62" placeholder="Write your phone number" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                  <Card className={styles.detailCard}>
                    <Title level={4}>Account and Privacy</Title>
                    <div className={styles.divider} />
                    <Form.Item
                      label="New Password"
                      name="newPassword"
                      rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
                    >
                      <Input.Password placeholder="Write your password" />
                    </Form.Item>
                    <Form.Item
                      label="Confirm Password"
                      name="confirmPassword"
                      dependencies={['newPassword']}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Confirm your password" />
                    </Form.Item>
                  </Card>
                  <Button
                    type="primary"
                    onClick={() => form.submit()}
                    loading={isLoading}
                    className={styles.updateButton}
                  >
                    Update Change
                  </Button>
                </div>
              </TabPane>
              <TabPane tab="Order History" key="history">
                <div className={styles.tabContent}>
                  {orderHistory.map((order) => (
                    <Card key={order.id} className={styles.orderCard}>
                      <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={18}>
                          <Paragraph className={styles.orderDate}>{order.date}</Paragraph>
                          <Title level={5}>{order.movie}</Title>
                        </Col>
                        <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                          <img src={order.cinemaLogo} alt="Cinema Logo" className={styles.cinemaLogo} />
                        </Col>
                      </Row>
                      <div className={styles.divider} />
                      <Row gutter={[16, 16]} align="middle">
                        <Col xs={12} md={4}>
                          <Tag
                            color={order.status === 'active' ? 'green' : 'gray'}
                            className={styles.ticketStatus}
                          >
                            Ticket {order.status}
                          </Tag>
                        </Col>
                        <Col xs={12} md={20} style={{ textAlign: 'right' }}>
                          <Select defaultValue="Show Details" className={styles.orderSelect}>
                            <Option value="Show Details">Show Details</Option>
                            <Option value="Jakarta">Jakarta</Option>
                            <Option value="Bandung">Bandung</Option>
                            <Option value="Surabaya">Surabaya</Option>
                          </Select>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;