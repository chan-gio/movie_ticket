/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Row, Col, Typography, Button, Carousel } from "antd";
import { Link } from "react-router-dom";
import styles from "./HomeCard.module.scss";
import MovieCard from "../MovieCard/MovieCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Title } = Typography;

// Hàm tạo danh sách ngày từ hôm nay đến 14 ngày sau
const getDateRange = () => {
  const dates = [];
  const today = new Date(2025, 4, 16); // Ngày hôm nay: 16/05/2025
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Dữ liệu mẫu phim với ngày phát hành cụ thể (từ 16/05/2025 đến 30/05/2025)
const upcomingMovies = [
  {
    id: 11,
    title: "Dune",
    genre: "Sci-Fi, Adventure",
    poster: "https://wallpapercave.com/wp/wp1816326.jpg",
    releaseDate: "2025-05-16",
  },
  {
    id: 12,
    title: "No Time to Die",
    genre: "Action, Thriller",
    poster: "https://wallpapercave.com/wp/wp3703396.jpg",
    releaseDate: "2025-05-20",
  },
  {
    id: 13,
    title: "Black Widow",
    genre: "Action, Adventure",
    poster: "https://wallpapercave.com/wp/wp3703396.jpg",
    releaseDate: "2025-05-22",
  },
  {
    id: 14,
    title: "Eternals",
    genre: "Action, Fantasy",
    poster: "https://wallpapercave.com/wp/wp3703396.jpg",
    releaseDate: "2025-05-25",
  },
  {
    id: 15,
    title: "The Batman",
    genre: "Action, Crime",
    poster: "https://wallpapercave.com/wp/wp3703396.jpg",
    releaseDate: "2025-05-30",
  },
];

const UpcomingMovies = () => {
  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} className={styles.sectionTitle}>
            Upcoming Movies
          </Title>
        </Col>
        <Col>
          <Link to="/movies">
            <Button type="default" className={styles.viewAllButton}>
              View All
            </Button>
          </Link>
        </Col>
      </Row>
      <div className={styles.Container}>
        <Carousel
          arrows={true}
          slidesToShow={Math.min(upcomingMovies.length, 5)}
          slidesToScroll={1}
          draggable={true}
          dots
          className={styles.movieCarousel}
          responsive={[
            {
              breakpoint: 767,
              settings: {
                slidesToShow: Math.min(upcomingMovies.length, 2),
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
          {upcomingMovies.map((movie) => (
            <div key={movie.id} className={styles.carouselItem}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default UpcomingMovies;
