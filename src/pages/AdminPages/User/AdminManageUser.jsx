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
  Spin,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import UserService from "../../../services/UserService";
import styles from "./AdminManageUser.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminManageUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState(""); // State for keyword search
  const [isSearching, setIsSearching] = useState(false); // Track if a search is active

  useEffect(() => {
    loadData(pagination.current, pagination.pageSize);
  }, []);

  const loadData = async (page = 1, pageSize = 10, keyword = searchKeyword) => {
    setLoading(true);
    try {
      let response;
      if (keyword) {
        // Search by keyword (username or phone)
        response = await UserService.searchUser(keyword, page, pageSize);
        setIsSearching(true);
      } else {
        // Load all users
        response = await UserService.getAllUsers(page, pageSize);
        setIsSearching(false);
      }
      setUsers(response.data);
      setPagination({
        current: response.pagination.current,
        pageSize: response.pagination.pageSize,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await UserService.deleteUser(id);
      message.success("User deleted successfully");
      // Reload data to reflect accurate pagination
      loadData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.message || "Failed to delete user");
    }
  };

  const handleTableChange = (pagination) => {
    loadData(pagination.current, pagination.pageSize);
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      message.warning("Please enter a username or phone number to search");
      return;
    }
    loadData(1, pagination.pageSize, searchKeyword); // Reset to page 1 on new search
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setIsSearching(false);
    loadData(1, pagination.pageSize, ""); // Reset to full list
  };

  const userColumns = [
    {
      title: "No.",
      key: "serial",
      width: 60,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (email) => (
        <TypographyText type="secondary">{email}</TypographyText>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a, b) => (a.full_name || "").localeCompare(b.full_name || ""),
      render: (fullName) => fullName || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (role) => role || "USER",
    },
    {
      title: "Profile Picture",
      dataIndex: "profile_picture_url",
      key: "profile_picture_url",
      render: (url) => (
        <img
          src={
            url ||
            "https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
          }
          alt="Profile"
          className={styles.profilePicture}
          onError={(e) =>
            (e.target.src =
              "https://st.quantrimang.com/photos/image/072015/22/avatar.jpg")
          }
        />
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
              navigate(`/admin/manage_user/details/${record.user_id}`)
            }
            className={styles.viewButton}
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteUser(record.user_id)}
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
            Manage Users
          </Title>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="Search by username or phone number"
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
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {loading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : users.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>No users found</TypographyText>
              </div>
            ) : (
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="user_id"
                pagination={pagination}
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

export default AdminManageUser;
