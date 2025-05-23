/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, Typography, Statistic, Spin, Image } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './AdminManageMovie.module.scss';
import '../GlobalStyles.module.scss';
import MovieService from '../../../services/MovieService';

const { Title, Text: TypographyText } = Typography;

function AdminManageMovie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await MovieService.getAllMovies();
      setMovies(response.data);
    } catch (error) {
      toast.error('Failed to load movies', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (id) => {
    setDeleting(true);
    try {
      await MovieService.softDeleteMovie(id);
      setMovies(movies.filter(movie => movie.movie_id !== id));
      toast.success('Movie deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } catch (error) {
      toast.error('Failed to delete movie', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } finally {
      setDeleting(false);
    }
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
      render: text => <TypographyText>{text?.slice(0, 50) + '...'}</TypographyText>,
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
        const isReleased = releaseDate <= new Date();
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
        <Image
          src={url}
          alt="Poster"
          className={styles.posterImage}
          fallback="https://villagesonmacarthur.com/wp-content/uploads/2020/12/video-player-placeholder-very-large.png"
          preview
        />
      ),
    },
    {
      title: 'Adult Rating',
      dataIndex: 'adult',
      key: 'adult',
      render: rating => <TypographyText>{rating || 'N/A'}</TypographyText>,
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
            disabled={deleting}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this movie?"
            onConfirm={() => handleDeleteMovie(record.movie_id)}
            disabled={deleting}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
              disabled={deleting}
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
              disabled={deleting}
            >
              Add Movie
            </Button>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate('/admin/deleted_movies')}
              className={styles.viewDeletedButton}
              disabled={deleting}
            >
              View Deleted Movies
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
              className={styles.refreshButton}
              disabled={deleting}
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