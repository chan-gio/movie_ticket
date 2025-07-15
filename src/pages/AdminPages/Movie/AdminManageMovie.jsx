import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, Typography, Statistic, Spin, Image, Select, Input } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './AdminManageMovie.module.scss';
import { useAdminMoviesWithSearch, useDeleteMovie, useRefreshMovies } from '../../../hooks/useMovies';

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;
const { Search } = Input;

function AdminManageMovie() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Sử dụng custom hooks với react-query
  const {
    data: moviesData,
    isLoading,
    error,
    isSearching
  } = useAdminMoviesWithSearch({
    title: searchType === 'title' ? searchTerm : undefined,
    page: pagination.current,
    perPage: pagination.pageSize
  });

  const { mutate: deleteMovie, isLoading: isDeleting } = useDeleteMovie();
  const { mutate: refreshData, isLoading: isRefreshing } = useRefreshMovies();

  // Cập nhật data từ response
  const movies = moviesData?.data || [];
  const paginationData = {
    current: moviesData?.current_page || 1,
    pageSize: moviesData?.per_page || 10,
    total: moviesData?.total || 0
  };

  // Show error message if there's an error
  if (error) {
    toast.error(error.message || 'Failed to load movies', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressStyle: { background: '#5f2eea' }
    });
  }

  const handleSearch = value => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearchChange = e => {
    setInputValue(e.target.value);
  };

  const handleSearchTypeChange = value => {
    setSearchType(value);
    setSearchTerm('');
    setInputValue('');
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setInputValue('');
    setSearchType('title');
    setPagination({ current: 1, pageSize: 10, total: 0 });
    refreshData({
      page: 1,
      perPage: 10,
      title: undefined
    });
  };

  const handleDeleteMovie = async id => {
    deleteMovie(id, {
      onSuccess: () => {
        toast.success('Movie deleted successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' }
        });
      },
      onError: error => {
        toast.error(error.message || 'Failed to delete movie', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' }
        });
      }
    });
  };

  const handleTableChange = paginationConfig => {
    setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      total: paginationConfig.total
    });
  };

  const formatDate = date => {
    return date ? new Date(date).toLocaleDateString('en-GB', { dateStyle: 'medium' }) : 'N/A';
  };

  const movieColumns = [
    {
      title: 'No.',
      key: 'serial',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: 'Poster',
      dataIndex: 'poster_url',
      key: 'poster_url',
      width: 100,
      render: url => <Image width={80} height={120} src={url || 'https://wallpapercave.com/wp/wp1816326.jpg'} alt="Movie Poster" fallback="https://wallpapercave.com/wp/wp1816326.jpg" className={styles.posterImage} />
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: title => (
        <TypographyText strong className={styles.movieTitle}>
          {title}
        </TypographyText>
      )
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      sorter: (a, b) => (a.genre || '').localeCompare(b.genre || ''),
      render: genre => genre || 'N/A'
    },
    {
      title: 'Adult',
      dataIndex: 'adult',
      key: 'adult',
      sorter: (a, b) => (a.adult || '').localeCompare(b.adult || ''),
      render: adult => adult || 'N/A'
    },
    {
      title: 'Release Date',
      dataIndex: 'release_date',
      key: 'release_date',
      sorter: (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0),
      render: date => formatDate(date)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/admin/manage_movie/details/${record.movie_id}`)} className={styles.viewButton}>
            View
          </Button>
          <Button type="default" icon={<EditOutlined />} onClick={() => navigate(`/admin/manage_movie/edit/${record.movie_id}`)} className={styles.editButton}>
            Edit
          </Button>
          <Popconfirm title="Are you sure to delete this movie?" onConfirm={() => handleDeleteMovie(record.movie_id)}>
            <Button type="danger" icon={<DeleteOutlined />} className={styles.deleteButton} loading={isDeleting}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
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
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/manage_movie/add')} className={styles.addButton}>
              Add Movie
            </Button>
            <Button type="default" onClick={() => navigate('/admin/manage_movie/deleted')} className={styles.deletedButton}>
              Deleted Movies
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic title="Total Movies" value={paginationData.total} valueStyle={{ color: '#5f2eea' }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic title="Current Page" value={movies.length} suffix={`/ ${paginationData.total}`} valueStyle={{ color: '#4b9bff' }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic title="Search Results" value={isSearching ? movies.length : 0} suffix={isSearching ? ' found' : 'No search'} valueStyle={{ color: '#ff6a6a' }} />
          </Card>
        </Col>
      </Row>

      {/* Search and Controls */}
      <Row gutter={[16, 16]} className={styles.controlsRow}>
        <Col xs={24} lg={8}>
          <Select value={searchType} onChange={handleSearchTypeChange} style={{ width: '100%' }} className={styles.searchTypeSelect}>
            <Option value="title">Search by Title</Option>
            <Option value="adult">Search by Adult</Option>
          </Select>
        </Col>
        <Col xs={24} lg={12}>
          <Search placeholder={`Search by ${searchType}...`} value={inputValue} onChange={handleSearchChange} onSearch={handleSearch} enterButton={<SearchOutlined />} className={styles.searchInput} allowClear />
        </Col>
        <Col xs={24} lg={4}>
          <Button type="primary" icon={<ReloadOutlined />} onClick={handleRefresh} loading={isRefreshing} className={styles.refreshButton} block>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Movies Table */}
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {isLoading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : movies.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>{isSearching ? 'No movies found' : 'No movies available'}</TypographyText>
              </div>
            ) : (
              <Table
                columns={movieColumns}
                dataSource={movies}
                rowKey="movie_id"
                pagination={{
                  current: paginationData.current,
                  pageSize: paginationData.pageSize,
                  total: paginationData.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} movies`
                }}
                onChange={handleTableChange}
                rowClassName={styles.tableRow}
                className={styles.table}
                scroll={{ x: 'max-content' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageMovie;
