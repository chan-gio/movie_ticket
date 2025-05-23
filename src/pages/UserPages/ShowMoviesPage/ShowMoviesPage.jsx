import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Select,
  Button,
  Spin,
  Typography,
  DatePicker,
  Empty,
} from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useLocation, useSearchParams } from "react-router-dom";
import styles from "./ShowMoviesPage.module.scss";
import bannerImg from "/assets/banner.png";
import MovieCard from "../../../components/UserPages/ShowMoviesPage/MovieCard";
import MovieService from "../../../services/MovieService";
import dayjs from "dayjs";

const { Option } = Select;
const { Text } = Typography;

export default function ShowMoviesPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const initialType = location.state?.type || null;
  const initialSearchQuery = location.state?.searchQuery || "";
  const initialSearchResults = location.state?.searchResults || null;

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    type: initialType,
    date: null,
  });

  const moviesPerPage = 20;

  useEffect(() => {
    if (initialSearchQuery && initialSearchResults) {
      const newMovies = initialSearchResults.data || [];
      setMovies(newMovies);
      setHasMore(newMovies.length === moviesPerPage);
      setPage(1); // Reset page to 1 for new search
    } else {
      loadMovies();
    }
  }, [page, filters.type, initialSearchQuery, initialSearchResults]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      let response;
      if (initialSearchQuery) {
        response = await MovieService.searchByTitleFE({
          title: initialSearchQuery,
          perPage: moviesPerPage,
          page,
        });
      } else if (filters.type === "now-showing") {
        response = await MovieService.getNowShowing();
      } else if (filters.type === "upcoming") {
        response = await MovieService.getUpcomingMovie();
      } else {
        response = await MovieService.getAllMoviesFE({
          perPage: moviesPerPage,
          page,
        });
      }

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
      setMovies([]); // Set empty array on error to trigger empty state
      setHasMore(false);
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
      filtered = filtered.filter((movie) =>
        movie.showtimes?.some((showtime) => {
          const showtimeDate = dayjs(showtime.start_time).format("YYYY-MM-DD");
          return showtimeDate === filters.date;
        })
      );
    }

    setFilteredMovies(filtered);
  };

  const handleFilterChange = (key, value) => {
    let newValue = value;
    if (key === "date") {
      console.log("DatePicker value:", value);
      newValue =
        value && dayjs.isDayjs(value) ? value.format("YYYY-MM-DD") : null;
      console.log("Formatted date:", newValue);
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
      <div
        className={styles.headerContainer}
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <span>
          Danh sách phim <br />
          Danh sách các phim hiện đang chiếu rạp trên toàn quốc. Xem lịch chiếu
          phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
        </span>
      </div>
      {loading && page === 1 ? (
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
                onChange={(value) => handleFilterChange("type", value)}
                value={filters.type}
                allowClear
              >
                <Option value="now-showing">Now Showing</Option>
                <Option value="upcoming">Upcoming Movie</Option>
              </Select>
              <DatePicker
                placeholder="Chọn ngày"
                className={styles.select}
                onChange={(date) => handleFilterChange("date", date)}
                value={filters.date ? dayjs(filters.date, "YYYY-MM-DD") : null}
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
                        : "Không tìm được phim"}
                    </Text>
                  }
                />
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
