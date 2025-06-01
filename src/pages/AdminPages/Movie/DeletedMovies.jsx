/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Space,
  Popconfirm,
  Typography,
  Statistic,
  Spin,
  Image,
  Input,
} from "antd";
import {
  ReloadOutlined,
  UndoOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import styles from "./DeletedMovies.module.scss";
import MovieService from "../../../services/MovieService";

const { Title, Text: TypographyText } = Typography;
const { Search } = Input;

function DeletedMovies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [totalDeletedMovies, setTotalDeletedMovies] = useState(0);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch total deleted movies on mount
  useEffect(() => {
    const fetchTotalDeletedMovies = async () => {
      try {
        const response = await MovieService.getDeletedMovies({
          perPage: 1,
          page: 1,
        });
        setTotalDeletedMovies(response.total || 0);
      } catch (error) {
        console.error("Fetch total deleted movies error:", error.message);
        setTotalDeletedMovies(0);
        toast.error("Không thể lấy tổng số phim đã xóa", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: "#5f2eea" },
        });
      }
    };
    fetchTotalDeletedMovies();
  }, []);

  // Load movies with pagination and search
  const loadData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      let response;
      if (searchTerm) {
        response = await MovieService.searchDeletedMovies({
          title: searchTerm,
          perPage: pagination.pageSize,
          page: pagination.current,
        });
      } else {
        response = await MovieService.getDeletedMovies({
          perPage: pagination.pageSize,
          page: pagination.current,
        });
      }

      console.log("API Response:", response);
      const movieData = response.data || [];
      setMovies(movieData);

      if (
        response.total !== pagination.total ||
        response.current_page !== pagination.current
      ) {
        setPagination((prev) => ({
          ...prev,
          total: response.total || 0,
          current: response.current_page || 1,
        }));
      }

      if (searchTerm && movieData.length === 0) {
        toast.info("Không tìm thấy phim phù hợp", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: "#5f2eea" },
        });
      }
    } catch (error) {
      console.error("Load data error:", error.message);
      setMovies([]);
      setPagination((prev) => ({ ...prev, total: 0, current: 1 }));
      toast.error(error.message || "Không thể tải dữ liệu phim", {
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
      console.log("Movies state:", movies);
    }
  }, [searchTerm, pagination.current, pagination.pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData, searchTrigger]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setSearchTrigger((prev) => prev + 1);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setInputValue("");
    setSearchTrigger((prev) => prev + 1);
    setPagination({ current: 1, pageSize: 10, total: 0 });
  };

  const handleRestoreMovie = async (id) => {
    setRestoring(true);
    try {
      await MovieService.restoreMovie(id);
      setMovies(movies.filter((movie) => movie.movie_id !== id));
      setTotalDeletedMovies((prev) => Math.max(0, prev - 1));
      toast.success("Khôi phục phim thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: "#5f2eea" },
      });
    } catch (error) {
      toast.error(error.message || "Khôi phục phim thất bại", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: "#5f2eea" },
      });
    } finally {
      setRestoring(false);
    }
  };

  const handleTableChange = (paginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const movieColumns = [
    {
      title: "ID",
      dataIndex: "movie_id",
      key: "movie_id",
      sorter: (a, b) => a.movie_id.localeCompare(b.movie_id),
      render: (text) => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: "Tên Phim",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      render: (text) => <TypographyText>{text?.slice(0, 50) + "..."}</TypographyText>,
    },
    {
      title: "Thời Lượng (phút)",
      dataIndex: "duration",
      key: "duration",
      sorter: (a, b) => a.duration - b.duration,
      render: (duration) => <TypographyText>{duration} phút</TypographyText>,
    },
    {
      title: "Ngày Phát Hành",
      dataIndex: "release_date",
      key: "release_date",
      sorter: (a, b) => new Date(a.release_date) - new Date(b.release_date),
      render: (date) => {
        const releaseDate = new Date(date);
        const isReleased = releaseDate <= new Date();
        return (
          <TypographyText type={isReleased ? "success" : "warning"}>
            {formatDate(date)}
          </TypographyText>
        );
      },
    },
    {
      title: "Poster",
      dataIndex: "poster_url",
      key: "poster_url",
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
      title: "Xếp Hạng Người Lớn",
      dataIndex: "adult",
      key: "adult",
      render: (rating) => <TypographyText>{rating || "N/A"}</TypographyText>,
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn khôi phục phim này?"
            onConfirm={() => handleRestoreMovie(record.movie_id)}
            disabled={restoring}
          >
            <Button
              type="primary"
              icon={<UndoOutlined />}
              className={styles.restoreButton}
              disabled={restoring}
            >
              Khôi Phục
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
            Quản Lý Phim Đã Xóa
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/manage_movie")}
              className={styles.backButton}
              disabled={restoring}
            >
              Quay Lại Quản Lý Phim
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              className={styles.refreshButton}
              disabled={restoring}
            >
              Làm Mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={8}>
          <Card className={styles.statisticCard} hoverable>
            <Statistic
              title={<span className={styles.statisticTitle}>Tổng Số Phim Đã Xóa</span>}
              value={totalDeletedMovies}
              valueStyle={{ color: "#5f2eea" }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} md={12}>
          <Space style={{ marginBottom: 16, width: "100%" }}>
            <Search
              placeholder="Nhập tên phim"
              value={inputValue}
              onChange={handleSearchChange}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              allowClear
              className={styles.search}
              disabled={restoring}
            />
          </Space>
        </Col>
      </Row>
      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} className={styles.mainContent}>
          <Col xs={24}>
            <Card className={styles.tableCard}>
              <Table
                columns={movieColumns}
                dataSource={movies}
                rowKey="movie_id"
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                  showTotal: (total) => `Tổng ${total} phim`,
                  onChange: (page, pageSize) =>
                    handleTableChange({ current: page, pageSize }),
                }}
                rowClassName={styles.tableRow}
                className={styles.table}
                locale={{
                  emptyText: (
                    <TypographyText className={styles.emptyText}>
                      Không tìm thấy phim
                    </TypographyText>
                  ),
                }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default DeletedMovies;