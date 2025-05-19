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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await BookingService.getAllBookings();
      // Filter out soft-deleted bookings
      const activeBookings = data.filter((booking) => !booking.is_deleted);
      setBookings(activeBookings);
    } catch (error) {
      message.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      // Update booking status to CANCELLED
      const updatedBooking = await BookingService.updateBookingStatus(
        id,
        "CANCELLED"
      );
      // Update local state to reflect the new status
      setBookings(
        bookings.map((booking) =>
          booking.booking_id === id
            ? {
                ...booking,
                status: "CANCELLED",
                updated_at: new Date().toISOString(),
              }
            : booking
        )
      );
      message.success("Booking cancelled successfully");
    } catch (error) {
      message.error(error.message || "Failed to cancel booking");
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const bookingColumns = [
    {
      title: "User",
      dataIndex: ["user", "full_name"],
      key: "user_name",
      sorter: (a, b) => a.user.full_name.localeCompare(b.user.full_name),
    },
    {
      title: "Movie",
      dataIndex: ["showtime", "movie", "title"],
      key: "movie_title",
      sorter: (a, b) =>
        a.showtime.movie.title.localeCompare(b.showtime.movie.title),
    },
    {
      title: "Cinema",
      dataIndex: ["showtime", "room", "cinema_name"],
      key: "cinema_name",
      sorter: (a, b) =>
        (a.showtime.room?.cinema_name || "").localeCompare(
          b.showtime.room?.cinema_name || ""
        ),
      render: (_, record) => record.showtime.room?.cinema_name || "N/A",
    },
    {
      title: "Room",
      dataIndex: ["showtime", "room", "room_name"],
      key: "room_name",
      sorter: (a, b) =>
        (a.showtime.room?.room_name || "").localeCompare(
          b.showtime.room?.room_name || ""
        ),
      render: (_, record) => record.showtime.room?.room_name || "N/A",
    },
    {
      title: "Showtime",
      dataIndex: ["showtime", "start_time"],
      key: "start_time",
      render: (text) => formatDateTime(text),
      sorter: (a, b) =>
        new Date(a.showtime.start_time) - new Date(b.showtime.start_time),
    },
    {
      title: "Seats",
      dataIndex: ["bookingSeats"],
      key: "seats",
      render: (bookingSeats) =>
        bookingSeats?.map((seat) => seat.seat_id).join(", ") || "N/A",
    },
    {
      title: "Total Price (VND)",
      dataIndex: "total_price",
      key: "total_price",
      sorter: (a, b) => a.total_price - b.total_price,
      render: (price) => (
        <TypographyText type="success">
          {price.toLocaleString("vi-VN")} VND
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
          {record.status !== "CANCELLED" && (
            <Popconfirm
              title="Are you sure to cancel this booking?"
              onConfirm={() => handleCancelBooking(record.booking_id)}
            >
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
            </Popconfirm>
          )}
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
            onClick={loadData}
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
              value={bookings.length}
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
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                }}
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
