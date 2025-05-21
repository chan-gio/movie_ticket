import { Card, Row, Col, Typography, Tag, Button, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./OrderHistory.module.scss";

const { Title, Paragraph } = Typography;

const OrderHistory = ({ orderHistory, loading }) => {
  const navigate = useNavigate();

  const handleShowDetails = (orderId) => {
    navigate(`/confirmation/${orderId}`);
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
          orderHistory.map((order) => (
            <Card key={order.id} className={styles.orderCard}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={18}>
                  <Paragraph className={styles.orderDate}>{order.date}</Paragraph>
                  <Title level={5}>{order.movie}</Title>
                </Col>
                <Col xs={24} md={6} style={{ textAlign: "right" }}>
                  <img
                    src={order.cinemaLogo}
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
                        : "gray"
                    }
                    className={styles.ticketStatus}
                  >
                    Ticket {order.status}
                  </Tag>
                </Col>
                <Col xs={12} md={20} style={{ textAlign: "right" }}>
                  <Button onClick={() => handleShowDetails(order.id)}>
                    Show Details
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        )}
      </Card>
    </div>
  );
};

export default OrderHistory;