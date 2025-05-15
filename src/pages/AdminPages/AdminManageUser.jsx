import { useState } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Table, Space, Popconfirm, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageUser.module.scss';
import './GlobalStyles.module.scss';

const { Title } = Typography;
const { Option } = Select;

// Static Data
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@tickitz.com', role: 'User' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@tickitz.com', role: 'User' },
];

function AdminManageUser() {
  const [userForm] = Form.useForm();
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = (values) => {
    const newUser = { id: users.length + 1, ...values };
    setUsers([...users, newUser]);
    userForm.resetFields();
    message.success('User added successfully');
  };

  const handleEditUser = (values) => {
    setUsers(users.map(user => (user.id === editingUser.id ? { ...user, ...values } : user)));
    setEditingUser(null);
    userForm.resetFields();
    message.success('User updated successfully');
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('User deleted successfully');
  };

  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
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
            onConfirm={() => handleDeleteUser(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Manage User</Title>
      <Card className={styles.card}>
        <Form
          form={userForm}
          layout="vertical"
          onFinish={editingUser ? handleEditUser : handleAddUser}
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Required' }, { type: 'email', message: 'Invalid email' }]}>
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Required' }]}>
                <Select placeholder="Select role">
                  <Option value="User">User</Option>
                  <Option value="Admin">Admin</Option>
                </Select>
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
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default AdminManageUser;