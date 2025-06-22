/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
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
import { useDeletedMovies, useRestoreMovie } from "../../../hooks/useMovies";

const { Title, Text: TypographyText } = Typography;
const { Search } = Input;

function DeletedMovies() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Sử dụng custom hooks với react-query
  const { 
    data: moviesData, 
    isLoading, 
    error, 
    refetch 
  } = useDeletedMovies({ 
    title: searchTerm,
    page: pagination.current, 
    perPage: pagination.pageSize 
  });

  const { mutate: restoreMovie, isLoading: isRestoring } = useRestoreMovie();

  // Cập nhật data từ response
  const movies = moviesData?.data || [];
  const paginationData = {
    current: moviesData?.current_page || 1,
    pageSize: moviesData?.per_page || 10,
    total: moviesData?.total || 0,
  };

  // Show error message if there's an error
  if (error) {
    toast.error(error.message || "Failed to load deleted movies", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressStyle: { background: "#5f2eea" },
    });
  }

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setInputValue("");
    setPagination({ current: 1, pageSize: 10, total: 0 });
    refetch();
  };

  const handleRestoreMovie = async (id) => {
    restoreMovie(id, {
      onSuccess: () => {
        toast.success("Movie restored successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: "#5f2eea" },
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to restore movie", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: "#5f2eea" },
        });
      },
    });
  };

  const handleTableChange = (paginationConfig) => {
    setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      total: paginationConfig.total,
    });
  };

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-GB", { dateStyle: "medium" })
      : "N/A";
  };

  const movieColumns = [
    {
      title: "No.",
      key: "serial",
      width: 60,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Poster",
      dataIndex: "poster_url",
      key: "poster_url",
      width: 100,
      render: (url) => (
        <Image
          width={80}
          height={120}
          src={
            url ||
            "https://wallpapercave.com/wp/wp1816326.jpg"
          }
          alt="Movie Poster"
          fallback="https://wallpapercave.com/wp/wp1816326.jpg"
          className={styles.posterImage}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title) => (
        <TypographyText strong className={styles.movieTitle}>
          {title}
        </TypographyText>
      ),
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      sorter: (a, b) => (a.genre || "").localeCompare(b.genre || ""),
      render: (genre) => genre || "N/A",
    },
    {
      title: "Adult",
      dataIndex: "adult",
      key: "adult",
      sorter: (a, b) => (a.adult || "").localeCompare(b.adult || ""),
      render: (adult) => adult || "N/A",
    },
    {
      title: "Release Date",
      dataIndex: "release_date",
      key: "release_date",
      sorter: (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0),
      render: (date) => formatDate(date),
    },
    {
      title: "Deleted At",
      dataIndex: "deleted_at",
      key: "deleted_at",
      sorter: (a, b) => new Date(a.deleted_at || 0) - new Date(b.deleted_at || 0),
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure to restore this movie?"
            onConfirm={() => handleRestoreMovie(record.movie_id)}
          >
            <Button
              type="primary"
              icon={<UndoOutlined />}
              className={styles.restoreButton}
              loading={isRestoring}
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
          <div className={styles.headerContent}>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/manage_movie")}
              className={styles.backButton}
            >
              Back to Movies
            </Button>
            <Title level={2} className={styles.pageTitle}>
              Deleted Movies
            </Title>
          </div>
        </Col>
        <Col>
          <Space>
            <Search
              placeholder="Search by title..."
              value={inputValue}
              onChange={handleSearchChange}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              className={styles.searchInput}
              allowClear
            />
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={isLoading}
              className={styles.refreshButton}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Total Deleted Movies"
              value={paginationData.total}
              valueStyle={{ color: "#ff6a6a" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Current Page"
              value={movies.length}
              suffix={`/ ${paginationData.total}`}
              valueStyle={{ color: "#4b9bff" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Search Results"
              value={searchTerm ? movies.length : 0}
              suffix={searchTerm ? " found" : "No search"}
              valueStyle={{ color: "#ffa726" }}
            />
          </Card>
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
                <TypographyText>
                  {searchTerm ? "No deleted movies found" : "No deleted movies available"}
                </TypographyText>
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
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} deleted movies`,
                }}
                onChange={handleTableChange}
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
