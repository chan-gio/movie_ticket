/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, Typography, Form, Input, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './AdminManageRoom.module.scss';
import RoomService from '../../../services/RoomService';
import CinemaService from '../../../services/CinemaService';

const { Title, Text: TypographyText } = Typography;

function AdminManageRoom() {
  const navigate = useNavigate();
  const { cinemaId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [addingRoom, setAddingRoom] = useState(false);
  const [roomForm] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedCinema, fetchedRooms] = await Promise.all([
        CinemaService.getCinemaById(cinemaId),
        RoomService.getRoomsByCinemaId(cinemaId),
      ]);
      setCinema(fetchedCinema);
      setRooms(fetchedRooms);
    } catch (error) {
      toast.error(error.message || 'Failed to load data', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (values) => {
    setAddingRoom(true);
    try {
      console.log('Form values:', values); // Debug: Log form values
      const roomData = {
        cinema_id: cinemaId,
        room_name: values.room_name,
        capacity: Number(values.capacity), // Ensure capacity is a number
      };
      const newRoom = await RoomService.createRoom(roomData);
      setRooms([...rooms, newRoom]);
      roomForm.resetFields();
      toast.success('Room added successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } catch (error) {
      console.error('Add room error:', error); // Debug: Log error details
      toast.error(error.message || 'Failed to add room', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } finally {
      setAddingRoom(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    setDeleting(true);
    try {
      await RoomService.softDeleteRoom(id);
      setRooms(rooms.filter(room => room.room_id !== id));
      toast.success('Room deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } catch (error) {
      toast.error(error.message || 'Failed to delete room', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleResetRoomForm = () => {
    roomForm.resetFields();
    toast.info('Room form reset', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressStyle: { background: '#5f2eea' },
    });
  };

  const roomColumns = [
    {
      title: 'ID',
      dataIndex: 'room_id',
      key: 'room_id',
      sorter: (a, b) => a.room_id.localeCompare(b.room_id),
      render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: 'Room Name',
      dataIndex: 'room_name',
      key: 'room_name',
      sorter: (a, b) => a.room_name.localeCompare(b.room_name),
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: (a, b) => a.capacity - b.capacity,
      render: capacity => <TypographyText>{capacity} seats</TypographyText>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<SettingOutlined />}
            onClick={() => navigate(`/admin/manage_seats/edit_room/${record.room_id}`)}
            className={styles.settingsButton}
            disabled={deleting || addingRoom}
          >
            Settings
          </Button>
          <Popconfirm
            title="Are you sure to delete this room?"
            onConfirm={() => handleDeleteRoom(record.room_id)}
            disabled={deleting || addingRoom}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
              disabled={deleting || addingRoom}
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
            Manage Rooms {cinema ? `for ${cinema.name}` : ''}
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
              className={styles.refreshButton}
              disabled={deleting || addingRoom}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>
      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} className={styles.mainContent}>
          <Col xs={24}>
            <Card className={styles.tableCard}>
              <Title level={4} className={styles.sectionTitle}>
                Rooms
              </Title>
              <Form
                form={roomForm}
                layout="inline"
                onFinish={handleAddRoom}
                className={styles.roomForm}
              >
                <Form.Item
                  name="room_name"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input placeholder="Room Name" className={styles.input} />
                </Form.Item>
                <Form.Item
                  name="capacity"
                  rules={[
                    { required: true, message: 'Required' },
                    {
                      validator: (_, value) => {
                        const num = Number(value);
                        if (!value || (num > 0 && Number.isInteger(num))) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Must be a positive integer'));
                      },
                    },
                  ]}
                  normalize={value => (value ? Number(value) : value)}
                >
                  <Input
                    type="number"
                    placeholder="Capacity"
                    className={styles.input}
                    min={1}
                    step={1}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.addRoomButton}
                    disabled={deleting || addingRoom}
                    loading={addingRoom}
                  >
                    Add Room
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    onClick={handleResetRoomForm}
                    className={styles.resetButton}
                    disabled={deleting || addingRoom}
                  >
                    Reset
                  </Button>
                </Form.Item>
              </Form>
              {rooms.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>No rooms found for this cinema</TypographyText>
                </div>
              ) : (
                <Table
                  columns={roomColumns}
                  dataSource={rooms}
                  rowKey="room_id"
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
      )}
    </div>
  );
}

export default AdminManageRoom;