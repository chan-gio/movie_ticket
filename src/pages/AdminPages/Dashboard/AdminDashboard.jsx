import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Card,
  Statistic,
  Button,
  Select,
  message,
  Spin,
  DatePicker,
  Table,
  Tag,
} from "antd";
import {
  ReloadOutlined,
  BookOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
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
import DashboardService from "../../../services/DashboardService";
import dayjs from "dayjs";

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

// Formatter for Vietnamese number format (e.g., 1000000 -> 1.000.000)
const numberFormatter = new Intl.NumberFormat("vi-VN");

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    revenueData: [],
    topMovies: [],
    topCinemas: [],
    topMoviesByCinema: [],
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("month"); // Default to 'month'
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM")); // Default to current month (2025-06)

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (newFilter = filter, newMonth = selectedMonth) => {
    setLoading(true);
    try {
      // Validate filter
      const validFilter = ["day", "week", "month"].includes(newFilter) ? newFilter : "month";
      if (newFilter !== validFilter) {
        console.warn("Invalid filter detected, falling back to 'month'", { invalidFilter: newFilter });
        setFilter("month");
      }

      const params = { filter: validFilter };
      if (validFilter === "month" && newMonth) {
        params.month = newMonth;
      }
      console.log("Sending API request with params:", params); // Debug log
      const data = await DashboardService.fetchDashboardData(params);
      console.log("API response:", data); // Debug log
      setDashboardData(data);
    } catch (error) {
      console.error("Load data error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      message.error(error.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    console.log("Filter changed to:", value); // Debug log
    setFilter(value);
    // Reset month if filter is not 'month', otherwise keep current month
    const newMonth = value === "month" ? selectedMonth : null;
    setSelectedMonth(newMonth);
    loadData(value, newMonth);
  };

  const handleMonthChange = (date) => {
    const month = date ? date.format("YYYY-MM") : null;
    console.log("Month changed to:", month); // Debug log
    setSelectedMonth(month);
    loadData(filter, month);
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
      title: "Total Price (VND)",
      dataIndex: "total_price",
      key: "total_price",
      sorter: (a, b) => (a.total_price ?? 0) - (b.total_price ?? 0),
      render: (price) => (
        <TypographyText type="success">
          {numberFormatter.format(price ?? 0)} VND
        </TypographyText>
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
                  valueStyle={{ color: "#5f2eea" }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className={styles.statisticCard} hoverable>
                <Statistic
                  title={<span className={styles.statisticTitle}>Total Revenue</span>}
                  value={dashboardData.totalRevenue}
                  prefix={<DollarOutlined />}
                  suffix="VND"
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
                  value={filter}
                  onChange={handleFilterChange}
                  style={{ width: 120, marginRight: 8 }}
                  className={styles.filterSelect}
                >
                  <Option value="day">Daily</Option>
                  <Option value="week">Weekly</Option>
                  <Option value="month">Monthly</Option>
                </Select>
                {filter === "month" && (
                  <DatePicker
                    picker="month"
                    value={selectedMonth ? dayjs(selectedMonth, "YYYY-MM") : null}
                    onChange={handleMonthChange}
                    format="YYYY-MM"
                    placeholder="Select month"
                    style={{ width: 120 }}
                  />
                )}
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
                        value: "Revenue (VND)",
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
                      formatter={(value) => `${numberFormatter.format(value)} VND`}
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

          {/* Top Movies by Bookings - BarChart */}
          <div className={styles.section}>
            <Title level={3} className={styles.sectionTitle}>
              Top Movies by Bookings
            </Title>
            <Card className={styles.chartCard}>
              {dashboardData.topMovies.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>No movie data available</TypographyText>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={dashboardData.topMovies}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="movie_title"
                      stroke="#6b7280"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      stroke="#6b7280"
                      label={{
                        value: "Bookings",
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
                      formatter={(value) => `${value} bookings`}
                    />
                    <Bar dataKey="bookings" fill="#5f2eea" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Top Cinemas by Bookings - BarChart */}
          <div className={styles.section}>
            <Title level={3} className={styles.sectionTitle}>
              Top Cinemas by Bookings
            </Title>
            <Card className={styles.chartCard}>
              {dashboardData.topCinemas.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>No cinema data available</TypographyText>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={dashboardData.topCinemas}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="cinema_name"
                      stroke="#6b7280"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      stroke="#6b7280"
                      label={{
                        value: "Bookings",
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
                      formatter={(value) => `${value} bookings`}
                    />
                    <Bar dataKey="bookings" fill="#4b9bff" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Top Movies by Cinema - BarChart */}
          <div className={styles.section}>
            <Title level={3} className={styles.sectionTitle}>
              Top Movies by Cinema
            </Title>
            <Card className={styles.chartCard}>
              {dashboardData.topMoviesByCinema.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>No data available</TypographyText>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={dashboardData.topMoviesByCinema}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="cinema_name"
                      stroke="#6b7280"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      stroke="#6b7280"
                      label={{
                        value: "Bookings",
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
                      formatter={(value, name, props) => [
                        `${value} bookings`,
                        `Movie: ${props.payload.movie_title}`,
                      ]}
                    />
                    <Bar dataKey="bookings" fill="#ff6a6a" />
                  </BarChart>
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
        </>
      )}
    </div>
  );
}

export default AdminDashboard;