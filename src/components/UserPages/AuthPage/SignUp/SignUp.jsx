import React from "react";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import styles from "./SignUp.module.scss";

const SignUp = ({ form, alert, setAlert, isLoading, handleSubmit }) => {
  return (
    <>
      <h1 className={styles.title}>Sign Up</h1>
      <p className={styles.subtitle}>Fill your additional details</p>
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
        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[{ required: true, message: "You must agree to the terms" }]}
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
      <div className={styles.socialButtons}>
        <Button icon={<GoogleOutlined />} className={styles.socialButton}>
          Google
        </Button>
        <Button icon={<FacebookOutlined />} className={styles.socialButton}>
          Facebook
        </Button>
      </div>
    </>
  );
};

export default SignUp;
