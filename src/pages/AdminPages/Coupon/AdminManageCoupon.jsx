import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Statistic } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageCoupon.module.scss';
import '../GlobalStyles.module.scss';

const { Title } = Typography;

// Mock API call to fetch coupons
const fetchCoupons = async () => {
  // Simulate fetching data from the coupon table
  return [
    { coupon_id: 'cp1', code: 'DISCOUNT10', discount: 10, expiry_date: '2025-12-31T23:59:59', is_active: true },
    { coupon_id: 'cp2', code: 'SUMMER20', discount: 20, expiry_date: '2025-06-30T23:59:59', is_active: false },
  ];
};

function AdminManageCoupon() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchCoupons();
      setCoupons(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter(coupon => coupon.coupon_id !== id));
    message.success('Coupon deleted successfully');
  };

  const couponColumns = [
    { title: 'ID', dataIndex: 'coupon_id', key: 'coupon_id' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Discount (%)', dataIndex: 'discount', key: 'discount' },
    { title: 'Expiry Date', dataIndex: 'expiry_date', key: 'expiry_date' },
    { title: 'Active', dataIndex: 'is_active', key: 'is_active', render: (active) => (active ? 'Yes' : 'No') },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/manage_coupon/edit/${record.coupon_id}`)} />
          <Popconfirm
            title="Are you sure to delete this coupon?"
            onConfirm={() => handleDeleteCoupon(record.coupon_id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={3}>Manage Coupon</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <Statistic
              title="Total Coupons"
              value={coupons.length}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Button type="primary" onClick={() => navigate('/admin/manage_coupon/add')} style={{ marginBottom: 16 }}>
              Add Coupon
            </Button>
            <Table
              columns={couponColumns}
              dataSource={coupons}
              rowKey="coupon_id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageCoupon;