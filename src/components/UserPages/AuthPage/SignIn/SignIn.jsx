import React, { useState } from "react";
import { Form, Input, Button, Alert, Modal } from "antd";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import styles from "./SignIn.module.scss";

const SignIn = ({
  form,
  alert,
  setAlert,
  isLoading,
  setIsLoading,
  forgotPasswordVisible,
  setForgotPasswordVisible,
  handleSubmit,
  handleForgotPasswordSubmit,
}) => {
  return (
    <>
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
            { required: true, message: "Required" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input placeholder="Write your email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 6, message: "Password must be at least 6 characters" },
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
          Forgot your password?{" "}
          <a onClick={() => setForgotPasswordVisible(true)}>Reset now</a>
        </p>
      </Form>
      <div className={styles.divider}>
        <span>or</span>
      </div>
      <div className={styles.socialButtons}>
        <Button icon={<GoogleOutlined />} className={styles.socialButton}>
          Google
        </Button>
        <Button icon={<FacebookOutlined />} className={styles.socialButton}>
          Facebook
        </Button>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        title="Fill your complete email"
        open={forgotPasswordVisible}
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
              { required: true, message: "Required" },
              { type: "email", message: "Invalid email" },
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
    </>
  );
};

export default SignIn;
