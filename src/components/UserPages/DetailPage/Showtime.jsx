import React from 'react';
import { Row, Col, Typography, Skeleton, Card } from 'antd';
import CinemaCard from './CinemaCard';
import styles from './Showtime.module.scss';
import { useUpcomingMovies } from '../../../hooks/useMovies';

const { Title, Paragraph } = Typography;

const getTitleColor = cinema => {
  switch (cinema) {
    case 'CGV Vincom':
      return '#ff4d4f';
    case 'CineOne21':
      return '#1890ff';
    case 'hiflix Cinema':
      return '#ff4d4f';
    default:
      return '#000';
  }
};

export default function Showtime({ showtimes, isLoading, error }) {
  const { data: upcomingMovies = [], isLoading: isUpcomingLoading, error: upcomingError } = useUpcomingMovies();

  if (isLoading) {
    return (
      <div className={styles.showtimes}>
        <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 0 }} />
        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
          {[...Array(3)].map((_, index) => (
            <Col key={index} xs={24} md={12} lg={8}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.showtimes} style={{ textAlign: 'center', padding: '30px', color: 'red' }}>
        Error: {error.message || 'Failed to load showtimes'}
      </div>
    );
  }

  if (showtimes.length === 0) {
    return (
      <div className={styles.showtimes} style={{ textAlign: 'center', padding: '30px' }}>
        <Paragraph>Chưa có suất chiếu cho phim này.</Paragraph>
        <Paragraph strong>Các suất chiếu sắp tới:</Paragraph>
        {isUpcomingLoading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : upcomingError ? (
          <Paragraph type="danger">Không thể tải các phim sắp chiếu.</Paragraph>
        ) : upcomingMovies.length === 0 ? (
          <Paragraph>Không có phim sắp chiếu.</Paragraph>
        ) : (
          <Row gutter={[16, 16]} justify="center">
            {upcomingMovies.slice(0, 4).map((movie) => (
              <Col xs={24} sm={12} md={8} lg={6} key={movie.movie_id}>
                <Card
                  hoverable
                  cover={<img alt={movie.title} src={movie.poster_url} style={{ height: 240, objectFit: 'cover' }} />}
                  style={{ marginBottom: 16 }}
                >
                  <Title level={5}>{movie.title}</Title>
                  <Paragraph>Khởi chiếu: {movie.release_date}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  }

  return (
    <div className={styles.showtimes}>
      <Title level={3} className={styles.showtimesTitle}>
        Showtimes and Tickets
      </Title>
      <Row gutter={[16, 16]} className={styles.cinemaGrid}>
        {showtimes.map(item => (
          <Col xs={24} md={12} lg={8} key={item.cinema_id}>
            <CinemaCard cinema={item.cinema} address={item.address} showtimes={item.showtimes} price={item.price} titleColor={getTitleColor(item.cinema)} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
