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
        toast.error("Unable to fetch total movies", {
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
        toast.info("No movies found", {
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
      toast.error(error.message || "Unable to load movie data", {
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
      toast.success("Movie deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: "#5f2eea" },
      });
    } catch (error) {
      toast.error(error.message || "Failed to delete movie", {
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
    return new Date(date).toLocaleDateString("en-US", {
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
      title: "Movie Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <TypographyText>{text?.slice(0, 50) + "..."}</TypographyText>
      ),
    },
    {
      title: "Duration (minutes)",
      dataIndex: "duration",
      key: "duration",
      sorter: (a, b) => a.duration - b.duration,
      render: (duration) => <TypographyText>{duration} minutes</TypographyText>,
    },
    {
      title: "Release Date",
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
      title: "Adult Rating",
      dataIndex: "adult",
      key: "adult",
      render: (rating) => <TypographyText>{rating || "N/A"}</TypographyText>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() =>
              navigate(`/admin/manage_movie/edit/${record.movie_id}`)
            }
            className={styles.editButton}
            disabled={deleting}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this movie?"
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
              onClick={() => navigate("/admin/manage_movie/add")}
              className={styles.addButton}
              disabled={deleting}
            >
              Add Movie
            </Button>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate("/admin/deleted_movies")}
              className={styles.viewDeletedButton}
              disabled={deleting}
            >
              View Deleted Movies
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
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
              title={
                <span className={styles.statisticTitle}>Total Movies</span>
              }
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
              <Option value="title">Search by Title</Option>
              <Option value="adult">Search by Rating</Option>
            </Select>
            {searchType === "title" ? (
              <Search
                placeholder="Enter movie title"
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
                placeholder="Select rating"
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
                  showTotal: (total) => `Total ${total} movies`,
                  onChange: (page, pageSize) =>
                    handleTableChange({ current: page, pageSize }),
                }}
                rowClassName={styles.tableRow}
                className={styles.table}
                locale={{
                  emptyText: (
                    <TypographyText className={styles.emptyText}>
                      No movies found
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
