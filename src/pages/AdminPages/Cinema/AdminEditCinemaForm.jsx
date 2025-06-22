import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Typography, Spin, Select } from 'antd';
import { toast } from 'react-toastify';
import { useCinemaById, useUpdateCinema } from '../../../hooks/useCinemas';
import styles from './AdminEditCinemaForm.module.scss';
import { VietnamCities } from '../../../../public/assets/VietnamCities';

const { Title } = Typography;
const { Option } = Select;

const AdminEditCinemaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [originalData, setOriginalData] = useState({});

  // Sử dụng custom hooks với react-query
  const { 
    data: cinema, 
    isLoading: isLoadingCinema, 
    error: cinemaError 
  } = useCinemaById(id);

  const { mutate: updateCinema, isLoading: isUpdating } = useUpdateCinema();

  // Show error message if there's an error
  if (cinemaError) {
    toast.error(cinemaError.message || 'Failed to load cinema data', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressStyle: { background: '#5f2eea' },
    });
  }

  useEffect(() => {
    if (cinema) {
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
    }
  }, [cinema, form]);

  const onFinish = async (values) => {
    // Combine address and city
    const fullAddress = `${values.cinema_address}, ${values.cinema_city}`;
    const cinemaData = {};

    // Only include changed fields
    if (values.name !== originalData.name) cinemaData.name = values.name;
    if (fullAddress !== `${originalData.cinema_address}, ${originalData.cinema_city}`) {
      cinemaData.address = fullAddress;
    }

    if (Object.keys(cinemaData).length > 0) {
      updateCinema({ cinemaId: id, data: cinemaData }, {
        onSuccess: () => {
          toast.success('Cinema updated successfully', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progressStyle: { background: '#5f2eea' },
          });
          navigate('/admin/manage_cinema');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update cinema', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progressStyle: { background: '#5f2eea' },
          });
        },
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
      navigate('/admin/manage_cinema');
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
          {isLoadingCinema ? (
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
                      disabled={isUpdating}
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
                      disabled={isUpdating}
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
                      disabled={isUpdating}
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
                  loading={isUpdating}
                  className={styles.submitButton}
                  disabled={isUpdating}
                >
                  Update Cinema
                </Button>
                <Button
                  onClick={() => navigate('/admin/manage_cinema')}
                  style={{ marginLeft: 8 }}
                  disabled={isUpdating}
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