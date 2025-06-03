import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Row, Col, Typography, Select } from "antd";
import { toastSuccess, toastError } from "../../../utils/toastNotifier";
import CinemaService from "../../../services/CinemaService";
import styles from "./AdminAddCinemaForm.module.scss";
import { VietnamCities } from "../../../../public/assets/VietnamCities";

const { Title } = Typography;
const { Option } = Select;

const AdminAddCinemaForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const cinemaData = {
        name: values.name,
        address: `${values.cinema_address}, ${values.cinema_city}`,
      };

      await CinemaService.createCinema(cinemaData);

      toastSuccess("Cinema added successfully");
      navigate("/admin/manage_cinema");
    } catch (error) {
      toastError(error.message || "Failed to add cinema");
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
            autoComplete="off"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter the cinema name" },
                  ]}
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
                  rules={[
                    {
                      required: true,
                      message: "Please enter the cinema address",
                    },
                  ]}
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
                  rules={[{ required: true, message: "Please select a city" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select a city"
                    optionFilterProp="children"
                    autoComplete="new-cinema-city"
                    data-form-type="cinema-city"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
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
                Add Cinema
              </Button>
              <Button
                onClick={() => navigate("/admin/manage_cinema")}
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
