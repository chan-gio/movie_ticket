import React, { useState } from "react";
import { Card, Row, Col, Typography, Select, Button, Space } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from "./Showtime.module.scss";

const { Title, Paragraph } = Typography;


export default function Showtime({ dates, locations, showtimes }) {
  const [selectedTime, setSelectedTime] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <>
      <div className={styles.showtimes}>
        <Title level={3} className={styles.showtimesTitle}>
          Showtimes and Tickets
        </Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={6}>
            <Select
              placeholder="Select date"
              className={styles.select}
              suffixIcon={<CalendarOutlined />}
              onChange={(value) => console.log("Selected date:", value)}
            >
              {dates.map((date) => (
                <Option key={date} value={date}>
                  {formatDate(date)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Select city"
              className={styles.select}
              suffixIcon={<EnvironmentOutlined />}
              onChange={(value) => console.log("Selected city:", value)}
            >
              {locations.map((location) => (
                <Option key={location} value={location}>
                  {location}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        {showtimes.length > 0 ? (
          <Row gutter={[16, 16]} className={styles.cinemaGrid}>
            {showtimes.map((item) => (
              <Col xs={24} md={12} lg={8} key={item.id}>
                <Card className={styles.cinemaCard}>
                  <Row gutter={[8, 8]} align="middle">
                    <Col xs={6}>
                      <img
                        src={item.picture}
                        alt={item.cinema}
                        className={styles.cinemaImage}
                      />
                    </Col>
                    <Col xs={18}>
                      <Title level={5}>{item.cinema}</Title>
                      <Paragraph className={styles.cinemaAddress}>
                        {item.address}
                      </Paragraph>
                    </Col>
                  </Row>
                  <div className={styles.divider} />
                  <Space wrap className={styles.timeButtons}>
                    {item.times.map((time) => (
                      <Button
                        key={time}
                        type={selectedTime === time ? "primary" : "default"}
                        onClick={() => setSelectedTime(time)}
                        className={styles.timeButton}
                      >
                        {time}
                      </Button>
                    ))}
                  </Space>
                  <Row justify="space-between" className={styles.priceRow}>
                    <Paragraph className={styles.priceLabel}>Price</Paragraph>
                    <Paragraph className={styles.price}>
                      ${item.price}/seat
                    </Paragraph>
                  </Row>
                  <Row gutter={[8, 8]}>
                    <Col xs={12}>
                      <Link to="/seats">
                        <Button
                          type="primary"
                          block
                          className={styles.bookButton}
                        >
                          Book now
                        </Button>
                      </Link>
                    </Col>
                    <Col xs={12}>
                      <Button block className={styles.cartButton}>
                        Add to cart
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Paragraph className={styles.noData}>There is no data</Paragraph>
        )}
      </div>

      
    </>
  );
}
