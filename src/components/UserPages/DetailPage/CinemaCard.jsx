/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Space, Select, message, Progress } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import styles from "./CinemaCard.module.scss";
import BookingService from "../../../services/BookingService";
import useAuth from "../../../utils/auth";
import { useBookingTimer } from "../../../Context/BookingTimerContext";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const CinemaCard = ({ cinema, address, showtimes, price, titleColor }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth({ disableRedirect: true });
  const { startTimer } = useBookingTimer();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [loading, setLoading] = useState(false);

  const safeCinema = cinema || "Unknown Cinema";
  const safeAddress = address || "Unknown Address";
  const safeShowtimes = Array.isArray(showtimes) && showtimes.length > 0 ? showtimes : [];
  const safePrice = price && price !== "N/A" ? `${price}đ / seat` : "Price N/A";

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
    return [...new Set(times)].sort();
  };

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
      .map((showtime) => ({
        id: showtime.room?.room_id || null,
        name: showtime.room?.room_name || "Unknown Room",
        showtimeId: showtime.showtime_id,
      }));
    return [...new Set(rooms.map(room => JSON.stringify(room)))].map(room => JSON.parse(room)).sort((a, b) => a.name.localeCompare(b.name));
  };

  const getShowtimeId = (date, time, roomId) => {
    if (!date || !time || !roomId) return null;
    const showtime = safeShowtimes.find((showtime) => {
      if (!showtime.start_time) return false;
      const showtimeDate = new Date(showtime.start_time).toISOString().split("T")[0];
      const showtimeTime = new Date(showtime.start_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return showtimeDate === date && showtimeTime === time && showtime.room?.room_id === roomId;
    });
    return showtime ? showtime.showtime_id : null;
  };

  const dates = getUniqueDates();
  const times = getTimesForDate(selectedDate);
  const rooms = getRoomsForDateAndTime(selectedDate, selectedTime);

  const handleBookNow = async () => {
    if (!isAuthenticated || !userId) {
      message.error("You need to log in to book a movie. Redirecting to login...");
      navigate('/auth');
      return;
    }

    if (!selectedRoomId) {
      message.error("Please select a room to proceed.");
      return;
    }

    const showtimeId = getShowtimeId(selectedDate, selectedTime, selectedRoomId);
    if (!showtimeId) {
      message.error("Could not determine showtime. Please try again.");
      return;
    }

    const bookingData = {
      user_id: userId,
      showtime_id: showtimeId,
      status: "PENDING",
    };

    try {
      setLoading(true);
      const response = await BookingService.createBooking(bookingData);
      const bookingId = response.booking_id;
      const movieName = response.movie_title; 
      if (bookingId) {
        const path = `/seats/${selectedRoomId}/${bookingId}`;
        startTimer(bookingId, movieName, "SeatSelection", { selectedDate, selectedTime, selectedRoomId }, path);
        navigate(path);
      } else {
        throw new Error("Booking ID not returned from server.");
      }
    } catch (error) {
      console.error('Booking error:', error);
      message.error(error.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      <Select
        placeholder="Select date"
        className={styles.select}
        suffixIcon={<CalendarOutlined />}
        onChange={(value) => {
          setSelectedDate(value);
          setSelectedTime(null);
          setSelectedRoomId(null);
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

      {selectedDate && (
        <Space wrap className={styles.timeButtons}>
          {times.length > 0 ? (
            times.map((time) => (
              <Button
                key={time}
                type={selectedTime === time ? "primary" : "default"}
                onClick={() => {
                  setSelectedTime(time);
                  setSelectedRoomId(null);
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

      {selectedTime && (
        <Select
          placeholder="Select room"
          className={styles.select}
          onChange={(value) => setSelectedRoomId(value)}
          value={selectedRoomId}
          style={{ width: "100%", marginTop: 16, marginBottom: 16 }}
        >
          {rooms.map((room) => (
            <Option key={room.id} value={room.id}>
              {room.name}
            </Option>
          ))}
        </Select>
      )}

      <div className={styles.priceRow}>
        <Paragraph className={styles.priceLabel}>Price</Paragraph>
        <Paragraph className={styles.price}>{safePrice}</Paragraph>
      </div>

      <div className={styles.buttonRow}>
        <Button
          type="primary"
          block
          className={styles.bookButton}
          disabled={!selectedRoomId || loading}
          onClick={handleBookNow}
          loading={loading}
        >
          Book now
        </Button>
      </div>
    </div>
  );
};

export default CinemaCard;