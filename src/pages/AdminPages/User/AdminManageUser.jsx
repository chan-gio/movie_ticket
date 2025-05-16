import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Table, Space, Popconfirm, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageUser.module.scss';
import '../GlobalStyles.module.scss';

const { Title } = Typography;
const { Option } = Select;

// Mock API call to fetch users
const fetchUsers = async () => {
  // Simulate fetching data from the user_account table
  return [
    { user_id: 'u1', username: 'john_doe', email: 'john.doe@tickitz.com', full_name: 'John Doe', phone: '1234567890', profile_picture_url: 'https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg' },
    { user_id: 'u2', username: 'jane_smith', email: 'jane.smith@tickitz.com', full_name: 'Jane Smith', phone: '0987654321', profile_picture_url: 'https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg' },
  ];
};

function AdminManageUser() {
  const [userForm] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddUser = (values) => {
    const newUser = { user_id: `u${users.length + 1}`, ...values };
    setUsers([...users, newUser]);
    userForm.resetFields();
    message.success('User added successfully');
  };

  const handleEditUser = (values) => {
    setUsers(users.map(user => (user.user_id === editingUser.user_id ? { ...user, ...values } : user)));
    setEditingUser(null);
    userForm.resetFields();
    message.success('User updated successfully');
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.user_id !== id));
    message.success('User deleted successfully');
  };

  const userColumns = [
    { title: 'ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Profile Picture',
      dataIndex: 'profile_picture_url',
      key: 'profile_picture_url',
      render: (url) => <img src={url} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%' }} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingUser(record);
            userForm.setFieldsValue(record);
          }} />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteUser(record.user_id)}
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
      <Title level={3}>Manage User</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className={styles.card}>
            <Form
              form={userForm}
              layout="vertical"
              onFinish={editingUser ? handleEditUser : handleAddUser}
              style={{ marginBottom: 24 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                  <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Required' }]}>
                    <Input placeholder="Enter username" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Required' }, { type: 'email', message: 'Invalid email' }]}>
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Full Name" name="full_name" rules={[{ required: true, message: 'Required' }]}>
                    <Input placeholder="Enter full name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Required' }, { pattern: /^\d+$/, message: 'Must be a number' }]}>
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
              {editingUser && (
                <Button onClick={() => { setEditingUser(null); userForm.resetFields(); }} style={{ marginLeft: 8 }}>
                  Cancel
                </Button>
              )}
            </Form>
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="user_id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageUser;