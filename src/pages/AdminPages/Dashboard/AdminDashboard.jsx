import { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Statistic, Tabs, Table, Tag, Spin, Button, Space, Select } from 'antd';
import { ReloadOutlined, BookOutlined, DollarOutlined, VideoCameraOutlined, ShopOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './AdminDashboard.module.scss';
import '../GlobalStyles.module.scss';

const { TabPane } = Tabs;
const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

// Mock API call to fetch dashboard data
const fetchDashboardData = async (filter = 'month') => {
  // Simulate fetching data from the database
  const baseData = {
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

  // Simulate revenue data based on filter
  let revenueData = [];
  if (filter === 'day') {
    // Daily data for the last 7 days (May 12 to May 18, 2025)
    revenueData = [
      { date: 'May 12', revenue: 800 },
      { date: 'May 13', revenue: 900 },
      { date: 'May 14', revenue: 1100 },
      { date: 'May 15', revenue: 1000 },
      { date: 'May 16', revenue: 1200 },
      { date: 'May 17', revenue: 1300 },
      { date: 'May 18', revenue: 1500 },
    ];
  } else if (filter === 'week') {
    // Weekly data for the last 4 weeks (April 21 to May 18, 2025)
    revenueData = [
      { date: 'Apr 21-27', revenue: 1800 },
      { date: 'Apr 28-May 4', revenue: 2000 },
      { date: 'May 5-11', revenue: 2200 },
      { date: 'May 12-18', revenue: 2500 },
    ];
  } else {
    // Monthly data for the last 5 months (Jan to May 2025)
    revenueData = [
      { date: 'Jan 2025', revenue: 1200 },
      { date: 'Feb 2025', revenue: 1400 },
      { date: 'Mar 2025', revenue: 1600 },
      { date: 'Apr 2025', revenue: 1800 },
      { date: 'May 2025', revenue: 2000 },
    ];
  }

  // Simulate top movies by bookings
  const topMovies = [
    { movie_title: 'Movie 1', bookings: 50 },
    { movie_title: 'Movie 2', bookings: 40 },
    { movie_title: 'Movie 3', bookings: 30 },
    { movie_title: 'Movie 4', bookings: 20 },
    { movie_title: 'Movie 5', bookings: 10 },
  ];

  // Simulate top cinemas by bookings
  const topCinemas = [
    { cinema_name: 'Cinema 1', bookings: 60 },
    { cinema_name: 'Cinema 2', bookings: 45 },
    { cinema_name: 'Cinema 3', bookings: 30 },
    { cinema_name: 'Cinema 4', bookings: 15 },
  ];

  return {
    ...baseData,
    revenueData,
    topMovies,
    topCinemas,
  };
};

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    paymentsByMethod: [],
    revenueData: [],
    topMovies: [],
    topCinemas: [],
  });
  const [loading, setLoading] = useState(true);
  const [revenueFilter, setRevenueFilter] = useState('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (filter = revenueFilter) => {
    setLoading(true);
    try {
      const data = await fetchDashboardData(filter);
      setDashboardData(data);
    } catch (error) {
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setRevenueFilter(value);
    loadData(value);
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

  const movieColumns = [
    {
      title: 'Movie Title',
      dataIndex: 'movie_title',
      key: 'movie_title',
      sorter: (a, b) => a.movie_title.localeCompare(b.movie_title),
      render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: 'Bookings',
      dataIndex: 'bookings',
      key: 'bookings',
      sorter: (a, b) => a.bookings - b.bookings,
      render: bookings => <TypographyText>{bookings}</TypographyText>,
    },
  ];

  const cinemaColumns = [
    {
      title: 'Cinema Name',
      dataIndex: 'cinema_name',
      key: 'cinema_name',
      sorter: (a, b) => a.cinema_name.localeCompare(b.cinema_name),
      render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: 'Bookings',
      dataIndex: 'bookings',
      key: 'bookings',
      sorter: (a, b) => a.bookings - b.bookings,
      render: bookings => <TypographyText>{bookings}</TypographyText>,
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
            onClick={() => loadData()}
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

          {/* Revenue Line Chart */}
          <div className={styles.section}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={3} className={styles.sectionTitle}>
                  Revenue Over Time
                </Title>
              </Col>
              <Col>
                <Select
                  value={revenueFilter}
                  onChange={handleFilterChange}
                  style={{ width: 120 }}
                  className={styles.filterSelect}
                >
                  <Option value="day">Daily</Option>
                  <Option value="week">Weekly</Option>
                  <Option value="month">Monthly</Option>
                </Select>
              </Col>
            </Row>
            <Card className={styles.chartCard}>
              {dashboardData.revenueData.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>No revenue data available</TypographyText>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', offset: -10, fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px' }}
                      labelStyle={{ color: '#14142b' }}
                      formatter={(value) => `$${value}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="revenue" stroke="#5f2eea" strokeWidth={2} dot={{ fill: '#5f2eea', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

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

          {/* Top Movies by Bookings */}
          <div className={styles.section}>
            <Title level={3} className={styles.sectionTitle}>
              Top Movies by Bookings
            </Title>
            <Card className={styles.tableCard}>
              {dashboardData.topMovies.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>No movie data available</TypographyText>
                </div>
              ) : (
                <Table
                  columns={movieColumns}
                  dataSource={dashboardData.topMovies}
                  rowKey="movie_title"
                  pagination={false}
                  rowClassName={styles.tableRow}
                  className={styles.table}
                />
              )}
            </Card>
          </div>

          {/* Top Cinemas by Bookings */}
          <div className={styles.section}>
            <Title level={3} className={styles.sectionTitle}>
              Top Cinemas by Bookings
            </Title>
            <Card className={styles.tableCard}>
              {dashboardData.topCinemas.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>No cinema data available</TypographyText>
                </div>
              ) : (
                <Table
                  columns={cinemaColumns}
                  dataSource={dashboardData.topCinemas}
                  rowKey="cinema_name"
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