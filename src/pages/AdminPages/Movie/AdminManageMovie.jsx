import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Statistic } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AdminManageMovie.module.scss';
import '../GlobalStyles.module.scss';

const { Title } = Typography;

// Mock API call to fetch movies
const fetchMovies = async () => {
  // Simulate fetching data from the movie table
  return [
    { movie_id: 'm1', title: 'Spider-Man: Homecoming', description: 'A young Peter Parker begins to navigate his newfound identity as the web-slinging superhero Spider-Man.', duration: 133, release_date: '2025-05-15', poster_url: 'https://picfiles.alphacoders.com/148/148651.jpg' },
    { movie_id: 'm2', title: 'Avengers: End Game', description: 'The Avengers assemble to reverse Thanos’ actions and restore balance to the universe.', duration: 181, release_date: '2025-04-20', poster_url: 'https://via.placeholder.com/150?text=Avengers' },
  ];
};

function AdminManageMovie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMovies();
      setMovies(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDeleteMovie = (id) => {
    setMovies(movies.filter(movie => movie.movie_id !== id));
    message.success('Movie deleted successfully');
  };

  const movieColumns = [
    { title: 'ID', dataIndex: 'movie_id', key: 'movie_id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description', render: (text) => text.slice(0, 50) + '...' },
    { title: 'Duration (min)', dataIndex: 'duration', key: 'duration' },
    { title: 'Release Date', dataIndex: 'release_date', key: 'release_date' },
    { title: 'Poster', dataIndex: 'poster_url', key: 'poster_url', render: (url) => <img src={url} alt="Poster" style={{ width: 50, height: 50 }} /> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/manage_movie/edit/${record.movie_id}`)} />
          <Popconfirm
            title="Are you sure to delete this movie?"
            onConfirm={() => handleDeleteMovie(record.movie_id)}
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
      <Title level={3}>Manage Movie</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <Statistic
              title="Total Movies"
              value={movies.length}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Button type="primary" onClick={() => navigate('/admin/manage_movie/add')} style={{ marginBottom: 16 }}>
              Add Movie
            </Button>
            <Table
              columns={movieColumns}
              dataSource={movies}
              rowKey="movie_id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageMovie;