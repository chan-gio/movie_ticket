import { Row, Col, Typography, Form } from 'antd';
import MovieDescription from '../../components/Admin/MovieDescription';
import PremiereLocation from '../../components/Admin/PremiereLocation';
import PremiereShowtime from '../../components/Admin/PremiereShowtime';
import SalesCharts from '../../components/Admin/SalesCharts';
import styles from './AdminDashboard.module.scss';
import './GlobalStyles.module.scss';

// Static Data
const movieData = {
  poster: 'https://picfiles.alphacoders.com/148/148651.jpg',
  name: 'Spider-Man: Homecoming',
  category: 'Action, Adventure, Sci-Fi',
  releaseDate: '2025-05-15',
  durationHours: 2,
  durationMinutes: 13,
  director: 'Jon Watts',
  casts: 'Tom Holland, Michael Keaton, Robert Dow..',
  synopsis: 'Thrilled by his experience with the Avengers, Peter returns home, where he lives with his Aunt May, under the watchful eye of his new mentor Tony Stark. Peter tries to fall back into his normal daily routine—distracted by thoughts of proving himself to be more than just your friendly neighborhood Spider-Man—but when the Vulture emerges as a new villain, everything that Peter holds most important will be threatened.',
};

const cinemas = [
  { name: 'ebv', logo: 'https://via.placeholder.com/50x32?text=ebv' },
  { name: 'hiflix', logo: 'https://via.placeholder.com/50x28?text=hiflix' },
  { name: 'cineone', logo: 'https://via.placeholder.com/50x16?text=cineone' },
];

const showtimes = ['08:30am', '10:30pm', '12:00pm', '04:30pm', '07:00pm', '08:30pm', '08:30pm'];

const salesData = [
  { movie: 'Avengers: End Game', period: 'Weekly' },
  { movie: 'Avengers: End Game', period: 'Weekly' },
  { movie: 'Avengers: End Game', period: 'Weekly' },
];

const { Title } = Typography;

function AdminDashboard() {
  const [form] = Form.useForm();

  return (
    <div>
      {/* Movie Description and Premiere Location */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Title level={3}>Movie Description</Title>
          <MovieDescription movieData={movieData} form={form} />
        </Col>
        <Col xs={24} lg={8}>
          <Title level={3}>Premiere Location</Title>
          <PremiereLocation cinemas={cinemas} />
          <Title level={3} className={styles.showtimeTitle}>Premiere Showtime</Title>
          <PremiereShowtime showtimes={showtimes} />
        </Col>
      </Row>

      {/* Sales Charts */}
      <Title level={3}>Sales Charts</Title>
      <SalesCharts salesData={salesData} />
    </div>
  );
}

export default AdminDashboard;