import React from "react";
import { Typography, Tag } from "antd";
import { Link } from "react-router-dom";
import styles from "./MovieCard.module.scss";

const { Title, Paragraph } = Typography;

const MovieCard = ({ movie }) => {
  // Fallbacks for missing data
  const title = movie.title || "Untitled";
  const poster = movie.poster || "https://wallpapercave.com/wp/wp1816326.jpg";
  const genre = movie.genre || "Unknown";
  const ageRating = movie.adult || "N/A";
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className={styles.movieCard}>
      <Link to={`/movie/${movie.id}`}>
        <img src={poster} alt={title} className={styles.moviePoster} />
      </Link>
      <Title level={5} className={styles.movieCardTitle}>
        {title}
      </Title>
      <Paragraph className={styles.movieCardText}>{genre}</Paragraph>
      <Paragraph className={styles.movieCardText}>
        <Tag color="blue">{ageRating}</Tag>
        <span> | {releaseDate}</span>
      </Paragraph>
    </div>
  );
};

export default MovieCard;
