import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  message, 
  Upload, 
  Row, 
  Col, 
  Typography, 
  InputNumber, 
  Select, 
  Image, 
  Spin,
  Card 
} from 'antd';
import { UploadOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useAdminMovieById, useCreateMovie, useUpdateMovie } from '../../../hooks/useMovies';
import styles from './AdminMovieForm.module.scss';

const { Title } = Typography;
const { Option } = Select;

const AdminMovieForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalPosterUrl, setOriginalPosterUrl] = useState(null);
  const [originalData, setOriginalData] = useState({});

  const isEditMode = !!id;

  // Sử dụng custom hooks với react-query
  const { 
    data: movie, 
    isLoading: isLoadingMovie, 
    error: movieError 
  } = useAdminMovieById(isEditMode ? id : null);

  const { mutate: createMovie, isLoading: isCreating } = useCreateMovie();
  const { mutate: updateMovie, isLoading: isUpdating } = useUpdateMovie();

  // Set form data when movie is loaded (edit mode)
  useEffect(() => {
    if (isEditMode && movie) {
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
    } else if (!isEditMode) {
      // Reset form for add mode
      form.resetFields();
      setFileList([]);
      setPreviewUrl(null);
      setOriginalPosterUrl(null);
      setOriginalData({});
    }
  }, [movie, isEditMode, form]);

  // Show error message if there's an error
  if (movieError) {
    message.error(movieError.message || 'Failed to load movie data');
  }

  const onFinish = async (values) => {
    if (isEditMode) {
      // Edit mode - only update changed fields
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
        updateMovie({ movieId: id, movieData, posterFile }, {
          onSuccess: () => {
            toast.success('Movie updated successfully', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progressStyle: { background: '#5f2eea' },
            });
            navigate('/admin/manage_movie');
          },
          onError: (error) => {
            message.error(error.message || 'Failed to update movie');
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
        navigate('/admin/manage_movie');
      }
    } else {
      // Add mode
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

      const posterFile = fileList[0]?.originFileObj;
      createMovie({ movieData, posterFile }, {
        onSuccess: () => {
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
        },
        onError: (error) => {
          message.error(error.message || 'Failed to add movie');
        },
      });
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
      setPreviewUrl(isEditMode ? originalPosterUrl : null);
    }
  };

  const handleRemove = () => {
    setFileList([]);
    setPreviewUrl(isEditMode ? originalPosterUrl : null);
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

  const isLoading = isLoadingMovie;
  const isSubmitting = isCreating || isUpdating;

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            {isEditMode ? 'Edit Movie' : 'Add New Movie'}
          </Title>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={16}>
          <Card title="Movie Information" className={styles.formCard}>
            {isLoading ? (
              <div className={styles.loading}>
                <Spin size="large" />
                <p>Loading movie data...</p>
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
                      <Input placeholder="Enter movie title" disabled={isSubmitting} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Duration (minutes)"
                      name="duration"
                      rules={[{ required: true, message: 'Please enter the duration' }]}
                    >
                      <InputNumber 
                        min={1} 
                        placeholder="Enter duration in minutes" 
                        style={{ width: '100%' }} 
                        disabled={isSubmitting}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Release Date"
                      name="release_date"
                      rules={[{ required: true, message: 'Please select the release date' }]}
                    >
                      <DatePicker 
                        format="YYYY-MM-DD" 
                        style={{ width: '100%' }} 
                        disabled={isSubmitting}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Adult Rating"
                      name="adult"
                    >
                      <Select 
                        placeholder="Select adult rating" 
                        allowClear 
                        disabled={isSubmitting}
                      >
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
                      <Input.TextArea 
                        rows={4} 
                        placeholder="Enter movie description" 
                        disabled={isSubmitting}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Director"
                      name="director"
                    >
                      <Input placeholder="Enter director name" disabled={isSubmitting} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Cast"
                      name="cast"
                    >
                      <Input placeholder="Enter cast names" disabled={isSubmitting} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Genre"
                      name="genre"
                    >
                      <Input placeholder="Enter genre" disabled={isSubmitting} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Rating"
                      name="rating"
                    >
                      <InputNumber 
                        min={0} 
                        max={10} 
                        step={0.1} 
                        placeholder="Enter rating (0-10)" 
                        style={{ width: '100%' }} 
                        disabled={isSubmitting}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Submit Button */}
                <Form.Item className={styles.submitButton}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    size="large"
                  >
                    {isEditMode ? 'Update Movie' : 'Add Movie'}
                  </Button>
                  <Button
                    onClick={() => navigate('/admin/manage_movie')}
                    style={{ marginLeft: 10 }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>

        {/* Poster Upload Section */}
        <Col xs={24} lg={8}>
          <Card title="Movie Poster" className={styles.posterCard}>
            <div className={styles.posterSection}>
              {previewUrl ? (
                <div className={styles.previewContainer}>
                  <Image
                    src={previewUrl}
                    alt="Movie poster preview"
                    className={styles.previewImage}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                  />
                  <Button
                    type="text"
                    icon={<CloseCircleOutlined />}
                    onClick={handleRemove}
                    className={styles.removeButton}
                    disabled={isSubmitting}
                  />
                </div>
              ) : (
                <div className={styles.uploadArea}>
                  <Upload {...uploadProps}>
                    <Button 
                      icon={<UploadOutlined />} 
                      disabled={isSubmitting}
                      className={styles.uploadButton}
                    >
                      Upload Poster
                    </Button>
                  </Upload>
                  <p className={styles.uploadHint}>
                    Click to upload movie poster (JPG, PNG, max 5MB)
                  </p>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminMovieForm; 