/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, Typography, Statistic, Spin, Image } from 'antd';
import { ReloadOutlined, UndoOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './DeletedMovies.module.scss';
import '../GlobalStyles.module.scss';
import MovieService from '../../../services/MovieService';

const { Title, Text: TypographyText } = Typography;

function DeletedMovies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await MovieService.getDeletedMovies();
      setMovies(response?.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load deleted movies', {
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

  const handleRestoreMovie = async (id) => {
    setRestoring(true);
    try {
      await MovieService.restoreMovie(id);
      setMovies(movies.filter(movie => movie.movie_id !== id));
      toast.success('Movie restored successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } catch (error) {
      toast.error(error.message || 'Failed to restore movie', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } finally {
      setRestoring(false);
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
          <Popconfirm
            title="Are you sure to restore this movie?"
            onConfirm={() => handleRestoreMovie(record.movie_id)}
            disabled={restoring}
          >
            <Button
              type="primary"
              icon={<UndoOutlined />}
              className={styles.restoreButton}
              disabled={restoring}
            >
              Restore
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
            Manage Deleted Movies
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/manage_movie')}
              className={styles.backButton}
              disabled={restoring}
            >
              Back to Manage Movies
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
              className={styles.refreshButton}
              disabled={restoring}
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
              title={<span className={styles.statisticTitle}>Total Deleted Movies</span>}
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
                <TypographyText>No deleted movies found</TypographyText>
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

export default DeletedMovies;