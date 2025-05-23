/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, Typography, Form, Input, Spin, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import { toastSuccess, toastError, toastInfo } from '../../../utils/toastNotifier';
import styles from './AdminManageRoom.module.scss';
import RoomService from '../../../services/RoomService';
import CinemaService from '../../../services/CinemaService';

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

function AdminManageRoom() {
  const navigate = useNavigate();
  const { cinemaId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [addingRoom, setAddingRoom] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
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
      toastError(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (values) => {
    setAddingRoom(true);
    try {
      const roomData = {
        cinema_id: cinemaId,
        room_name: values.room_name,
        status: values.status || 'UNAVAILABLE',
      };
      const newRoom = await RoomService.createRoom(roomData);
      setRooms([...rooms, newRoom]);
      roomForm.resetFields();
      toastSuccess('Room added successfully');
    } catch (error) {
      toastError(error.message || 'Failed to add room');
    } finally {
      setAddingRoom(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    setDeleting(true);
    try {
      await RoomService.softDeleteRoom(id);
      setRooms(rooms.filter(room => room.room_id !== id));
      toastSuccess('Room deleted successfully');
    } catch (error) {
      toastError(error.message || 'Failed to delete room');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateStatus = async (roomId, status) => {
    setUpdatingStatus(roomId);
    try {
      await RoomService.updateRoomStatus(roomId, status);
      setRooms(rooms.map(room =>
        room.room_id === roomId ? { ...room, status } : room
      ));
      toastSuccess('Room status updated successfully');
    } catch (error) {
      toastError(error.message || 'Failed to update room status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleResetRoomForm = () => {
    roomForm.resetFields();
    toastInfo('Room form reset');
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: status => (
        <TypographyText type={status === 'AVAILABLE' ? 'success' : 'danger'}>
          {status}
        </TypographyText>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Select
            value={record.status}
            onChange={value => handleUpdateStatus(record.room_id, value)}
            style={{ width: 140 }}
            disabled={deleting || addingRoom || updatingStatus === record.room_id}
            loading={updatingStatus === record.room_id}
          >
            <Option value="AVAILABLE">AVAILABLE</Option>
            <Option value="UNAVAILABLE">UNAVAILABLE</Option>
          </Select>
          <Button
            type="default"
            icon={<SettingOutlined />}
            onClick={() => navigate(`/admin/manage_seats/edit_room/${record.room_id}`)}
            className={styles.settingsButton}
            disabled={deleting || addingRoom || updatingStatus}
          >
            Settings
          </Button>
          <Popconfirm
            title="Are you sure to delete this room?"
            onConfirm={() => handleDeleteRoom(record.room_id)}
            disabled={deleting || addingRoom || updatingStatus}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
              disabled={deleting || addingRoom || updatingStatus}
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
              disabled={deleting || addingRoom || updatingStatus}
            >
              Refresh
            </Button>
            <Button
              block
              onClick={() => navigate(-1)}
              className={styles.backButton}
              disabled={loading || deleting || addingRoom || updatingStatus}
            >
              Back
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
                autoComplete="off"
              >
                <Form.Item
                  name="room_name"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input
                    placeholder="Room Name"
                    className={styles.input}
                    autoComplete="new-room-name"
                    data-form-type="room-name"
                  />
                </Form.Item>
                <Form.Item name="status" initialValue="UNAVAILABLE" hidden>
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.addRoomButton}
                    disabled={deleting || addingRoom || updatingStatus}
                    loading={addingRoom}
                  >
                    Add Room
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    onClick={handleResetRoomForm}
                    className={styles.resetButton}
                    disabled={deleting || addingRoom || updatingStatus}
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