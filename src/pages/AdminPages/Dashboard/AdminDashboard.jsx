import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Card,
  Statistic,
  Table,
  Tag,
  Spin,
  Button,
  Select,
  message,
} from "antd";
import {
  ReloadOutlined,
  BookOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./AdminDashboard.module.scss";
import "../GlobalStyles.module.scss";
import DashboardService from "../../../services/DashboardService"; // Import the DashboardService

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    revenueData: [],
    topMovies: [],
    topCinemas: [],
  });
  const [loading, setLoading] = useState(true);
  const [revenueFilter, setRevenueFilter] = useState("month");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (filter = revenueFilter) => {
    setLoading(true);
    try {
      const data = await DashboardService.fetchDashboardData(filter);
      setDashboardData(data);
    } catch (error) {
      message.error(error.message || "Failed to load dashboard data");
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
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text) => <TypographyText>{text}</TypographyText>,
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      render: (text) => <TypographyText>{text}</TypographyText>,
    },
    {
      title: "Movie",
      dataIndex: "movie_title",
      key: "movie_title",
      sorter: (a, b) => a.movie_title.localeCompare(b.movie_title),
    },
    {
      title: "Cinema",
      dataIndex: "cinema_name",
      key: "cinema_name",
      sorter: (a, b) => a.cinema_name.localeCompare(b.cinema_name),
    },
    {
      title: "Total Price ($)",
      dataIndex: "total_price",
      key: "total_price",
      sorter: (a, b) => a.total_price - b.total_price,
      render: (price) => (
        <TypographyText type="success">${price}</TypographyText>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        let color;
        switch (status) {
          case "CONFIRMED":
            color = "green";
            break;
          case "PENDING":
            color = "gold";
            break;
          case "CANCELLED":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const movieColumns = [
    {
      title: "Movie Title",
      dataIndex: "movie_title",
      key: "movie_title",
      sorter: (a, b) => a.movie_title.localeCompare(b.movie_title),
      render: (text) => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: "Bookings",
      dataIndex: "bookings",
      key: "bookings",
      sorter: (a, b) => a.bookings - b.bookings,
      render: (bookings) => <TypographyText>{bookings}</TypographyText>,
    },
  ];

  const cinemaColumns = [
    {
      title: "Cinema Name",
      dataIndex: "cinema_name",
      key: "cinema_name",
      sorter: (a, b) => a.cinema_name.localeCompare(b.cinema_name),
      render: (text) => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: "Bookings",
      dataIndex: "bookings",
      key: "bookings",
      sorter: (a, b) => a.bookings - b.bookings,
      render: (bookings) => <TypographyText>{bookings}</TypographyText>,
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
                  title={
                    <span className={styles.statisticTitle}>
                      Total Bookings
                    </span>
                  }
                  value={dashboardData.totalBookings}
                  prefix={<BookOutlined />}
                  suffix="bookings"
                  valueStyle={{ color: "#5f2eea" }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className={styles.statisticCard} hoverable>
                <Statistic
                  title={
                    <span className={styles.statisticTitle}>Total Revenue</span>
                  }
                  value={dashboardData.totalRevenue}
                  prefix={<DollarOutlined />}
                  suffix="$"
                  valueStyle={{ color: "#5f2eea" }}
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
                  <LineChart
                    data={dashboardData.revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis
                      stroke="#6b7280"
                      label={{
                        value: "Revenue ($)",
                        angle: -90,
                        position: "insideLeft",
                        offset: -10,
                        fill: "#6b7280",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderColor: "#e5e7eb",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#14142b" }}
                      formatter={(value) => `$${value}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#5f2eea"
                      strokeWidth={2}
                      dot={{ fill: "#5f2eea", strokeWidth: 2 }}
                    />
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
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
