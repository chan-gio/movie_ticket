import { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Statistic, Tabs, List } from 'antd';
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
    const loadData = async () => {
      setLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Overview Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className={styles.card}>
            <Statistic
              title="Total Bookings"
              value={dashboardData.totalBookings}
              suffix="bookings"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className={styles.card}>
            <Statistic
              title="Total Revenue"
              value={dashboardData.totalRevenue}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings */}
      <Title level={3} style={{ marginTop: 24 }}>Recent Bookings</Title>
      <Card className={styles.card}>
        <List
          dataSource={dashboardData.recentBookings}
          renderItem={(item) => (
            <List.Item>
              <TypographyText><strong>Booking ID:</strong> {item.booking_id}</TypographyText>&nbsp;
              <TypographyText><strong>User ID:</strong> {item.user_id}</TypographyText>&nbsp;
              <TypographyText><strong>Movie:</strong> {item.movie_title}</TypographyText>&nbsp;
              <TypographyText><strong>Cinema:</strong> {item.cinema_name}</TypographyText>&nbsp;
              <TypographyText><strong>Total Price:</strong> ${item.total_price}</TypographyText>&nbsp;
              <TypographyText><strong>Status:</strong> {item.status}</TypographyText>
            </List.Item>
          )}
        />
      </Card>

      {/* Payments by Method */}
      <Title level={3} style={{ marginTop: 24 }}>Payments by Method</Title>
      <Card className={styles.card}>
        <Tabs defaultActiveKey="method">
          <TabPane tab="By Payment Method" key="method">
            <Row gutter={[16, 16]}>
              {dashboardData.paymentsByMethod.map((method, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card className={styles.salesCard}>
                    <TypographyText>{method.payment_method}</TypographyText>
                    <TypographyText style={{ display: 'block', marginTop: 8 }}>${method.total}</TypographyText>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default AdminDashboard;