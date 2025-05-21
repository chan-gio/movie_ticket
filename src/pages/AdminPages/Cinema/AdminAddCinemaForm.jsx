import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Typography } from 'antd';
import { toast } from 'react-toastify';
import CinemaService from '../../../services/CinemaService';
import styles from './AdminAddCinemaForm.module.scss';

const { Title } = Typography;

const AdminAddCinemaForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const cinemaData = {
        name: values.name,
        address: values.address,
      };

      await CinemaService.createCinema(cinemaData);

      toast.success('Cinema added successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
      navigate('/admin/manage_cinema');
    } catch (error) {
      toast.error(error.message || 'Failed to add cinema', {
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
            Add New Cinema
          </Title>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24}>
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
                Add Cinema
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
        </Col>
      </Row>
    </div>
  );
};

export default AdminAddCinemaForm;