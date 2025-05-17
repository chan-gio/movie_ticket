import React, { useState } from "react";
import { Row, Col, Typography, Button, Carousel } from "antd";
import { Link } from "react-router-dom";
import styles from "./UpcomingMovies.module.scss";
import MovieCard from "../MovieCard/MovieCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import comingSoon from "/assets/comingSoon.png";

const { Title } = Typography;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Dữ liệu mẫu phim có tháng ra mắt (month: 1-based)
const upcomingMovies = [
  {
    id: 11,
    title: "Dune",
    genre: "Sci-Fi, Adventure",
    poster: "/images/dune.jpg",
    month: 9,
  },
  {
    id: 12,
    title: "No Time to Die",
    genre: "Action, Thriller",
    poster: "/images/notimetodie.jpg",
    month: 10,
  },
  {
    id: 13,
    title: "Black Widow",
    genre: "Action, Adventure",
    poster: "/images/blackwidow.jpg",
    month: 7,
  },
  {
    id: 14,
    title: "Eternals",
    genre: "Action, Fantasy",
    poster: "/images/eternals.jpg",
    month: 11,
  },
  {
    id: 15,
    title: "The Batman",
    genre: "Action, Crime",
    poster: "/images/batman.jpg",
    month: 3,
  },
];

const UpcomingMovies = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Lọc phim theo tháng nếu có chọn
  const filteredMovies = selectedMonth
    ? upcomingMovies.filter((movie) => movie.month === selectedMonth)
    : upcomingMovies;

  return (
    <>
      <Row justify="space-between" align="middle" className={styles.headerRow}>
        <Col>
          <Title level={3} className={styles.sectionTitle}>
            Upcoming Movies
          </Title>
        </Col>
        <Col>
          <Link to="/movies/upcoming">
            <Button type="default" className={styles.viewAllButton}>
              View All
            </Button>
          </Link>
        </Col>
      </Row>

      <Row className={styles.monthFilter} gutter={[8, 8]} justify="start">
        {months.map((monthLabel, index) => {
          const monthNumber = index + 1;
          const isSelected = selectedMonth === monthNumber;
          return (
            <Button
              key={monthLabel}
              className={`${styles.monthButton} ${
                isSelected ? styles.monthButtonActive : ""
              }`}
              onClick={() => setSelectedMonth(isSelected ? null : monthNumber)}
            >
              {monthLabel}
            </Button>
          );
        })}
      </Row>

      {filteredMovies.length > 0 ? (
        <Carousel
          arrows={true}
          slidesToShow={Math.min(filteredMovies.length, 5)}
          slidesToScroll={1}
          dots
          draggable={true}
          className={styles.movieCarousel}
          responsive={[
            {
              breakpoint: 767,
              settings: {
                slidesToShow: Math.min(filteredMovies.length, 2),
                arrows: true,
              },
            },
            {
              breakpoint: 575,
              settings: {
                slidesToShow: 1,
                arrows: true,
              },
            },
          ]}
        >
          {filteredMovies.map((movie) => (
            <div key={movie.id} className={styles.carouselItem}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className={styles.placeholderContainer}>
          <img
            src={comingSoon}
            alt="No movies available"
            className={styles.placeholderImage}
          />
        </div>
      )}
    </>
  );
};

export default UpcomingMovies;
