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
import { useUsersWithSearch, useDeleteUser, useRefreshUsers } from "../../../hooks/useUsers";
import styles from "./AdminManageUser.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminManageUser() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  // Sử dụng custom hooks với react-query
  const { 
    data: usersData, 
    isLoading, 
    error, 
    isSearching 
  } = useUsersWithSearch({ 
    keyword: searchKeyword, 
    page: pagination.current, 
    perPage: pagination.pageSize 
  });

  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();
  const { mutate: refreshData, isLoading: isRefreshing } = useRefreshUsers();

  // Cập nhật pagination từ data
  const users = usersData?.data || [];
  const paginationData = usersData?.pagination || { current: 1, pageSize: 10, total: 0 };

  // Show error message if there's an error
  if (error) {
    message.error(error.message || "Failed to load users");
  }

  const handleDeleteUser = async (id) => {
    deleteUser(id, {
      onSuccess: () => {
        message.success("User deleted successfully");
      },
      onError: (error) => {
        message.error(error.message || "Failed to delete user");
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
      message.warning("Please enter a username or phone number to search");
      return;
    }
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to page 1 on new search
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to page 1
  };

  const handleRefresh = () => {
    refreshData({ 
      page: pagination.current, 
      perPage: pagination.pageSize, 
      keyword: searchKeyword 
    });
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
              onClick={handleRefresh}
              loading={isRefreshing}
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
            {isLoading ? (
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
                pagination={{
                  current: paginationData.current,
                  pageSize: paginationData.pageSize,
                  total: paginationData.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} users`,
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

export default AdminManageUser;
