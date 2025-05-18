import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './AdminManageUser.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;

// Mock API call to fetch users
const fetchUsers = async () => {
  // Simulate fetching data from the user_account table
  return [
    { user_id: 'u1', username: 'john_doe', email: 'john.doe@tickitz.com', full_name: 'John Doe', phone: '1234567890', profile_picture_url: 'https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg' },
    { user_id: 'u2', username: 'jane_smith', email: 'jane.smith@tickitz.com', full_name: 'Jane Smith', phone: '0987654321', profile_picture_url: 'https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg' },
  ];
};

function AdminManageUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.user_id !== id));
    message.success('User deleted successfully');
  };

  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'user_id',
      key: 'user_id',
      sorter: (a, b) => a.user_id.localeCompare(b.user_id),
      render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: email => <TypographyText type="secondary">{email}</TypographyText>,
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'Profile Picture',
      dataIndex: 'profile_picture_url',
      key: 'profile_picture_url',
      render: (url) => (
        <img
          src={url}
          alt="Profile"
          className={styles.profilePicture}
          onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=User')}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => message.info('Edit user functionality is disabled per request')}
            className={styles.editButton}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteUser(record.user_id)}
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
            Manage Users
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
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {loading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : users.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>No users found</TypographyText>
              </div>
            ) : (
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="user_id"
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
    </div>
  );
}

export default AdminManageUser;