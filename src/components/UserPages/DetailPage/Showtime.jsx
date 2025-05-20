import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Spin } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import CinemaCard from "./CinemaCard";
import ShowtimeService from "../../../services/ShowtimeService";
import styles from "./Showtime.module.scss";

const { Title } = Typography;

export default function Showtime({ movieId }) {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map API showtime data to CinemaCard props, grouping by cinema_id
  const formatShowtimes = (data) => {
    if (!Array.isArray(data)) {
      console.warn("Showtime data is not an array:", data);
      return [];
    }

    // Group showtimes by cinema_id
    const groupedByCinema = data.reduce((acc, showtime) => {
      const cinemaId = showtime.room?.cinema?.cinema_id || "unknown";
      const cinemaName = showtime.room?.cinema?.name || "Unknown Cinema";
      const cinemaAddress = showtime.room?.cinema?.address || "Unknown Address";

      if (!acc[cinemaId]) {
        acc[cinemaId] = {
          cinema_id: cinemaId,
          cinema: cinemaName,
          address: cinemaAddress,
          showtimes: [],
          price: showtime.price ? (showtime.price / 1000).toFixed(1) : "N/A",
        };
      }
      acc[cinemaId].showtimes.push({
        showtime_id: showtime.showtime_id,
        start_time: showtime.start_time,
        room: showtime.room,
      });
      return acc;
    }, {});

    // Convert grouped object to array
    return Object.values(groupedByCinema);
  };

  // Fetch showtimes
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await ShowtimeService.getShowTimesByMovieId(movieId);
        const data = response.data; // Access the 'data' array from response
        const formattedShowtimes = formatShowtimes(data);
        setShowtimes(formattedShowtimes);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  // Define title color for cinemas
  const getTitleColor = (cinema) => {
    switch (cinema) {
      case "CGV Vincom":
        return "#ff4d4f";
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
      
      {showtimes.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
          {showtimes.map((item) => (
            <Col xs={24} md={12} lg={8} key={item.cinema_id}>
              <CinemaCard
                cinema={item.cinema}
                address={item.address}
                showtimes={item.showtimes}
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