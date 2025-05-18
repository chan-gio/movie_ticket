import { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Statistic, Tabs, Table, Tag, Spin, Button, Space } from 'antd';
import { ReloadOutlined, BookOutlined, DollarOutlined } from '@ant-design/icons';
import styles from './AdminDashboard.module.scss';
import '../GlobalStyles.module.scss';

const { TabPane } = Tabs;
const { Title, Text: TypographyText } = Typography;

// Mock API call to fetch booking and payment data
const fetchDashboardData = async () => {
  // Simulate fetching data from the database
  return {
    totalBookings: 150,
    totalRevenue: 7500, // In dollars
    recentBookings: [
      { booking_id: 'b1', user_id: 'u1', movie_title: 'Movie 1', cinema_name: 'Cinema 1', total_price: 20, status: 'CONFIRMED' },
      { booking_id: 'b2', user_id: 'u2', movie_title: 'Movie 2', cinema_name: 'Cinema 2', total_price: 30, status: 'PENDING' },
      { booking_id: 'b3', user_id: 'u3', movie_title: 'Movie 3', cinema_name: 'Cinema 1', total_price: 25, status: 'CANCELLED' },
    ],
    paymentsByMethod: [
      { payment_method: 'CREDIT_CARD', total: 3000 },
      { payment_method: 'MOMO', total: 2000 },
      { payment_method: 'ZALOPAY', total: 1500 },
      { payment_method: 'CASH', total: 1000 },
    ],
  };
};

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    paymentsByMethod: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (error) {
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const bookingColumns = [
    {
      title: 'Booking ID',
      dataIndex: 'booking_id',
      key: 'booking_id',
      sorter: (a, b) => a.booking_id.localeCompare(b.booking_id),
      render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
      sorter: (a, b) => a.user_id.localeCompare(b.user_id),
    },
    {
      title: 'Movie',
      dataIndex: 'movie_title',
      key: 'movie_title',
      sorter: (a, b) => a.movie_title.localeCompare(b.movie_title),
    },
    {
      title: 'Cinema',
      dataIndex: 'cinema_name',
      key: 'cinema_name',
      sorter: (a, b) => a.cinema_name.localeCompare(b.cinema_name),
    },
    {
      title: 'Total Price ($)',
      dataIndex: 'total_price',
      key: 'total_price',
      sorter: (a, b) => a.total_price - b.total_price,
      render: price => <TypographyText type="success">${price}</TypographyText>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: status => {
        let color;
        switch (status) {
          case 'CONFIRMED':
            color = 'green';
            break;
          case 'PENDING':
            color = 'gold';
            break;
          case 'CANCELLED':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Admin Dashboard
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadData}
            loading={loading}
            className={styles.refreshButton}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Overview Statistics */}
          <Row gutter={[16, 16]} className={styles.section}>
            <Col xs={24} lg={12}>
              <Card className={styles.statisticCard} hoverable>
                <Statistic
                  title={<span className={styles.statisticTitle}>Total Bookings</span>}
                  value={dashboardData.totalBookings}
                  prefix={<BookOutlined />}
                  suffix="bookings"
                  valueStyle={{ color: '#5f2eea' }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className={styles.statisticCard} hoverable>
                <Statistic
                  title={<span className={styles.statisticTitle}>Total Revenue</span>}
                  value={dashboardData.totalRevenue}
                  prefix={<DollarOutlined />}
                  suffix="$"
                  valueStyle={{ color: '#5f2eea' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Recent Bookings */}
          <div className={styles.section}>
            <Title level={3} className={styles.sectionTitle}>
              Recent Bookings
            </Title>
            <Card className={styles.tableCard}>
              {dashboardData.recentBookings.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>No recent bookings</TypographyText>
                </div>
              ) : (
                <Table
                  columns={bookingColumns}
                  dataSource={dashboardData.recentBookings}
                  rowKey="booking_id"
                  pagination={false}
                  rowClassName={styles.tableRow}
                  className={styles.table}
                />
              )}
            </Card>
          </div>

          {/* Payments by Method */}
          <div className={styles.section}>
            <Title level={3} className={styles.sectionTitle}>
              Payments by Method
            </Title>
            <Card className={styles.tableCard}>
              <Tabs defaultActiveKey="method" className={styles.paymentTabs}>
                <TabPane tab="By Payment Method" key="method">
                  {dashboardData.paymentsByMethod.length === 0 ? (
                    <div className={styles.empty}>
                      <TypographyText>No payment data available</TypographyText>
                    </div>
                  ) : (
                    <Row gutter={[16, 16]}>
                      {dashboardData.paymentsByMethod.map((method, index) => (
                        <Col xs={24} md={8} key={index}>
                          <Card className={styles.paymentCard} hoverable>
                            <TypographyText className={styles.paymentMethod}>
                              {method.payment_method}
                            </TypographyText>
                            <TypographyText className={styles.paymentAmount}>
                              ${method.total}
                            </TypographyText>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;