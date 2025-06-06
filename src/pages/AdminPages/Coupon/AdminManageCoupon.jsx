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
  Tag,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CouponService from "../../../services/CouponService";
import styles from "./AdminManageCoupon.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminManageCoupon() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // Track if a search is active

  useEffect(() => {
    loadData(pagination.current, pagination.pageSize);
  }, []);

  const loadData = async (page = 1, pageSize = 10, searchCode = "") => {
    setLoading(true);
    try {
      let response;
      if (searchCode) {
        // Search by coupon code
        response = await CouponService.searchCouponsByCode(
          searchCode,
          page,
          pageSize
        );
        setIsSearching(true);
      } else {
        // Load all coupons
        response = await CouponService.getAllCoupons(page, pageSize);
        setIsSearching(false);
      }
      // Ensure data is an array
      const couponData = Array.isArray(response.data) ? response.data : [];
      setCoupons(couponData);
      setFilteredCoupons(couponData);
      setPagination({
        current: response.pagination?.current || page,
        pageSize: response.pagination?.pageSize || pageSize,
        total: response.pagination?.total || couponData.length,
      });
    } catch (error) {
      message.error(error.message || "Failed to load coupons");
      setCoupons([]);
      setFilteredCoupons([]);
      setPagination((prev) => ({
        ...prev,
        current: 1,
        total: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      message.warning("Please enter a coupon code to search");
      return;
    }
    loadData(1, pagination.pageSize, searchText); // Reset to page 1 on new search
  };

  const handleClearSearch = () => {
    setSearchText("");
    setIsSearching(false);
    loadData(1, pagination.pageSize, ""); // Reset to full list
  };

  const handleSoftDeleteCoupon = async (id) => {
    try {
      await CouponService.softDeleteCoupon(id);
      message.success("Coupon deactivated successfully");
      loadData(
        pagination.current,
        pagination.pageSize,
        isSearching ? searchText : ""
      );
    } catch (error) {
      message.error(error.message || "Failed to deactivate coupon");
    }
  };

  const handleActivateCoupon = async (id) => {
    try {
      await CouponService.restoreCoupon(id);
      message.success("Coupon activated successfully");
      loadData(
        pagination.current,
        pagination.pageSize,
        isSearching ? searchText : ""
      );
    } catch (error) {
      message.error(error.message || "Failed to activate coupon");
    }
  };

  const handleHardDeleteCoupon = async (id) => {
    try {
      await CouponService.forceDeleteCoupon(id);
      message.success("Coupon deleted successfully");
      loadData(
        pagination.current,
        pagination.pageSize,
        isSearching ? searchText : ""
      );
    } catch (error) {
      message.error(error.message || "Failed to delete coupon");
    }
  };

  const handleTableChange = (pagination) => {
    loadData(
      pagination.current,
      pagination.pageSize,
      isSearching ? searchText : ""
    );
  };

  const formatDateTime = (dateTime) => {
    return dateTime
      ? new Date(dateTime).toLocaleString("en-GB", {
          dateStyle: "medium",
        })
      : "N/A";
  };

  const couponColumns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => description || "N/A",
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => a.discount - b.discount,
      render: (discount) => (
        <TypographyText type="success">{discount}%</TypographyText>
      ),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      key: "expiry_date",
      render: (date) => {
        const expiryDate = new Date(date);
        const isExpired = expiryDate < new Date();
        return (
          <TypographyText type={isExpired ? "danger" : "secondary"}>
            {formatDateTime(date)}
          </TypographyText>
        );
      },
      sorter: (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      sorter: (a, b) => Number(a.is_active) - Number(b.is_active),
      render: (active) => (
        <Tag color={active ? "green" : "red"}>{active ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Usage",
      key: "usage",
      render: (_, record) => (
        <TypographyText>
          {record.is_used}/{record.quantity}
        </TypographyText>
      ),
      sorter: (a, b) => a.is_used - b.is_used,
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
              navigate(`/admin/manage_coupon/edit/${record.coupon_id}`)
            }
            className={styles.editButton}
          >
            Edit
          </Button>
          {record.is_active ? (
            <Popconfirm
              title="Are you sure to deactivate this coupon?"
              onConfirm={() => handleSoftDeleteCoupon(record.coupon_id)}
            >
              <Button
                type="default"
                icon={<DeleteOutlined />}
                className={styles.deactivateButton}
              >
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure to activate this coupon?"
              onConfirm={() => handleActivateCoupon(record.coupon_id)}
            >
              <Button
                type="default"
                icon={<CheckCircleOutlined />}
                style={{ borderColor: "#52c41a", color: "#52c41a" }}
                className={styles.activateButton}
              >
                Activate
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="Are you sure to permanently delete this coupon?"
            onConfirm={() => handleHardDeleteCoupon(record.coupon_id)}
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

  // Calculate statistics
  const totalActiveCoupons = filteredCoupons.filter(
    (coupon) => coupon.is_active
  ).length;
  const totalUsableCoupons = filteredCoupons.filter(
    (coupon) => coupon.is_used < coupon.quantity
  ).length;

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Manage Coupons
          </Title>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="Search by code"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
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
              onClick={() => navigate("/admin/manage_coupon/add")}
              className={styles.addButton}
            >
              Add Coupon
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() =>
                loadData(
                  pagination.current,
                  pagination.pageSize,
                  isSearching ? searchText : ""
                )
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
                <span className={styles.statisticTitle}>Total Coupons</span>
              }
              value={pagination.total}
              valueStyle={{ color: "#5f2eea" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statisticCard} hoverable>
            <Statistic
              title={
                <span className={styles.statisticTitle}>Active Coupons</span>
              }
              value={totalActiveCoupons}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.statisticCard} hoverable>
            <Statistic
              title={
                <span className={styles.statisticTitle}>Usable Coupons</span>
              }
              value={totalUsableCoupons}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {loading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>No coupons found</TypographyText>
              </div>
            ) : (
              <Table
                columns={couponColumns}
                dataSource={filteredCoupons}
                rowKey="coupon_id"
                pagination={pagination}
                onChange={handleTableChange}
                rowClassName={styles.tableRow}
                className={styles.table}
                scroll={{ x: "max-content" }} // Thêm thanh cuộn ngang
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageCoupon;
