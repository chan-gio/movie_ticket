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
import dayjs from "dayjs";
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
        is_active: true,
        is_used: 0,
        quantity: 1,
      });
    }
  }, [id, isEditMode, couponForm]);

  const loadCouponData = async () => {
    setLoading(true);
    try {
      const coupon = await CouponService.getCouponById(id);
      if (coupon) {
        // Parse expiry_date with dayjs
        const expiryDateDayjs = coupon.expiry_date
          ? dayjs(coupon.expiry_date)
          : null;
        console.log(
          "Loaded expiry_date:",
          coupon.expiry_date,
          "Parsed:",
          expiryDateDayjs?.format("YYYY-MM-DD")
        );

        couponForm.setFieldsValue({
          ...coupon,
          expiry_date: expiryDateDayjs,
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
        expiry_date: values.expiry_date
          ? values.expiry_date.format("YYYY-MM-DD")
          : null,
      };
      console.log("Submitting couponData:", couponData);
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
        expiry_date: values.expiry_date
          ? values.expiry_date.format("YYYY-MM-DD")
          : null,
      };
      console.log("Submitting couponData:", couponData);
      await CouponService.updateCoupon(id, couponData);
      couponForm.resetFields();
      navigate("/admin/manage_coupon");
      message.success("Coupon updated successfully");
    } catch (error) {
      message.error(error.message || "Failed to update coupon");
    }
  };

  const disabledDate = (current) => {
    // Disable dates before today (June 1, 2025)
    return current && current < dayjs().startOf("day");
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
                  rules={[{ required: true, message: "Please enter the coupon code" }]}
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
                    { required: true, message: "Please enter the discount percentage" },
                    {
                      type: "number",
                      min: 0,
                      max: 100,
                      message: "Discount must be between 0 and 100",
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
                  rules={[{ required: true, message: "Please select an expiry date" }]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      console.log(
                        "DatePicker changed:",
                        value ? value.format("YYYY-MM-DD") : null
                      );
                    }}
                  />
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
                    { required: true, message: "Please enter the usage count" },
                    {
                      type: "number",
                      min: 0,
                      message: "Usage count must be 0 or greater",
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
                    { required: true, message: "Please enter the maximum uses" },
                    {
                      type: "number",
                      min: 1,
                      message: "Quantity must be 1 or greater",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const isUsedValue = getFieldValue("is_used");
                        if (value >= isUsedValue) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Quantity must be greater than or equal to Usage Count")
                        );
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
                {discount !== undefined ? `${discount}%` : "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Expiry Date:</strong>{" "}
                {expiryDate ? expiryDate.format("YYYY-MM-DD") : "Not Set"}
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