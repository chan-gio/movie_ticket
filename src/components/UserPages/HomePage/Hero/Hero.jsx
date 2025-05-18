import { Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import styles from "./Hero.module.scss";

const { Title, Paragraph } = Typography;

const movies = [
  {
    id: 1,
    title: "Movie 1",
    poster: "https://wallpapercave.com/wp/wp1816326.jpg",
    genre: "Action",
  },
  {
    id: 2,
    title: "Movie 2",
    poster:
      "https://static01.nyt.com/images/2020/02/05/multimedia/05xp-lionking/merlin_165677088_8820db00-d13c-4f15-a5a4-be78b888c5b6-jumbo.jpg?quality=90&auto=webp",
    genre: "Adventure",
  },
  {
    id: 3,
    title: "Movie 3",
    poster: "https://wallpapercave.com/wp/wp3703396.jpg",
    genre: "Sci-Fi",
  },
  {
    id: 4,
    title: "Movie 4",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/98/John_Wick_TeaserPoster.jpg/250px-John_Wick_TeaserPoster.jpg",
    genre: "Fantasy",
  },
];

function Hero() {
  return (
    <div className={styles.heroContainer}>
      <section className={styles.hero}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <div className={styles.heroSubtitleContainer}>
              <Paragraph className={styles.heroSubtitle}>
                Nearest Cinema, Newest Movie,
              </Paragraph>
              <Title className={styles.heroTitle}>Find out now!</Title>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <div className={styles.imageContainer}>
              {movies.map((movie, idx) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className={styles.imgGradient}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className={styles.heroImage}
                  />
                </Link>
              ))}
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
}

export default Hero;
