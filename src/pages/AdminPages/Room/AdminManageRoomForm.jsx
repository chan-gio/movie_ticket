import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Form, Input, Button, message, Typography, Select } from 'antd';
import styles from './AdminManageRoomForm.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock API call to fetch a single room
const fetchRoomById = async (id) => {
  const rooms = [
    { room_id: 'r1', cinema_id: 'c1', cinema_name: 'Cinema 1', room_name: 'Room 1', capacity: 100 },
    { room_id: 'r2', cinema_id: 'c2', cinema_name: 'Cinema 2', room_name: 'Room 2', capacity: 120 },
  ];
  return rooms.find(room => room.room_id === id);
};

// Mock API call to fetch all rooms
const fetchRooms = async () => {
  return [
    { room_id: 'r1', cinema_id: 'c1', cinema_name: 'Cinema 1', room_name: 'Room 1', capacity: 100 },
    { room_id: 'r2', cinema_id: 'c2', cinema_name: 'Cinema 2', room_name: 'Room 2', capacity: 120 },
  ];
};

// Mock API call to fetch all cinemas
const fetchCinemas = async () => {
  return [
    { cinema_id: 'c1', name: 'Cinema 1' },
    { cinema_id: 'c2', name: 'Cinema 2' },
  ];
};

function AdminManageRoomForm({ isEditMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [roomForm] = Form.useForm();
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedRooms = await fetchRooms();
      setRooms(fetchedRooms);
      const fetchedCinemas = await fetchCinemas();
      setCinemas(fetchedCinemas);
      if (isEditMode) {
        const room = await fetchRoomById(id);
        if (room) {
          setEditingRoom(room);
          roomForm.setFieldsValue(room);
        }
      }
    };
    loadData();
  }, [id, isEditMode, roomForm]);

  const handleAddRoom = (values) => {
    const newRoom = {
      room_id: `r${rooms.length + 1}`,
      ...values,
      cinema_name: cinemas.find(cinema => cinema.cinema_id === values.cinema_id)?.name,
    };
    setRooms([...rooms, newRoom]);
    roomForm.resetFields();
    navigate('/admin/manage_cinema');
    message.success('Room added successfully');
  };

  const handleEditRoom = (values) => {
    setRooms(rooms.map(room => (room.room_id === editingRoom.room_id ? {
      ...room,
      ...values,
      cinema_name: cinemas.find(cinema => cinema.cinema_id === values.cinema_id)?.name,
    } : room)));
    setEditingRoom(null);
    roomForm.resetFields();
    navigate('/admin/manage_cinema');
    message.success('Room updated successfully');
  };

  return (
    <div>
      <Title level={3}>{isEditMode ? 'Edit Room' : 'Add Room'}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Form
              form={roomForm}
              layout="vertical"
              onFinish={isEditMode ? handleEditRoom : handleAddRoom}
            >
              <Form.Item label="Cinema" name="cinema_id" rules={[{ required: true, message: 'Required' }]}>
                <Select placeholder="Select a cinema">
                  {cinemas.map(cinema => (
                    <Option key={cinema.cinema_id} value={cinema.cinema_id}>{cinema.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Room Name" name="room_name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Enter room name" />
              </Form.Item>
              <Form.Item label="Capacity" name="capacity" rules={[{ required: true, message: 'Required' }, { type: 'number', min: 1, message: 'Must be a positive number' }]}>
                <Input type="number" placeholder="Enter room capacity" />
              </Form.Item>
              <Button type="primary" htmlType="submit">{isEditMode ? 'Update Room' : 'Add Room'}</Button>
              <Button onClick={() => navigate('/admin/manage_cinema')} style={{ marginLeft: 8 }}>Cancel</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <Title level={4}>Room Preview</Title>
            <Text><strong>Cinema:</strong> {roomForm.getFieldValue('cinema_id') ? cinemas.find(cinema => cinema.cinema_id === roomForm.getFieldValue('cinema_id'))?.name : 'Not Set'}</Text><br />
            <Text><strong>Room Name:</strong> {roomForm.getFieldValue('room_name') || 'Not Set'}</Text><br />
            <Text><strong>Capacity:</strong> {roomForm.getFieldValue('capacity') || 'Not Set'}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageRoomForm;