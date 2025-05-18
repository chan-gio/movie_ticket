import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Statistic, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchShowtimes();
      setShowtimes(data);
    } catch (error) {
      message.error('Failed to load showtimes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShowtime = (id) => {
    setShowtimes(showtimes.filter(showtime => showtime.showtime_id !== id));
    message.success('Showtime deleted successfully');
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const showtimeColumns = [
    {
      title: 'ID',
      dataIndex: 'showtime_id',
      key: 'showtime_id',
      sorter: (a, b) => a.showtime_id.localeCompare(b.showtime_id),
      render: text => <TypographyText strong>{text}</TypographyText>,
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
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
      render: text => formatDateTime(text),
      sorter: (a, b) => new Date(a.start_time) - new Date(b.start_time),
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: price => <TypographyText type="success">${price}</TypographyText>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/manage_showtime/edit/${record.showtime_id}`)}
            className={styles.editButton}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this showtime?"
            onConfirm={() => handleDeleteShowtime(record.showtime_id)}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Manage Showtimes
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/manage_showtime/add')}
              className={styles.addButton}
            >
              Add Showtime
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
              className={styles.refreshButton}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={8}>
          <Card className={styles.statisticCard} hoverable>
            <Statistic
              title={<span className={styles.statisticTitle}>Total Showtimes</span>}
              value={showtimes.length}
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
            ) : showtimes.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>No showtimes found</TypographyText>
              </div>
            ) : (
              <Table
                columns={showtimeColumns}
                dataSource={showtimes}
                rowKey="showtime_id"
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

export default AdminManageShowtime;