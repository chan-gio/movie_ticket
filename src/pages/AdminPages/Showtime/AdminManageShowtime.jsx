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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ShowTimeService from "../../../services/ShowtimeService"; // Import the updated service
import styles from "./AdminManageShowtime.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminManageShowtime() {
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ShowTimeService.getAllShowTimes();
      // Filter out soft-deleted showtimes
      const activeShowtimes = data.filter((showtime) => !showtime.is_deleted);
      setShowtimes(activeShowtimes);
    } catch (error) {
      message.error(error.message || "Failed to load showtimes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShowtime = async (id) => {
    try {
      await ShowTimeService.deleteShowTime(id);
      setShowtimes(showtimes.filter((showtime) => showtime.showtime_id !== id));
      message.success("Showtime deleted successfully");
    } catch (error) {
      message.error(error.message || "Failed to delete showtime");
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const showtimeColumns = [
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
              onClick={loadData}
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
              value={showtimes.length}
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
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                }}
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
