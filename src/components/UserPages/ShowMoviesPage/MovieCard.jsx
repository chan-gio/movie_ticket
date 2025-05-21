import React from "react";
import { Typography, Button } from "antd";
import { Link } from "react-router-dom";
import styles from "./MovieCard.module.scss";
const fallbackPoster = "https://betravingknows.com/wp-content/uploads/2017/06/video-movie-placeholder-image-grey.png"; 

const { Title, Paragraph } = Typography;

const MovieCard = ({ movie }) => {
  return (
    <div className={styles.movieCard}>
      <Link to={`/movie/${movie.movie_id}`} className={styles.posterLink}>
        <img
          src={movie.poster_url || fallbackPoster}
          alt={movie.title}
          className={styles.moviePoster}
        />
      </Link>
      <div className={styles.movieContent}>
        <Title level={5} className={styles.movieTitle}>
          <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
        </Title>
        <Paragraph className={styles.movieText}>
          {movie.genre || "N/A"}
        </Paragraph>
        {movie.release_date && (
          <Paragraph className={styles.movieText}>
            Release: {new Date(movie.release_date).toLocaleDateString("vi-VN")}
          </Paragraph>
        )}
        <Button
          type="primary"
          className={styles.viewButton}
          onClick={() => window.location.href = `/movie/${movie.id}`}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default MovieCard;