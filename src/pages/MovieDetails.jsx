import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Select, Button, Space } from 'antd';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from './MovieDetails.module.scss';
import { useState } from 'react';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const movie = {
  id: 1,
  title: 'Movie 1',
  picture: 'https://via.placeholder.com/200x300',
  genre: 'Action, Adventure',
  releaseDate: '2025-01-15',
  directed: 'John Director',
  duration: '2h 15m',
  cast: 'Actor A, Actor B, Actor C',
  synopsis: 'An action-packed adventure through a thrilling world of challenges and triumphs.',
};

const showtimes = [
  {
    id: 1,
    cinema: 'Cinema 1',
    picture: 'https://via.placeholder.com/100',
    address: '123 Main St, City A',
    times: ['10:00 AM', '2:00 PM', '6:00 PM'],
    price: 10,
  },
  {
    id: 2,
    cinema: 'Cinema 2',
    picture: 'https://via.placeholder.com/100',
    address: '456 Elm St, City B',
    times: ['11:00 AM', '3:00 PM', '7:00 PM'],
    price: 12,
  },
];

const dates = [
  '2025-05-15',
  '2025-05-16',
  '2025-05-17',
];

const locations = [
  'City A',
  'City B',
];

function MovieDetails() {
  const { id } = useParams();
  const [selectedTime, setSelectedTime] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.movieDetails}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className={styles.posterCard}>
            <img src={movie.picture} alt={movie.title} className={styles.posterImage} />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Title level={2}>{movie.title}</Title>
          <Paragraph className={styles.genre}>{movie.genre}</Paragraph>
          <Row gutter={[16, 16]}>
            <Col xs={12} lg={8}>
              <Paragraph className={styles.label}>Release date</Paragraph>
              <Paragraph>{formatDate(movie.releaseDate)}</Paragraph>
            </Col>
            <Col xs={12} lg={16}>
              <Paragraph className={styles.label}>Directed by</Paragraph>
              <Paragraph>{movie.directed}</Paragraph>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={12} lg={8}>
              <Paragraph className={styles.label}>Duration</Paragraph>
              <Paragraph>{movie.duration}</Paragraph>
            </Col>
            <Col xs={12} lg={16}>
              <Paragraph className={styles.label}>Casts</Paragraph>
              <Paragraph>{movie.cast}</Paragraph>
            </Col>
          </Row>
          <div className={styles.divider} />
          <Title level={4}>Synopsis</Title>
          <Paragraph>{movie.synopsis}</Paragraph>
        </Col>
      </Row>

      <div className={styles.showtimes}>
        <Title level={3} className={styles.showtimesTitle}>
          Showtimes and Tickets
        </Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={6}>
            <Select
              placeholder="Select date"
              className={styles.select}
              suffixIcon={<CalendarOutlined />}
              onChange={(value) => console.log('Selected date:', value)}
            >
              {dates.map((date) => (
                <Option key={date} value={date}>
                  {formatDate(date)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Select city"
              className={styles.select}
              suffixIcon={<EnvironmentOutlined />}
              onChange={(value) => console.log('Selected city:', value)}
            >
              {locations.map((location) => (
                <Option key={location} value={location}>
                  {location}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        {showtimes.length > 0 ? (
          <Row gutter={[16, 16]} className={styles.cinemaGrid}>
            {showtimes.map((item) => (
              <Col xs={24} md={12} lg={8} key={item.id}>
                <Card className={styles.cinemaCard}>
                  <Row gutter={[8, 8]} align="middle">
                    <Col xs={6}>
                      <img src={item.picture} alt={item.cinema} className={styles.cinemaImage} />
                    </Col>
                    <Col xs={18}>
                      <Title level={5}>{item.cinema}</Title>
                      <Paragraph className={styles.cinemaAddress}>{item.address}</Paragraph>
                    </Col>
                  </Row>
                  <div className={styles.divider} />
                  <Space wrap className={styles.timeButtons}>
                    {item.times.map((time) => (
                      <Button
                        key={time}
                        type={selectedTime === time ? 'primary' : 'default'}
                        onClick={() => setSelectedTime(time)}
                        className={styles.timeButton}
                      >
                        {time}
                      </Button>
                    ))}
                  </Space>
                  <Row justify="space-between" className={styles.priceRow}>
                    <Paragraph className={styles.priceLabel}>Price</Paragraph>
                    <Paragraph className={styles.price}>${item.price}/seat</Paragraph>
                  </Row>
                  <Row gutter={[8, 8]}>
                    <Col xs={12}>
                      <Link to="/seats">
                        <Button type="primary" block className={styles.bookButton}>
                          Book now
                        </Button>
                      </Link>
                    </Col>
                    <Col xs={12}>
                      <Button block className={styles.cartButton}>
                        Add to cart
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Paragraph className={styles.noData}>There is no data</Paragraph>
        )}
      </div>

      <div className={styles.viewMore}>
        <div className={styles.dividerLine}></div>
        <Link to="#" className={styles.viewMoreLink}>view more</Link>
        <div className={styles.dividerLine}></div>
      </div>
    </div>
  );
}

export default MovieDetails;