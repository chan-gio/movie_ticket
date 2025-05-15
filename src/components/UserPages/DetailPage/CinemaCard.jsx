import React, { useState } from "react";
import { Typography, Button, Space } from "antd";
import { Link } from "react-router-dom";
import styles from "./CinemaCard.module.scss";

const { Title, Paragraph } = Typography;

const CinemaCard = ({ cinema, address, times, price, titleColor }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <div className={styles.cinemaCard}>
      <Title level={5} style={{ color: titleColor }} className={styles.cinemaTitle}>
        {cinema}
      </Title>
      <Paragraph className={styles.cinemaAddress}>{address}</Paragraph>
      <Space wrap className={styles.timeButtons}>
        {times.map((time) => (
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
      <div className={styles.priceRow}>
        <Paragraph className={styles.priceLabel}>Price</Paragraph>
        <Paragraph className={styles.price}>${price}/seat</Paragraph>
      </div>
      <div className={styles.buttonRow}>
        <Link to="/seats">
          <Button type="primary" block className={styles.bookButton}>
            Book now
          </Button>
        </Link>
        <Button block className={styles.cartButton}>
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default CinemaCard;