import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Typography, Divider, Button, Select, message, Row, Col, Space } from 'antd';
import { UserOutlined, VideoCameraOutlined, DollarOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from './AdminManageBookingDetails.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

// Mock API call to fetch a single booking with related data
const fetchBookingById = async (id) => {
  const bookings = [
    {
      booking_id: 'b1',
      user_id: 'u1',
      user_name: 'John Doe',
      user_email: 'john.doe@tickitz.com',
      user_phone: '1234567890',
      showtime_id: 's1',
      movie_title: 'Spider-Man: Homecoming',
      cinema_name: 'Cinema 1',
      room_name: 'Room 1',
      start_time: '2025-05-15T14:00:00',
      seats: ['A1', 'A2'],
      total_price: 20,
      coupon_code: 'DISCOUNT10',
      coupon_discount: 10,
      status: 'CONFIRMED',
      created_at: '2025-05-14T10:00:00',
      updated_at: '2025-05-14T10:00:00',
    },
    {
      booking_id: 'b2',
      user_id: 'u2',
      user_name: 'Jane Smith',
      user_email: 'jane.smith@tickitz.com',
      user_phone: '0987654321',
      showtime_id: 's2',
      movie_title: 'Avengers: End Game',
      cinema_name: 'Cinema 2',
      room_name: 'Room 2',
      start_time: '2025-05-15T17:00:00',
      seats: ['B1'],
      total_price: 12,
      coupon_code: null,
      coupon_discount: null,
      status: 'PENDING',
      created_at: '2025-05-14T12:00:00',
      updated_at: '2025-05-14T12:00:00',
    },
  ];
  return bookings.find(booking => booking.booking_id === id);
};

function AdminManageBookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchBookingById(id);
      if (data) {
        setBooking(data);
        setStatus(data.status);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setBooking({ ...booking, status: newStatus, updated_at: new Date().toISOString() });
    message.success(`Booking status updated to ${newStatus}`);
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!booking) {
    return <div className={styles.error}>Booking not found</div>;
  }

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.pageTitle}>
        Booking Details - {booking.booking_id}
      </Title>
      <Card className={styles.card}>
        {/* User Information */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={4} className={styles.sectionTitle}>
            <UserOutlined className={styles.sectionIcon} /> User Information
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Name:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>{booking.user_name}</TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Email:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>{booking.user_email}</TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Phone:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>{booking.user_phone}</TypographyText>
            </Col>
          </Row>
        </Space>

        <Divider className={styles.divider} />

        {/* Showtime Information */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={4} className={styles.sectionTitle}>
            <VideoCameraOutlined className={styles.sectionIcon} /> Showtime Information
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Movie:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>{booking.movie_title}</TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Cinema:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>{booking.cinema_name}</TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Room:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>{booking.room_name}</TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Showtime:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>{formatDateTime(booking.start_time)}</TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Seats:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>{booking.seats.join(', ')}</TypographyText>
            </Col>
          </Row>
        </Space>

        <Divider className={styles.divider} />

        {/* Payment Information */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={4} className={styles.sectionTitle}>
            <DollarOutlined className={styles.sectionIcon} /> Payment Information
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Total Price:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>${booking.total_price}</TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Coupon:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {booking.coupon_code || 'N/A'} {booking.coupon_discount ? `(${booking.coupon_discount}% off)` : ''}
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
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={4} className={styles.sectionTitle}>
            <CalendarOutlined className={styles.sectionIcon} /> Timestamps
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Created At:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                <ClockCircleOutlined className={styles.timeIcon} /> {formatDateTime(booking.created_at)}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Updated At:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                <ClockCircleOutlined className={styles.timeIcon} /> {formatDateTime(booking.updated_at)}
              </TypographyText>
            </Col>
          </Row>
        </Space>

        <Row justify="end" style={{ marginTop: 24 }}>
          <Button type="primary" className={styles.backButton} onClick={() => navigate('/admin/manage_booking')}>
            Back to Bookings
          </Button>
        </Row>
      </Card>
    </div>
  );
}

export default AdminManageBookingDetails;