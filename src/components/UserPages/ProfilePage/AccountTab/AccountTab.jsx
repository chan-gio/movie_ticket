import { useState } from "react";
import { Card, Row, Col, Typography, Form, Input, Button, Alert } from "antd";
import styles from "./AccountTab.module.scss";

const { Title } = Typography;

const AccountTab = ({ userData }) => {
  const [form] = Form.useForm();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = (values) => {
    setIsLoading(true);
    setTimeout(() => {
      setAlert({
        show: true,
        type: "success",
        message: "Profile updated successfully!",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
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
                  { required: true, message: "Required" },
                  { min: 2, message: "Too Short!" },
                  { max: 30, message: "Too Long!" },
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
                  { required: true, message: "Required" },
                  { min: 2, message: "Too Short!" },
                  { max: 30, message: "Too Long!" },
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
                  { required: true, message: "Required" },
                  { type: "email", message: "Invalid email" },
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
                  { required: true, message: "Required" },
                  { pattern: /^\d+$/, message: "Must be a number" },
                ]}
              >
                <Input
                  addonBefore="+62"
                  placeholder="Write your phone number"
                />
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
          rules={[
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="Write your password" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
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
  );
};

export default AccountTab;
