import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Form, Input, DatePicker, Button, message, Typography } from 'antd';
import styles from './AdminManageMovieForm.module.scss';
import '../GlobalStyles.module.scss';

// Mock API call to fetch a single movie
const fetchMovieById = async (id) => {
  // Simulate fetching data from the movie table
  const movies = [
    { movie_id: 'm1', title: 'Spider-Man: Homecoming', description: 'A young Peter Parker begins to navigate his newfound identity as the web-slinging superhero Spider-Man.', duration: 133, release_date: '2025-05-15', poster_url: 'https://picfiles.alphacoders.com/148/148651.jpg' },
    { movie_id: 'm2', title: 'Avengers: End Game', description: 'The Avengers assemble to reverse Thanos’ actions and restore balance to the universe.', duration: 181, release_date: '2025-04-20', poster_url: 'https://via.placeholder.com/150?text=Avengers' },
  ];
  return movies.find(movie => movie.movie_id === id);
};

// Mock API call to fetch all movies
const fetchMovies = async () => {
  return [
    { movie_id: 'm1', title: 'Spider-Man: Homecoming', description: 'A young Peter Parker begins to navigate his newfound identity as the web-slinging superhero Spider-Man.', duration: 133, release_date: '2025-05-15', poster_url: 'https://picfiles.alphacoders.com/148/148651.jpg' },
    { movie_id: 'm2', title: 'Avengers: End Game', description: 'The Avengers assemble to reverse Thanos’ actions and restore balance to the universe.', duration: 181, release_date: '2025-04-20', poster_url: 'https://via.placeholder.com/150?text=Avengers' },
  ];
};

const { Title, Text } = Typography;

function AdminManageMovieForm({ isEditMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movieForm] = Form.useForm();
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedMovies = await fetchMovies();
      setMovies(fetchedMovies);
      if (isEditMode) {
        const movie = await fetchMovieById(id);
        if (movie) {
          setEditingMovie(movie);
          movieForm.setFieldsValue({
            ...movie,
            release_date: movie.release_date ? moment(movie.release_date, 'YYYY-MM-DD') : null,
          });
        }
      }
    };
    loadData();
  }, [id, isEditMode, movieForm]);

  const handleAddMovie = (values) => {
    const newMovie = { movie_id: `m${movies.length + 1}`, ...values, release_date: values.release_date.format('YYYY-MM-DD') };
    setMovies([...movies, newMovie]);
    movieForm.resetFields();
    navigate('/admin/manage_movie');
    message.success('Movie added successfully');
  };

  const handleEditMovie = (values) => {
    setMovies(movies.map(movie => (movie.movie_id === editingMovie.movie_id ? { ...movie, ...values, release_date: values.release_date.format('YYYY-MM-DD') } : movie)));
    setEditingMovie(null);
    movieForm.resetFields();
    navigate('/admin/manage_movie');
    message.success('Movie updated successfully');
  };

  return (
    <div>
      <Title level={3}>{isEditMode ? 'Edit Movie' : 'Add Movie'}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Form
              form={movieForm}
              layout="vertical"
              onFinish={isEditMode ? handleEditMovie : handleAddMovie}
            >
              <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Enter movie title" />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Required' }]}>
                <Input.TextArea placeholder="Enter movie description" rows={4} />
              </Form.Item>
              <Form.Item label="Duration (minutes)" name="duration" rules={[{ required: true, message: 'Required' }, { type: 'number', min: 1, message: 'Must be a positive number' }]}>
                <Input type="number" placeholder="Enter duration in minutes" />
              </Form.Item>
              <Form.Item label="Release Date" name="release_date" rules={[{ required: true, message: 'Required' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Poster URL" name="poster_url" rules={[{ required: true, message: 'Required' }, { type: 'url', message: 'Must be a valid URL' }]}>
                <Input placeholder="Enter poster URL" />
              </Form.Item>
              <Button type="primary" htmlType="submit">{isEditMode ? 'Update Movie' : 'Add Movie'}</Button>
              <Button onClick={() => navigate('/admin/manage_movie')} style={{ marginLeft: 8 }}>Cancel</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <Title level={4}>Movie Preview</Title>
            <Text><strong>Title:</strong> {movieForm.getFieldValue('title') || 'Not Set'}</Text><br />
            <Text><strong>Description:</strong> {movieForm.getFieldValue('description')?.slice(0, 50) || 'Not Set'}...</Text><br />
            <Text><strong>Duration:</strong> {movieForm.getFieldValue('duration') || 'Not Set'} minutes</Text><br />
            <Text><strong>Release Date:</strong> {movieForm.getFieldValue('release_date')?.format('YYYY-MM-DD') || 'Not Set'}</Text><br />
            {movieForm.getFieldValue('poster_url') && (
              <img src={movieForm.getFieldValue('poster_url')} alt="Poster Preview" style={{ width: '100%', marginTop: 16 }} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageMovieForm;