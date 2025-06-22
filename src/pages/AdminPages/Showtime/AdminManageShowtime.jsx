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
import { useShowtimesWithSearch, useDeleteShowtime, useRefreshShowtimes } from "../../../hooks/useShowtimes";
import moment from "moment";
import styles from "./AdminManageShowtime.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminManageShowtime() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  // Sử dụng custom hooks với react-query
  const { 
    data: showtimesData, 
    isLoading, 
    error, 
    isSearching 
  } = useShowtimesWithSearch({ 
    keyword: searchKeyword,
    page: pagination.current, 
    perPage: pagination.pageSize 
  });

  const { mutate: deleteShowtime, isLoading: isDeleting } = useDeleteShowtime();
  const { mutate: refreshData, isLoading: isRefreshing } = useRefreshShowtimes();

  // Cập nhật data từ response
  const showtimes = showtimesData?.data || [];
  const paginationData = {
    current: showtimesData?.current_page || 1,
    pageSize: showtimesData?.per_page || 10,
    total: showtimesData?.total || 0,
  };

  // Show error message if there's an error
  if (error) {
    message.error(error.message || "Failed to load showtimes");
  }

  const handleDeleteShowtime = async (id) => {
    deleteShowtime(id, {
      onSuccess: () => {
        message.success("Showtime deleted successfully");
      },
      onError: (error) => {
        message.error(error.message || "Failed to delete showtime");
      },
    });
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: newPagination.total,
    });
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      message.warning("Please enter a keyword to search");
      return;
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleRefresh = () => {
    setSearchKeyword("");
    setPagination({ current: 1, pageSize: 10, total: 0 });
    refreshData({ 
      page: 1, 
      perPage: 10, 
      keyword: undefined 
    });
  };

  const formatDateTime = (dateTime) => {
    return moment.utc(dateTime).format("D MMM YYYY, HH:mm");
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
              loading={isDeleting}
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/manage_showtime/add")}
              className={styles.addButton}
            >
              Add Showtime
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Total Showtimes"
              value={paginationData.total}
              valueStyle={{ color: "#5f2eea" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Current Page"
              value={showtimes.length}
              suffix={`/ ${paginationData.total}`}
              valueStyle={{ color: "#4b9bff" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Search Results"
              value={isSearching ? showtimes.length : 0}
              suffix={isSearching ? " found" : "No search"}
              valueStyle={{ color: "#ff6a6a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Controls */}
      <Row gutter={[16, 16]} className={styles.controlsRow}>
        <Col xs={24} lg={16}>
          <Input
            placeholder="Search by movie title, cinema name, or room name..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
            className={styles.searchInput}
            allowClear
          />
        </Col>
        <Col xs={24} lg={4}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className={styles.searchButton}
            block
          >
            Search
          </Button>
        </Col>
        <Col xs={24} lg={4}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isRefreshing}
            className={styles.refreshButton}
            block
          >
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Showtimes Table */}
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {isLoading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : showtimes.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>
                  {isSearching ? "No showtimes found" : "No showtimes available"}
                </TypographyText>
              </div>
            ) : (
              <Table
                columns={showtimeColumns}
                dataSource={showtimes}
                rowKey="showtime_id"
                pagination={{
                  current: paginationData.current,
                  pageSize: paginationData.pageSize,
                  total: paginationData.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} showtimes`,
                }}
                onChange={handleTableChange}
                rowClassName={styles.tableRow}
                className={styles.table}
                scroll={{ x: 1200 }} // Enable horizontal scroll for responsive design
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageShowtime;