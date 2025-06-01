import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Typography,
  Statistic,
  Spin,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ShowTimeService from "../../../services/ShowtimeService";
import styles from "./AdminManageShowtime.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminManageShowtime() {
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const loadData = async (page = 1, pageSize = 10, keyword = searchKeyword) => {
    setLoading(true);
    try {
      let response;
      if (keyword) {
        response = await ShowTimeService.searchShowtimes(
          keyword,
          page,
          pageSize
        );
        setIsSearching(true);
      } else {
        response = await ShowTimeService.getAllShowTimes(page, pageSize);
        setIsSearching(false);
      }
      setShowtimes(response.data || []);
      setPagination({
        current: response.current_page,
        pageSize: response.per_page,
        total: response.total,
      });
    } catch (error) {
      console.error("Error loading showtimes:", error.message);
      message.error(error.message || "Failed to load showtimes");
      setIsSearching(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(pagination.current, pagination.pageSize);
  }, []);

  const handleDeleteShowtime = async (id) => {
    try {
      await ShowTimeService.deleteShowTime(id);
      message.success("Showtime deleted successfully");
      loadData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.message || "Failed to delete showtime");
    }
  };

  const handleTableChange = (newPagination) => {
    loadData(newPagination.current, newPagination.pageSize);
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      message.warning("Please enter a keyword to search");
      return;
    }
    loadData(1, pagination.pageSize, searchKeyword);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setIsSearching(false);
    loadData(1, pagination.pageSize, "");
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const showtimeColumns = [
    {
      title: "No.",
      key: "index",
      width: 70,
      fixed: "left",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Movie",
      dataIndex: ["movie", "title"],
      key: "movie_title",
      sorter: (a, b) => a.movie.title.localeCompare(b.movie.title),
      render: (title) => title || "N/A",
    },
    {
      title: "Cinema",
      dataIndex: ["room", "cinema", "name"],
      key: "cinema_name",
      sorter: (a, b) =>
        (a.room.cinema?.name || "").localeCompare(b.room.cinema?.name || ""),
      render: (name) => name || "N/A",
    },
    {
      title: "Room",
      dataIndex: ["room", "room_name"],
      key: "room_name",
      sorter: (a, b) =>
        (a.room.room_name || "").localeCompare(b.room.room_name || ""),
      render: (room_name) => room_name || "N/A",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      render: (text) => formatDateTime(text),
      sorter: (a, b) => new Date(a.start_time) - new Date(b.start_time),
    },
    {
      title: "Price (VND)",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <TypographyText type="success">
          {price.toLocaleString("vi-VN")} VND
        </TypographyText>
      ),
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
              navigate(`/admin/manage_showtime/edit/${record.showtime_id}`)
            }
            className={styles.editButton}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this showtime?"
            onConfirm={() => handleDeleteShowtime(record.showtime_id)}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
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
            Manage Showtimes
          </Title>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="Search by movie, cinema, or date (YYYY-MM-DD)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={handleSearch}
              className={styles.searchInput}
              allowClear
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              className={styles.searchButton}
            >
              Search
            </Button>
            {isSearching && (
              <Button
                type="default"
                onClick={handleClearSearch}
                className={styles.clearButton}
              >
                Clear Search
              </Button>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/manage_showtime/add")}
              className={styles.addButton}
            >
              Add Showtime
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() =>
                loadData(pagination.current, pagination.pageSize, searchKeyword)
              }
              loading={loading}
              className={styles.refreshButton}
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
                <span className={styles.statisticTitle}>Total Showtimes</span>
              }
              value={pagination.total}
              valueStyle={{ color: "#5f2eea" }}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {loading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : showtimes.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>No showtimes found</TypographyText>
              </div>
            ) : (
              <Table
                columns={showtimeColumns}
                dataSource={showtimes}
                rowKey="showtime_id"
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
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

export default AdminManageShowtime;
