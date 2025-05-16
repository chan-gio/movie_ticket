import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Tabs, Statistic } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageCinema.module.scss';
import '../GlobalStyles.module.scss';

const { Title } = Typography;
const { TabPane } = Tabs;

// Mock API call to fetch cinemas
const fetchCinemas = async () => {
  // Simulate fetching data from the cinema table
  return [
    { cinema_id: 'c1', name: 'Cinema 1', address: '123 Main St, City 1' },
    { cinema_id: 'c2', name: 'Cinema 2', address: '456 Oak St, City 2' },
  ];
};

// Mock API call to fetch rooms
const fetchRooms = async () => {
  // Simulate fetching data from the room table
  return [
    { room_id: 'r1', cinema_id: 'c1', cinema_name: 'Cinema 1', room_name: 'Room 1', capacity: 100 },
    { room_id: 'r2', cinema_id: 'c2', cinema_name: 'Cinema 2', room_name: 'Room 2', capacity: 120 },
  ];
};

function AdminManageCinema() {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const fetchedCinemas = await fetchCinemas();
      setCinemas(fetchedCinemas);
      const fetchedRooms = await fetchRooms();
      setRooms(fetchedRooms);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDeleteCinema = (id) => {
    setCinemas(cinemas.filter(cinema => cinema.cinema_id !== id));
    message.success('Cinema deleted successfully');
  };

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter(room => room.room_id !== id));
    message.success('Room deleted successfully');
  };

  const cinemaColumns = [
    { title: 'ID', dataIndex: 'cinema_id', key: 'cinema_id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/manage_cinema/edit_cinema/${record.cinema_id}`)} />
          <Popconfirm
            title="Are you sure to delete this cinema?"
            onConfirm={() => handleDeleteCinema(record.cinema_id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const roomColumns = [
    { title: 'ID', dataIndex: 'room_id', key: 'room_id' },
    { title: 'Cinema', dataIndex: 'cinema_name', key: 'cinema_name' },
    { title: 'Room Name', dataIndex: 'room_name', key: 'room_name' },
    { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/manage_cinema/edit_room/${record.room_id}`)} />
          <Popconfirm
            title="Are you sure to delete this room?"
            onConfirm={() => handleDeleteRoom(record.room_id)}
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
      <Title level={3}>Manage Cinema</Title>
      <Tabs defaultActiveKey="cinemas">
        <TabPane tab="Cinemas" key="cinemas">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card className={styles.card}>
                <Statistic
                  title="Total Cinemas"
                  value={cinemas.length}
                />
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card className={styles.card}>
                <Button type="primary" onClick={() => navigate('/admin/manage_cinema/add_cinema')} style={{ marginBottom: 16 }}>
                  Add Cinema
                </Button>
                <Table
                  columns={cinemaColumns}
                  dataSource={cinemas}
                  rowKey="cinema_id"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Rooms" key="rooms">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card className={styles.card}>
                <Statistic
                  title="Total Rooms"
                  value={rooms.length}
                />
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card className={styles.card}>
                <Button type="primary" onClick={() => navigate('/admin/manage_cinema/add_room')} style={{ marginBottom: 16 }}>
                  Add Room
                </Button>
                <Table
                  columns={roomColumns}
                  dataSource={rooms}
                  rowKey="room_id"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default AdminManageCinema;