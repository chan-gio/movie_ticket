import { Card, Row, Col, Typography, Tag, Select } from "antd";
import styles from "./OrderHistory.module.scss";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const OrderHistory = ({ orderHistory }) => {
  return (
    <div className={styles.tabContent}>
      <Card className={styles.detailCard}>
        <Title level={4}>Order History</Title>
        <div className={styles.divider} />
        {orderHistory.map((order) => (
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
                  color={order.status === "active" ? "green" : "gray"}
                  className={styles.ticketStatus}
                >
                  Ticket {order.status}
                </Tag>
              </Col>
              <Col xs={12} md={20} style={{ textAlign: "right" }}>
                <Select
                  defaultValue="Show Details"
                  className={styles.orderSelect}
                >
                  <Option value="Show Details">Show Details</Option>
                  <Option value="Jakarta">Jakarta</Option>
                  <Option value="Bandung">Bandung</Option>
                  <Option value="Surabaya">Surabaya</Option>
                </Select>
              </Col>
            </Row>
          </Card>
        ))}
      </Card>
    </div>
  );
};

export default OrderHistory;
