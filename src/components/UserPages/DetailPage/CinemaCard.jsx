import React, { useState } from "react";
import { Typography, Button, Space, Select } from "antd";
import { Link } from "react-router-dom";
import { CalendarOutlined } from "@ant-design/icons";
import styles from "./CinemaCard.module.scss";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const CinemaCard = ({ cinema, address, showtimes, price, titleColor }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fallbacks for missing data
  const safeCinema = cinema || "Unknown Cinema";
  const safeAddress = address || "Unknown Address";
  const safeShowtimes = Array.isArray(showtimes) && showtimes.length > 0 ? showtimes : [];
  const safePrice = price && price !== "N/A" ? `$${price}/seat` : "Price N/A";

  // Extract unique dates
  const getUniqueDates = () => {
    const dates = new Set();
    safeShowtimes.forEach((showtime) => {
      if (showtime.start_time) {
        const date = new Date(showtime.start_time).toISOString().split("T")[0];
        dates.add(date);
      }
    });
    return Array.from(dates).sort();
  };

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Unknown";
  };

  // Extract times for the selected date
  const getTimesForDate = (date) => {
    if (!date) return [];
    const times = safeShowtimes
      .filter((showtime) => {
        if (!showtime.start_time) return false;
        const showtimeDate = new Date(showtime.start_time).toISOString().split("T")[0];
        return showtimeDate === date;
      })
      .map((showtime) =>
        new Date(showtime.start_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    return [...new Set(times)].sort(); // Remove duplicates and sort
  };

  // Extract rooms for the selected date and time
  const getRoomsForDateAndTime = (date, time) => {
    if (!date || !time) return [];
    const rooms = safeShowtimes
      .filter((showtime) => {
        if (!showtime.start_time) return false;
        const showtimeDate = new Date(showtime.start_time).toISOString().split("T")[0];
        const showtimeTime = new Date(showtime.start_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return showtimeDate === date && showtimeTime === time;
      })
      .map((showtime) => showtime.room?.room_name || "Unknown Room");
    return [...new Set(rooms)].sort(); // Remove duplicates and sort
  };

  const dates = getUniqueDates();
  const times = getTimesForDate(selectedDate);
  const rooms = getRoomsForDateAndTime(selectedDate, selectedTime);

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

      {/* Date Selection */}
      <Select
        placeholder="Select date"
        className={styles.select}
        suffixIcon={<CalendarOutlined />}
        onChange={(value) => {
          setSelectedDate(value);
          setSelectedTime(null); // Reset time and room when date changes
          setSelectedRoom(null);
        }}
        value={selectedDate}
        style={{ width: "100%", marginBottom: 16 }}
      >
        {dates.map((date) => (
          <Option key={date} value={date}>
            {formatDate(date)}
          </Option>
        ))}
      </Select>

      {/* Time Selection - Only show if a date is selected */}
      {selectedDate && (
        <Space wrap className={styles.timeButtons}>
          {times.length > 0 ? (
            times.map((time) => (
              <Button
                key={time}
                type={selectedTime === time ? "primary" : "default"}
                onClick={() => {
                  setSelectedTime(time);
                  setSelectedRoom(null); // Reset room when time changes
                }}
                className={styles.timeButton}
              >
                {time}
              </Button>
            ))
          ) : (
            <Paragraph>No showtimes available</Paragraph>
          )}
        </Space>
      )}

      {/* Room Selection - Only show if a time is selected */}
      {selectedTime && (
        <Select
          placeholder="Select room"
          className={styles.select}
          onChange={(value) => setSelectedRoom(value)}
          value={selectedRoom}
          style={{ width: "100%", marginTop: 16, marginBottom: 16 }}
        >
          {rooms.map((room) => (
            <Option key={room} value={room}>
              {room}
            </Option>
          ))}
        </Select>
      )}

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
            disabled={!selectedRoom}
          >
            Book now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CinemaCard;