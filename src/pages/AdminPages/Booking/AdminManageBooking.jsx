import { useEffect, useState } from "react";
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
  Tag,
  Spin,
  Input,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  useBookingsWithSearch,
  useDeleteBooking,
  useRefreshBookings,
} from "../../../hooks/useBookings";
import styles from "./AdminManageBooking.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminManageBooking() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  // Custom hooks
  const {
    data: bookingsData,
    isLoading: loading,
    isError,
    error,
    isSearching,
  } = useBookingsWithSearch({
    keyword: searchKeyword,
    page: pagination.current,
    perPage: pagination.pageSize,
  });

  const deleteBookingMutation = useDeleteBooking();
  const refreshBookingsMutation = useRefreshBookings();

  // Update pagination when data changes
  const bookings = bookingsData?.data || [];
  const total = bookingsData?.pagination?.total || 0;

  // Update pagination state when data changes
  useEffect(() => {
    if (bookingsData?.pagination) {
      setPagination(prev => ({
        ...prev,
        current: bookingsData.pagination.current,
        total: bookingsData.pagination.total,
      }));
    }
  }, [bookingsData]);

  const handleDeleteBooking = async (id) => {
    try {
      await deleteBookingMutation.mutateAsync(id);
      message.success("Booking deleted successfully");
    } catch (error) {
      message.error(error.message || "Failed to delete booking");
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      message.warning("Please enter a phone number or username to search");
      return;
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleRefresh = async () => {
    try {
      await refreshBookingsMutation.mutateAsync({
        page: pagination.current,
        perPage: pagination.pageSize,
        keyword: searchKeyword,
      });
    } catch (error) {
      message.error("Failed to refresh data");
    }
  };

  const formatDateTime = (dateTime) => {
    return dateTime
      ? new Date(dateTime).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "N/A";
  };

  // Handle error state
  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <TypographyText type="danger">
            Error: {error?.message || "Failed to load bookings"}
          </TypographyText>
          <Button 
            type="primary" 
            onClick={handleRefresh}
            style={{ marginTop: 16 }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const bookingColumns = [
    {
      title: "No.",
      key: "index",
      width: 70,
      fixed: "left",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "User",
      dataIndex: ["user", "full_name"],
      key: "user_name",
      sorter: (a, b) =>
        (a.user?.full_name || "").localeCompare(b.user?.full_name || ""),
      render: (_, record) => record.user?.full_name || "N/A",
    },
    {
      title: "Username",
      dataIndex: ["user", "username"],
      key: "username",
      sorter: (a, b) =>
        (a.user?.username || "").localeCompare(b.user?.username || ""),
      render: (_, record) => record.user?.username || "N/A",
    },
    {
      title: "Phone Number",
      dataIndex: ["user", "phone"],
      key: "phone_number",
      sorter: (a, b) =>
        (a.user?.phone || "").localeCompare(b.user?.phone || ""),
      render: (_, record) => record.user?.phone || "N/A",
    },
    {
      title: "Movie",
      dataIndex: ["showtime", "movie", "title"],
      key: "movie_title",
      sorter: (a, b) =>
        (a.showtime?.movie?.title || "").localeCompare(
          b.showtime?.movie?.title || ""
        ),
      render: (_, record) => record.showtime?.movie?.title || "N/A",
    },
    {
      title: "Room",
      dataIndex: ["showtime", "room", "room_name"],
      key: "room_name",
      sorter: (a, b) =>
        (a.showtime?.room?.room_name || "").localeCompare(
          b.showtime?.room?.room_name || ""
        ),
      render: (_, record) => record.showtime?.room?.room_name || "N/A",
    },
    {
      title: "Showtime",
      dataIndex: ["showtime", "start_time"],
      key: "start_time",
      render: (text) => formatDateTime(text),
      sorter: (a, b) =>
        new Date(a.showtime?.start_time || 0) -
        new Date(b.showtime?.start_time || 0),
    },
    {
      title: "Seats",
      dataIndex: "booking_seats",
      key: "seats",
      render: (bookingSeats) =>
        bookingSeats?.map((seat) => seat.seat?.seat_number).join(", ") || "N/A",
    },
    {
      title: "Total Price (VND)",
      dataIndex: "total_price",
      key: "total_price",
      sorter: (a, b) => (a.total_price || 0) - (b.total_price || 0),
      render: (price) => (
        <TypographyText type="success">
          {(price || 0).toLocaleString("vi-VN")} VND
        </TypographyText>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
      render: (status) => {
        let color;
        switch (status) {
          case "CONFIRMED":
            color = "green";
            break;
          case "PENDING":
            color = "gold";
            break;
          case "CANCELLED":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status || "N/A"}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(`/admin/manage_booking/details/${record.booking_id}`)
            }
            className={styles.viewButton}
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure to delete this booking?"
            onConfirm={() => handleDeleteBooking(record.booking_id)}
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className={styles.cancelButton}
              loading={deleteBookingMutation.isPending}
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
            Manage Bookings
          </Title>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="Search by phone number or username"
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
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshBookingsMutation.isPending || loading}
              className={styles.refreshButton}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={8}>
          <Card className={styles.statisticCard}>
            <Statistic
              title="Total Bookings"
              value={total}
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
            ) : bookings.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>
                  {isSearching ? "No bookings found for your search" : "No bookings found"}
                </TypographyText>
              </div>
            ) : (
              <Table
                columns={bookingColumns}
                dataSource={bookings}
                rowKey="booking_id"
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
                onChange={handleTableChange}
                rowClassName={styles.tableRow}
                className={styles.table}
                scroll={{ x: "max-content" }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageBooking;
