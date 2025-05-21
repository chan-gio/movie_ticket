import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Typography, Spin } from 'antd';
import { toast } from 'react-toastify';
import CinemaService from '../../../services/CinemaService';
import styles from './AdminEditCinemaForm.module.scss';

const { Title } = Typography;

const AdminEditCinemaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCinema = async () => {
      setLoading(true);
      try {
        const cinema = await CinemaService.getCinemaById(id);
        const formData = {
          name: cinema.name,
          address: cinema.address,
        };
        form.setFieldsValue(formData);
        setOriginalData(formData);
      } catch (error) {
        toast.error(error.message || 'Failed to load cinema data', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCinema();
  }, [id, form]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // Only include changed fields
      const cinemaData = {};
      if (values.name !== originalData.name) cinemaData.name = values.name;
      if (values.address !== originalData.address) cinemaData.address = values.address;

      if (Object.keys(cinemaData).length > 0) {
        await CinemaService.updateCinema(id, cinemaData);
        toast.success('Cinema updated successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' },
        });
      } else {
        toast.info('No changes detected', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: '#5f2eea' },
        });
      }
      navigate('/admin/manage_cinema');
    } catch (error) {
      toast.error(error.message || 'Failed to update cinema', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Edit Cinema
          </Title>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24}>
          {loading ? (
            <div className={styles.loading}>
              <Spin size="large" />
            </div>
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className={styles.form}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the cinema name' }]}
                  >
                    <Input placeholder="Enter cinema name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please enter the cinema address' }]}
                  >
                    <Input placeholder="Enter cinema address" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  className={styles.submitButton}
                  disabled={submitting}
                >
                  Update Cinema
                </Button>
                <Button
                  onClick={() => navigate('/admin/manage_cinema')}
                  style={{ marginLeft: 8 }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AdminEditCinemaForm;