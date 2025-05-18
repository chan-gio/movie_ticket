import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Select, Form, Input, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './AdminManageCinema.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

// Mock API call to fetch cinemas
const fetchCinemas = async () => {
// Simulate fetching data from the cinema table
return [
    { cinema_id: 'c1', name: 'Cinema 1', address: '123 Main St, City 1' },
    { cinema_id: 'c2', name: 'Cinema 2', address: '456 Oak St, City 2' },
];
};

// Mock API call to fetch rooms
const fetchRooms = async (cinemaId) => {
// Simulate fetching data from the room table
const allRooms = [
    { room_id: 'r1', cinema_id: 'c1', cinema_name: 'Cinema 1', room_name: 'Room 1', capacity: 100 },
    { room_id: 'r2', cinema_id: 'c1', cinema_name: 'Cinema 1', room_name: 'Room 2', capacity: 80 },
    { room_id: 'r3', cinema_id: 'c2', cinema_name: 'Cinema 2', room_name: 'Room 1', capacity: 120 },
    { room_id: 'r4', cinema_id: 'c2', cinema_name: 'Cinema 2', room_name: 'Room 2', capacity: 90 },
];
return allRooms.filter(room => room.cinema_id === cinemaId);
};

function AdminManageCinema() {
const navigate = useNavigate();
const [cinemas, setCinemas] = useState([]);
const [selectedCinemaId, setSelectedCinemaId] = useState(null);
const [rooms, setRooms] = useState([]);
const [loading, setLoading] = useState(true);
const [roomForm] = Form.useForm();

useEffect(() => {
    loadData();
}, []);

const loadData = async () => {
    setLoading(true);
    try {
    const fetchedCinemas = await fetchCinemas();
    setCinemas(fetchedCinemas);
    if (fetchedCinemas.length > 0) {
        setSelectedCinemaId(fetchedCinemas[0].cinema_id);
        const fetchedRooms = await fetchRooms(fetchedCinemas[0].cinema_id);
        setRooms(fetchedRooms);
    }
    } catch (error) {
    message.error('Failed to load cinemas');
    } finally {
    setLoading(false);
    }
};

const handleCinemaChange = async (cinemaId) => {
    setSelectedCinemaId(cinemaId);
    const fetchedRooms = await fetchRooms(cinemaId);
    setRooms(fetchedRooms);
};

const handleDeleteCinema = (id) => {
    setCinemas(cinemas.filter(cinema => cinema.cinema_id !== id));
    if (selectedCinemaId === id) {
    const remainingCinemas = cinemas.filter(cinema => cinema.cinema_id !== id);
    if (remainingCinemas.length > 0) {
        setSelectedCinemaId(remainingCinemas[0].cinema_id);
        handleCinemaChange(remainingCinemas[0].cinema_id);
    } else {
        setSelectedCinemaId(null);
        setRooms([]);
    }
    }
    message.success('Cinema deleted successfully');
};

const handleDeleteRoom = (id) => {
    setRooms(rooms.filter(room => room.room_id !== id));
    message.success('Room deleted successfully');
};

const handleAddRoom = (values) => {
    const newRoom = {
    room_id: `r${rooms.length + 1}`,
    cinema_id: selectedCinemaId,
    cinema_name: cinemas.find(cinema => cinema.cinema_id === selectedCinemaId)?.name,
    ...values,
    };
    setRooms([...rooms, newRoom]);
    roomForm.resetFields();
    message.success('Room added successfully');
};

const handleResetRoomForm = () => {
    roomForm.resetFields();
    message.info('Room form reset');
};

const cinemaColumns = [
    {
    title: 'ID',
    dataIndex: 'cinema_id',
    key: 'cinema_id',
    sorter: (a, b) => a.cinema_id.localeCompare(b.cinema_id),
    render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
        <Space>
        <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/manage_cinema/edit_cinema/${record.cinema_id}`)}
            className={styles.editButton}
        >
            Edit
        </Button>
        <Popconfirm
            title="Are you sure to delete this cinema? This will also delete all associated rooms."
            onConfirm={() => handleDeleteCinema(record.cinema_id)}
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
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/manage_cinema/edit_room/${record.room_id}`)}
            className={styles.editButton}
        >
            Edit
        </Button>
        <Button
            type="default"
            icon={<SettingOutlined />}
            onClick={() => navigate(`/admin/manage_seats/edit_room/${record.room_id}`)}
            className={styles.settingsButton}
        >
            Settings
        </Button>
        <Popconfirm
            title="Are you sure to delete this room?"
            onConfirm={() => handleDeleteRoom(record.room_id)}
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
            Manage Cinemas
        </Title>
        </Col>
        <Col>
        <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadData}
            loading={loading}
            className={styles.refreshButton}
        >
            Refresh
        </Button>
        </Col>
    </Row>
    {loading ? (
        <div className={styles.loading}>
        <Spin size="large" />
        </div>
    ) : (
        <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={12}>
            <Card className={styles.tableCard}>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/manage_cinema/add_cinema')}
                className={styles.addButton}
            >
                Add Cinema
            </Button>
            {cinemas.length === 0 ? (
                <div className={styles.empty}>
                <TypographyText>No cinemas found</TypographyText>
                </div>
            ) : (
                <Table
                columns={cinemaColumns}
                dataSource={cinemas}
                rowKey="cinema_id"
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
        <Col xs={24} lg={12}>
            <Card className={styles.tableCard}>
            <TypographyText className={styles.label}>Select Cinema:</TypographyText>
            <Select
                value={selectedCinemaId}
                onChange={handleCinemaChange}
                className={styles.select}
                placeholder="Select a cinema"
                disabled={cinemas.length === 0}
            >
                {cinemas.map(cinema => (
                <Option key={cinema.cinema_id} value={cinema.cinema_id}>{cinema.name}</Option>
                ))}
            </Select>
            {selectedCinemaId && (
                <>
                <Title level={4} className={styles.sectionTitle}>
                    Rooms in {cinemas.find(cinema => cinema.cinema_id === selectedCinemaId)?.name}
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
                    rules={[{ required: true, message: 'Required' }, { type: 'number', min: 1, message: 'Must be a positive number' }]}
                    >
                    <Input type="number" placeholder="Capacity" className={styles.input} />
                    </Form.Item>
                    <Form.Item>
                    <Button type="primary" htmlType="submit" className={styles.addRoomButton}>
                        Add Room
                    </Button>
                    </Form.Item>
                    <Form.Item>
                    <Button onClick={handleResetRoomForm} className={styles.resetButton}>
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
                </>
            )}
            </Card>
        </Col>
        </Row>
    )}
    </div>
);
}

export default AdminManageCinema;