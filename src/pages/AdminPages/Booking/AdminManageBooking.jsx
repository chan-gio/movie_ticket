import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Statistic } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageBooking.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;

// Mock API call to fetch bookings with related data
const fetchBookings = async () => {
  // Simulate fetching data from the booking table with joined user, showtime, movie, cinema, room, seats, and coupon data
  return [
    {
      booking_id: 'b1',
      user_id: 'u1',
      user_name: 'John Doe',
      showtime_id: 's1',
      movie_title: 'Spider-Man: Homecoming',
      cinema_name: 'Cinema 1',
      room_name: 'Room 1',
      start_time: '2025-05-15T14:00:00',
      seats: ['A1', 'A2'],
      total_price: 20,
      coupon_code: 'DISCOUNT10',
      status: 'CONFIRMED',
      created_at: '2025-05-14T10:00:00',
    },
    {
      booking_id: 'b2',
      user_id: 'u2',
      user_name: 'Jane Smith',
      showtime_id: 's2',
      movie_title: 'Avengers: End Game',
      cinema_name: 'Cinema 2',
      room_name: 'Room 2',
      start_time: '2025-05-15T17:00:00',
      seats: ['B1'],
      total_price: 12,
      coupon_code: null,
      status: 'PENDING',
      created_at: '2025-05-14T12:00:00',
    },
  ];
};

function AdminManageBooking() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchBookings();
      setBookings(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCancelBooking = (id) => {
    setBookings(bookings.map(booking => 
      booking.booking_id === id ? { ...booking, status: 'CANCELLED' } : booking
    ));
    message.success('Booking cancelled successfully');
  };

  const bookingColumns = [
    { title: 'ID', dataIndex: 'booking_id', key: 'booking_id' },
    { title: 'User', dataIndex: 'user_name', key: 'user_name' },
    { title: 'Movie', dataIndex: 'movie_title', key: 'movie_title' },
    { title: 'Cinema', dataIndex: 'cinema_name', key: 'cinema_name' },
    { title: 'Room', dataIndex: 'room_name', key: 'room_name' },
    { title: 'Showtime', dataIndex: 'start_time', key: 'start_time' },
    { title: 'Seats', dataIndex: 'seats', key: 'seats', render: seats => seats.join(', ') },
    { title: 'Total Price ($)', dataIndex: 'total_price', key: 'total_price' },
    { title: 'Coupon', dataIndex: 'coupon_code', key: 'coupon_code', render: code => code || 'N/A' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/admin/manage_booking/details/${record.booking_id}`)} />
          {record.status !== 'CANCELLED' && (
            <Popconfirm
              title="Are you sure to cancel this booking?"
              onConfirm={() => handleCancelBooking(record.booking_id)}
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={3}>Manage Bookings</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <Card className={styles.card}>
            <Statistic
              title="Total Bookings"
              value={bookings.length}
            />
          </Card>
        </Col>
        <Col xs={24} lg={24}>
          <Card className={styles.card}>
            <Table
              columns={bookingColumns}
              dataSource={bookings}
              rowKey="booking_id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageBooking;