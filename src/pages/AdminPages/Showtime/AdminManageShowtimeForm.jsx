import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Form, Input, DatePicker, Button, message, Typography, Select } from 'antd';
import styles from './AdminManageShowtimeForm.module.scss';
import '../GlobalStyles.module.scss';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock API calls to fetch related data
const fetchShowtimes = async () => {
  return [
    { showtime_id: 's1', movie_id: 'm1', movie_title: 'Spider-Man: Homecoming', room_id: 'r1', room_name: 'Room 1', start_time: '2025-05-15T14:00:00', price: 10 },
    { showtime_id: 's2', movie_id: 'm2', movie_title: 'Avengers: End Game', room_id: 'r2', room_name: 'Room 2', start_time: '2025-05-15T17:00:00', price: 12 },
  ];
};

const fetchShowtimeById = async (id) => {
  const showtimes = await fetchShowtimes();
  return showtimes.find(showtime => showtime.showtime_id === id);
};

const fetchMovies = async () => {
  return [
    { movie_id: 'm1', title: 'Spider-Man: Homecoming' },
    { movie_id: 'm2', title: 'Avengers: End Game' },
  ];
};

const fetchRooms = async () => {
  return [
    { room_id: 'r1', room_name: 'Room 1', cinema_id: 'c1', cinema_name: 'Cinema 1' },
    { room_id: 'r2', room_name: 'Room 2', cinema_id: 'c2', cinema_name: 'Cinema 2' },
  ];
};

function AdminManageShowtimeForm({ isEditMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showtimeForm] = Form.useForm();
  const [showtimes, setShowtimes] = useState([]);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedShowtimes = await fetchShowtimes();
      setShowtimes(fetchedShowtimes);
      const fetchedMovies = await fetchMovies();
      setMovies(fetchedMovies);
      const fetchedRooms = await fetchRooms();
      setRooms(fetchedRooms);

      if (isEditMode) {
        const showtime = await fetchShowtimeById(id);
        if (showtime) {
          setEditingShowtime(showtime);
          showtimeForm.setFieldsValue({
            ...showtime,
            start_time: showtime.start_time ? moment(showtime.start_time) : null,
          });
        }
      }
    };
    loadData();
  }, [id, isEditMode, showtimeForm]);

  const handleAddShowtime = (values) => {
    const newShowtime = {
      showtime_id: `s${showtimes.length + 1}`,
      ...values,
      start_time: values.start_time.format('YYYY-MM-DDTHH:mm:ss'),
      movie_title: movies.find(movie => movie.movie_id === values.movie_id)?.title,
      room_name: rooms.find(room => room.room_id === values.room_id)?.room_name,
    };
    setShowtimes([...showtimes, newShowtime]);
    showtimeForm.resetFields();
    navigate('/admin/manage_showtime');
    message.success('Showtime added successfully');
  };

  const handleEditShowtime = (values) => {
    setShowtimes(showtimes.map(showtime => (showtime.showtime_id === editingShowtime.showtime_id ? {
      ...showtime,
      ...values,
      start_time: values.start_time.format('YYYY-MM-DDTHH:mm:ss'),
      movie_title: movies.find(movie => movie.movie_id === values.movie_id)?.title,
      room_name: rooms.find(room => room.room_id === values.room_id)?.room_name,
    } : showtime)));
    setEditingShowtime(null);
    showtimeForm.resetFields();
    navigate('/admin/manage_showtime');
    message.success('Showtime updated successfully');
  };

  return (
    <div>
      <Title level={3}>{isEditMode ? 'Edit Showtime' : 'Add Showtime'}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Form
              form={showtimeForm}
              layout="vertical"
              onFinish={isEditMode ? handleEditShowtime : handleAddShowtime}
            >
              <Form.Item label="Movie" name="movie_id" rules={[{ required: true, message: 'Required' }]}>
                <Select placeholder="Select a movie">
                  {movies.map(movie => (
                    <Option key={movie.movie_id} value={movie.movie_id}>{movie.title}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Room" name="room_id" rules={[{ required: true, message: 'Required' }]}>
                <Select placeholder="Select a room">
                  {rooms.map(room => (
                    <Option key={room.room_id} value={room.room_id}>{`${room.room_name} (${room.cinema_name})`}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Start Time" name="start_time" rules={[{ required: true, message: 'Required' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Price ($)" name="price" rules={[{ required: true, message: 'Required' }, { type: 'number', min: 0, message: 'Must be a non-negative number' }]}>
                <Input type="number" placeholder="Enter ticket price" />
              </Form.Item>
              <Button type="primary" htmlType="submit">{isEditMode ? 'Update Showtime' : 'Add Showtime'}</Button>
              <Button onClick={() => navigate('/admin/manage_showtime')} style={{ marginLeft: 8 }}>Cancel</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <Title level={4}>Showtime Preview</Title>
            <Text><strong>Movie:</strong> {showtimeForm.getFieldValue('movie_id') ? movies.find(movie => movie.movie_id === showtimeForm.getFieldValue('movie_id'))?.title : 'Not Set'}</Text><br />
            <Text><strong>Room:</strong> {showtimeForm.getFieldValue('room_id') ? rooms.find(room => room.room_id === showtimeForm.getFieldValue('room_id'))?.room_name : 'Not Set'}</Text><br />
            <Text><strong>Start Time:</strong> {showtimeForm.getFieldValue('start_time')?.format('YYYY-MM-DD HH:mm:ss') || 'Not Set'}</Text><br />
            <Text><strong>Price:</strong> ${showtimeForm.getFieldValue('price') || 'Not Set'}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageShowtimeForm;