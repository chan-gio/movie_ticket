/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, message, Typography, Statistic, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './AdminManageMovie.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text: TypographyText } = Typography;

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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMovies();
      setMovies(data);
    } catch (error) {
      message.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = (id) => {
    setMovies(movies.filter(movie => movie.movie_id !== id));
    message.success('Movie deleted successfully');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const movieColumns = [
    {
      title: 'ID',
      dataIndex: 'movie_id',
      key: 'movie_id',
      sorter: (a, b) => a.movie_id.localeCompare(b.movie_id),
      render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: text => <TypographyText>{text.slice(0, 50) + '...'}</TypographyText>,
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a, b) => a.duration - b.duration,
      render: duration => <TypographyText>{duration} min</TypographyText>,
    },
    {
      title: 'Release Date',
      dataIndex: 'release_date',
      key: 'release_date',
      sorter: (a, b) => new Date(a.release_date) - new Date(b.release_date),
      render: date => {
        const releaseDate = new Date(date);
        const isReleased = releaseDate <= new Date(); // Current date: May 17, 2025
        return (
          <TypographyText type={isReleased ? 'success' : 'warning'}>
            {formatDate(date)}
          </TypographyText>
        );
      },
    },
    {
      title: 'Poster',
      dataIndex: 'poster_url',
      key: 'poster_url',
      render: (url) => (
        <img
          src={url}
          alt="Poster"
          className={styles.posterImage}
          onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=Poster')}
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
            onClick={() => navigate(`/admin/manage_movie/edit/${record.movie_id}`)}
            className={styles.editButton}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this movie?"
            onConfirm={() => handleDeleteMovie(record.movie_id)}
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
            Manage Movies
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/manage_movie/add')}
              className={styles.addButton}
            >
              Add Movie
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
              className={styles.refreshButton}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={8}>
          <Card className={styles.statisticCard} hoverable>
            <Statistic
              title={<span className={styles.statisticTitle}>Total Movies</span>}
              value={movies.length}
              valueStyle={{ color: '#5f2eea' }}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {loading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : movies.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>No movies found</TypographyText>
              </div>
            ) : (
              <Table
                columns={movieColumns}
                dataSource={movies}
                rowKey="movie_id"
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

export default AdminManageMovie;