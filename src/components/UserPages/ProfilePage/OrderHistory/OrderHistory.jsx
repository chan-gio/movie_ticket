import { Card, Row, Col, Typography, Tag, Button, Skeleton, Pagination, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./OrderHistory.module.scss";
import { useSettings } from "../../../../Context/SettingContext";
import { useState } from "react";
import moment from "moment";

const { Title, Paragraph } = Typography;

const OrderHistory = ({ orderHistory, loading, pagination, onPaginationChange }) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleShowDetails = (order) => {
    const orderCode = order.orderCode || "";
    navigate(`/confirmation/${order.id}?orderCode=${encodeURIComponent(orderCode)}`);
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setCancelModalVisible(true);
  };

  const handleCancelModalOk = () => {
    setCancelModalVisible(false);
    setSelectedOrder(null);
  };

  const handleCancelModalCancel = () => {
    setCancelModalVisible(false);
    setSelectedOrder(null);
  };

  // Check if cancellation is allowed (active and ≥ 2 hours before showtime)
  const canCancel = (order) => {
    if (order.status !== "active") return false;

    if (!order.date || typeof order.date !== "string") {
      console.error("Invalid or missing order.date:", order.date);
      return false;
    }

    const showTime = moment(order.date, [
      "dddd, MMMM DD, YYYY [at] hh:mm A", 
      "dddd, MMMM D, YYYY [at] h:mm A",   
      "dddd, MMMM DD, YYYY [at] HH:mm",   
      "dddd, DD MMMM YYYY, hh:mm A",      
      "dddd, D MMMM YYYY, h:mm A",        
      "dddd, DD MMM YYYY, hh:mm A",       
      "dddd, D MMM YYYY, h:mm A",        
    ], false); // Lenient parsing

    if (!showTime.isValid()) {
      // Fallback to general parsing
      const fallbackShowTime = moment(order.date);
      if (!fallbackShowTime.isValid()) {
        console.error("Invalid showtime date after fallback:", order.date);
        return false;
      }
      console.warn("Using fallback parsing for:", order.date);
      showTime.set(fallbackShowTime.toObject());
    }

    const currentTime = moment();
    const hoursDiff = showTime.diff(currentTime, "hours");
    return hoursDiff >= 2;
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
                      <>
                        <Button onClick={() => handleShowDetails(order)} style={{ marginRight: 8 }}>
                          Show Details
                        </Button>
                        {canCancel(order) && (
                          <Button
                            type="default"
                            danger
                            onClick={() => handleCancelClick(order)}
                          >
                            Cancel Ticket
                          </Button>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}
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
      <Modal
        title="Cancel Ticket"
        open={cancelModalVisible}
        onOk={handleCancelModalOk}
        onCancel={handleCancelModalCancel}
        footer={[
          <Button key="ok" type="primary" onClick={handleCancelModalOk}>
            OK
          </Button>,
        ]}
      >
        <p>
          To cancel your ticket for <strong>{selectedOrder?.movie}</strong> on{" "}
          <strong>{selectedOrder?.date}</strong>, please contact our support team at{" "}
          <strong>0971665475</strong> for assistance.
        </p>
      </Modal>
    </div>
  );
};

export default OrderHistory;