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
  Select,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import styles from "./AdminManageMovie.module.scss";
import MovieService from "../../../services/MovieService";

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;
const { Search } = Input;

function AdminManageMovie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch total movies on mount
  useEffect(() => {
    const fetchTotalMovies = async () => {
      try {
        const response = await MovieService.getAllMovies({
          perPage: 1,
          page: 1,
        });
        setTotalMovies(response.total || 0);
      } catch (error) {
        console.error("Fetch total movies error:", error.message);
        setTotalMovies(0);
        toast.error("Không thể lấy tổng số phim", {
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
    fetchTotalMovies();
  }, []);

  // Load movies with pagination and search
  const loadData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      let response;
      if (searchTerm) {
        if (searchType === "title") {
          response = await MovieService.searchByTitleFE({
            title: searchTerm,
            perPage: pagination.pageSize,
            page: pagination.current,
          });
        } else {
          response = await MovieService.searchMoviesByAdult({
            adult: searchTerm,
            perPage: pagination.pageSize,
            page: pagination.current,
          });
        }
      } else {
        response = await MovieService.getAllMovies({
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
  }, [searchTerm, searchType, pagination.current, pagination.pageSize]);

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

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
    setSearchTerm("");
    setInputValue("");
    setSearchTrigger((prev) => prev + 1);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setInputValue("");
    setSearchType("title");
    setSearchTrigger((prev) => prev + 1);
    setPagination({ current: 1, pageSize: 10, total: 0 });
  };

  const handleDeleteMovie = async (id) => {
    setDeleting(true);
    try {
      await MovieService.softDeleteMovie(id);
      setMovies(movies.filter((movie) => movie.movie_id !== id));
      setTotalMovies((prev) => Math.max(0, prev - 1));
      toast.success("Xóa phim thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: "#5f2eea" },
      });
    } catch (error) {
      toast.error(error.message || "Xóa phim thất bại", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: "#5f2eea" },
      });
    } finally {
      setDeleting(false);
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
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/manage_movie/edit/${record.movie_id}`)}
            className={styles.editButton}
            disabled={deleting}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa phim này?"
            onConfirm={() => handleDeleteMovie(record.movie_id)}
            disabled={deleting}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
              disabled={deleting}
            >
              Xóa
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
            Quản Lý Phim
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/manage_movie/add")}
              className={styles.addButton}
              disabled={deleting}
            >
              Thêm Phim
            </Button>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate("/admin/deleted_movies")}
              className={styles.viewDeletedButton}
              disabled={deleting}
            >
              Xem Phim Đã Xóa
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              className={styles.refreshButton}
              disabled={deleting}
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
              title={<span className={styles.statisticTitle}>Tổng Số Phim</span>}
              value={totalMovies}
              valueStyle={{ color: "#5f2eea" }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} md={12}>
          <Space style={{ marginBottom: 16, width: "100%" }}>
            <Select
              value={searchType}
              onChange={handleSearchTypeChange}
              style={{ width: 150 }}
              className={styles.select}
            >
              <Option value="title">Tìm Theo Tên</Option>
              <Option value="adult">Tìm Theo Xếp Hạng</Option>
            </Select>
            {searchType === "title" ? (
              <Search
                placeholder="Nhập tên phim"
                value={inputValue}
                onChange={handleSearchChange}
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                allowClear
                className={styles.search}
                disabled={deleting}
              />
            ) : (
              <Select
                value={inputValue}
                onChange={(value) => {
                  setInputValue(value);
                  handleSearch(value);
                }}
                style={{ width: 200 }}
                className={styles.select}
                placeholder="Chọn xếp hạng"
                allowClear
              >
                <Option value="G">G</Option>
                <Option value="PG">PG</Option>
                <Option value="PG-13">PG-13</Option>
                <Option value="R">R</Option>
                <Option value="NC-17">NC-17</Option>
              </Select>
            )}
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

export default AdminManageMovie;