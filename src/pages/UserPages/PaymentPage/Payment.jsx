import { Link } from 'react-router-dom';
import { Row, Col, Card, Typography, List, Form, Input, Alert, Radio, Button, Space } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
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

const paymentMethods = [
  { value: 'google-pay', label: 'Google Pay', icon: 'https://via.placeholder.com/74x30?text=GooglePay' },
  { value: 'visa', label: 'Visa', icon: 'https://via.placeholder.com/80x26?text=Visa' },
  { value: 'gopay', label: 'GoPay', icon: 'https://via.placeholder.com/106x35?text=GoPay' },
  { value: 'paypal', label: 'PayPal', icon: 'https://via.placeholder.com/31x37?text=PayPal' },
  { value: 'dana', label: 'DANA', icon: 'https://via.placeholder.com/50x20?text=DANA' },
  { value: 'bca', label: 'BCA', icon: 'https://via.placeholder.com/85x28?text=BCA' },
  { value: 'bri', label: 'BRI', icon: 'https://via.placeholder.com/45x38?text=BRI' },
  { value: 'ovo', label: 'OVO', icon: 'https://via.placeholder.com/92x30?text=OVO' },
];

function Payment() {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Payment submitted:', values);
    // Navigate to /confirmation or handle payment logic
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

      {/* Payment Method */}
      <Row gutter={[16, 16]} className={styles.section}>
        <Col xs={24} lg={16}>
          <Title level={3}>Choose a Payment Method</Title>
          <Card className={styles.methodCard}>
            <Form.Item name="paymentMethod" rules={[{ required: true, message: 'Please select a payment method' }]}>
              <Radio.Group className={styles.paymentMethods}>
                <Row gutter={[16, 16]}>
                  {paymentMethods.map((method) => (
                    <Col xs={12} md={6} key={method.value}>
                      <Radio value={method.value} className={styles.paymentOption}>
                        <img src={method.icon} alt={method.label} className={styles.paymentIcon} />
                      </Radio>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
            </Form.Item>
            <div className={styles.divider}>
              <span>or</span>
            </div>
            <Text className={styles.cashOption}>
              Pay via cash. <Link to="#">See how it works</Link>
            </Text>
          </Card>
          <Space className={styles.navButtons}>
            <Link to="/seats">
              <Button className={styles.prevButton}>Previous step</Button>
            </Link>
            <Link to="/confirmation">
              <Button type="primary" onClick={() => form.submit()} className={styles.payButton}>
                Pay your order
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default Payment;