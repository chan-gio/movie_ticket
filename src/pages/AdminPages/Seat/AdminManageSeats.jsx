import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Select, Statistic } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageSeats.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

// Mock API call to fetch rooms
const fetchRooms = async () => {
  return [
    { room_id: 'r1', room_name: 'Room 1', cinema_id: 'c1', cinema_name: 'Cinema 1' },
    { room_id: 'r2', room_name: 'Room 2', cinema_id: 'c2', cinema_name: 'Cinema 2' },
  ];
};

// Mock API call to fetch seats for a room
const fetchSeats = async (roomId) => {
  // Simulate fetching data from the seat table for a specific room
  const allSeats = [
    { seat_id: 's1', room_id: 'r1', seat_number: 'A1', seat_type: 'STANDARD' },
    { seat_id: 's2', room_id: 'r1', seat_number: 'A2', seat_type: 'VIP' },
    { seat_id: 's3', room_id: 'r2', seat_number: 'B1', seat_type: 'COUPLE' },
    { seat_id: 's4', room_id: 'r2', seat_number: 'B2', seat_type: 'STANDARD' },
  ];
  return allSeats.filter(seat => seat.room_id === roomId);
};

function AdminManageSeats() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const fetchedRooms = await fetchRooms();
      setRooms(fetchedRooms);
      if (fetchedRooms.length > 0) {
        setSelectedRoomId(fetchedRooms[0].room_id);
        const fetchedSeats = await fetchSeats(fetchedRooms[0].room_id);
        setSeats(fetchedSeats);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRoomChange = async (roomId) => {
    setSelectedRoomId(roomId);
    const fetchedSeats = await fetchSeats(roomId);
    setSeats(fetchedSeats);
  };

  const handleDeleteSeat = (id) => {
    setSeats(seats.filter(seat => seat.seat_id !== id));
    message.success('Seat deleted successfully');
  };

  const seatColumns = [
    { title: 'ID', dataIndex: 'seat_id', key: 'seat_id' },
    { title: 'Seat Number', dataIndex: 'seat_number', key: 'seat_number' },
    { title: 'Seat Type', dataIndex: 'seat_type', key: 'seat_type' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/manage_seats/edit/${record.seat_id}`)} />
          <Popconfirm
            title="Are you sure to delete this seat?"
            onConfirm={() => handleDeleteSeat(record.seat_id)}
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
      <Title level={3}>Manage Seats</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <TypographyText>Select Room:</TypographyText>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={selectedRoomId}
              onChange={handleRoomChange}
            >
              {rooms.map(room => (
                <Option key={room.room_id} value={room.room_id}>{`${room.room_name} (${room.cinema_name})`}</Option>
              ))}
            </Select>
            <Statistic
              title="Total Seats"
              value={seats.length}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Button type="primary" onClick={() => navigate(`/admin/manage_seats/add?roomId=${selectedRoomId}`)} style={{ marginBottom: 16 }}>
              Add Seat
            </Button>
            <Table
              columns={seatColumns}
              dataSource={seats}
              rowKey="seat_id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageSeats;