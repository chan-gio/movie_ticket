import { Card, Row, Col, Typography, Tag, Button, Skeleton, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./OrderHistory.module.scss";
import { useSettings } from "../../../../Context/SettingContext";

const { Title, Paragraph } = Typography;

const OrderHistory = ({ orderHistory, loading, pagination, onPaginationChange }) => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const handleShowDetails = (order) => {
    const orderCode = order.orderCode || "";
    navigate(`/confirmation/${order.id}?orderCode=${encodeURIComponent(orderCode)}`);
  };

  if (loading) {
    return (
      <div className={styles.tabContent}>
        <Card className={styles.detailCard}>
          <Skeleton active title paragraph={{ rows: 0 }} />
          <div className={styles.divider} />
          {[...Array(3)].map((_, index) => (
            <Card key={index} className={styles.orderCard}>
              <Skeleton active avatar paragraph={{ rows: 1 }} />
            </Card>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <Card className={styles.detailCard}>
        <Title level={4}>Order History</Title>
        <div className={styles.divider} />
        {orderHistory.length === 0 ? (
          <Paragraph>No bookings found.</Paragraph>
        ) : (
          <>
            {orderHistory.map((order) => (
              <Card key={order.id} className={styles.orderCard}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} md={18}>
                    <Paragraph className={styles.orderDate}>{order.date}</Paragraph>
                    <Title level={5}>{order.movie}</Title>
                    <Paragraph className={styles.bookingTime}>
                      Booked on: {order.createdAt}
                    </Paragraph>
                  </Col>
                  <Col xs={24} md={6} style={{ textAlign: "right" }}>
                    <img
                      src={settings.name}
                      alt="Cinema Logo"
                      className={styles.cinemaLogo}
                    />
                  </Col>
                </Row>
                <div className={styles.divider} />
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={12} md={4}>
                    <Tag
                      color={
                        order.status === "active"
                          ? "green"
                          : order.status === "pending"
                          ? "orange"
                          : order.status === "cancelled"
                          ? "red"
                          : "gray"
                      }
                      className={styles.ticketStatus}
                    >
                      Ticket {order.status}
                    </Tag>
                  </Col>
                  <Col xs={12} md={20} style={{ textAlign: "right" }}>
                    {order.status === "active" && (
                      <Button onClick={() => handleShowDetails(order)}>
                        Show Details
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}
            {/* Pagination */}
            <div className={styles.pagination}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={onPaginationChange}
                showSizeChanger
                pageSizeOptions={["5", "10", "20"]}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default OrderHistory;