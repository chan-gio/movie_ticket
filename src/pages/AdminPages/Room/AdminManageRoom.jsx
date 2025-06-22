import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, Typography, Form, Input, Spin, Select, Statistic } from 'antd';
import { DeleteOutlined, SettingOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './AdminManageRoom.module.scss';
import { useCinemaById } from '../../../hooks/useCinemas';
import { 
  useRoomsByCinemaId, 
  useCreateRoom, 
  useSoftDeleteRoom, 
  useUpdateRoomStatus,
  useRefreshRooms
} from '../../../hooks/useRooms';

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

function AdminManageRoom() {
  const navigate = useNavigate();
  const { cinemaId } = useParams();
  const [addingRoom, setAddingRoom] = useState(false);
  const [roomForm] = Form.useForm();

  // Sử dụng custom hooks với react-query
  const { 
    data: cinema, 
    isLoading: isLoadingCinema, 
    error: cinemaError 
  } = useCinemaById(cinemaId);

  const { 
    data: roomsData, 
    isLoading: isLoadingRooms, 
    error: roomsError 
  } = useRoomsByCinemaId({ 
    cinemaId, 
    page: 1, 
    perPage: 100 
  });

  const { mutate: createRoom, isLoading: isCreating } = useCreateRoom();
  const { mutate: deleteRoom, isLoading: isDeleting } = useSoftDeleteRoom();
  const { mutate: updateStatus, isLoading: isUpdatingStatus } = useUpdateRoomStatus();
  const { mutate: refreshData, isLoading: isRefreshing } = useRefreshRooms();

  // Cập nhật data từ response
  const rooms = roomsData || [];

  // Show error message if there's an error
  if (cinemaError) {
    toast.error(cinemaError.message || 'Failed to load cinema data', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressStyle: { background: '#5f2eea' },
    });
  }

  if (roomsError) {
    toast.error(roomsError.message || 'Failed to load rooms data', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressStyle: { background: '#5f2eea' },
    });
  }

  const handleAddRoom = async (values) => {
    const roomData = {
      cinema_id: cinemaId,
      room_name: values.room_name,
      status: values.status || 'UNAVAILABLE',
    };
    
    createRoom(roomData, {
      onSuccess: () => {
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
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to add room', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' },
        });
      },
    });
  };

  const handleDeleteRoom = async (id) => {
    deleteRoom(id, {
      onSuccess: () => {
        toast.success('Room deleted successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' },
        });
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete room', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' },
        });
      },
    });
  };

  const handleUpdateStatus = async (roomId, status) => {
    updateStatus({ roomId, status }, {
      onSuccess: () => {
        toast.success('Room status updated successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' },
        });
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update room status', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' },
        });
      },
    });
  };

  const handleRefresh = () => {
    refreshData();
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

  const isLoading = isLoadingCinema || isLoadingRooms;
  const isSubmitting = isCreating || isDeleting || isUpdatingStatus;

  const roomColumns = [
    {
      title: 'No.',
      key: 'serial',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Room Name',
      dataIndex: 'room_name',
      key: 'room_name',
      sorter: (a, b) => a.room_name.localeCompare(b.room_name),
      render: (name) => (
        <TypographyText strong className={styles.roomName}>
          {name}
        </TypographyText>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: status => (
        <span
          className={`${styles.status} ${
            status === 'AVAILABLE' ? styles.available : styles.unavailable
          }`}
        >
          {status}
        </span>
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
            disabled={isSubmitting}
            loading={isUpdatingStatus}
          >
            <Option value="AVAILABLE">AVAILABLE</Option>
            <Option value="UNAVAILABLE">UNAVAILABLE</Option>
          </Select>
          <Button
            type="default"
            icon={<SettingOutlined />}
            onClick={() => navigate(`/admin/manage_seats/edit_room/${record.room_id}`)}
            className={styles.settingsButton}
            disabled={isSubmitting}
          >
            Settings
          </Button>
          <Popconfirm
            title="Are you sure to delete this room?"
            onConfirm={() => handleDeleteRoom(record.room_id)}
            disabled={isSubmitting}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
              disabled={isSubmitting}
              loading={isDeleting}
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
              onClick={handleRefresh}
              loading={isRefreshing}
              disabled={isSubmitting}
              className={styles.refreshButton}
            >
              Refresh
            </Button>
            <Button
              block
              onClick={() => navigate(-1)}
              className={styles.backButton}
              disabled={isLoading || isSubmitting}
            >
              Back
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Total Rooms"
              value={rooms.length}
              valueStyle={{ color: "#5f2eea" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Available Rooms"
              value={rooms.filter(room => room.status === 'AVAILABLE').length}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Unavailable Rooms"
              value={rooms.filter(room => room.status === 'UNAVAILABLE').length}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {isLoading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} className={styles.mainContent}>
          {/* Add Room Form */}
          <Col xs={24} lg={8}>
            <Card title="Add New Room" className={styles.formCard}>
              <Form
                form={roomForm}
                layout="vertical"
                onFinish={handleAddRoom}
                className={styles.form}
              >
                <Form.Item
                  label="Room Name"
                  name="room_name"
                  rules={[{ required: true, message: 'Please enter room name' }]}
                >
                  <Input 
                    placeholder="Enter room name" 
                    disabled={isSubmitting}
                  />
                </Form.Item>
                <Form.Item
                  label="Status"
                  name="status"
                  initialValue="UNAVAILABLE"
                >
                  <Select 
                    placeholder="Select status" 
                    disabled={isSubmitting}
                  >
                    <Option value="AVAILABLE">AVAILABLE</Option>
                    <Option value="UNAVAILABLE">UNAVAILABLE</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isCreating}
                      disabled={isSubmitting}
                      icon={<PlusOutlined />}
                    >
                      Add Room
                    </Button>
                    <Button
                      onClick={handleResetRoomForm}
                      disabled={isSubmitting}
                    >
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Rooms Table */}
          <Col xs={24} lg={16}>
            <Card title="Rooms List" className={styles.tableCard}>
              {rooms.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>
                    No rooms available for this cinema
                  </TypographyText>
                </div>
              ) : (
                <Table
                  columns={roomColumns}
                  dataSource={rooms}
                  rowKey="room_id"
                  pagination={false}
                  rowClassName={styles.tableRow}
                  className={styles.table}
                  scroll={{ x: 800 }}
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