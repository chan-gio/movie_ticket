/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, message, Upload, Row, Col, Typography, InputNumber, Select, Image } from 'antd';
import { UploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import moment from 'moment';
import MovieService from '../../../services/MovieService';
import styles from './AdminAddMovieForm.module.scss';

const { Title } = Typography;
const { Option } = Select;

const AdminAddMovieForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onFinish = async (values) => {
    setUploading(true);
    try {
      const movieData = {
        title: values.title,
        description: values.description,
        duration: values.duration,
        release_date: values.release_date.format('YYYY-MM-DD'),
        director: values.director || null,
        cast: values.cast || null,
        genre: values.genre || null,
        rating: values.rating || null,
        adult: values.adult || null,
      };

      // Handle poster file upload
      const posterFile = fileList[0]?.originFileObj;
      await MovieService.createMovie(movieData, posterFile);

      toast.success('Movie added successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
      navigate('/admin/manage_movie');
    } catch (error) {
      message.error(error.message || 'Failed to add movie');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    // Limit to one file
    const updatedFileList = newFileList.slice(-1);
    setFileList(updatedFileList);

    // Generate preview URL for the selected image
    if (updatedFileList.length > 0) {
      const file = updatedFileList[0].originFileObj;
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    setFileList([]);
    setPreviewUrl(null);
    return true; // Allow removal
  };

  const uploadProps = {
    onChange: handleUploadChange,
    fileList,
    beforeUpload: (file) => {
      // Validate file type and size
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent automatic upload
    },
    showUploadList: false,
    disabled: fileList.length > 0,
  };

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Add New Movie
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
            initialValues={{
              release_date: null,
              rating: null,
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please enter the movie title' }]}
                >
                  <Input placeholder="Enter movie title" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Duration (minutes)"
                  name="duration"
                  rules={[{ required: true, message: 'Please enter the duration' }]}
                >
                  <InputNumber min={1} placeholder="Enter duration in minutes" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Release Date"
                  name="release_date"
                  rules={[{ required: true, message: 'Please select the release date' }]}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Adult Rating"
                  name="adult"
                >
                  <Select placeholder="Select adult rating" allowClear>
                    <Option value="T13">T13</Option>
                    <Option value="T16">T16</Option>
                    <Option value="T18">T18</Option>
                    <Option value="K">K</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: 'Please enter the description' }]}
                >
                  <Input.TextArea rows={4} placeholder="Enter movie description" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Director"
                  name="director"
                >
                  <Input placeholder="Enter director name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Cast"
                  name="cast"
                >
                  <Input placeholder="Enter cast names" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Genre"
                  name="genre"
                >
                  <Input placeholder="Enter genre" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Rating"
                  name="rating"
                >
                  <InputNumber min={0} max={10} step={0.1} placeholder="Enter rating (0-10)" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Poster Image"
                  name="poster"
                  rules={[{ required: true, message: 'Please upload a poster image' }]}
                >
                  <div>
                    <Upload {...uploadProps} accept="image/*">
                      <Button
                        icon={<UploadOutlined />}
                        disabled={fileList.length > 0}
                        className={styles.uploadButton}
                      >
                        Select Poster
                      </Button>
                    </Upload>
                    {previewUrl && (
                      <div className={styles.previewContainer}>
                        <Image
                          src={previewUrl}
                          alt="Poster Preview"
                          className={styles.previewImage}
                          preview
                        />
                        <CloseCircleOutlined
                          className={styles.removeIcon}
                          onClick={handleRemove}
                        />
                      </div>
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={uploading}
                className={styles.submitButton}
              >
                Add Movie
              </Button>
              <Button
                onClick={() => navigate('/admin/manage_movie')}
                style={{ marginLeft: 8 }}
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

export default AdminAddMovieForm;