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
  Select,
  Input,
} from "antd";
import {
  ReloadOutlined,
  UndoOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import styles from "./DeletedCinemas.module.scss";
import CinemaService from "../../../services/CinemaService";

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;
const { Search } = Input;

function DeletedCinemas() {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [inputValue, setInputValue] = useState(""); // For search input while typing
  const [searchTerm, setSearchTerm] = useState(""); // For confirmed search term
  const [searchType, setSearchType] = useState("name"); // name or address
  const [searchTrigger, setSearchTrigger] = useState(0); // Trigger search on button click
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Debounced loadData function
  const loadData = useCallback(async () => {
    if (loading) return; // Prevent concurrent calls
    setLoading(true);
    try {
      let response;
      if (searchTerm) {
        // Search by name or address
        if (searchType === "name") {
          response = await CinemaService.searchDeletedCinemaByName(searchTerm, pagination.current, {
            per_page: pagination.pageSize,
          });
        } else {
          response = await CinemaService.searchDeletedCinemaByAddress(searchTerm, pagination.current, {
            per_page: pagination.pageSize,
          });
        }
      } else {
        // Get all deleted cinemas
        response = await CinemaService.getDeletedCinemas({
          per_page: pagination.pageSize,
          page: pagination.current,
        });
      }

      // Log response for debugging
      console.log("API Response:", response);

      // Extract cinema data and pagination info
      const cinemaData = response.data || [];
      setCinemas(cinemaData);

      // Update pagination if values have changed
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

      // Show toast for no results if search was performed
      if (searchTerm && cinemaData.length === 0) {
        toast.info("Không tìm thấy rạp chiếu phim phù hợp", {
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
      setCinemas([]); // Ensure empty array on error
      setPagination((prev) => ({ ...prev, total: 0, current: 1 }));
      toast.error(error.message || "Không thể tải dữ liệu rạp", {
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
      console.log("Cinemas state:", cinemas);
    }
  }, [searchTerm, searchType, pagination.current, pagination.pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData, searchTrigger]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setSearchTrigger((prev) => prev + 1); // Trigger search
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page
  };

  const handleSearchChange = (e) => {
    setInputValue(e.target.value); // Update input value while typing
  };

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
    setSearchTerm(""); // Clear confirmed search term
    setInputValue(""); // Clear input field
    setSearchTrigger((prev) => prev + 1); // Trigger reload
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleRefresh = () => {
    setSearchTerm(""); // Clear confirmed search term
    setInputValue(""); // Clear input field
    setSearchType("name"); // Reset search type
    setSearchTrigger((prev) => prev + 1); // Trigger reload
    setPagination({ current: 1, pageSize: 10, total: 0 }); // Reset pagination
  };

  const handleRestoreCinema = async (id) => {
    setRestoring(true);
    try {
      await CinemaService.restoreCinema(id);
      setCinemas(cinemas.filter((cinema) => cinema.cinema_id !== id));
      toast.success("Khôi phục rạp thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: "#5f2eea" },
      });
    } catch (error) {
      toast.error(error.message || "Khôi phục rạp thất bại", {
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

  const cinemaColumns = [
    {
      title: "ID",
      dataIndex: "cinema_id",
      key: "cinema_id",
      sorter: (a, b) => a.cinema_id.localeCompare(b.cinema_id),
      render: (text) => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: "Tên Rạp",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn khôi phục rạp này?"
            onConfirm={() => handleRestoreCinema(record.cinema_id)}
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
            Quản Lý Rạp Đã Xóa
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/manage_cinema")}
              className={styles.backButton}
              disabled={restoring}
            >
              Quay Lại Quản Lý Rạp
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
              title={<span className={styles.statisticTitle}>Tổng Số Rạp Đã Xóa</span>}
              value={pagination.total}
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
              <Option value="name">Tìm Theo Tên</Option>
              <Option value="address">Tìm Theo Địa Chỉ</Option>
            </Select>
            <Search
              placeholder={`Nhập ${searchType === "name" ? "tên rạp" : "địa chỉ"}`}
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
                columns={cinemaColumns}
                dataSource={cinemas}
                rowKey="cinema_id"
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                  showTotal: (total) => `Tổng ${total} rạp`,
                  onChange: (page, pageSize) =>
                    handleTableChange({ current: page, pageSize }),
                }}
                rowClassName={styles.tableRow}
                className={styles.table}
                locale={{
                  emptyText: (
                    <TypographyText className={styles.emptyText}>
                      Không tìm thấy rạp
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

export default DeletedCinemas;