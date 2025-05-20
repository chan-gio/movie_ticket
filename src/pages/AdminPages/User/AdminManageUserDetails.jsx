import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Divider,
  Button,
  Row,
  Col,
  Space,
  Spin,
  message,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import UserService from "../../../services/UserService";
import styles from "./AdminManageUserDetails.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminManageUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await UserService.getUserById(id);
        if (data) {
          setUser(data);
        } else {
          message.error("User not found");
        }
      } catch (error) {
        message.error(error.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const formatDateTime = (dateTime) => {
    return dateTime
      ? new Date(dateTime).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "N/A";
  };

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-GB", { dateStyle: "medium" })
      : "N/A";
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <div className={styles.error}>User not found</div>;
  }

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.pageTitle}>
        User Details
      </Title>
      <Card className={styles.card}>
        {/* User Information */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4} className={styles.sectionTitle}>
            <UserOutlined className={styles.sectionIcon} /> User Information
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Username:
              </TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {user.username || "N/A"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Full Name:
              </TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {user.full_name || "N/A"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Email:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {user.email || "N/A"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Phone:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {user.phone || "N/A"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>Role:</TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {user.role || "USER"}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Date of Birth:
              </TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                {formatDate(user.dob)}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Profile Picture:
              </TypographyText>
            </Col>
            <Col span={16}>
              {user.profile_picture_url ? (
                <img
                  src={user.profile_picture_url}
                  alt="Profile"
                  className={styles.previewImage}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/100?text=User")
                  }
                />
              ) : (
                <TypographyText className={styles.value}>N/A</TypographyText>
              )}
            </Col>
          </Row>
        </Space>

        <Divider className={styles.divider} />

        {/* Timestamps */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4} className={styles.sectionTitle}>
            <CalendarOutlined className={styles.sectionIcon} /> Timestamps
          </Title>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Created At:
              </TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                <ClockCircleOutlined className={styles.timeIcon} />{" "}
                {formatDateTime(user.created_at)}
              </TypographyText>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <TypographyText className={styles.label}>
                Updated At:
              </TypographyText>
            </Col>
            <Col span={16}>
              <TypographyText className={styles.value}>
                <ClockCircleOutlined className={styles.timeIcon} />{" "}
                {formatDateTime(user.updated_at)}
              </TypographyText>
            </Col>
          </Row>
        </Space>

        <Row justify="end" style={{ marginTop: 24 }}>
          <Button
            type="primary"
            className={styles.backButton}
            onClick={() => navigate("/admin/manage_user")}
          >
            Back to Users
          </Button>
        </Row>
      </Card>
    </div>
  );
}

export default AdminManageUserDetails;
