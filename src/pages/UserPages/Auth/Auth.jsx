import React, { useState } from "react";
import { Tabs, Form, Row, Col, Input, Button, Alert, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import LeftContainer from "../../../components/UserPages/AuthPage/LeftContainer/LeftContainer";
import AuthService from "../../../services/AuthService";
import styles from "./Auth.module.scss";

const { TabPane } = Tabs;

const Auth = () => {
  const [form] = Form.useForm();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Handle Sign Up submission
  const handleSignUpSubmit = async (values) => {
    setIsLoading(true);
    try {
      const user = await AuthService.register(values);
      setAlert({
        show: true,
        type: "success",
        message: "Registration successful! You can now log in.",
      });
      form.resetFields();
      message.success("Registration successful! Please sign in.");
      // Switch to Sign In tab
      navigate('/auth', { state: { activeTab: "signin" } });
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.message || "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign In submission
  const handleSignInSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { token, user } = await AuthService.login(values);
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_id', user.user_id);
      setAlert({
        show: true,
        type: "success",
        message: "Login successful!",
      });
      navigate('/');
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.message || "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password submission (placeholder for now)
  const handleForgotPasswordSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Placeholder: Replace with actual AuthService.forgotPassword when implemented
      setTimeout(() => {
        setAlert({
          show: true,
          type: "success",
          message: "A reset link has been sent to your email.",
        });
        setForgotPasswordVisible(false);
      }, 1000);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.message || "Failed to send reset link",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change to clear alerts
  const handleTabChange = () => {
    setAlert({ show: false, type: "", message: "" });
    form.resetFields();
  };

  return (
    <div className={styles.auth}>
      <Row>
        <Col xs={0} md={7}>
          <LeftContainer />
        </Col>
        <Col xs={24} md={17} className={styles.rightContainer}>
          <Tabs defaultActiveKey="signin" onChange={handleTabChange}>
            <TabPane tab="Sign In" key="signin">
              <div>
                {alert.show && (
                  <Alert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                    style={{ marginBottom: 16 }}
                  />
                )}
                <Form form={form} onFinish={handleSignInSubmit} layout="vertical">
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading} block>
                      Sign In
                    </Button>
                  </Form.Item>
                  <Button type="link" onClick={() => setForgotPasswordVisible(true)}>
                    Forgot Password?
                  </Button>
                </Form>
                <Modal
                  title="Forgot Password"
                  open={forgotPasswordVisible}
                  onCancel={() => setForgotPasswordVisible(false)}
                  footer={null}
                >
                  <Form onFinish={handleForgotPasswordSubmit} layout="vertical">
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                    >
                      <Input placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={isLoading} block>
                        Send Reset Link
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
            </TabPane>
            <TabPane tab="Sign Up" key="signup">
              <div>
                {alert.show && (
                  <Alert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={() => setAlert({ show: false, type: "", message: "" })}
                    style={{ marginBottom: 16 }}
                  />
                )}
                <Form form={form} onFinish={handleSignUpSubmit} layout="vertical">
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username' }]}
                  >
                    <Input placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                  <Form.Item
                    label="Full Name"
                    name="full_name"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input placeholder="Full Name" />
                  </Form.Item>
                  <Form.Item
                    label="Date of Birth"
                    name="dob"
                    rules={[{ required: true, message: 'Please enter your date of birth' }]}
                  >
                    <Input type="date" />
                  </Form.Item>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input placeholder="Phone Number" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading} block>
                      Sign Up
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default Auth;