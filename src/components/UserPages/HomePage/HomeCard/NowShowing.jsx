/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Button, Carousel } from "antd";
import { Link } from "react-router-dom";
import { FrownOutlined } from "@ant-design/icons";
import styles from "./HomeCard.module.scss";
import MovieCard from "../MovieCard/MovieCard";
import MovieService from "../../../../services/MovieService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Title } = Typography;

const NowShowing = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNowShowingMovies = async () => {
      try {
        const movies = await MovieService.getNowShowing();
        // Map API response to match MovieCard expected props
        const formattedMovies = movies.map((movie) => ({
          id: movie.movie_id, // Map movie_id to id
          title: movie.title,
          poster:
            movie.poster_url || "https://wallpapercave.com/wp/wp1816326.jpg", // Fallback poster
          genre: movie.genre || "Unknown", // Fallback genre
        }));
        setNowShowingMovies(formattedMovies);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNowShowingMovies();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Error: {error}</div>
    );
  }

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
        {nowShowingMovies.length === 0 ? (
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
              No movies currently showing
            </Typography.Text>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default NowShowing;
