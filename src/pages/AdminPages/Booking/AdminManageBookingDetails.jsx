import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Divider,
  Button,
  Select,
  message,
  Row,
  Col,
  Space,
  Spin,
} from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  useBookingById,
  useUpdateBookingStatus,
} from "../../../hooks/useBookings";
import styles from "./AdminManageBookingDetails.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

function AdminManageBookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState(null);

  // Custom hooks
  const {
    data: booking,
    isLoading: loading,
    isError,
    error,
  } = useBookingById(id);

  const updateStatusMutation = useUpdateBookingStatus();

  // Update local status when booking data changes
  useEffect(() => {
    if (booking?.status) {
      setStatus(booking.status);
    }
  }, [booking]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        bookingId: id,
        status: newStatus,
      });
      setStatus(newStatus);
      message.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      message.error(error.message || "Failed to update booking status");
    }
  };

  const formatDateTime = (dateTime) => {
    return dateTime
      ? new Date(dateTime).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "N/A";
  };

  // Handle error state
  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <TypographyText type="danger">
            Error: {error?.message || "Failed to load booking details"}
          </TypographyText>
          <Button 
            type="primary" 
            onClick={() => window.location.reload()}
            style={{ marginTop: 16 }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <TypographyText type="danger">Booking not found</TypographyText>
          <Button 
            type="primary" 
            onClick={() => navigate("/admin/manage_booking")}
            style={{ marginTop: 16 }}
          >
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.pageTitle}>
        Booking Details
      </Title>
      <Card className={styles.card}>
        {/* User Information */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4} className={styles.sectionTitle}>
            <UserOutlined className={styles.sectionIcon} /> User Information
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Name:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.user?.full_name || "N/A"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Email:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.user?.email || "N/A"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Phone:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.user?.phone || "N/A"}
              </TypographyText>
            </Col>
          </Row>
        </Space>

        <Divider className={styles.divider} />

        {/* Showtime Information */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4} className={styles.sectionTitle}>
            <VideoCameraOutlined className={styles.sectionIcon} /> Showtime
            Information
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Movie:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.showtime?.movie?.title || "N/A"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Room:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.showtime?.room?.room_name || booking.showtime?.room_id || "N/A"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Showtime:
              </TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {formatDateTime(booking.showtime?.start_time)}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Seats:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.booking_seats
                  ?.map((seat) => seat.seat?.seat_number || seat.seat_id)
                  .join(", ") || "N/A"}
              </TypographyText>
            </Col>
          </Row>
        </Space>

        <Divider className={styles.divider} />

        {/* Payment Information */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4} className={styles.sectionTitle}>
            <DollarOutlined className={styles.sectionIcon} /> Payment
            Information
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Total Price:
              </TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {(booking.total_price || 0).toLocaleString("vi-VN")} VND
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Status:</TypographyText>
            </Col>
            <Col span={16}>
              <Select
                value={status}
                onChange={handleStatusChange}
                className={styles.statusSelect}
                loading={updateStatusMutation.isPending}
              >
                <Option value="PENDING">Pending</Option>
                <Option value="CONFIRMED">Confirmed</Option>
                <Option value="CANCELLED">Cancelled</Option>
              </Select>
            </Col>
          </Row>
        </Space>

        <Divider className={styles.divider} />

        {/* Timestamps */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4} className={styles.sectionTitle}>
            <CalendarOutlined className={styles.sectionIcon} /> Timestamps
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Created At:
              </TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                <ClockCircleOutlined className={styles.timeIcon} />{" "}
                {formatDateTime(booking.created_at)}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Updated At:
              </TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                <ClockCircleOutlined className={styles.timeIcon} />{" "}
                {formatDateTime(booking.updated_at)}
              </TypographyText>
            </Col>
          </Row>
        </Space>

        <Row justify="end" style={{ marginTop: 24 }}>
          <Button
            type="primary"
            className={styles.backButton}
            onClick={() => navigate("/admin/manage_booking")}
          >
            Back to Bookings
          </Button>
        </Row>
      </Card>
    </div>
  );
}

export default AdminManageBookingDetails;
