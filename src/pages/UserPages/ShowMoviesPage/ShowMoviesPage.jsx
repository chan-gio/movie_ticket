import React, { useState, useEffect } from "react";
import { Row, Col, Select, Button, Spin, Typography } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from "./ShowMoviesPage.module.scss";
import bannerImg from "/assets/banner.png";
import MovieCard from "../../../components/UserPages/ShowMoviesPage/MovieCard";
import MovieService from "../../../services/MovieService";

const { Option } = Select;
const { Text } = Typography;

export default function ShowMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    genre: null,
    city: null,
    date: null,
  });

  const moviesPerPage = 20;

  useEffect(() => {
    loadMovies();
  }, [page]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const response = await MovieService.getNowShowing({
        perPage: moviesPerPage,
        page,
      });
      const newMovies = response.data || [];
      setMovies(prev => page === 1 ? newMovies : [...prev, ...newMovies]);
      setHasMore(newMovies.length === moviesPerPage);
    } catch (error) {
      toast.error(error.message || 'Failed to load movies', {
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

  useEffect(() => {
    applyFilters();
  }, [movies, filters]);

  const applyFilters = () => {
    let filtered = [...movies];

    if (filters.genre) {
      filtered = filtered.filter(movie => 
        movie.genre.toLowerCase() === filters.genre.toLowerCase()
      );
    }

    if (filters.city) {
      // Note: Assuming movie data includes a city field or related showtime data
      // For now, this is a placeholder as the movie data structure lacks city info
      // filtered = filtered.filter(movie => movie.city?.toLowerCase() === filters.city.toLowerCase());
    }

    if (filters.date) {
      // Note: Assuming movie data includes showtime dates
      // For now, this is a placeholder as the movie data structure lacks date info
      // filtered = filtered.filter(movie => movie.showtimeDate === filters.date);
    }

    setFilteredMovies(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // Reset to first page on filter change
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.headerContainer}
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <span>
          Danh sách phim đang chiếu <br />
          Danh sách các phim hiện đang chiếu rạp trên toàn quốc 16/05/2025. Xem
          lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
        </span>
      </div>

      {loading && page === 1 ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {/* Filter column */}
          <Col xs={24} md={24} lg={6}>
            <div className={styles.filterColumn}>
              <Select
                placeholder="Chọn thể loại"
                className={styles.select}
                suffixIcon={<CalendarOutlined />}
                onChange={value => handleFilterChange('genre', value)}
                value={filters.genre}
                allowClear
              >
                <Option value="action">Hành động</Option>
                <Option value="comedy">Hài</Option>
                <Option value="drama">Tâm lý</Option>
                <Option value="sci-fi">Khoa học viễn tưởng</Option>
              </Select>
              <Select
                placeholder="Chọn thành phố"
                className={styles.select}
                suffixIcon={<EnvironmentOutlined />}
                onChange={value => handleFilterChange('city', value)}
                value={filters.city}
                allowClear
              >
                <Option value="hanoi">Hà Nội</Option>
                <Option value="hcm">Hồ Chí Minh</Option>
                <Option value="danang">Đà Nẵng</Option>
                <Option value="haiphong">Hải Phòng</Option>
                <Option value="cantho">Cần Thơ</Option>
                <Option value="nha-trang">Nha Trang</Option>
              </Select>
              <Select
                placeholder="Chọn ngày"
                className={styles.select}
                suffixIcon={<CalendarOutlined />}
                onChange={value => handleFilterChange('date', value)}
                value={filters.date}
                allowClear
              >
                <Option value="2025-05-15">15/05/2025</Option>
                <Option value="2025-05-16">16/05/2025</Option>
                <Option value="2025-05-17">17/05/2025</Option>
                <Option value="2025-05-18">18/05/2025</Option>
              </Select>
            </div>
          </Col>

          {/* Movie grid column */}
          <Col xs={24} md={24} lg={18}>
            {filteredMovies.length === 0 ? (
              <div className={styles.empty}>
                <Text>No movies found</Text>
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {filteredMovies.map((movie) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                      style={{ padding: "10px" }}
                      key={movie.movie_id}
                    >
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
                      loading={loading}
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