import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Typography, Input, Form } from 'antd';
import styles from './Home.module.scss';

const { Title, Paragraph } = Typography;

const nowShowingMovies = [
  { id: 1, title: 'Movie 1', poster: 'https://via.placeholder.com/200x300' },
  { id: 2, title: 'Movie 2', poster: 'https://via.placeholder.com/200x300' },
  { id: 3, title: 'Movie 3', poster: 'https://via.placeholder.com/200x300' },
  { id: 4, title: 'Movie 4', poster: 'https://via.placeholder.com/200x300' },
];

const upcomingMovies = [
  { id: 5, title: 'Upcoming 1', poster: 'https://via.placeholder.com/200x300', genre: 'Action' },
  { id: 6, title: 'Upcoming 2', poster: 'https://via.placeholder.com/200x300', genre: 'Comedy' },
  { id: 7, title: 'Upcoming 3', poster: 'https://via.placeholder.com/200x300', genre: 'Drama' },
];

const months = [
  { id: 1, month: 'January' },
  { id: 2, month: 'February' },
  { id: 3, month: 'March' },
  { id: 4, month: 'April' },
];

function Home() {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Paragraph className={styles.heroSubtitle}>
              Nearest Cinema, Newest Movie,
            </Paragraph>
            <Title className={styles.heroTitle}>
              Find out now!
            </Title>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={[8, 8]}>
              <Col xs={8} style={{ paddingTop: 80 }}>
                <div className={styles.imgGradient}>
                  <img
                    src="https://wallpapercave.com/wp/wp1816326.jpg"
                    alt="Movie Poster 1"
                    className={styles.heroImage}
                  />
                </div>
              </Col>
              <Col xs={8} style={{ paddingTop: 40 }}>
                <div className={styles.imgGradient}>
                  <img
                    src="https://static01.nyt.com/images/2020/02/05/multimedia/05xp-lionking/merlin_165677088_8820db00-d13c-4f15-a5a4-be78b888c5b6-jumbo.jpg?quality=90&auto=webp"
                    alt="Movie Poster 2"
                    className={styles.heroImage}
                  />
                </div>
              </Col>
              <Col xs={8}>
                <div className={styles.imgGradient}>
                  <img
                    src="https://wallpapercave.com/wp/wp3703396.jpg"
                    alt="Movie Poster 3"
                    className={styles.heroImage}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>

      {/* Now Showing Section */}
      <section className={styles.section}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} className={styles.sectionTitle}>
              Now Showing
            </Title>
          </Col>
          <Col>
            <Link to="/movies">
              <Paragraph className={styles.viewAll}>view all</Paragraph>
            </Link>
          </Col>
        </Row>
        <div className={styles.scrollMenu}>
          {nowShowingMovies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className={styles.movieLink}>
              <Card
                hoverable
                cover={<img src={movie.poster} alt={movie.title} className={styles.moviePoster} />}
                className={styles.movieCard}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Movies Section */}
      <section className={styles.section}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} className={styles.sectionTitle}>
              Upcoming Movies
            </Title>
          </Col>
          <Col>
            <Link to="/movies">
              <Paragraph className={styles.viewAll}>view all</Paragraph>
            </Link>
          </Col>
        </Row>
        <div className={styles.scrollMenu}>
          {months.map((item) => (
            <Button
              key={item.id}
              type="default"
              className={styles.monthButton}
            >
              {item.month}
            </Button>
          ))}
        </div>
        <div className={styles.scrollMenu}>
          {upcomingMovies.map((movie) => (
            <Card
              key={movie.id}
              hoverable
              className={styles.movieCard}
            >
              <img src={movie.poster} alt={movie.title} className={styles.moviePoster} />
              <Title level={5} className={styles.movieCardTitle}>
                {movie.title}
              </Title>
              <Paragraph className={styles.movieCardText}>
                {movie.genre}
              </Paragraph>
              <Link to={`/movie/${movie.id}`}>
                <Button type="default" className={styles.detailButton}>
                  Detail
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Subscribe Section */}
      <section className={styles.section}>
        <Card className={styles.subscribeCard}>
          <Paragraph className={styles.subscribeText}>
            Be the vanguard of the
          </Paragraph>
          <Title level={3} className={styles.subscribeTitle}>
            Moviegoers
          </Title>
          <Form layout="inline" className={styles.subscribeForm}>
            <Form.Item>
              <Input placeholder="Type your email" className={styles.subscribeInput} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.subscribeButton}>
                Join now
              </Button>
            </Form.Item>
          </Form>
          <Paragraph className={styles.subscribeFooter}>
            By joining you as a Tickitz member, <br />
            we will always send you the latest updates via email.
          </Paragraph>
        </Card>
      </section>
    </div>
  );
}

export default Home;