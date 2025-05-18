/* eslint-disable no-unused-vars */
import { useParams, Link } from "react-router-dom";
import { Typography } from "antd";
import styles from "./MovieDetails.module.scss";
import ContentBox from "../../../components/UserPages/DetailPage/ContentBox";
import Showtime from "../../../components/UserPages/DetailPage/Showtime";

const { Title, Paragraph } = Typography;

function MovieDetails() {
  const { id } = useParams();

  return (
    <div className={styles.movieDetails}>
      <ContentBox movieId={id} />
      <Showtime movieId={id} />
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
