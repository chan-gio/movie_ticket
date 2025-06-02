/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Skeleton } from "antd";
import CinemaCard from "./CinemaCard";
import ShowtimeService from "../../../services/ShowtimeService";
import styles from "./Showtime.module.scss";
import { toastInfo, toastError } from "../../../utils/toastNotifier";

const { Title } = Typography;

export default function Showtime({ movieId }) {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // Track if fetch has been attempted

  const formatShowtimes = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }

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
          price: showtime.price || "N/A",
        };
      }
      acc[cinemaId].showtimes.push({
        showtime_id: showtime.showtime_id,
        start_time: showtime.start_time,
        room: showtime.room,
      });
      return acc;
    }, {});

    return Object.values(groupedByCinema);
  };

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ShowtimeService.getShowTimesByMovieId(movieId);
        const data = response.data;
        const formattedShowtimes = formatShowtimes(data);
        setShowtimes(formattedShowtimes);

        if (formattedShowtimes.length === 0) {
          toastInfo("No showtimes available for this movie.");
        }
      } catch (err) {
        console.error("Fetch Showtimes Error:", err);
        setError(err.message);
        toastError(err.message || "Failed to fetch showtimes");
      } finally {
        setLoading(false);
        setHasFetched(true); // Mark fetch as completed
      }
    };

    if (!hasFetched) {
      fetchShowtimes();
    }
  }, [movieId, hasFetched]); // Only re-fetch if movieId changes or hasn't fetched yet

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
      <div className={styles.showtimes}>
        <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 0 }} />
        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
          {[...Array(3)].map((_, index) => (
            <Col key={index} xs={24} md={12} lg={8}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className={styles.showtimes}>
      <Title level={3} className={styles.showtimesTitle}>
        Showtimes and Tickets
      </Title>
      {showtimes.length > 0 && (
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
      )}
    </div>
  );
}