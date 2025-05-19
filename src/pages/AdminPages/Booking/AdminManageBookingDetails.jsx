import { useState, useEffect } from "react";
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
import BookingService from "../../../services/BookingService";
import styles from "./AdminManageBookingDetails.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

function AdminManageBookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await BookingService.getBookingById(id);
        if (data) {
          setBooking(data);
          setStatus(data.status);
        } else {
          message.error("Booking not found");
        }
      } catch (error) {
        message.error(error.message || "Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedBooking = await BookingService.updateBookingStatus(
        id,
        newStatus
      );
      setStatus(newStatus);
      setBooking({
        ...booking,
        status: newStatus,
        updated_at: new Date().toISOString(),
      });
      message.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      message.error(error.message || "Failed to update booking status");
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return <div className={styles.error}>Booking not found</div>;
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
                {booking.user.full_name}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Email:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.user.email}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Phone:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.user.phone || "N/A"}
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
                {booking.showtime.movie.title}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Cinema:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.showtime.room?.cinema_name || "N/A"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Room:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.showtime.room?.room_name || "N/A"}
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
                {formatDateTime(booking.showtime.start_time)}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Seats:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.bookingSeats
                  ? booking.bookingSeats.map((seat) => seat.seat_id).join(", ")
                  : "N/A"}
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
                {booking.total_price.toLocaleString("vi-VN")} VND
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
