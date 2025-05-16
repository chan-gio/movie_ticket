import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Form, Input, DatePicker, Button, message, Typography, Switch } from 'antd';
import styles from './AdminManageCouponForm.module.scss';
import '../GlobalStyles.module.scss';
import moment from 'moment';

const { Title, Text } = Typography;

// Mock API call to fetch a single coupon
const fetchCouponById = async (id) => {
  const coupons = [
    { coupon_id: 'cp1', code: 'DISCOUNT10', discount: 10, expiry_date: '2025-12-31T23:59:59', is_active: true },
    { coupon_id: 'cp2', code: 'SUMMER20', discount: 20, expiry_date: '2025-06-30T23:59:59', is_active: false },
  ];
  return coupons.find(coupon => coupon.coupon_id === id);
};

// Mock API call to fetch all coupons
const fetchCoupons = async () => {
  return [
    { coupon_id: 'cp1', code: 'DISCOUNT10', discount: 10, expiry_date: '2025-12-31T23:59:59', is_active: true },
    { coupon_id: 'cp2', code: 'SUMMER20', discount: 20, expiry_date: '2025-06-30T23:59:59', is_active: false },
  ];
};

function AdminManageCouponForm({ isEditMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [couponForm] = Form.useForm();
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedCoupons = await fetchCoupons();
      setCoupons(fetchedCoupons);
      if (isEditMode) {
        const coupon = await fetchCouponById(id);
        if (coupon) {
          setEditingCoupon(coupon);
          couponForm.setFieldsValue({
            ...coupon,
            expiry_date: coupon.expiry_date ? moment(coupon.expiry_date) : null,
          });
        }
      }
    };
    loadData();
  }, [id, isEditMode, couponForm]);

  const handleAddCoupon = (values) => {
    const newCoupon = {
      coupon_id: `cp${coupons.length + 1}`,
      ...values,
      expiry_date: values.expiry_date.format('YYYY-MM-DDTHH:mm:ss'),
    };
    setCoupons([...coupons, newCoupon]);
    couponForm.resetFields();
    navigate('/admin/manage_coupon');
    message.success('Coupon added successfully');
  };

  const handleEditCoupon = (values) => {
    setCoupons(coupons.map(coupon => (coupon.coupon_id === editingCoupon.coupon_id ? {
      ...coupon,
      ...values,
      expiry_date: values.expiry_date.format('YYYY-MM-DDTHH:mm:ss'),
    } : coupon)));
    setEditingCoupon(null);
    couponForm.resetFields();
    navigate('/admin/manage_coupon');
    message.success('Coupon updated successfully');
  };

  return (
    <div>
      <Title level={3}>{isEditMode ? 'Edit Coupon' : 'Add Coupon'}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Form
              form={couponForm}
              layout="vertical"
              onFinish={isEditMode ? handleEditCoupon : handleAddCoupon}
            >
              <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Enter coupon code" />
              </Form.Item>
              <Form.Item label="Discount (%)" name="discount" rules={[{ required: true, message: 'Required' }, { type: 'number', min: 0, max: 100, message: 'Must be between 0 and 100' }]}>
                <Input type="number" placeholder="Enter discount percentage" />
              </Form.Item>
              <Form.Item label="Expiry Date" name="expiry_date" rules={[{ required: true, message: 'Required' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Active" name="is_active" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Button type="primary" htmlType="submit">{isEditMode ? 'Update Coupon' : 'Add Coupon'}</Button>
              <Button onClick={() => navigate('/admin/manage_coupon')} style={{ marginLeft: 8 }}>Cancel</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <Title level={4}>Coupon Preview</Title>
            <Text><strong>Code:</strong> {couponForm.getFieldValue('code') || 'Not Set'}</Text><br />
            <Text><strong>Discount:</strong> {couponForm.getFieldValue('discount') || 'Not Set'}%</Text><br />
            <Text><strong>Expiry Date:</strong> {couponForm.getFieldValue('expiry_date')?.format('YYYY-MM-DD HH:mm:ss') || 'Not Set'}</Text><br />
            <Text><strong>Active:</strong> {couponForm.getFieldValue('is_active') ? 'Yes' : 'No'}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default AdminManageCouponForm;