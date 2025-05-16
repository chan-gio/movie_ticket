import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import styles from './AdminManageGenreForm.module.scss';
import '../GlobalStyles.module.scss';

// Static Data (for edit mode simulation)
const initialGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Sci-Fi' },
];

const { Title } = Typography;

function AdminManageGenreForm({ isEditMode }) {
  const navigate = useNavigate();
  const [genreForm] = Form.useForm();
  const [genres, setGenres] = useState(initialGenres);
  const [editingGenre, setEditingGenre] = useState(null);

  // In a real app, you would fetch the genre data based on the ID for edit mode
  // For static data, we'll simulate this by finding the genre in the array
  const genreId = isEditMode ? parseInt(window.location.pathname.split('/').pop()) : null;
  const genreToEdit = isEditMode ? genres.find(genre => genre.id === genreId) : null;

  // Set initial form values for edit mode
  if (isEditMode && genreToEdit && !editingGenre) {
    setEditingGenre(genreToEdit);
    genreForm.setFieldsValue(genreToEdit);
  }

  const handleAddGenre = (values) => {
    const newGenre = { id: genres.length + 1, ...values };
    setGenres([...genres, newGenre]);
    genreForm.resetFields();
    navigate('/admin/manage_genre');
    message.success('Genre added successfully');
  };

  const handleEditGenre = (values) => {
    setGenres(genres.map(genre => (genre.id === editingGenre.id ? { ...genre, ...values } : genre)));
    setEditingGenre(null);
    genreForm.resetFields();
    navigate('/admin/manage_genre');
    message.success('Genre updated successfully');
  };

  return (
    <div>
      <Title level={3}>{isEditMode ? 'Edit Genre' : 'Add Genre'}</Title>
      <Card className={styles.card}>
        <Form
          form={genreForm}
          layout="vertical"
          onFinish={isEditMode ? handleEditGenre : handleAddGenre}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="Enter genre name" />
          </Form.Item>
          <Button type="primary" htmlType="submit">{isEditMode ? 'Update Genre' : 'Add Genre'}</Button>
          <Button onClick={() => navigate('/admin/manage_genre')} style={{ marginLeft: 8 }}>Cancel</Button>
        </Form>
      </Card>
    </div>
  );
}

export default AdminManageGenreForm;