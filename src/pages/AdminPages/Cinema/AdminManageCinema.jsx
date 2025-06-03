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
  Select,
  Spin,
  Input,
  Statistic,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined,
  ApartmentOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import styles from "./AdminManageCinema.module.scss";
import CinemaService from "../../../services/CinemaService";

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;
const { Search } = Input;

function AdminManageCinema() {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [totalCinemas, setTotalCinemas] = useState(0); // New state for total cinemas
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inputValue, setInputValue] = useState(""); // For search input while typing
  const [searchTerm, setSearchTerm] = useState(""); // For confirmed search term
  const [searchType, setSearchType] = useState("name"); // name or address
  const [searchTrigger, setSearchTrigger] = useState(0); // Trigger search on button click
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch total cinemas count on mount
  useEffect(() => {
    const fetchTotalCinemas = async () => {
      try {
        const response = await CinemaService.getAllCinemas({
          per_page: 1, // Minimal data to get total
          page: 1,
        });
        setTotalCinemas(response.total || 0);
      } catch (error) {
        console.error("Fetch total cinemas error:", error.message);
        setTotalCinemas(0);
        toast.error("Unable to retrieve total cinemas", {
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
    fetchTotalCinemas();
  }, []);

  // Debounced loadData function
  const loadData = useCallback(async () => {
    if (loading) return; // Prevent concurrent calls
    setLoading(true);
    try {
      let response;
      if (searchTerm) {
        // Search by name or address
        if (searchType === "name") {
          response = await CinemaService.searchCinemaByName(
            searchTerm,
            pagination.current,
            {
              per_page: pagination.pageSize,
            }
          );
        } else {
          response = await CinemaService.searchCinemaByAddress(
            searchTerm,
            pagination.current,
            {
              per_page: pagination.pageSize,
            }
          );
        }
      } else {
        // Get all cinemas
        response = await CinemaService.getAllCinemas({
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

      // Set selected cinema ID if data exists
      if (cinemaData.length > 0 && !selectedCinemaId) {
        setSelectedCinemaId(cinemaData[0].cinema_id);
      } else if (cinemaData.length === 0) {
        setSelectedCinemaId(null);
      }

      // Show toast for no results if search was performed
      if (searchTerm && cinemaData.length === 0) {
        toast.info("No matching cinemas found", {
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
      setSelectedCinemaId(null);
      toast.error(error.message || "Unable to load cinema data", {
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

  const handleDeleteCinema = async (id) => {
    setDeleting(true);
    try {
      await CinemaService.softDeleteCinema(id);
      setCinemas(cinemas.filter((cinema) => cinema.cinema_id !== id));
      setTotalCinemas((prev) => Math.max(0, prev - 1)); // Decrement total
      if (selectedCinemaId === id) {
        const remainingCinemas = cinemas.filter(
          (cinema) => cinema.cinema_id !== id
        );
        setSelectedCinemaId(
          remainingCinemas.length > 0 ? remainingCinemas[0].cinema_id : null
        );
      }
      toast.success("Cinema deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: "#5f2eea" },
      });
    } catch (error) {
      toast.error(error.message || "Failed to delete cinema", {
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

  const cinemaColumns = [
    {
      title: "ID",
      dataIndex: "cinema_id",
      key: "cinema_id",
      sorter: (a, b) => a.cinema_id.localeCompare(b.cinema_id),
      render: (text) => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
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
              navigate(`/admin/manage_cinema/edit_cinema/${record.cinema_id}`)
            }
            className={styles.editButton}
            disabled={deleting}
          >
            Edit
          </Button>
          <Button
            type="primary"
            icon={<ApartmentOutlined />}
            onClick={() => navigate(`/admin/manage_rooms/${record.cinema_id}`)}
            className={styles.roomsButton}
            disabled={deleting}
          >
            Manage Rooms
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this cinema? All related rooms will also be deleted."
            onConfirm={() => handleDeleteCinema(record.cinema_id)}
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
            Manage Cinemas
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/manage_cinema/add_cinema")}
              className={styles.addButton}
              disabled={deleting}
            >
              Add Cinema
            </Button>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate("/admin/deleted_cinemas")}
              className={styles.viewDeletedButton}
              disabled={deleting}
            >
              View Deleted Cinemas
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
                <span className={styles.statisticTitle}>Total Cinemas</span>
              }
              value={totalCinemas}
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
              <Option value="name">Search by Name</Option>
              <Option value="address">Search by Address</Option>
            </Select>
            <Search
              placeholder={`Enter ${
                searchType === "name" ? "cinema name" : "address"
              }`}
              value={inputValue}
              onChange={handleSearchChange}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              allowClear
              className={styles.search}
              disabled={deleting}
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
                  showTotal: (total) => `Total ${total} cinemas`,
                  onChange: (page, pageSize) =>
                    handleTableChange({ current: page, pageSize }),
                }}
                rowClassName={styles.tableRow}
                className={styles.table}
                locale={{
                  emptyText: (
                    <TypographyText className={styles.emptyText}>
                      No cinemas found
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

export default AdminManageCinema;
