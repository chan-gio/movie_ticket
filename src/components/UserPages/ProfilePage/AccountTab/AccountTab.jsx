import { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Form, Input, Button, Alert, Skeleton } from "antd";
import styles from "./AccountTab.module.scss";
import UserService from "../../../../services/UserService";

const { Title } = Typography;

const AccountTab = ({ userData, loading, onProfileUpdate }) => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Sync form fields with userData
  useEffect(() => {
    if (userData) {
      profileForm.setFieldsValue({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phone || "",
      });
    }
  }, [userData, profileForm]);

  const handleProfileUpdate = async (values) => {
    setIsProfileLoading(true);
    try {
      const updatedData = {
        full_name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        phone: values.phoneNumber,
      };

      const userId = localStorage.getItem("user_id");
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      await UserService.updateUser(userId, updatedData);

      setAlert({
        show: true,
        type: "success",
        message: "Profile updated successfully!",
      });

      // Trigger parent refresh
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.message || "Failed to update profile",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setIsPasswordLoading(true);
    try {
      const passwordData = {
        old_password: values.oldPassword,
        new_password: values.newPassword,
        new_password_confirmation: values.confirmPassword,
      };

      const userId = localStorage.getItem("user_id");
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      await UserService.changePassword(userId, passwordData);

      setAlert({
        show: true,
        type: "success",
        message: "Password changed successfully!",
      });
      passwordForm.resetFields();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.message || "Failed to change password",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.tabContent}>
        <Card className={styles.detailCard}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
        <Card className={styles.detailCard}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
        <Skeleton.Button active size="large" block />
      </div>
    );
  }

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
        <Title level={4}>Edit Profile</Title>
        <div className={styles.divider} />
        <Form
          form={profileForm}
          onFinish={handleProfileUpdate}
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please enter your first name" },
                  { min: 2, message: "First name is too short" },
                  { max: 30, message: "First name is too long" },
                ]}
              >
                <Input placeholder="Enter your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please enter your last name" },
                  { min: 2, message: "Last name is too short" },
                  { max: 30, message: "Last name is too long" },
                ]}
              >
                <Input placeholder="Enter your last name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                  { pattern: /^\d+$/, message: "Phone number must contain only digits" },
                ]}
              >
                <Input
                  addonBefore="+62"
                  placeholder="Enter your phone number"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isProfileLoading}
              block
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card className={styles.detailCard}>
        <Title level={4}>Change Password</Title>
        <div className={styles.divider} />
        <Form
          form={passwordForm}
          onFinish={handlePasswordChange}
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24}>
              <Form.Item
                label="Old Password"
                name="oldPassword"
                rules={[
                  { required: true, message: "Please enter your old password" },
                ]}
              >
                <Input.Password placeholder="Enter your old password" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24}>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter your new password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password placeholder="Enter your new password" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm your new password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm your new password" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPasswordLoading}
              block
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AccountTab;