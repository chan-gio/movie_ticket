import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Form, Input, Button, message, Typography } from 'antd';
import styles from './AdminManageCinemaForm.module.scss';
import '../GlobalStyles.module.scss';

const { Title, Text } = Typography;

// Mock API call to fetch a single cinema
const fetchCinemaById = async (id) => {
  const cinemas = [
    { cinema_id: 'c1', name: 'Cinema 1', address: '123 Main St, City 1' },
    { cinema_id: 'c2', name: 'Cinema 2', address: '456 Oak St, City 2' },
  ];
  return cinemas.find(cinema => cinema.cinema_id === id);
};

// Mock API call to fetch all cinemas
const fetchCinemas = async () => {
  return [
    { cinema_id: 'c1', name: 'Cinema 1', address: '123 Main St, City 1' },
    { cinema_id: 'c2', name: 'Cinema 2', address: '456 Oak St, City 2' },
  ];
};

function AdminManageCinemaForm({ isEditMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cinemaForm] = Form.useForm();
  const [cinemas, setCinemas] = useState([]);
  const [editingCinema, setEditingCinema] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedCinemas = await fetchCinemas();
      setCinemas(fetchedCinemas);
      if (isEditMode) {
        const cinema = await fetchCinemaById(id);
        if (cinema) {
          setEditingCinema(cinema);
          cinemaForm.setFieldsValue(cinema);
        }
      }
    };
    loadData();
  }, [id, isEditMode, cinemaForm]);

  const handleAddCinema = (values) => {
    const newCinema = { cinema_id: `c${cinemas.length + 1}`, ...values };
    setCinemas([...cinemas, newCinema]);
    cinemaForm.resetFields();
    navigate('/admin/manage_cinema');
    message.success('Cinema added successfully');
  };

  const handleEditCinema = (values) => {
    setCinemas(cinemas.map(cinema => (cinema.cinema_id === editingCinema.cinema_id ? { ...cinema, ...values } : cinema)));
    setEditingCinema(null);
    cinemaForm.resetFields();
    navigate('/admin/manage_cinema');
    message.success('Cinema updated successfully');
  };

  return (
    <div>
      <Title level={3}>{isEditMode ? 'Edit Cinema' : 'Add Cinema'}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className={styles.card}>
            <Form
              form={cinemaForm}
              layout="vertical"
              onFinish={isEditMode ? handleEditCinema : handleAddCinema}
            >
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Enter cinema name" />
              </Form.Item>
              <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Required' }]}>
                <Input.TextArea placeholder="Enter cinema address" rows={4} />
              </Form.Item>
              <Button type="primary" htmlType="submit">{isEditMode ? 'Update Cinema' : 'Add Cinema'}</Button>
              <Button onClick={() => navigate('/admin/manage_cinema')} style={{ marginLeft: 8 }}>Cancel</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.card}>
            <Title level={4}>Cinema Preview</Title>
            <Text><strong>Name:</strong> {cinemaForm.getFieldValue('name') || 'Not Set'}</Text><br />
            <Text><strong>Address:</strong> {cinemaForm.getFieldValue('address') || 'Not Set'}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageCinemaForm;