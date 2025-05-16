import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Row, Col, Card, Form, Input, Select, Button, message, Typography } from 'antd';
import styles from './AdminManageSeatForm.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

// Mock API call to fetch a single seat
const fetchSeatById = async (id) => {
  const seats = [
    { seat_id: 's1', room_id: 'r1', seat_number: 'A1', seat_type: 'STANDARD' },
    { seat_id: 's2', room_id: 'r1', seat_number: 'A2', seat_type: 'VIP' },
    { seat_id: 's3', room_id: 'r2', seat_number: 'B1', seat_type: 'COUPLE' },
    { seat_id: 's4', room_id: 'r2', seat_number: 'B2', seat_type: 'STANDARD' },
  ];
  return seats.find(seat => seat.seat_id === id);
};

// Mock API call to fetch all seats
const fetchSeats = async () => {
  return [
    { seat_id: 's1', room_id: 'r1', seat_number: 'A1', seat_type: 'STANDARD' },
    { seat_id: 's2', room_id: 'r1', seat_number: 'A2', seat_type: 'VIP' },
    { seat_id: 's3', room_id: 'r2', seat_number: 'B1', seat_type: 'COUPLE' },
    { seat_id: 's4', room_id: 'r2', seat_number: 'B2', seat_type: 'STANDARD' },
  ];
};

// Mock API call to fetch room details
const fetchRoomById = async (id) => {
  const rooms = [
    { room_id: 'r1', room_name: 'Room 1', cinema_id: 'c1', cinema_name: 'Cinema 1' },
    { room_id: 'r2', room_name: 'Room 2', cinema_id: 'c2', cinema_name: 'Cinema 2' },
  ];
  return rooms.find(room => room.room_id === id);
};

function AdminManageSeatForm({ isEditMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [seatForm] = Form.useForm();
  const [seats, setSeats] = useState([]);
  const [room, setRoom] = useState(null);
  const [editingSeat, setEditingSeat] = useState(null);

  // Extract roomId from query parameters for adding a seat
  const query = new URLSearchParams(location.search);
  const roomId = query.get('roomId');

  useEffect(() => {
    const loadData = async () => {
      const fetchedSeats = await fetchSeats();
      setSeats(fetchedSeats);

      // Fetch room details based on roomId (for add mode) or from editing seat (edit mode)
      const targetRoomId = isEditMode ? (await fetchSeatById(id))?.room_id : roomId;
      if (targetRoomId) {
        const fetchedRoom = await fetchRoomById(targetRoomId);
        setRoom(fetchedRoom);
        seatForm.setFieldsValue({ room_id: targetRoomId });
      }

      if (isEditMode) {
        const seat = await fetchSeatById(id);
        if (seat) {
          setEditingSeat(seat);
          seatForm.setFieldsValue(seat);
        }
      }
    };
    loadData();
  }, [id, roomId, isEditMode, seatForm]);

  const handleAddSeat = (values) => {
    const newSeat = { seat_id: `s${seats.length + 1}`, ...values };
    setSeats([...seats, newSeat]);
    seatForm.resetFields();
    navigate('/admin/manage_seats');
    message.success('Seat added successfully');
  };

  const handleEditSeat = (values) => {
    setSeats(seats.map(seat => (seat.seat_id === editingSeat.seat_id ? { ...seat, ...values } : seat)));
    setEditingSeat(null);
    seatForm.resetFields();
    navigate('/admin/manage_seats');
    message.success('Seat updated successfully');
  };

  return (
    <div>
      <Title level={3}>{isEditMode ? 'Edit Seat' : 'Add Seat'}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Form
              form={seatForm}
              layout="vertical"
              onFinish={isEditMode ? handleEditSeat : handleAddSeat}
            >
              <Form.Item label="Room" name="room_id" rules={[{ required: true, message: 'Required' }]} hidden>
                <Input disabled />
              </Form.Item>
              <TypographyText><strong>Room:</strong> {room ? `${room.room_name} (${room.cinema_name})` : 'Not Set'}</TypographyText>
              <Form.Item label="Seat Number" name="seat_number" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Enter seat number (e.g., A1)" />
              </Form.Item>
              <Form.Item label="Seat Type" name="seat_type" rules={[{ required: true, message: 'Required' }]}>
                <Select placeholder="Select seat type">
                  <Option value="STANDARD">Standard</Option>
                  <Option value="VIP">VIP</Option>
                  <Option value="COUPLE">Couple</Option>
                </Select>
              </Form.Item>
              <Button type="primary" htmlType="submit">{isEditMode ? 'Update Seat' : 'Add Seat'}</Button>
              <Button onClick={() => navigate('/admin/manage_seats')} style={{ marginLeft: 8 }}>Cancel</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <Title level={4}>Seat Preview</Title>
            <TypographyText><strong>Room:</strong> {room ? `${room.room_name} (${room.cinema_name})` : 'Not Set'}</TypographyText><br />
            <TypographyText><strong>Seat Number:</strong> {seatForm.getFieldValue('seat_number') || 'Not Set'}</TypographyText><br />
            <TypographyText><strong>Seat Type:</strong> {seatForm.getFieldValue('seat_type') || 'Not Set'}</TypographyText>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageSeatForm;