import React from 'react';
import { Card, Row, Col, Typography, Skeleton } from 'antd';
import styles from './ContentBox.module.scss';

const { Title, Paragraph } = Typography;

const ContentBox = ({ movie, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ margin: '40px 0px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className={styles.posterCard}>
              <Skeleton.Image active style={{ width: '100%', height: 400 }} />
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
            <Skeleton active paragraph={{ rows: 0 }} title={{ width: '40%' }} />
            <Row gutter={[16, 16]}>
              <Col xs={12} lg={8}>
                <Skeleton active paragraph={{ rows: 1 }} title={{ width: '50%' }} />
              </Col>
              <Col xs={12} lg={16}>
                <Skeleton active paragraph={{ rows: 1 }} title={{ width: '50%' }} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={12} lg={8}>
                <Skeleton active paragraph={{ rows: 1 }} title={{ width: '50%' }} />
              </Col>
              <Col xs={12} lg={16}>
                <Skeleton active paragraph={{ rows: 1 }} title={{ width: '50%' }} />
              </Col>
            </Row>
            <div className={styles.divider} />
            <Skeleton active paragraph={{ rows: 3 }} title={{ width: '30%' }} />
          </Col>
        </Row>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        No movie data available
      </div>
    );
  }

  return (
    <div style={{ margin: '40px 0px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className={styles.posterCard}>
            <img
              src={movie.picture}
              alt={movie.title}
              className={styles.posterImage}
            />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Title level={2}>{movie.title}</Title>
          <Paragraph className={styles.genre}>{movie.genre}</Paragraph>
          <Row gutter={[16, 16]}>
            <Col xs={12} lg={8}>
              <Paragraph className={styles.label}>Release date</Paragraph>
              <Paragraph>{movie.releaseDate}</Paragraph>
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
    </div>
  );
};

export default ContentBox;