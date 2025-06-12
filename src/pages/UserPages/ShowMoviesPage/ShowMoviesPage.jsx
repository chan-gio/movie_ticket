import React, { useState, useMemo } from 'react';
import { Row, Col, Select, Button, Spin, Typography, DatePicker, Empty } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import { useLocation, useSearchParams } from 'react-router-dom';
import styles from './ShowMoviesPage.module.scss';
import bannerImg from '/assets/banner.png';
import MovieCard from '../../../components/UserPages/ShowMoviesPage/MovieCard';
import { useAllMovies, useNowShowingMovies, useUpcomingMovies, useSearchMovies } from '../../../hooks/useMovies';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text } = Typography;

export default function ShowMoviesPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const initialType = location.state?.type || null;
  const initialSearchQuery = location.state?.searchQuery || '';

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: initialType,
    date: null,
  });

  const moviesPerPage = 20;

  // Chọn hook dựa trên filters.type hoặc searchQuery
  const { data: nowShowingMovies = [], isLoading: isNowShowingLoading } = useNowShowingMovies();
  const { data: upcomingMovies = [], isLoading: isUpcomingLoading } = useUpcomingMovies();
  const { data: allMovies = [], isLoading: isAllMoviesLoading } = useAllMovies({ page, perPage: moviesPerPage });
  const { data: searchMovies = [], isLoading: isSearchLoading } = useSearchMovies({
    title: initialSearchQuery || searchQuery,
    page,
    perPage: moviesPerPage,
  });

  // Chọn dữ liệu dựa trên filters.type hoặc searchQuery
  const movies = initialSearchQuery || searchQuery
    ? searchMovies
    : filters.type === 'now-showing'
    ? nowShowingMovies
    : filters.type === 'upcoming'
    ? upcomingMovies
    : allMovies;

  const isLoading = initialSearchQuery || searchQuery
    ? isSearchLoading
    : filters.type === 'now-showing'
    ? isNowShowingLoading
    : filters.type === 'upcoming'
    ? isUpcomingLoading
    : isAllMoviesLoading;

  const hasMore = movies.length === moviesPerPage;

  // Tính toán filteredMovies với useMemo
  const filteredMovies = useMemo(() => {
    let filtered = [...movies];
    if (filters.date) {
      filtered = filtered.filter((movie) =>
        movie.showtimes?.some((showtime) => {
          const showtimeDate = dayjs(showtime.start_time).format('YYYY-MM-DD');
          return showtimeDate === filters.date;
        })
      );
    }
    return filtered;
  }, [movies, filters.date]);

  const handleFilterChange = (key, value) => {
    let newValue = value;
    if (key === 'date') {
      newValue = value && dayjs.isDayjs(value) ? value.format('YYYY-MM-DD') : null;
    }
    setFilters((prev) => ({
      ...prev,
      [key]: newValue,
    }));
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer} style={{ backgroundImage: `url(${bannerImg})` }}>
        <span>
          Danh sách phim <br />
          Danh sách các phim hiện đang chiếu rạp trên toàn quốc. Xem lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
        </span>
      </div>
      {isLoading && page === 1 ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24} lg={6}>
            <div className={styles.filterColumn}>
              <Select
                placeholder="Chọn loại"
                className={styles.select}
                suffixIcon={<VideoCameraOutlined />}
                onChange={(value) => handleFilterChange('type', value)}
                value={filters.type}
                allowClear
              >
                <Option value="now-showing">Now Showing</Option>
                <Option value="upcoming">Upcoming Movie</Option>
              </Select>
              <DatePicker
                placeholder="Chọn ngày"
                className={styles.select}
                onChange={(date) => handleFilterChange('date', date)}
                value={filters.date ? dayjs(filters.date, 'YYYY-MM-DD') : null}
                format="DD/MM/YYYY"
                allowClear
              />
            </div>
          </Col>
          <Col xs={24} md={24} lg={18}>
            {filteredMovies.length === 0 ? (
              <div className={styles.emptyState}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Text strong>
                      {searchQuery
                        ? `Không tìm được phim trùng khớp với "${searchQuery}"`
                        : 'Không tìm được phim'}
                    </Text>
                  }
                />
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {filteredMovies.map((movie) => (
                    <Col xs={24} sm={12} md={8} lg={6} style={{ padding: '10px' }} key={movie.movie_id}>
                      <MovieCard movie={movie} />
                    </Col>
                  ))}
                </Row>
                {hasMore && (
                  <div className={styles.loadMoreContainer}>
                    <Button
                      type="primary"
                      className={styles.loadMoreButton}
                      onClick={handleLoadMore}
                      loading={isLoading}
                    >
                      Xem thêm
                    </Button>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}