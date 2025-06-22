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
} from "@ant-design/icons";
import { toast } from "react-toastify";
import styles from "./AdminManageCinema.module.scss";
import { 
  useAllCinemas, 
  useSearchCinemasByName, 
  useSearchCinemasByAddress,
  useSoftDeleteCinema,
  useRefreshCinemas
} from "../../../hooks/useCinemas";

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;
const { Search } = Input;

function AdminManageCinema() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(""); // For search input while typing
  const [searchTerm, setSearchTerm] = useState(""); // For confirmed search term
  const [searchType, setSearchType] = useState("name"); // name or address
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Sử dụng custom hooks với react-query
  const { 
    data: allCinemasData, 
    isLoading: isLoadingAllCinemas, 
    error: allCinemasError 
  } = useAllCinemas({ 
    page: searchTerm ? undefined : pagination.current, 
    perPage: pagination.pageSize 
  });

  const { 
    data: searchByNameData, 
    isLoading: isLoadingSearchByName, 
    error: searchByNameError 
  } = useSearchCinemasByName({ 
    searchTerm: searchType === "name" ? searchTerm : undefined,
    page: searchType === "name" ? pagination.current : undefined,
    perPage: searchType === "name" ? pagination.pageSize : undefined
  });

  const { 
    data: searchByAddressData, 
    isLoading: isLoadingSearchByAddress, 
    error: searchByAddressError 
  } = useSearchCinemasByAddress({ 
    city: searchType === "address" ? searchTerm : undefined,
    page: searchType === "address" ? pagination.current : undefined,
    perPage: searchType === "address" ? pagination.pageSize : undefined
  });

  const { mutate: deleteCinema, isLoading: isDeleting } = useSoftDeleteCinema();
  const { mutate: refreshData, isLoading: isRefreshing } = useRefreshCinemas();

  // Xác định data và loading state dựa trên search type
  const getCurrentData = () => {
    if (searchTerm) {
      if (searchType === "name") {
        return searchByNameData;
      } else {
        return searchByAddressData;
      }
    }
    return allCinemasData;
  };

  const getCurrentLoading = () => {
    if (searchTerm) {
      if (searchType === "name") {
        return isLoadingSearchByName;
      } else {
        return isLoadingSearchByAddress;
      }
    }
    return isLoadingAllCinemas;
  };

  const getCurrentError = () => {
    if (searchTerm) {
      if (searchType === "name") {
        return searchByNameError;
      } else {
        return searchByAddressError;
      }
    }
    return allCinemasError;
  };

  const currentData = getCurrentData();
  const isLoading = getCurrentLoading();
  const error = getCurrentError();

  // Cập nhật data từ response
  const cinemas = currentData?.data || [];
  const paginationData = {
    current: currentData?.current_page || 1,
    pageSize: currentData?.per_page || 10,
    total: currentData?.total || 0,
  };

  // Show error message if there's an error
  if (error) {
    toast.error(error.message || "Failed to load cinemas", {
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
    setInputValue(e.target.value); // Update input value while typing
  };

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
    setSearchTerm(""); // Clear confirmed search term
    setInputValue(""); // Clear input field
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleRefresh = () => {
    setSearchTerm(""); // Clear confirmed search term
    setInputValue(""); // Clear input field
    setSearchType("name"); // Reset search type
    setPagination({ current: 1, pageSize: 10, total: 0 }); // Reset pagination
    refreshData();
  };

  const handleDeleteCinema = async (id) => {
    deleteCinema(id, {
      onSuccess: () => {
        toast.success("Cinema deleted successfully", {
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
        toast.error(error.message || "Failed to delete cinema", {
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

  const cinemaColumns = [
    {
      title: "No.",
      key: "serial",
      width: 60,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => (
        <TypographyText strong className={styles.cinemaName}>
          {name}
        </TypographyText>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => (a.address || "").localeCompare(b.address || ""),
      render: (address) => address || "N/A",
    },
    {
      title: "Status",
      dataIndex: "is_deleted",
      key: "is_deleted",
      render: (isDeleted) => (
        <span
          className={`${styles.status} ${
            isDeleted ? styles.deleted : styles.active
          }`}
        >
          {isDeleted ? "Deleted" : "Active"}
        </span>
      ),
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
              navigate(`/admin/manage_rooms/${record.cinema_id}`)
            }
            className={styles.viewButton}
          >
            View Rooms
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() =>
              navigate(`/admin/manage_cinema/edit_cinema/${record.cinema_id}`)
            }
            className={styles.editButton}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this cinema?"
            onConfirm={() => handleDeleteCinema(record.cinema_id)}
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
            >
              Add Cinema
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Total Cinemas"
              value={paginationData.total}
              valueStyle={{ color: "#5f2eea" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Current Page"
              value={cinemas.length}
              suffix={`/ ${paginationData.total}`}
              valueStyle={{ color: "#4b9bff" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statCard} hoverable>
            <Statistic
              title="Search Results"
              value={searchTerm ? cinemas.length : 0}
              suffix={searchTerm ? " found" : "No search"}
              valueStyle={{ color: "#ff6a6a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Controls */}
      <Row gutter={[16, 16]} className={styles.controlsRow}>
        <Col xs={24} lg={8}>
          <Select
            value={searchType}
            onChange={handleSearchTypeChange}
            className={styles.searchTypeSelect}
            disabled={isLoading}
          >
            <Option value="name">Search by Name</Option>
            <Option value="address">Search by Address</Option>
          </Select>
        </Col>
        <Col xs={24} lg={12}>
          <Search
            placeholder={
              searchType === "name"
                ? "Search by cinema name..."
                : "Search by address..."
            }
            value={inputValue}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            className={styles.searchInput}
            disabled={isLoading}
            allowClear
          />
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

      {/* Cinemas Table */}
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {isLoading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : cinemas.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>
                  {searchTerm ? "No cinemas found" : "No cinemas available"}
                </TypographyText>
              </div>
            ) : (
              <Table
                columns={cinemaColumns}
                dataSource={cinemas}
                rowKey="cinema_id"
                pagination={{
                  current: paginationData.current,
                  pageSize: paginationData.pageSize,
                  total: paginationData.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} cinemas`,
                }}
                onChange={handleTableChange}
                rowClassName={styles.tableRow}
                className={styles.table}
                scroll={{ x: 1200 }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageCinema;
