import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, List, Form, Input, Alert, Button, Space } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import axios from 'axios';
import QRCode from 'react-qr-code';
import styles from './Payment.module.scss';

const { Title, Text } = Typography;

const orderData = {
  date: '2025-05-15',
  time: '2:00 PM',
  movieTitle: 'Movie 1',
  cinema: 'Cinema 1',
  tickets: 2,
  price: 10,
};

// Access PayOS credentials from environment variables
const PAYOS_CLIENT_ID = import.meta.env.VITE_PAYOS_CLIENT_ID;
const PAYOS_API_KEY = import.meta.env.VITE_PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = import.meta.env.VITE_PAYOS_CHECKSUM_KEY;
const PAYOS_API_URL = import.meta.env.VITE_PAYOS_API_URL;

function Payment() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    // Prepare order data for PayOS
    const totalAmount = orderData.price * orderData.tickets * 100; // Amount in smallest currency unit (e.g., cents)
    const orderCode = Date.now(); // Unique order code (use a better method in production)
    const description = `Payment for ${orderData.tickets} tickets to ${orderData.movieTitle} on ${orderData.date}`;
    const returnUrl = `${window.location.origin}/confirmation?orderCode=${orderCode}`; // Redirect URL after payment
    const cancelUrl = `${window.location.origin}/payment`; // Redirect URL if payment is canceled

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
          price: orderData.price * 100,
        },
      ],
    };

    try {
      // Call PayOS API to create a payment link
      const response = await axios.post(
        PAYOS_API_URL,
        paymentData,
        {
          headers: {
            'x-client-id': PAYOS_CLIENT_ID,
            'x-api-key': PAYOS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.data && response.data.data.checkoutUrl) {
        // Set the QR code value to the PayOS payment link
        setQrCodeValue(response.data.data.checkoutUrl);
      } else {
        throw new Error('Failed to create payment link');
      }
    } catch (err) {
      setError('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.payment}>
      {/* Payment Info and Personal Info */}
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

      {/* Payment Method with QR Code */}
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
            {qrCodeValue ? (
              <div style={{ textAlign: 'center' }}>
                <QRCode value={qrCodeValue} size={256} />
                <Text className={styles.qrText}>
                  Scan the QR code with your payment app to pay ${orderData.price * orderData.tickets}.
                </Text>
              </div>
            ) : (
              <Text>Click "Generate QR Code" to proceed with payment.</Text>
            )}
          </Card>
          <Space className={styles.navButtons}>
            <Link to="/seats">
              <Button className={styles.prevButton}>Previous step</Button>
            </Link>
            <Button
              type="primary"
              onClick={() => form.submit()}
              className={styles.payButton}
              loading={loading}
            >
              Generate QR Code
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default Payment;