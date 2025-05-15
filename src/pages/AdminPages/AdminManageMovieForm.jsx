import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, DatePicker, Button, message, Typography } from 'antd';
import styles from './AdminManageMovieForm.module.scss';
import './GlobalStyles.module.scss';

// Static Data (for edit mode simulation)
const initialMovies = [
  { id: 1, title: 'Spider-Man: Homecoming', category: 'Action, Adventure', releaseDate: '2025-05-15' },
  { id: 2, title: 'Avengers: End Game', category: 'Action, Sci-Fi', releaseDate: '2025-04-20' },
];

const { Title } = Typography;

function AdminManageMovieForm({ isEditMode }) {
  const navigate = useNavigate();
  const [movieForm] = Form.useForm();
  const [movies, setMovies] = useState(initialMovies);
  const [editingMovie, setEditingMovie] = useState(null);

  // In a real app, you would fetch the movie data based on the ID for edit mode
  // For static data, we'll simulate this by finding the movie in the array
  const movieId = isEditMode ? parseInt(window.location.pathname.split('/').pop()) : null;
  const movieToEdit = isEditMode ? movies.find(movie => movie.id === movieId) : null;

  // Set initial form values for edit mode
  if (isEditMode && movieToEdit && !editingMovie) {
    setEditingMovie(movieToEdit);
    movieForm.setFieldsValue(movieToEdit);
  }

  const handleAddMovie = (values) => {
    const newMovie = { id: movies.length + 1, ...values };
    setMovies([...movies, newMovie]);
    movieForm.resetFields();
    navigate('/admin/manage_movie');
    message.success('Movie added successfully');
  };

  const handleEditMovie = (values) => {
    setMovies(movies.map(movie => (movie.id === editingMovie.id ? { ...movie, ...values } : movie)));
    setEditingMovie(null);
    movieForm.resetFields();
    navigate('/admin/manage_movie');
    message.success('Movie updated successfully');
  };

  return (
    <div>
      <Title level={3}>{isEditMode ? 'Edit Movie' : 'Add Movie'}</Title>
      <Card className={styles.card}>
        <Form
          form={movieForm}
          layout="vertical"
          onFinish={isEditMode ? handleEditMovie : handleAddMovie}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="Enter movie title" />
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="Enter category" />
          </Form.Item>
          <Form.Item label="Release Date" name="releaseDate" rules={[{ required: true, message: 'Required' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Button type="primary" htmlType="submit">{isEditMode ? 'Update Movie' : 'Add Movie'}</Button>
          <Button onClick={() => navigate('/admin/manage_movie')} style={{ marginLeft: 8 }}>Cancel</Button>
        </Form>
      </Card>
    </div>
  );
}

export default AdminManageMovieForm;