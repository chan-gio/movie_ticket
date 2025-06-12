import React from 'react';
import { Row, Col, Typography, Skeleton } from 'antd';
import CinemaCard from './CinemaCard';
import styles from './Showtime.module.scss';
import { toastInfo } from '../../../utils/toastNotifier';

const { Title } = Typography;

const getTitleColor = (cinema) => {
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

export default function Showtime({ showtimes, isLoading }) {
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

  if (showtimes.length === 0) {
    toastInfo('No showtimes available for this movie.');
    return null;
  }

  return (
    <div className={styles.showtimes}>
      <Title level={3} className={styles.showtimesTitle}>
        Showtimes and Tickets
      </Title>
      <Row gutter={[16, 16]} className={styles.cinemaGrid}>
        {showtimes.map((item) => (
          <Col xs={24} md={12} lg={8} key={item.cinema_id}>
            <CinemaCard
              cinema={item.cinema}
              address={item.address}
              showtimes={item.showtimes}
              price={item.price}
              titleColor={getTitleColor(item.cinema)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}