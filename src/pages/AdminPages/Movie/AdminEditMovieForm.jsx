/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, DatePicker, message, Upload, Row, Col, Typography, InputNumber, Select, Image, Spin } from 'antd';
import { UploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import moment from 'moment';
import MovieService from '../../../services/MovieService';
import styles from './AdminEditMovieForm.module.scss';

const { Title } = Typography;
const { Option } = Select;

const AdminEditMovieForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalPosterUrl, setOriginalPosterUrl] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movie = await MovieService.getMovieById(id);
        const formData = {
          title: movie.title,
          description: movie.description,
          duration: movie.duration,
          release_date: movie.release_date ? moment(movie.release_date) : null,
          director: movie.director,
          cast: movie.cast,
          genre: movie.genre,
          rating: movie.rating,
          adult: movie.adult,
        };
        form.setFieldsValue(formData);
        setOriginalData(formData);
        setPreviewUrl(movie.poster_url);
        setOriginalPosterUrl(movie.poster_url);
        setLoading(false);
      } catch (error) {
        message.error('Failed to load movie data');
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, form]);

  const onFinish = async (values) => {
    setUploading(true);
    try {
      const movieData = {};
      if (values.title !== originalData.title) movieData.title = values.title;
      if (values.description !== originalData.description) movieData.description = values.description;
      if (values.duration !== originalData.duration) movieData.duration = values.duration;
      if (values.release_date?.format('YYYY-MM-DD') !== originalData.release_date?.format('YYYY-MM-DD')) {
        movieData.release_date = values.release_date?.format('YYYY-MM-DD') || null;
      }
      if (values.director !== originalData.director) movieData.director = values.director || null;
      if (values.cast !== originalData.cast) movieData.cast = values.cast || null;
      if (values.genre !== originalData.genre) movieData.genre = values.genre || null;
      if (values.rating !== originalData.rating) movieData.rating = values.rating || null;
      if (values.adult !== originalData.adult) movieData.adult = values.adult || null;

      const posterFile = fileList[0]?.originFileObj;
      if (!posterFile && originalPosterUrl) {
        movieData.poster_url = originalPosterUrl;
      }

      if (Object.keys(movieData).length > 0 || posterFile) {
        await MovieService.updateMovie(id, movieData, posterFile);
        toast.success('Movie updated successfully', {
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
      navigate('/admin/manage_movie');
    } catch (error) {
      message.error(error.message || 'Failed to update movie');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.slice(-1);
    setFileList(updatedFileList);

    if (updatedFileList.length > 0) {
      const file = updatedFileList[0].originFileObj;
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(originalPosterUrl);
    }
  };

  const handleRemove = () => {
    setFileList([]);
    setPreviewUrl(originalPosterUrl);
    return true;
  };

  const uploadProps = {
    onChange: handleUploadChange,
    fileList,
    beforeUpload: (file) => {
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
      return false;
    },
    showUploadList: false,
    disabled: fileList.length > 0,
  };

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Edit Movie
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
                  Update Movie
                </Button>
                <Button
                  onClick={() => navigate('/admin/manage_movie')}
                  style={{ marginLeft: 8 }}
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

export default AdminEditMovieForm;