import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Statistic, Tag, Spin } from 'antd';
import { EyeOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (error) {
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (id) => {
    setBookings(bookings.map(booking => 
      booking.booking_id === id ? { ...booking, status: 'CANCELLED' } : booking
    ));
    message.success('Booking cancelled successfully');
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const bookingColumns = [
    {
      title: 'ID',
      dataIndex: 'booking_id',
      key: 'booking_id',
      sorter: (a, b) => a.booking_id.localeCompare(b.booking_id),
      render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: 'User',
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: 'Movie',
      dataIndex: 'movie_title',
      key: 'movie_title',
      sorter: (a, b) => a.movie_title.localeCompare(b.movie_title),
    },
    {
      title: 'Cinema',
      dataIndex: 'cinema_name',
      key: 'cinema_name',
      sorter: (a, b) => a.cinema_name.localeCompare(b.cinema_name),
    },
    {
      title: 'Room',
      dataIndex: 'room_name',
      key: 'room_name',
      sorter: (a, b) => a.room_name.localeCompare(b.room_name),
    },
    {
      title: 'Showtime',
      dataIndex: 'start_time',
      key: 'start_time',
      render: text => formatDateTime(text),
      sorter: (a, b) => new Date(a.start_time) - new Date(b.start_time),
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      render: seats => seats.join(', '),
    },
    {
      title: 'Total Price ($)',
      dataIndex: 'total_price',
      key: 'total_price',
      sorter: (a, b) => a.total_price - b.total_price,
      render: price => <TypographyText type="success">${price}</TypographyText>,
    },
    {
      title: 'Coupon',
      dataIndex: 'coupon_code',
      key: 'coupon_code',
      render: code => code || <TypographyText type="secondary">N/A</TypographyText>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: status => {
        let color;
        switch (status) {
          case 'CONFIRMED':
            color = 'green';
            break;
          case 'PENDING':
            color = 'gold';
            break;
          case 'CANCELLED':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/manage_booking/details/${record.booking_id}`)}
            className={styles.viewButton}
          >
            View
          </Button>
          {record.status !== 'CANCELLED' && (
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
              valueStyle={{ color: '#5f2eea' }}
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
                  pageSizeOptions: ['10', '20', '50'],
                }}
                rowClassName={styles.tableRow}
                className={styles.table}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageBooking;