import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Table, Space, Popconfirm, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageGenre.module.scss';
import './GlobalStyles.module.scss';

// Static Data
const initialGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Sci-Fi' },
];

const { Title } = Typography;

function AdminManageGenre() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState(initialGenres);

  const handleDeleteGenre = (id) => {
    setGenres(genres.filter(genre => genre.id !== id));
    message.success('Genre deleted successfully');
  };

  const genreColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/manage_genre/edit/${record.id}`)} />
          <Popconfirm
            title="Are you sure to delete this genre?"
            onConfirm={() => handleDeleteGenre(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Manage Genre</Title>
      <Card className={styles.card}>
        <Button type="primary" onClick={() => navigate('/admin/manage_genre/add')} style={{ marginBottom: 16 }}>
          Add Genre
        </Button>
        <Table
          columns={genreColumns}
          dataSource={genres}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default AdminManageGenre;