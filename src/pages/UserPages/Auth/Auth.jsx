import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Form, Input, Button, Checkbox, Row, Col, Alert, Modal, Space } from 'antd';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import styles from './Auth.module.scss';

const { TabPane } = Tabs;

const logo = 'https://via.placeholder.com/150x50?text=Tickitz'; // Replace with actual logo

function Auth() {
  const [form] = Form.useForm();
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  const handleSubmit = (values) => {
    setIsLoading(true);
    // Mock submission
    setTimeout(() => {
      setAlert({
        show: true,
        type: 'success',
        message: 'Submission successful! You can now log in.',
      });
      setIsLoading(false);
      form.resetFields();
    }, 1000);
  };

  const handleForgotPasswordSubmit = (values) => {
    setIsLoading(true);
    // Mock submission
    setTimeout(() => {
      setAlert({
        show: true,
        type: 'success',
        message: 'A reset link has been sent to your email.',
      });
      setIsLoading(false);
      setForgotPasswordVisible(false);
    }, 1000);
  };

  return (
    <div className={styles.auth}>
      <Row>
        <Col xs={0} md={7} className={styles.leftContainer}>
          <div className={styles.leftContent}>
            <img src={logo} alt="Tickitz Logo" className={styles.logo} />
            <p className={styles.tagline}>wait, watch, wow!</p>
            <p className={styles.subTagline}>Lets build your account</p>
            <ul className={styles.steps}>
              <li>
                <span className={`${styles.stepCircle} ${styles.active}`}>1</span>
                <span className={styles.stepText}>Fill your details</span>
              </li>
              <li>
                <span className={styles.stepCircle}>2</span>
                <span className={styles.stepText}>Activate your account</span>
              </li>
              <li>
                <span className={styles.stepCircle}>3</span>
                <span className={styles.stepText}>Done</span>
              </li>
            </ul>
          </div>
        </Col>
        <Col xs={24} md={17} className={styles.rightContainer}>
          <Tabs defaultActiveKey="signin">
            <TabPane tab="Sign In" key="signin">
              <h1 className={styles.title}>Sign In</h1>
              <p className={styles.subtitle}>
                Sign in with your data that you entered during your registration
              </p>
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
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Required' },
                    { type: 'email', message: 'Invalid email' },
                  ]}
                >
                  <Input placeholder="Write your email" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Password is required' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                  ]}
                >
                  <Input.Password placeholder="Write your password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}
                    className={styles.submitButton}
                  >
                    Sign In
                  </Button>
                </Form.Item>
                <p className={styles.linkText}>
                  Forgot your password?{' '}
                  <a onClick={() => setForgotPasswordVisible(true)}>Reset now</a>
                </p>
              </Form>
              <div className={styles.divider}>
                <span>or</span>
              </div>
              <Space className={styles.socialButtons}>
                <Button icon={<GoogleOutlined />} className={styles.socialButton}>
                  Google
                </Button>
                <Button icon={<FacebookOutlined />} className={styles.socialButton}>
                  Facebook
                </Button>
              </Space>
            </TabPane>
            <TabPane tab="Sign Up" key="signup">
              <h1 className={styles.title}>Sign Up</h1>
              <p className={styles.subtitle}>
                Fill your additional details
              </p>
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
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Required' },
                    { type: 'email', message: 'Invalid email' },
                  ]}
                >
                  <Input placeholder="Write your email" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Password is required' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                  ]}
                >
                  <Input.Password placeholder="Write your password" />
                </Form.Item>
                <Form.Item
                  name="terms"
                  valuePropName="checked"
                  rules={[
                    { required: true, message: 'You must agree to the terms' },
                  ]}
                >
                  <Checkbox>I agree to terms & conditions</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}
                    className={styles.submitButton}
                  >
                    Join for free now
                  </Button>
                </Form.Item>
                <p className={styles.linkText}>
                  Do you already have an account? <Link to="/auth">Log in</Link>
                </p>
              </Form>
              <div className={styles.divider}>
                <span>or</span>
              </div>
              <Space className={styles.socialButtons}>
                <Button icon={<GoogleOutlined />} className={styles.socialButton}>
                  Google
                </Button>
                <Button icon={<FacebookOutlined />} className={styles.socialButton}>
                  Facebook
                </Button>
              </Space>
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {/* Forgot Password Modal */}
      <Modal
        title="Fill your complete email"
        visible={forgotPasswordVisible}
        onCancel={() => setForgotPasswordVisible(false)}
        footer={null}
      >
        <p className={styles.subtitle}>
          We'll send a link to your email shortly
        </p>
        <Form onFinish={handleForgotPasswordSubmit} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Required' },
              { type: 'email', message: 'Invalid email' },
            ]}
          >
            <Input placeholder="Write your email" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className={styles.submitButton}
            >
              Activate now
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Auth;