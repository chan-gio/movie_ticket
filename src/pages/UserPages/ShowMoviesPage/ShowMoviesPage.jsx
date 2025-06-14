import React, { useState, useMemo, useEffect } from 'react';
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
  const [allLoadedMovies, setAllLoadedMovies] = useState([]);

  const moviesPerPage = 20;

  // Chọn hook dựa trên filters.type hoặc searchQuery, bao gồm isFetching
  const { data: nowShowingMovies = [], isFetching: isNowShowingFetching } = useNowShowingMovies();
  const { data: upcomingMovies = [], isFetching: isUpcomingFetching } = useUpcomingMovies();
  const { data: allMovies = [], isFetching: isAllMoviesFetching } = useAllMovies({ page, perPage: moviesPerPage });
  const { data: searchMovies = [], isFetching: isSearchFetching } = useSearchMovies({
    title: initialSearchQuery || searchQuery,
    page,
    perPage: moviesPerPage,
  });

  // Chọn dữ liệu và trạng thái fetching dựa trên filters.type hoặc searchQuery
  const movies = initialSearchQuery || searchQuery
    ? searchMovies
    : filters.type === 'now-showing'
    ? nowShowingMovies
    : filters.type === 'upcoming'
    ? upcomingMovies
    : allMovies;

  const isFetching = initialSearchQuery || searchQuery
    ? isSearchFetching
    : filters.type === 'now-showing'
    ? isNowShowingFetching
    : filters.type === 'upcoming'
    ? isUpcomingFetching
    : isAllMoviesFetching;

  const hasMore = movies.length === moviesPerPage;

  // Cập nhật allLoadedMovies khi movies, page, filters hoặc searchQuery thay đổi
  useEffect(() => {
    if (page === 1) {
      setAllLoadedMovies(movies);
    } else if (movies.length > 0) {
      setAllLoadedMovies((prev) => {
        const newMovies = movies.filter(
          (movie) => !prev.some((existing) => existing.movie_id === movie.movie_id)
        );
        return [...prev, ...newMovies];
      });
    }
  }, [movies, page, filters.type, searchQuery, initialSearchQuery]);

  // Tính toán filteredMovies với useMemo
  const filteredMovies = useMemo(() => {
    let filtered = [...allLoadedMovies];
    if (filters.date) {
      filtered = filtered.filter((movie) =>
        movie.showtimes?.some((showtime) => {
          const showtimeDate = dayjs(showtime.start_time).format('YYYY-MM-DD');
          return showtimeDate === filters.date;
        })
      );
    }
    return filtered;
  }, [allLoadedMovies, filters.date]);

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
    setAllLoadedMovies([]);
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
      {isFetching && page === 1 ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} style={{ display: 'flex', justifyContent: 'center' }}>
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
                <div className={styles.moviesGrid}>
                  {filteredMovies.map((movie) => (
                    <div key={movie.movie_id}>
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
                {isFetching && page > 1 && (
                  <div className={styles.loadingMore}>
                    <Spin size="large" />
                  </div>
                )}
                {hasMore && (
                  <div className={styles.loadMoreContainer}>
                    <Button
                      type="primary"
                      className={styles.loadMoreButton}
                      onClick={handleLoadMore}
                      loading={isFetching && page > 1}
                      disabled={isFetching && page > 1}
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