import React, { useState } from "react";
import { Typography, Button, Space } from "antd";
import { Link } from "react-router-dom";
import styles from "./CinemaCard.module.scss";

const { Title, Paragraph } = Typography;

const CinemaCard = ({ cinema, address, times, price, titleColor }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  // Fallbacks for missing data
  const safeCinema = cinema || "Unknown Cinema";
  const safeAddress = address || "Unknown Address";
  const safeTimes = Array.isArray(times) && times.length > 0 ? times : ["N/A"];
  const safePrice = price && price !== "N/A" ? `$${price}/seat` : "Price N/A";

  return (
    <div className={styles.cinemaCard}>
      <Title
        level={5}
        style={{ color: titleColor || "#000" }}
        className={styles.cinemaTitle}
      >
        {safeCinema}
      </Title>
      <Paragraph className={styles.cinemaAddress}>{safeAddress}</Paragraph>
      <Space wrap className={styles.timeButtons}>
        {safeTimes.map((time) => (
          <Button
            key={time}
            type={selectedTime === time ? "primary" : "default"}
            onClick={() => setSelectedTime(time)}
            className={styles.timeButton}
            disabled={time === "N/A"}
          >
            {time}
          </Button>
        ))}
      </Space>
      <div className={styles.priceRow}>
        <Paragraph className={styles.priceLabel}>Price</Paragraph>
        <Paragraph className={styles.price}>{safePrice}</Paragraph>
      </div>
      <div className={styles.buttonRow}>
        <Link to="/seats">
          <Button
            type="primary"
            block
            className={styles.bookButton}
            disabled={!selectedTime || selectedTime === "N/A"}
          >
            Book now
          </Button>
        </Link>
        <Button
          block
          className={styles.cartButton}
          disabled={!selectedTime || selectedTime === "N/A"}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default CinemaCard;
