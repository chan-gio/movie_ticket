import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Statistic } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageShowtime.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;

// Mock API call to fetch showtimes with cinema information
const fetchShowtimes = async () => {
  // Simulate fetching data from the showtime table with joined movie, room, and cinema data
  return [
    { showtime_id: 's1', movie_id: 'm1', movie_title: 'Spider-Man: Homecoming', room_id: 'r1', room_name: 'Room 1', cinema_name: 'Cinema 1', start_time: '2025-05-15T14:00:00', price: 10 },
    { showtime_id: 's2', movie_id: 'm2', movie_title: 'Avengers: End Game', room_id: 'r2', room_name: 'Room 2', cinema_name: 'Cinema 2', start_time: '2025-05-15T17:00:00', price: 12 },
  ];
};

function AdminManageShowtime() {
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchShowtimes();
      setShowtimes(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDeleteShowtime = (id) => {
    setShowtimes(showtimes.filter(showtime => showtime.showtime_id !== id));
    message.success('Showtime deleted successfully');
  };

  const showtimeColumns = [
    { title: 'ID', dataIndex: 'showtime_id', key: 'showtime_id' },
    { title: 'Movie', dataIndex: 'movie_title', key: 'movie_title' },
    { title: 'Cinema', dataIndex: 'cinema_name', key: 'cinema_name' },
    { title: 'Room', dataIndex: 'room_name', key: 'room_name' },
    { title: 'Start Time', dataIndex: 'start_time', key: 'start_time' },
    { title: 'Price ($)', dataIndex: 'price', key: 'price' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/manage_showtime/edit/${record.showtime_id}`)} />
          <Popconfirm
            title="Are you sure to delete this showtime?"
            onConfirm={() => handleDeleteShowtime(record.showtime_id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={3}>Manage Showtime</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <Statistic
              title="Total Showtimes"
              value={showtimes.length}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Button type="primary" onClick={() => navigate('/admin/manage_showtime/add')} style={{ marginBottom: 16 }}>
              Add Showtime
            </Button>
            <Table
              columns={showtimeColumns}
              dataSource={showtimes}
              rowKey="showtime_id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageShowtime;