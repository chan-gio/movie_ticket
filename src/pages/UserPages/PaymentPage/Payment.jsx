import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Typography, List, Form, Input, Alert, Button, Space, Spin } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import styles from './Payment.module.scss';
import BookingService from '../../../services/BookingService';
import UserService from '../../../services/UserService';
import PaymentService from '../../../services/PaymentService'; // Import PaymentService

const { Title, Text } = Typography;

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    const fetchData = async () => {
      if (!bookingId) {
        setFetchError("Booking ID not provided");
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);

        const bookingResponse = await BookingService.getBookingById(bookingId);
        setBooking(bookingResponse);

        const userId = bookingResponse.user_id;
        if (userId) {
          const userResponse = await UserService.getUserById(userId);
          setUser(userResponse);

          form.setFieldsValue({
            fullName: userResponse.full_name,
            email: userResponse.email,
            phoneNumber: userResponse.phone,
          });
        } else {
          console.warn('User ID not found in booking response');
        }

        setFetchLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setFetchError(err.message || "Failed to fetch data");
        setFetchLoading(false);
      }
    };

    fetchData();
    hasFetched.current = true;
  }, [bookingId, form]);

  const orderData = booking
    ? {
        date: booking.showtime?.start_time ? new Date(booking.showtime.start_time).toISOString().split("T")[0] : 'Unknown Date',
        time: booking.showtime?.start_time ? new Date(booking.showtime.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : 'Unknown Time',
        movieTitle: booking.showtime?.movie?.title || 'Unknown Movie',
        cinema: 'Cinema 1',
        tickets: booking.booking_seats?.length || 0,
        price: booking.showtime?.price || 0,
      }
    : {
        date: '2025-05-15',
        time: '2:00 PM',
        movieTitle: 'Movie 1',
        cinema: 'Cinema 1',
        tickets: 2,
        price: 5000,
      };

  // Sort booking_seats by seat_number (row letter then column number)
  const sortedSeats = booking?.booking_seats?.slice().sort((a, b) => {
    const seatA = a.seat?.seat_number || '';
    const seatB = b.seat?.seat_number || '';

    // Extract row (letter) and column (number) from seat_number
    const rowA = seatA.charAt(0); // e.g., "A"
    const colA = parseInt(seatA.slice(1), 10); // e.g., "1"
    const rowB = seatB.charAt(0); // e.g., "B"
    const colB = parseInt(seatB.slice(1), 10); // e.g., "2"

    // Compare rows (alphabetically)
    if (rowA < rowB) return -1;
    if (rowA > rowB) return 1;

    // If rows are the same, compare columns (numerically)
    return colA - colB;
  }) || [];

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    const totalAmount = orderData.price * orderData.tickets;
    const orderCode = Math.floor(100000 + Math.random() * 900000);
    const description = orderData.movieTitle.length <= 9 ? orderData.movieTitle : orderData.movieTitle.substring(0, 9);
    const baseUrl = 'http://localhost:5173'; // Use base URL instead of ngrok
    const returnUrl = `${baseUrl}/confirmation/${bookingId}?orderCode=${orderCode}`;
    const cancelUrl = `${baseUrl}/payment/${bookingId}`;

    const paymentData = {
      orderCode,
      amount: totalAmount,
      description,
      returnUrl,
      cancelUrl,
      buyerName: values.fullName,
      buyerEmail: values.email,
      buyerPhone: values.phoneNumber,
      items: [
        {
          name: orderData.movieTitle,
          quantity: orderData.tickets,
          price: orderData.price,
        },
      ],
    };

    try {
      const response = await PaymentService.proxyPayOS(paymentData); 

      if (response && response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error('Failed to create payment link: Invalid response structure');
      }
    } catch (err) {
      console.error('PayOS Service Error:', err.message);
      setError('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className={styles.payment}>
        <Spin size="large" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={styles.payment}>
        <Title level={3}>Error</Title>
        <Paragraph>{fetchError}</Paragraph>
        <Link to="/">
          <Button type="primary">Go Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.payment}>
      <Row gutter={[16, 16]} className={styles.section}>
        <Col xs={24} lg={16}>
          <Title level={3}>Payment Info</Title>
          <Card className={styles.infoCard}>
            <List>
              <List.Item>
                <Text className={styles.label}>Date & time</Text>
                <Text className={styles.value}>{orderData.date} at {orderData.time}</Text>
              </List.Item>
              <List.Item>
                <Text className={styles.label}>Movie title</Text>
                <Text className={styles.value}>{orderData.movieTitle}</Text>
              </List.Item>
              <List.Item>
                <Text className={styles.label}>Cinema name</Text>
                <Text className={styles.value}>{orderData.cinema}</Text>
              </List.Item>
              <List.Item>
                <Text className={styles.label}>Number of tickets</Text>
                <Text className={styles.value}>{orderData.tickets} pieces</Text>
              </List.Item>
              <List.Item>
                <Text className={styles.label}>Seats</Text>
                <Text className={styles.value}>
                  {sortedSeats.map(bookingSeat => bookingSeat.seat?.seat_number || bookingSeat.seat_id).join(', ') || 'None'}
                </Text>
              </List.Item>
              <List.Item>
                <Text className={styles.label}>Total payment</Text>
                <Text className={styles.value}>${orderData.price * orderData.tickets}</Text>
              </List.Item>
            </List>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Title level={3}>Personal Info</Title>
          <Card className={styles.personalCard}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Jonas El Rodriguez" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Required' },
                  { type: 'email', message: 'Invalid email' },
                ]}
              >
                <Input placeholder="jonasrodri123@gmail.com" />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Required' },
                  { pattern: /^\d+$/, message: 'Must be a number' },
                ]}
              >
                <Input addonBefore="+62" placeholder="81445687121" />
              </Form.Item>
              <Alert
                message="Fill your data correctly."
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                className={styles.alert}
              />
            </Form>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.section}>
        <Col xs={24} lg={16}>
          <Title level={3}>Pay with PayOS</Title>
          <Card className={styles.methodCard}>
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                className={styles.alert}
                style={{ marginBottom: 16 }}
              />
            )}
            <Text>Click "Proceed to Payment" to pay with PayOS.</Text>
          </Card>
          <Space className={styles.navButtons}>
            <Button
              className={styles.prevButton}
              onClick={() => navigate(`/seats/${booking.showtime.room_id}/${bookingId}`)}
            >
              Previous step
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              className={styles.payButton}
              loading={loading}
            >
              Proceed to Payment
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default Payment;
