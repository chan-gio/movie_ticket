import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Table, Space, Popconfirm, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageMovie.module.scss';
import './GlobalStyles.module.scss';

// Static Data
const initialMovies = [
  { id: 1, title: 'Spider-Man: Homecoming', category: 'Action, Adventure', releaseDate: '2025-05-15' },
  { id: 2, title: 'Avengers: End Game', category: 'Action, Sci-Fi', releaseDate: '2025-04-20' },
];

const { Title } = Typography;

function AdminManageMovie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState(initialMovies);

  const handleDeleteMovie = (id) => {
    setMovies(movies.filter(movie => movie.id !== id));
    message.success('Movie deleted successfully');
  };

  const movieColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Release Date', dataIndex: 'releaseDate', key: 'releaseDate' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/manage_movie/edit/${record.id}`)} />
          <Popconfirm
            title="Are you sure to delete this movie?"
            onConfirm={() => handleDeleteMovie(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Manage Movie</Title>
      <Card className={styles.card}>
        <Button type="primary" onClick={() => navigate('/admin/manage_movie/add')} style={{ marginBottom: 16 }}>
          Add Movie
        </Button>
        <Table
          columns={movieColumns}
          dataSource={movies}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default AdminManageMovie;