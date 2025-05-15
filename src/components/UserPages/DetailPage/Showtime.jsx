/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Row, Col, Typography, Select, Space } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import CinemaCard from "./CinemaCard";
import styles from "./Showtime.module.scss";

const { Title, Paragraph } = Typography;

export default function Showtime({ dates, locations, showtimes }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Định nghĩa màu tiêu đề cho từng rạp
  const getTitleColor = (cinema) => {
    switch (cinema) {
      case "ebv.id":
        return "#000"; // Đen
      case "CineOne21":
        return "#1890ff"; // Xanh
      case "hiflix Cinema":
        return "#ff4d4f"; // Đỏ
      default:
        return "#000";
    }
  };

  return (
    <>
      <div className={styles.showtimes}>
        <Title level={3} className={styles.showtimesTitle}>
          Showtimes and Tickets
        </Title>
        <Row className={styles.comboBoxes}>
          <Col xs={24} md={6}>
            <Select
              placeholder="Select date"
              className={styles.select}
              suffixIcon={<CalendarOutlined />}
              onChange={(value) => console.log("Selected date:", value)}
            >
              {dates.map((date) => (
                <Select.Option key={date} value={date}>
                  {formatDate(date)}
                </Select.Option>
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
                <Select.Option key={location} value={location}>
                  {location}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        {showtimes.length > 0 ? (
          <Row gutter={[16, 16]} className={styles.cinemaGrid}>
            {showtimes.map((item) => (
              <Col xs={24} md={12} lg={8} key={item.id}>
                <CinemaCard
                  cinema={item.cinema}
                  address={item.address}
                  times={item.times}
                  price={item.price}
                  titleColor={getTitleColor(item.cinema)}
                />
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