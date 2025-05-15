import { Row, Col, Form, Input, DatePicker, Card } from 'antd';
import moment from 'moment';
import styles from './MovieDescription.module.scss';

function MovieDescription({ movieData, form }) {
  return (
    <div>
      <Card className={styles.card}>
        <Row gutter={[16, 16]}>
          <Col md={8}>
            <Card className={styles.posterCard}>
              <img src={movieData.poster} alt="Movie Poster" className={styles.posterImage} />
            </Card>
          </Col>
          <Col md={16}>
            <Form form={form} layout="vertical">
              <Form.Item label="Movie Name" name="name">
                <Input placeholder="Spider-Man: Homecoming" defaultValue={movieData.name} />
              </Form.Item>
              <Form.Item label="Category" name="category">
                <Input placeholder="Action, Adventure, Sci-Fi" defaultValue={movieData.category} />
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <Form.Item label="Release date" name="releaseDate">
                    <DatePicker placeholder="Select date" defaultValue={moment(movieData.releaseDate, 'YYYY-MM-DD')} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item label="Duration (hour / minute)" name="duration">
                    <Row gutter={[8, 8]}>
                      <Col xs={6}>
                        <Input type="number" placeholder="2" defaultValue={movieData.durationHours} />
                      </Col>
                      <Col xs={6}>
                        <Input type="number" placeholder="13" defaultValue={movieData.durationMinutes} />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <Form.Item label="Director" name="director">
                    <Input placeholder="Jon Watts" defaultValue={movieData.director} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item label="Casts" name="casts">
                    <Input placeholder="Tom Holland, Michael Keaton, Robert Dow.." defaultValue={movieData.casts} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Synopsis" name="synopsis">
                <Input.TextArea placeholder="Thrilled by his experience with the Avengers..." defaultValue={movieData.synopsis} rows={4} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default MovieDescription;