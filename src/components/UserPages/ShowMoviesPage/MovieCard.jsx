import React from "react";
import { Typography, Tag } from "antd";
import { Link } from "react-router-dom";
import styles from "./MovieCard.module.scss";

const { Title, Paragraph } = Typography;

const MovieCard = ({ movie }) => {
  // Fallbacks for missing data
  const title = movie.title || "Untitled";
  const poster = movie.poster_url || "https://wallpapercave.com/wp/wp1816326.jpg";
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
      <Link to={`/movie/${movie.movie_id}`} className={styles.movieLink}>
        <div className={styles.posterContainer}>
          <img 
            src={poster} 
            alt={title} 
            className={styles.moviePoster}
            loading="lazy"
          />
        </div>
      </Link>
      <div className={styles.movieInfo}>
        <Title level={5} className={styles.movieCardTitle} title={title}>
          {title}
        </Title>
        <Paragraph className={styles.movieCardText} title={genre}>
          {genre}
        </Paragraph>
        <div className={styles.movieMeta}>
          <Tag color="blue" className={styles.ageRating}>
            {ageRating}
          </Tag>
          <span className={styles.releaseDate}>{releaseDate}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;