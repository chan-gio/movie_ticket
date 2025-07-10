import React, { useState } from 'react';
import { Input, Button, Modal, Form, Typography, Divider, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../Context/AuthContext';
import UserService from '../../../services/UserService';
import styles from './LoginPage.module.scss';
import { toastSuccess, toastError } from '../../../utils/toastNotifier';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuthContext();
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  // State for Forgot Password input
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Handle Sign In submission
  const handleSignInSubmit = async values => {
    setIsLoading(true);
    try {
      const response = await login(values);
      const { user } = response;
      localStorage.setItem('user_id', user.user_id);
      localStorage.setItem('profile_picture_url', user.profile_picture_url);
      toastSuccess('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Sign In Error:', error);
      toastError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up submission
  const handleSignUpSubmit = async values => {
    setIsLoading(true);
    try {
      const signupData = {
        username: values.username,
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        dob: values.dob,
        phone: values.phone
      };

      await register(signupData);
      toastSuccess('Registration successful! Please sign in.');

      // Reset signup form
      signupForm.resetFields();

      // Switch to login tab
      navigate('/login', { state: { activeTab: 'signin' } });
    } catch (error) {
      console.error('Sign Up Error:', error);
      toastError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotPasswordSubmit = async () => {
    setIsLoading(true);
    try {
      if (!forgotPasswordEmail) {
        throw new Error('Please enter your email');
      }
      if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
        throw new Error('Please enter a valid email');
      }

      await UserService.forgotPassword(forgotPasswordEmail);
      toastSuccess('A new password has been sent to your email.');
      setForgotPasswordVisible(false);
      setForgotPasswordEmail('');
    } catch (error) {
      console.error('Forgot Password Error:', error);
      toastError(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change to clear forms
  const handleTabChange = () => {
    loginForm.resetFields();
    signupForm.resetFields();
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logoSection}>
            <img src="/assets/logo.svg" alt="Logo" className={styles.logo} />
            <Title level={2} className={styles.title}>
              Welcome to Movie Ticket
            </Title>
            <Text className={styles.subtitle}>Sign in to your account or create a new one</Text>
          </div>

          <Tabs defaultActiveKey="signin" onChange={handleTabChange} className={styles.tabs}>
            <TabPane tab="Sign In" key="signin">
              <Form form={loginForm} name="login" onFinish={handleSignInSubmit} layout="vertical" className={styles.loginForm}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input placeholder="Enter your email" size="large" className={styles.input} />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                  ]}
                >
                  <Input.Password placeholder="Enter your password" size="large" className={styles.input} />
                </Form.Item>

                <Form.Item className={styles.forgotPassword}>
                  <Button type="link" onClick={() => setForgotPasswordVisible(true)} className={styles.forgotPasswordLink}>
                    Forgot Password?
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isLoading} block size="large" className={styles.loginButton}>
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Sign Up" key="signup">
              <Form form={signupForm} name="signup" onFinish={handleSignUpSubmit} layout="vertical" className={styles.signupForm}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: 'Please enter your username!' },
                    { min: 3, message: 'Username must be at least 3 characters!' }
                  ]}
                >
                  <Input placeholder="Enter your username" size="large" className={styles.input} />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input placeholder="Enter your email" size="large" className={styles.input} />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                  ]}
                >
                  <Input.Password placeholder="Enter your password" size="large" className={styles.input} />
                </Form.Item>

                <Form.Item name="full_name" label="Full Name" rules={[{ required: true, message: 'Please enter your full name!' }]}>
                  <Input placeholder="Enter your full name" size="large" className={styles.input} />
                </Form.Item>

                <Form.Item name="dob" label="Date of Birth" rules={[{ required: true, message: 'Please enter your date of birth!' }]}>
                  <Input type="date" size="large" className={styles.input} />
                </Form.Item>

                <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                  <Input placeholder="Enter your phone number" size="large" className={styles.input} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isLoading} block size="large" className={styles.signupButton}>
                    Sign Up
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal title="Forgot Password" open={forgotPasswordVisible} onCancel={() => setForgotPasswordVisible(false)} footer={null} className={styles.forgotPasswordModal}>
        <div className={styles.modalContent}>
          <Text className={styles.modalDescription}>Enter your email address and we'll send you a new password.</Text>
          <div className={styles.modalForm}>
            <Input placeholder="Enter your email" value={forgotPasswordEmail} onChange={e => setForgotPasswordEmail(e.target.value)} size="large" className={styles.modalInput} />
            <Button type="primary" onClick={handleForgotPasswordSubmit} loading={isLoading} block size="large" className={styles.modalButton}>
              Reset Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
