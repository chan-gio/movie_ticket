import { Row, Col, Select, Card } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import styles from './PremiereLocation.module.scss';

const { Option } = Select;

function PremiereLocation({ cinemas }) {
  return (
    <div>
      <Card className={styles.card}>
        <Select
          placeholder="Select city"
          suffixIcon={<EnvironmentOutlined />}
          className={styles.select}
          defaultValue="Purwokerto"
        >
          <Option value="Purwokerto">Purwokerto</Option>
          <Option value="Jakarta">Jakarta</Option>
          <Option value="Bandung">Bandung</Option>
          <Option value="Surabaya">Surabaya</Option>
        </Select>
        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
          {cinemas.map((cinema) => (
            <Col xs={4} key={cinema.name}>
              <img src={cinema.logo} alt={cinema.name} className={styles.cinemaLogo} />
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
          {cinemas.map((cinema) => (
            <Col xs={4} key={cinema.name}>
              <img src={cinema.logo} alt={cinema.name} className={styles.cinemaLogo} />
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
          {cinemas.map((cinema) => (
            <Col xs={4} key={cinema.name}>
              <img src={cinema.logo} alt={cinema.name} className={styles.cinemaLogo} />
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}

export default PremiereLocation;