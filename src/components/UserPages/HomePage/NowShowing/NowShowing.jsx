import React from "react";
import { Row, Col, Typography, Button, Carousel } from "antd";
import { Link } from "react-router-dom";
import styles from "./NowShowing.module.scss";
import MovieCard from "../MovieCard/MovieCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Title } = Typography;

const nowShowingMovies = [
  {
    id: 1,
    title: "Movie 1",
    poster: "https://via.placeholder.com/200x300",
    genre: "Action",
  },
  {
    id: 2,
    title: "Movie 2",
    poster: "https://via.placeholder.com/200x300",
    genre: "Comedy",
  },
  {
    id: 3,
    title: "Movie 3",
    poster: "https://via.placeholder.com/200x300",
    genre: "Drama",
  },
  {
    id: 4,
    title: "Movie 4",
    poster: "https://via.placeholder.com/200x300",
    genre: "Sci-Fi",
  },
  {
    id: 5,
    title: "Movie 5",
    poster: "https://via.placeholder.com/200x300",
    genre: "Thriller",
  },
];

const NowShowing = () => {
  return (
    <>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} className={styles.sectionTitle}>
            Now Showing
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
      <Carousel
        arrows={true} // Bật mũi tên điều hướng
        slidesToShow={Math.min(nowShowingMovies.length, 5)}
        slidesToScroll={1}
        draggable={true}
        dots
        className={styles.movieCarousel}
        responsive={[
          {
            breakpoint: 767,
            settings: {
              slidesToShow: Math.min(nowShowingMovies.length, 2),
              arrows: true, // Đảm bảo mũi tên vẫn hiển thị trên mobile
            },
          },
          {
            breakpoint: 575,
            settings: {
              slidesToShow: 1,
              arrows: true, // Đảm bảo mũi tên vẫn hiển thị trên mobile
            },
          },
        ]}
      >
        {nowShowingMovies.map((movie) => (
          <div key={movie.id} className={styles.carouselItem}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default NowShowing;
