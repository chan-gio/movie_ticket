import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Typography, List, Button, Select, message } from 'antd';
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  return (
    <div>
      <Title level={3}>Booking Details - {booking.booking_id}</Title>
      <Card className={styles.card}>
        <TypographyText><strong>User Name:</strong> {booking.user_name}</TypographyText><br />
        <TypographyText><strong>User Email:</strong> {booking.user_email}</TypographyText><br />
        <TypographyText><strong>User Phone:</strong> {booking.user_phone}</TypographyText><br />
        <TypographyText><strong>Movie:</strong> {booking.movie_title}</TypographyText><br />
        <TypographyText><strong>Cinema:</strong> {booking.cinema_name}</TypographyText><br />
        <TypographyText><strong>Room:</strong> {booking.room_name}</TypographyText><br />
        <TypographyText><strong>Showtime:</strong> {booking.start_time}</TypographyText><br />
        <TypographyText><strong>Seats:</strong> {booking.seats.join(', ')}</TypographyText><br />
        <TypographyText><strong>Total Price:</strong> ${booking.total_price}</TypographyText><br />
        <TypographyText><strong>Coupon:</strong> {booking.coupon_code || 'N/A'} {booking.coupon_discount ? `(${booking.coupon_discount}% off)` : ''}</TypographyText><br />
        <TypographyText><strong>Status:</strong> </TypographyText>
        <Select
          value={status}
          onChange={handleStatusChange}
          style={{ width: 150, marginLeft: 8 }}
        >
          <Option value="PENDING">Pending</Option>
          <Option value="CONFIRMED">Confirmed</Option>
          <Option value="CANCELLED">Cancelled</Option>
        </Select><br />
        <TypographyText><strong>Created At:</strong> {booking.created_at}</TypographyText><br />
        <TypographyText><strong>Updated At:</strong> {booking.updated_at}</TypographyText><br />
        <Button onClick={() => navigate('/admin/manage_booking')} style={{ marginTop: 16 }}>
          Back to Bookings
        </Button>
      </Card>
    </div>
  );
}

export default AdminManageBookingDetails;