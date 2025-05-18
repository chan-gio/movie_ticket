/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Select, Space, Spin } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import CinemaCard from "./CinemaCard";
import ShowtimeService from "../../../services/ShowtimeService";
import styles from "./Showtime.module.scss";

const { Title, Paragraph } = Typography;

export default function Showtime({ movieId }) {
  const [showtimes, setShowtimes] = useState([]);
  const [dates, setDates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Unknown";
  };

  // Generate dates and locations from showtimes
  const extractDatesAndLocations = (showtimes) => {
    const uniqueDates = new Set();
    const uniqueLocations = new Set();

    if (Array.isArray(showtimes)) {
      showtimes.forEach((showtime) => {
        if (showtime.start_time) {
          const date = new Date(showtime.start_time)
            .toISOString()
            .split("T")[0];
          uniqueDates.add(date);
        }
        // Use room_id as a proxy for location if address is unavailable
        uniqueLocations.add(showtime.room_id || "Unknown");
      });
    }

    return {
      dates: Array.from(uniqueDates).sort(),
      locations: Array.from(uniqueLocations).sort(),
    };
  };

  // Map API showtime data to CinemaCard props, grouping by room_id
  const formatShowtimes = (data) => {
    if (!Array.isArray(data)) {
      console.warn("Showtime data is not an array:", data);
      return [];
    }

    // Group showtimes by room_id to simulate cinema
    const groupedByRoom = data.reduce((acc, showtime) => {
      const roomId = showtime.room_id || "unknown";
      if (!acc[roomId]) {
        acc[roomId] = {
          id: showtime.showtime_id || `temp-${Math.random()}`,
          room_id: roomId,
          cinema: `Cinema ${roomId}`, // Placeholder; replace with actual cinema name if available
          address: "Unknown Address", // Placeholder; replace with actual address if available
          times: [],
          price: showtime.price ? (showtime.price / 1000).toFixed(1) : "N/A",
        };
      }
      if (showtime.start_time) {
        acc[roomId].times.push(
          new Date(showtime.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
      return acc;
    }, {});

    // Convert grouped object to array
    return Object.values(groupedByRoom).map((group) => ({
      ...group,
      times: group.times.length > 0 ? group.times : ["N/A"],
    }));
  };

  // Fetch showtimes
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const data = await ShowtimeService.getShowtimeByMovieId(movieId);
        const formattedShowtimes = formatShowtimes(data);
        const { dates, locations } = extractDatesAndLocations(data);
        setShowtimes(formattedShowtimes);
        setDates(dates);
        setLocations(locations);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  // Filter showtimes based on selected date and city
  const filteredShowtimes = showtimes.filter((showtime) => {
    // Check if any time in the showtime's times array matches the selected date
    const matchesDate = showtime.times.some((time) => {
      if (time === "N/A") return false;
      // Since times are derived from start_time, use the original showtime data
      const showtimeDate = new Date(showtime.times[0])
        .toISOString()
        .split("T")[0];
      return !selectedDate || showtimeDate === selectedDate;
    });
    const matchesCity = !selectedCity || showtime.room_id === selectedCity;
    return matchesDate && matchesCity;
  });

  // Define title color for cinemas
  const getTitleColor = (cinema) => {
    switch (cinema) {
      case "Cinema r01":
        return "#000";
      case "CineOne21":
        return "#1890ff";
      case "hiflix Cinema":
        return "#ff4d4f";
      default:
        return "#000";
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Error: {error}</div>
    );
  }

  return (
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
            onChange={(value) => setSelectedDate(value)}
            value={selectedDate}
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
            placeholder="Select room"
            className={styles.select}
            suffixIcon={<EnvironmentOutlined />}
            onChange={(value) => setSelectedCity(value)}
            value={selectedCity}
          >
            {locations.map((location) => (
              <Select.Option key={location} value={location}>
                {location}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      {filteredShowtimes.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
          {filteredShowtimes.map((item) => (
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            textAlign: "center",
            color: "#888",
          }}
        >
          <FrownOutlined
            style={{ fontSize: "48px", color: "#888", marginBottom: "16px" }}
          />
          <Typography.Text style={{ fontSize: "18px", color: "#888" }}>
            No showtimes available
          </Typography.Text>
        </div>
      )}
    </div>
  );
}
