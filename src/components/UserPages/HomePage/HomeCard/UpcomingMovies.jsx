/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Button, Carousel, Skeleton, Space } from "antd";
import { Link } from "react-router-dom";
import { FrownOutlined } from "@ant-design/icons";
import styles from "./HomeCard.module.scss";
import MovieCard from "../MovieCard/MovieCard";
import MovieService from "../../../../services/MovieService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Title } = Typography;

const UpcomingMovies = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        const response = await MovieService.getUpcomingMovie();
        const movies = response.data || response; // Handle API response structure
        const formattedMovies = movies.map((movie) => ({
          id: movie.movie_id,
          title: movie.title,
          poster:
            movie.poster_url || "https://wallpapercave.com/wp/wp1816326.jpg",
          genre: movie.genre || "Unknown",
          adult: movie.adult || "N/A",
          release_date: movie.release_date || "Unknown",
        }));
        setUpcomingMovies(formattedMovies);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, []);

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Error: {error}</div>
    );
  }

  return (
    <div>
      {loading ? (
        <div style={{ width: 1160, margin: "0 auto" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Skeleton.Input active size="large" style={{ width: 200 }} />
            </Col>
            <Col>
              <Skeleton.Button active size="default" />
            </Col>
          </Row>
          <div className={styles.Container}>
            <Row gutter={[16, 16]}>
              {[...Array(5)].map((_, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      ) : (
        <>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} className={styles.sectionTitle}>
                Upcoming Movies
              </Title>
            </Col>
            <Col>
              <Link to="/movies" state={{ type: "upcoming" }}>
                <Button type="default" className={styles.viewAllButton}>
                  View All
                </Button>
              </Link>
            </Col>
          </Row>
          <div className={styles.Container}>
            {upcomingMovies.length === 0 ? (
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
                  style={{
                    fontSize: "48px",
                    color: "#888",
                    marginBottom: "16px",
                  }}
                />
                <Typography.Text style={{ fontSize: "18px", color: "#888" }}>
                  No upcoming movies available
                </Typography.Text>
              </div>
            ) : (
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
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UpcomingMovies;
