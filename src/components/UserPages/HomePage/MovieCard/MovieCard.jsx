import React from "react";
import { Card, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import styles from "./MovieCard.module.scss";

const { Title, Paragraph } = Typography;

const MovieCard = ({ movie }) => {
  return (
    <Card hoverable className={styles.movieCard}>
      <img
        src={movie.poster}
        alt={movie.title}
        className={styles.moviePoster}
      />
      <Title level={5} className={styles.movieCardTitle}>
        {movie.title}
      </Title>
      <Paragraph className={styles.movieCardText}>{movie.genre}</Paragraph>
      <Link to={`/movie/${movie.id}`}>
        <Button type="default" className={styles.detailButton}>
          Detail
        </Button>
      </Link>
    </Card>
  );
};

export default MovieCard;
