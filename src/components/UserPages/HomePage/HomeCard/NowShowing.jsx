import React from 'react';
import { Row, Col, Typography, Button, Carousel, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { FrownOutlined } from '@ant-design/icons';
import styles from './HomeCard.module.scss';
import MovieCard from '../MovieCard/MovieCard';
import { useNowShowingMovies } from '../../../../hooks/useMovies';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const { Title } = Typography;

const NowShowing = () => {
  const { data: nowShowingMovies = [], isLoading, error } = useNowShowingMovies();

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Error: {error.message}</div>;
  }

  return (
    <div>
      {isLoading ? (
        <div style={{ width: 1160, margin: '0 auto' }}>
          <Row justify="space-between" align="middle">
            <Col><Skeleton.Input active size="large" style={{ width: 200 }} /></Col>
            <Col><Skeleton.Button active size="default" /></Col>
          </Row>
          <div className={styles.Container}>
            <Row gutter={[16, 16]}>
              {[...Array(5)].map((_, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      ) : (
        <>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} className={styles.sectionTitle}>Now Showing</Title>
            </Col>
            <Col>
              <Link to="/movies" state={{ type: 'now-showing' }}>
                <Button type="default" className={styles.viewAllButton}>View All</Button>
              </Link>
            </Col>
          </Row>
          <div className={styles.Container}>
            {nowShowingMovies.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', textAlign: 'center', color: '#888' }}>
                <FrownOutlined style={{ fontSize: '48px', color: '#888', marginBottom: '16px' }} />
                <Typography.Text style={{ fontSize: '18px', color: '#888' }}>No movies currently showing</Typography.Text>
              </div>
            ) : (
              <Carousel
                arrows
                slidesToShow={Math.min(nowShowingMovies.length, 5)}
                slidesToScroll={1}
                draggable
                dots
                className={styles.movieCarousel}
                responsive={[
                  { breakpoint: 991, settings: { slidesToShow: Math.min(nowShowingMovies.length, 4), arrows: true } },
                  { breakpoint: 767, settings: { slidesToShow: Math.min(nowShowingMovies.length, 3), arrows: true } },
                  { breakpoint: 575, settings: { slidesToShow: Math.min(nowShowingMovies.length, 1), arrows: true } },
                ]}
              >
                {nowShowingMovies.map((movie) => (
                  <div key={movie.id} className={styles.carouselItem}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NowShowing;