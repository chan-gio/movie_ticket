import React from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import styles from "./MovieCard.module.scss";

const { Title, Paragraph } = Typography;

const MovieCard = ({ movie }) => {
  return (
    <div className={styles.movieCard}>
      <Link to={`/movie/${movie.id}`}>
        <img
          src={movie.poster}
          alt={movie.title}
          className={styles.moviePoster}
        />
      </Link>
      <Title level={5} className={styles.movieCardTitle}>
        {movie.title}
      </Title>
      <Paragraph className={styles.movieCardText}>{movie.genre}</Paragraph>
    </div>
  );
};

export default MovieCard;
