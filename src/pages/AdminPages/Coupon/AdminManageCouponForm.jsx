import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  message,
  Typography,
  Switch,
  Spin,
} from "antd";
import styles from "./AdminManageCouponForm.module.scss";
import "../GlobalStyles.module.scss";
import moment from "moment";
import CouponService from "../../../services/CouponService";

const { Title, Text } = Typography;

function AdminManageCouponForm({ isEditMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [couponForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadCouponData();
    }
  }, [id, isEditMode]);

  const loadCouponData = async () => {
    setLoading(true);
    try {
      const coupon = await CouponService.getCouponById(id);
      if (coupon) {
        couponForm.setFieldsValue({
          ...coupon,
          expiry_date: coupon.expiry_date ? moment(coupon.expiry_date) : null,
        });
      }
    } catch (error) {
      message.error(error.message || "Failed to load coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (values) => {
    try {
      const couponData = {
        ...values,
        expiry_date: values.expiry_date.format("YYYY-MM-DDTHH:mm:ss"),
      };
      await CouponService.createCoupon(couponData);
      couponForm.resetFields();
      navigate("/admin/manage_coupon");
      message.success("Coupon added successfully");
    } catch (error) {
      message.error(error.message || "Failed to create coupon");
    }
  };

  const handleEditCoupon = async (values) => {
    try {
      const couponData = {
        ...values,
        expiry_date: values.expiry_date.format("YYYY-MM-DDTHH:mm:ss"),
      };
      await CouponService.updateCoupon(id, couponData);
      couponForm.resetFields();
      navigate("/admin/manage_coupon");
      message.success("Coupon updated successfully");
    } catch (error) {
      message.error(error.message || "Failed to update coupon");
    }
  };

  return (
    <div>
      <Title level={3}>{isEditMode ? "Edit Coupon" : "Add Coupon"}</Title>
      {loading && isEditMode ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card className={styles.card}>
              <Form
                form={couponForm}
                layout="vertical"
                onFinish={isEditMode ? handleEditCoupon : handleAddCoupon}
              >
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Enter coupon code" />
                </Form.Item>
                <Form.Item
                  label="Discount (%)"
                  name="discount"
                  rules={[
                    { required: true, message: "Required" },
                    {
                      type: "number",
                      min: 0,
                      max: 100,
                      message: "Must be between 0 and 100",
                    },
                  ]}
                  normalize={(value) => (value ? Number(value) : value)} // Fix: Convert string to number
                >
                  <Input
                    type="number"
                    placeholder="Enter discount percentage"
                  />
                </Form.Item>
                <Form.Item
                  label="Expiry Date"
                  name="expiry_date"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <DatePicker showTime style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  label="Active"
                  name="is_active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {isEditMode ? "Update Coupon" : "Add Coupon"}
                </Button>
                <Button
                  onClick={() => navigate("/admin/manage_coupon")}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
                </Button>
              </Form>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card className={styles.card}>
              <Title level={4}>Coupon Preview</Title>
              <Text>
                <strong>Code:</strong>{" "}
                {couponForm.getFieldValue("code") || "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Discount:</strong>{" "}
                {couponForm.getFieldValue("discount") || "Not Set"}%
              </Text>
              <br />
              <Text>
                <strong>Expiry Date:</strong>{" "}
                {couponForm
                  .getFieldValue("expiry_date")
                  ?.format("YYYY-MM-DD HH:mm:ss") || "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Active:</strong>{" "}
                {couponForm.getFieldValue("is_active") ? "Yes" : "No"}
              </Text>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default AdminManageCouponForm;
