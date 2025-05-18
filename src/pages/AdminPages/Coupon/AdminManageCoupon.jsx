import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Statistic, Spin, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './AdminManageCoupon.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;

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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (error) {
      message.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter(coupon => coupon.coupon_id !== id));
    message.success('Coupon deleted successfully');
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const couponColumns = [
    {
      title: 'ID',
      dataIndex: 'coupon_id',
      key: 'coupon_id',
      sorter: (a, b) => a.coupon_id.localeCompare(b.coupon_id),
      render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discount',
      key: 'discount',
      sorter: (a, b) => a.discount - b.discount,
      render: discount => <TypographyText type="success">{discount}%</TypographyText>,
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: date => {
        const expiryDate = new Date(date);
        const isExpired = expiryDate < new Date();
        return (
          <TypographyText type={isExpired ? 'danger' : 'secondary'}>
            {formatDateTime(date)}
          </TypographyText>
        );
      },
      sorter: (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date),
    },
    {
      title: 'Active',
      dataIndex: 'is_active',
      key: 'is_active',
      sorter: (a, b) => Number(a.is_active) - Number(b.is_active),
      render: active => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/manage_coupon/edit/${record.coupon_id}`)}
            className={styles.editButton}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this coupon?"
            onConfirm={() => handleDeleteCoupon(record.coupon_id)}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Manage Coupons
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/manage_coupon/add')}
              className={styles.addButton}
            >
              Add Coupon
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
              className={styles.refreshButton}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={8}>
          <Card className={styles.statisticCard} hoverable>
            <Statistic
              title={<span className={styles.statisticTitle}>Total Coupons</span>}
              value={coupons.length}
              valueStyle={{ color: '#5f2eea' }}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {loading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : coupons.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>No coupons found</TypographyText>
              </div>
            ) : (
              <Table
                columns={couponColumns}
                dataSource={coupons}
                rowKey="coupon_id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                }}
                rowClassName={styles.tableRow}
                className={styles.table}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageCoupon;