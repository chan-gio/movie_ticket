import { Row, Col, DatePicker, Button, Card, Typography } from 'antd';
import { CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './PremiereShowtime.module.scss';

const { Text } = Typography;

function PremiereShowtime({ showtimes }) {
  return (
    <div>
      <Card className={styles.card}>
        <DatePicker
          placeholder="Select date"
          suffixIcon={<CalendarOutlined />}
          className={styles.datePicker}
          defaultValue={moment('2025-05-15', 'YYYY-MM-DD')}
        />
        <Row gutter={[8, 8]} className={styles.showtimeGrid}>
          <Col xs={3}>
            <Button icon={<PlusOutlined />} className={styles.addButton} />
          </Col>
          {showtimes.map((time, index) => (
            <Col xs={3} key={index}>
              <Text>{time}</Text>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}

export default PremiereShowtime;