import React, { useState, useEffect } from "react";
import { Row, Col, Select, Button, Spin, Typography } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import styles from "./ShowMoviesPage.module.scss";
import bannerImg from "/assets/banner.png";
import MovieCard from "../../../components/UserPages/ShowMoviesPage/MovieCard";
import MovieService from "../../../services/MovieService";
import CinemaService from "../../../services/CinemaService";

const { Option } = Select;
const { Text } = Typography;

export default function ShowMoviesPage() {
  const location = useLocation();
  const initialType = location.state?.type || null;

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    type: initialType,
    date: null,
    cinema: null,
  });

  const moviesPerPage = 20;

  // Fetch cinemas on mount
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await CinemaService.getAllCinemas();
        // Ensure response is an array
        const cinemaData = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : [];
        setCinemas(cinemaData);
      } catch (error) {
        toast.error(error.message || "Failed to load cinemas", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: "#5f2eea" },
        });
        setCinemas([]); // Fallback to empty array on error
      }
    };
    fetchCinemas();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [page, filters.type]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      let response;
      if (filters.type === "now-showing") {
        response = await MovieService.getNowShowing();
      } else if (filters.type === "upcoming") {
        response = await MovieService.getUpcomingMovie();
      } else {
        response = await MovieService.getAllMoviesFE({
          perPage: moviesPerPage,
          page,
        });
      }

      // Handle paginated vs non-paginated responses
      const newMovies = response.data ? response.data : response;
      setMovies((prev) => (page === 1 ? newMovies : [...prev, ...newMovies]));
      setHasMore(newMovies.length === moviesPerPage);
    } catch (error) {
      toast.error(error.message || "Failed to load movies", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: "#5f2eea" },
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

    if (filters.date) {
      filtered = filtered.filter(
        (movie) => movie.release_date === filters.date
      );
    }

    if (filters.cinema) {
      filtered = filtered.filter((movie) =>
        movie.cinemas?.some((cinema) => cinema.cinema_id === filters.cinema)
      );
    }

    setFilteredMovies(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // Reset to first page on filter change
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.headerContainer}
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <span>
          Danh sách phim <br />
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
                placeholder="Chọn loại"
                className={styles.select}
                suffixIcon={<CalendarOutlined />}
                onChange={(value) => handleFilterChange("type", value)}
                value={filters.type}
                allowClear
              >
                <Option value="now-showing">Now Showing</Option>
                <Option value="upcoming">Upcoming Movie</Option>
              </Select>
              <Select
                placeholder="Chọn ngày"
                className={styles.select}
                suffixIcon={<CalendarOutlined />}
                onChange={(value) => handleFilterChange("date", value)}
                value={filters.date}
                allowClear
              >
                <Option value="2019-04-26">26 Apr 2019</Option>
                <Option value="2019-10-04">04 Oct 2019</Option>
                <Option value="2019-11-22">22 Nov 2019</Option>
                <Option value="2019-05-30">30 May 2019</Option>
                <Option value="2010-07-16">16 Jul 2010</Option>
              </Select>
              <Select
                placeholder="Chọn rạp"
                className={styles.select}
                suffixIcon={<EnvironmentOutlined />}
                onChange={(value) => handleFilterChange("cinema", value)}
                value={filters.cinema}
                allowClear
                loading={!cinemas.length && loading} // Show loading state
              >
                {Array.isArray(cinemas) && cinemas.length > 0 ? (
                  cinemas.map((cinema) => (
                    <Option key={cinema.cinema_id} value={cinema.cinema_id}>
                      {cinema.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled value={null}>
                    Không có rạp
                  </Option>
                )}
              </Select>
            </div>
          </Col>

          {/* Movie grid column */}
          <Col xs={24} md={24} lg={18}>
            {filteredMovies.length === 0 ? (
              <div className={styles.empty}>
                <Text>Không tìm thấy phim</Text>
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
