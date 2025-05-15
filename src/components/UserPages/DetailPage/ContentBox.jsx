import { Card, Row, Col, Typography, Select, Button, Space } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import styles from "./ContentBox.module.scss";

const { Title, Paragraph } = Typography;

const ContentBox = ({ movie }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
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
    </>
  );
};

export default ContentBox;
