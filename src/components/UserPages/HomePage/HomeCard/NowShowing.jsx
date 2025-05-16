import React from "react";
import { Row, Col, Typography, Button, Carousel } from "antd";
import { Link } from "react-router-dom";
import styles from "./HomeCard.module.scss";
import MovieCard from "../MovieCard/MovieCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Title } = Typography;

const nowShowingMovies = [
  {
    id: 1,
    title: "Movie 1",
    poster: "https://wallpapercave.com/wp/wp1816326.jpg",
    genre: "Action",
  },
  {
    id: 2,
    title: "Movie 2",
    poster: "https://wallpapercave.com/wp/wp1816326.jpg",
    genre: "Comedy",
  },
  {
    id: 3,
    title: "Movie 3",
    poster: "https://wallpapercave.com/wp/wp1816326.jpg",
    genre: "Drama",
  },
  {
    id: 4,
    title: "Movie 4",
    poster: "https://wallpapercave.com/wp/wp1816326.jpg",
    genre: "Sci-Fi",
  },
  {
    id: 5,
    title: "Movie 5",
    poster: "https://wallpapercave.com/wp/wp1816326.jpg",
    genre: "Thriller",
  },
];

const NowShowing = () => {
  return (
    <div>
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
      <div className={styles.Container}>
        <Carousel
          arrows={true}
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
          {nowShowingMovies.map((movie) => (
            <div key={movie.id} className={styles.carouselItem}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default NowShowing;
