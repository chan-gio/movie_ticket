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
  InputNumber,
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

  // Watch form field values for real-time preview updates
  const code = Form.useWatch("code", couponForm);
  const description = Form.useWatch("description", couponForm);
  const discount = Form.useWatch("discount", couponForm);
  const expiryDate = Form.useWatch("expiry_date", couponForm);
  const isActive = Form.useWatch("is_active", couponForm);
  const isUsed = Form.useWatch("is_used", couponForm);
  const quantity = Form.useWatch("quantity", couponForm);

  useEffect(() => {
    if (isEditMode) {
      loadCouponData();
    } else {
      couponForm.setFieldsValue({ 
        is_active: true, // Default for new coupons
        is_used: 0, // Default for new coupons
        quantity: 1, // Default for new coupons
      });
    }
  }, [id, isEditMode, couponForm]);

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
        expiry_date: values.expiry_date.format("YYYY-MM-DD"),
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
        expiry_date: values.expiry_date.format("YYYY-MM-DD"),
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
                  label="Description"
                  name="description"
                >
                  <Input.TextArea rows={4} placeholder="Enter coupon description" />
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
                  normalize={(value) => (value ? Number(value) : value)}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    placeholder="Enter discount percentage"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  label="Expiry Date"
                  name="expiry_date"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                  label="Active"
                  name="is_active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label="Usage Count"
                  name="is_used"
                  rules={[
                    { required: true, message: "Required" },
                    {
                      type: "number",
                      min: 0,
                      message: "Must be 0 or greater",
                    },
                  ]}
                  normalize={(value) => (value ? Number(value) : value)}
                >
                  <InputNumber
                    min={0}
                    placeholder="Enter number of times used"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  label="Quantity (Max Uses)"
                  name="quantity"
                  rules={[
                    { required: true, message: "Required" },
                    {
                      type: "number",
                      min: 1,
                      message: "Must be 1 or greater",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const isUsedValue = getFieldValue("is_used");
                        if (value >= isUsedValue) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Quantity must be greater than or equal to Usage Count"));
                      },
                    }),
                  ]}
                  normalize={(value) => (value ? Number(value) : value)}
                >
                  <InputNumber
                    min={1}
                    placeholder="Enter maximum number of uses"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {isEditMode ? "Update Coupon" : "Add Coupon"}
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/manage_coupon")}
                    style={{ marginLeft: 8 }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card className={styles.card}>
              <Title level={4}>Coupon Preview</Title>
              <Text>
                <strong>Code:</strong> {code || "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Description:</strong> {description || "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Discount:</strong>{" "}
                {discount ? `${discount}%` : "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Expiry Date:</strong>{" "}
                {expiryDate?.format("YYYY-MM-DD") || "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Active:</strong> {isActive ? "Yes" : "No"}
              </Text>
              <br />
              <Text>
                <strong>Usage Count:</strong> {isUsed !== undefined ? isUsed : "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Quantity (Max Uses):</strong> {quantity !== undefined ? quantity : "Not Set"}
              </Text>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default AdminManageCouponForm;