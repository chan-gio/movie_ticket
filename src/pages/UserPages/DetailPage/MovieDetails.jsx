import { useParams, Link } from 'react-router-dom';
import { Typography } from 'antd';
import styles from './MovieDetails.module.scss';
import ContentBox from '../../../components/UserPages/DetailPage/ContentBox';
import Showtime from '../../../components/UserPages/DetailPage/Showtime';
import { useMovieDetails } from '../../../hooks/useMovieDetails';

function MovieDetails() {
  const { id } = useParams();
  const { movie, showtimes, isLoading, error } = useMovieDetails(id);

  return (
    <div className={styles.movieDetails}>
      <ContentBox movie={movie} isLoading={isLoading} />
      <Showtime showtimes={showtimes} isLoading={isLoading} error={error} />
      <div className={styles.viewMore}>
        <div className={styles.dividerLine}></div>
        <Link to="#" className={styles.viewMoreLink}>
          view more
        </Link>
        <div className={styles.dividerLine}></div>
      </div>
    </div>
  );
}

export default MovieDetails;
