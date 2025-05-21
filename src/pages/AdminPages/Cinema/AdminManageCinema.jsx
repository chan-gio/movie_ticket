/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
  Typography,
  Select,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import styles from "./AdminManageCinema.module.scss";
import CinemaService from "../../../services/CinemaService";

const { Title, Text: TypographyText } = Typography;
const { Option } = Select;

function AdminManageCinema() {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await CinemaService.getAllCinemas({
        per_page: pagination.pageSize,
        page: pagination.current,
      });
      setCinemas(response.data);
      setPagination({
        ...pagination,
        total: response.total,
        current: response.current_page,
      });
      if (response.data.length > 0 && !selectedCinemaId) {
        setSelectedCinemaId(response.data[0].cinema_id);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load cinemas", {
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
    }
  };

  const handleCinemaChange = (cinemaId) => {
    setSelectedCinemaId(cinemaId);
  };

  const handleDeleteCinema = async (id) => {
    setDeleting(true);
    try {
      await CinemaService.softDeleteCinema(id);
      setCinemas(cinemas.filter((cinema) => cinema.cinema_id !== id));
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
    setPagination({
      ...pagination,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    });
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
            title="Are you sure to delete this cinema? This will also delete all associated rooms."
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
              onClick={loadData}
              loading={loading}
              className={styles.refreshButton}
              disabled={deleting}
            >
              Refresh
            </Button>
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
              {cinemas.length === 0 ? (
                <div className={styles.empty}>
                  <TypographyText>No cinemas found</TypographyText>
                </div>
              ) : (
                <Table
                  columns={cinemaColumns}
                  dataSource={cinemas}
                  rowKey="cinema_id"
                  pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onChange: (page, pageSize) =>
                      handleTableChange({ current: page, pageSize }),
                  }}
                  rowClassName={styles.tableRow}
                  className={styles.table}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default AdminManageCinema;
