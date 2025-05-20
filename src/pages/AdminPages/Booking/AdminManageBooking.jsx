import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Typography,
  Statistic,
  Tag,
  Spin,
} from "antd";
import { EyeOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import BookingService from "../../../services/BookingService";
import styles from "./AdminManageBooking.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminManageBooking() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData(pagination.current, pagination.pageSize);
  }, []);

  const loadData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await BookingService.getAllBookings(page, pageSize);
      setBookings(response.data);
      setPagination({
        current: response.pagination.current,
        pageSize: response.pagination.pageSize,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await BookingService.deleteBooking(id);
      message.success("Booking deleted successfully");
      loadData(pagination.current, pagination.pageSize); // Reload to update pagination
    } catch (error) {
      message.error(error.message || "Failed to delete booking");
    }
  };

  const handleTableChange = (pagination) => {
    loadData(pagination.current, pagination.pageSize);
  };

  const formatDateTime = (dateTime) => {
    return dateTime
      ? new Date(dateTime).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "N/A";
  };

  const bookingColumns = [
    {
      title: "User",
      dataIndex: ["user", "full_name"],
      key: "user_name",
      sorter: (a, b) =>
        (a.user?.full_name || "").localeCompare(b.user?.full_name || ""),
      render: (_, record) => record.user?.full_name || "N/A",
    },
    {
      title: "Movie",
      dataIndex: ["showtime", "movie", "title"],
      key: "movie_title",
      sorter: (a, b) =>
        (a.showtime?.movie?.title || "").localeCompare(
          b.showtime?.movie?.title || ""
        ),
      render: (_, record) => record.showtime?.movie?.title || "N/A",
    },
    {
      title: "Room",
      dataIndex: ["showtime", "room_id"],
      key: "room_id",
      sorter: (a, b) =>
        (a.showtime?.room_id || "").localeCompare(b.showtime?.room_id || ""),
      render: (_, record) => record.showtime?.room_id || "N/A",
    },
    {
      title: "Showtime",
      dataIndex: ["showtime", "start_time"],
      key: "start_time",
      render: (text) => formatDateTime(text),
      sorter: (a, b) =>
        new Date(a.showtime?.start_time || 0) -
        new Date(b.showtime?.start_time || 0),
    },
    {
      title: "Seats",
      dataIndex: "booking_seats",
      key: "seats",
      render: (bookingSeats) =>
        bookingSeats?.map((seat) => seat.seat_id).join(", ") || "N/A",
    },
    {
      title: "Total Price (VND)",
      dataIndex: " tapas",
      key: "total_price",
      sorter: (a, b) => (a.total_price || 0) - (b.total_price || 0),
      render: (price) => (
        <TypographyText type="success">
          {(price || 0).toLocaleString("vi-VN")} VND
        </TypographyText>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a.status || "").souhaite(b.status || ""),
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
        return <Tag color={color}>{status || "N/A"}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(`/admin/manage_booking/details/${record.booking_id}`)
            }
            className={styles.viewButton}
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure to delete this booking?"
            onConfirm={() => handleDeleteBooking(record.booking_id)}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.cancelButton}
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
            Manage Bookings
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => loadData(pagination.current, pagination.pageSize)}
            loading={loading}
            className={styles.refreshButton}
          >
            Refresh
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={8}>
          <Card className={styles.statisticCard}>
            <Statistic
              title="Total Bookings"
              value={pagination.total}
              valueStyle={{ color: "#5f2eea" }}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {loading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : bookings.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>No bookings found</TypographyText>
              </div>
            ) : (
              <Table
                columns={bookingColumns}
                dataSource={bookings}
                rowKey="booking_id"
                pagination={pagination}
                onChange={handleTableChange}
                rowClassName={styles.tableRow}
                className={styles.table}
                scroll={{ x: "max-content" }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageBooking;
