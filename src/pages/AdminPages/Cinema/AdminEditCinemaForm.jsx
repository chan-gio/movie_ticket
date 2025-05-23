import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Typography, Spin, Select } from 'antd';
import { toastSuccess, toastError, toastInfo } from  '../../../utils/toastNotifier';
import CinemaService from '../../../services/CinemaService';
import styles from './AdminEditCinemaForm.module.scss';
import { VietnamCities } from '../../../../public/assets/VietnamCities';

const { Title } = Typography;
const { Option } = Select;

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
        // Split address into address and city
        let address = cinema.address || '';
        let city = '';
        let cinemaAddress = address;

        const addressParts = address.split(',').map(part => part.trim());
        if (addressParts.length > 1) {
          const possibleCity = addressParts[addressParts.length - 1];
          if (VietnamCities.includes(possibleCity)) {
            city = possibleCity;
            cinemaAddress = addressParts.slice(0, -1).join(',').trim();
          }
        }

        const formData = {
          name: cinema.name,
          cinema_address: cinemaAddress,
          cinema_city: city || VietnamCities[0], 
        };

        form.setFieldsValue(formData);
        setOriginalData(formData);
      } catch (error) {
        toastError(error.message || 'Failed to load cinema data');
      } finally {
        setLoading(false);
      }
    };
    fetchCinema();
  }, [id, form]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // Combine address and city
      const fullAddress = `${values.cinema_address}, ${values.cinema_city}`;
      const cinemaData = {};

      // Only include changed fields
      if (values.name !== originalData.name) cinemaData.name = values.name;
      if (fullAddress !== `${originalData.cinema_address}, ${originalData.cinema_city}`) {
        cinemaData.address = fullAddress;
      }

      if (Object.keys(cinemaData).length > 0) {
        await CinemaService.updateCinema(id, cinemaData);
        toastSuccess('Cinema updated successfully');
      } else {
        toastInfo('No changes detected');
      }
      navigate('/admin/manage_cinema');
    } catch (error) {
      toastError(error.message || 'Failed to update cinema');
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
              autoComplete="off"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the cinema name' }]}
                  >
                    <Input
                      placeholder="Enter cinema name"
                      autoComplete="off"
                      data-form-type="cinema-name"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                  <Form.Item
                    label="Address"
                    name="cinema_address"
                    rules={[{ required: true, message: 'Please enter the cinema address' }]}
                  >
                    <Input
                      placeholder="Enter cinema address"
                      autoComplete="new-cinema-address"
                      data-form-type="cinema-address"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="City"
                    name="cinema_city"
                    rules={[{ required: true, message: 'Please select a city' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select a city"
                      optionFilterProp="children"
                      autoComplete="new-cinema-city"
                      data-form-type="cinema-city"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {VietnamCities.map((city) => (
                        <Option key={city} value={city}>
                          {city}
                        </Option>
                      ))}
                    </Select>
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