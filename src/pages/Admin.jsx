import { useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout, Menu, Card, Row, Col, Form, Input, Select, DatePicker, Button, Tabs, Radio, Typography, Table, Space, Popconfirm, message, Avatar } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, PlusOutlined, LogoutOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './Admin.module.scss';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

// Static Data
const movieData = {
  poster: 'https://picfiles.alphacoders.com/148/148651.jpg',
  name: 'Spider-Man: Homecoming',
  category: 'Action, Adventure, Sci-Fi',
  releaseDate: '2025-05-15',
  durationHours: 2,
  durationMinutes: 13,
  director: 'Jon Watts',
  casts: 'Tom Holland, Michael Keaton, Robert Dow..',
  synopsis: 'Thrilled by his experience with the Avengers, Peter returns home, where he lives with his Aunt May, under the watchful eye of his new mentor Tony Stark. Peter tries to fall back into his normal daily routine—distracted by thoughts of proving himself to be more than just your friendly neighborhood Spider-Man—but when the Vulture emerges as a new villain, everything that Peter holds most important will be threatened.',
};

const cinemas = [
  { name: 'ebv', logo: 'https://via.placeholder.com/50x32?text=ebv' },
  { name: 'hiflix', logo: 'https://via.placeholder.com/50x28?text=hiflix' },
  { name: 'cineone', logo: 'https://via.placeholder.com/50x16?text=cineone' },
];

const showtimes = ['08:30am', '10:30pm', '12:00pm', '04:30pm', '07:00pm', '08:30pm', '08:30pm'];

const salesData = [
  { movie: 'Avengers: End Game', period: 'Weekly' },
  { movie: 'Avengers: End Game', period: 'Weekly' },
  { movie: 'Avengers: End Game', period: 'Weekly' },
];

const adminProfile = {
  name: 'Admin User',
  email: 'admin@tickitz.com',
  role: 'Administrator',
};

const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@tickitz.com', role: 'User' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@tickitz.com', role: 'User' },
];

const initialMovies = [
  { id: 1, title: 'Spider-Man: Homecoming', category: 'Action, Adventure', releaseDate: '2025-05-15' },
  { id: 2, title: 'Avengers: End Game', category: 'Action, Sci-Fi', releaseDate: '2025-04-20' },
];

const initialGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Sci-Fi' },
];

function Admin() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [userForm] = Form.useForm();
  const [movieForm] = Form.useForm();
  const [genreForm] = Form.useForm();

  // State for Users, Movies, Genres
  const [users, setUsers] = useState(initialUsers);
  const [movies, setMovies] = useState(initialMovies);
  const [genres, setGenres] = useState(initialGenres);
  const [editingUser, setEditingUser] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editingGenre, setEditingGenre] = useState(null);

  const handleLogout = () => {
    // Mock logout logic
    navigate('/auth');
  };

  // User Management
  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingUser(record);
            userForm.setFieldsValue(record);
          }} />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => {
              setUsers(users.filter(user => user.id !== record.id));
              message.success('User deleted successfully');
            }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddUser = (values) => {
    const newUser = { id: users.length + 1, ...values };
    setUsers([...users, newUser]);
    userForm.resetFields();
    message.success('User added successfully');
  };

  const handleEditUser = (values) => {
    setUsers(users.map(user => (user.id === editingUser.id ? { ...user, ...values } : user)));
    setEditingUser(null);
    userForm.resetFields();
    message.success('User updated successfully');
  };

  // Movie Management
  const movieColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Release Date', dataIndex: 'releaseDate', key: 'releaseDate' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingMovie(record);
            movieForm.setFieldsValue(record);
            navigate(`/admin/manage_movie/edit/${record.id}`);
          }} />
          <Popconfirm
            title="Are you sure to delete this movie?"
            onConfirm={() => {
              setMovies(movies.filter(movie => movie.id !== record.id));
              message.success('Movie deleted successfully');
            }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddMovie = (values) => {
    const newMovie = { id: movies.length + 1, ...values };
    setMovies([...movies, newMovie]);
    movieForm.resetFields();
    navigate('/admin/manage_movie');
    message.success('Movie added successfully');
  };

  const handleEditMovie = (values) => {
    setMovies(movies.map(movie => (movie.id === editingMovie.id ? { ...movie, ...values } : movie)));
    setEditingMovie(null);
    movieForm.resetFields();
    navigate('/admin/manage_movie');
    message.success('Movie updated successfully');
  };

  // Genre Management
  const genreColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingGenre(record);
            genreForm.setFieldsValue(record);
            navigate(`/admin/manage_genre/edit/${record.id}`);
          }} />
          <Popconfirm
            title="Are you sure to delete this genre?"
            onConfirm={() => {
              setGenres(genres.filter(genre => genre.id !== record.id));
              message.success('Genre deleted successfully');
            }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
    <Layout className={styles.adminLayout}>
      {/* Custom Admin Navbar */}
      <div className={styles.adminNavbar}>
        <div className={styles.navbarContainer}>
          <Link to="/admin" className={styles.navbarBrand}>
            Admin Panel
          </Link>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Logout
          </Button>
        </div>
      </div>

      <Layout>
        {/* Sidebar */}
        <Sider width={200} className={styles.sider}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            className={styles.menu}
          >
            <Menu.Item key="dashboard">
              <Link to="/admin">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="profile">
              <Link to="/admin/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="settings">
              <Link to="/admin/settings">Settings</Link>
            </Menu.Item>
            <Menu.Item key="manage_user">
              <Link to="/admin/manage_user">Manage User</Link>
            </Menu.Item>
            <Menu.Item key="manage_movie">
              <Link to="/admin/manage_movie">Manage Movie</Link>
            </Menu.Item>
            <Menu.Item key="manage_genre">
              <Link to="/admin/manage_genre">Manage Genre</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Main Content */}
        <Content className={styles.content}>
          <Routes>
            {/* Dashboard */}
            <Route
              path="/"
              element={
                <div>
                  {/* Movie Description and Premiere Location */}
                  <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                      <Title level={3}>Movie Description</Title>
                      <Card className={styles.card}>
                        <Row gutter={[16, 16]}>
                          <Col md={8}>
                            <Card className={styles.posterCard}>
                              <img src={movieData.poster} alt="Movie Poster" className={styles.posterImage} />
                            </Card>
                          </Col>
                          <Col md={16}>
                            <Form form={form} layout="vertical">
                              <Form.Item label="Movie Name" name="name">
                                <Input placeholder="Spider-Man: Homecoming" defaultValue={movieData.name} />
                              </Form.Item>
                              <Form.Item label="Category" name="category">
                                <Input placeholder="Action, Adventure, Sci-Fi" defaultValue={movieData.category} />
                              </Form.Item>
                              <Row gutter={[16, 16]}>
                                <Col xs={12}>
                                  <Form.Item label="Release date" name="releaseDate">
                                    <DatePicker placeholder="Select date" defaultValue={moment(movieData.releaseDate, 'YYYY-MM-DD')} style={{ width: '100%' }} />
                                  </Form.Item>
                                </Col>
                                <Col xs={12}>
                                  <Form.Item label="Duration (hour / minute)" name="duration">
                                    <Row gutter={[8, 8]}>
                                      <Col xs={6}>
                                        <Input type="number" placeholder="2" defaultValue={movieData.durationHours} />
                                      </Col>
                                      <Col xs={6}>
                                        <Input type="number" placeholder="13" defaultValue={movieData.durationMinutes} />
                                      </Col>
                                    </Row>
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={[16, 16]}>
                                <Col xs={12}>
                                  <Form.Item label="Director" name="director">
                                    <Input placeholder="Jon Watts" defaultValue={movieData.director} />
                                  </Form.Item>
                                </Col>
                                <Col xs={12}>
                                  <Form.Item label="Casts" name="casts">
                                    <Input placeholder="Tom Holland, Michael Keaton, Robert Dow.." defaultValue={movieData.casts} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Form.Item label="Synopsis" name="synopsis">
                                <Input.TextArea placeholder="Thrilled by his experience with the Avengers..." defaultValue={movieData.synopsis} rows={4} />
                              </Form.Item>
                            </Form>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Title level={3}>Premiere Location</Title>
                      <Card className={styles.card}>
                        <Select
                          placeholder="Select city"
                          suffixIcon={<EnvironmentOutlined />}
                          className={styles.select}
                          defaultValue="Purwokerto"
                        >
                          <Option value="Purwokerto">Purwokerto</Option>
                          <Option value="Jakarta">Jakarta</Option>
                          <Option value="Bandung">Bandung</Option>
                          <Option value="Surabaya">Surabaya</Option>
                        </Select>
                        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
                          {cinemas.map((cinema) => (
                            <Col xs={4} key={cinema.name}>
                              <img src={cinema.logo} alt={cinema.name} className={styles.cinemaLogo} />
                            </Col>
                          ))}
                        </Row>
                        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
                          {cinemas.map((cinema) => (
                            <Col xs={4} key={cinema.name}>
                              <img src={cinema.logo} alt={cinema.name} className={styles.cinemaLogo} />
                            </Col>
                          ))}
                        </Row>
                        <Row gutter={[16, 16]} className={styles.cinemaGrid}>
                          {cinemas.map((cinema) => (
                            <Col xs={4} key={cinema.name}>
                              <img src={cinema.logo} alt={cinema.name} className={styles.cinemaLogo} />
                            </Col>
                          ))}
                        </Row>
                      </Card>
                      <Title level={3} className={styles.showtimeTitle}>Premiere Showtime</Title>
                      <Card className={styles.card}>
                        <DatePicker
                          placeholder="Select date"
                          suffixIcon={<CalendarOutlined />}
                          className={styles.datePicker}
                          defaultValue={moment('2025-05-15', 'YYYY-MM-DD')}
                        />
                        <Row gutter={[8, 8]} className={styles.showtimeGrid}>
                          <Col xs={3}>
                            <Button icon={<PlusOutlined />} className={styles.addButton} />
                          </Col>
                          {showtimes.map((time, index) => (
                            <Col xs={3} key={index}>
                              <Text>{time}</Text>
                            </Col>
                          ))}
                        </Row>
                      </Card>
                    </Col>
                  </Row>

                  {/* Sales Charts */}
                  <Title level={3}>Sales Charts</Title>
                  <Card className={styles.chartCard}>
                    <Tabs defaultActiveKey="movie">
                      <TabPane tab="Based on Movie" key="movie">
                        <Row gutter={[16, 16]}>
                          {salesData.map((data, index) => (
                            <Col xs={24} md={8} key={index}>
                              <Card className={styles.salesCard}>
                                <Text>{data.movie}</Text>
                                <Radio.Group defaultValue="Weekly" className={styles.timePeriod}>
                                  <Radio.Button value="Weekly">Weekly</Radio.Button>
                                  <Radio.Button value="Monthly">Monthly</Radio.Button>
                                  <Radio.Button value="Yearly">Yearly</Radio.Button>
                                </Radio.Group>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </TabPane>
                      <TabPane tab="Based on Location" key="location">
                        <Row gutter={[16, 16]}>
                          {salesData.map((data, index) => (
                            <Col xs={24} md={8} key={index}>
                              <Card className={styles.salesCard}>
                                <Text>{data.movie}</Text>
                                <Radio.Group defaultValue="Weekly" className={styles.timePeriod}>
                                  <Radio.Button value="Weekly">Weekly</Radio.Button>
                                  <Radio.Button value="Monthly">Monthly</Radio.Button>
                                  <Radio.Button value="Yearly">Yearly</Radio.Button>
                                </Radio.Group>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </TabPane>
                    </Tabs>
                  </Card>
                </div>
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <div>
                  <Title level={3}>Admin Profile</Title>
                  <Card className={styles.card}>
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                        <Avatar
                          size={150}
                          icon={<UserOutlined />}
                          src="https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"
                          className={styles.profileImage}
                        />
                      </Col>
                      <Col xs={24} md={16}>
                        <Form layout="vertical" onFinish={(values) => console.log('Profile updated:', values)}>
                          <Form.Item label="Name" name="name" initialValue={adminProfile.name}>
                            <Input placeholder="Admin User" />
                          </Form.Item>
                          <Form.Item label="Email" name="email" initialValue={adminProfile.email}>
                            <Input placeholder="admin@tickitz.com" />
                          </Form.Item>
                          <Form.Item label="Role" name="role" initialValue={adminProfile.role}>
                            <Input placeholder="Administrator" disabled />
                          </Form.Item>
                          <Button type="primary" htmlType="submit">Update Profile</Button>
                        </Form>
                      </Col>
                    </Row>
                  </Card>
                </div>
              }
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={
                <div>
                  <Title level={3}>Settings</Title>
                  <Card className={styles.card}>
                    <Form layout="vertical" onFinish={(values) => console.log('Settings updated:', values)}>
                      <Form.Item label="Site Name" name="siteName" initialValue="Tickitz">
                        <Input placeholder="Tickitz" />
                      </Form.Item>
                      <Form.Item label="Enable Email Notifications" name="emailNotifications" initialValue={true}>
                        <Select>
                          <Option value={true}>Yes</Option>
                          <Option value={false}>No</Option>
                        </Select>
                      </Form.Item>
                      <Button type="primary" htmlType="submit">Save Settings</Button>
                    </Form>
                  </Card>
                </div>
              }
            />

            {/* Manage User */}
            <Route
              path="/manage_user"
              element={
                <div>
                  <Title level={3}>Manage User</Title>
                  <Card className={styles.card}>
                    <Form
                      form={userForm}
                      layout="vertical"
                      onFinish={editingUser ? handleEditUser : handleAddUser}
                      style={{ marginBottom: 24 }}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Required' }]}>
                            <Input placeholder="Enter name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Required' }, { type: 'email', message: 'Invalid email' }]}>
                            <Input placeholder="Enter email" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Required' }]}>
                            <Select placeholder="Select role">
                              <Option value="User">User</Option>
                              <Option value="Admin">Admin</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Button type="primary" htmlType="submit">
                        {editingUser ? 'Update User' : 'Add User'}
                      </Button>
                      {editingUser && (
                        <Button onClick={() => { setEditingUser(null); userForm.resetFields(); }} style={{ marginLeft: 8 }}>
                          Cancel
                        </Button>
                      )}
                    </Form>
                    <Table
                      columns={userColumns}
                      dataSource={users}
                      rowKey="id"
                      pagination={false}
                    />
                  </Card>
                </div>
              }
            />

            {/* Manage Movie */}
            <Route
              path="/manage_movie"
              element={
                <div>
                  <Title level={3}>Manage Movie</Title>
                  <Card className={styles.card}>
                    <Button type="primary" onClick={() => navigate('/admin/manage_movie/add')} style={{ marginBottom: 16 }}>
                      Add Movie
                    </Button>
                    <Table
                      columns={movieColumns}
                      dataSource={movies}
                      rowKey="id"
                      pagination={false}
                    />
                  </Card>
                </div>
              }
            />
            <Route
              path="/manage_movie/add"
              element={
                <div>
                  <Title level={3}>Add Movie</Title>
                  <Card className={styles.card}>
                    <Form
                      form={movieForm}
                      layout="vertical"
                      onFinish={handleAddMovie}
                    >
                      <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="Enter movie title" />
                      </Form.Item>
                      <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="Enter category" />
                      </Form.Item>
                      <Form.Item label="Release Date" name="releaseDate" rules={[{ required: true, message: 'Required' }]}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Button type="primary" htmlType="submit">Add Movie</Button>
                      <Button onClick={() => navigate('/admin/manage_movie')} style={{ marginLeft: 8 }}>Cancel</Button>
                    </Form>
                  </Card>
                </div>
              }
            />
            <Route
              path="/manage_movie/edit/:id"
              element={
                <div>
                  <Title level={3}>Edit Movie</Title>
                  <Card className={styles.card}>
                    <Form
                      form={movieForm}
                      layout="vertical"
                      onFinish={handleEditMovie}
                    >
                      <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="Enter movie title" />
                      </Form.Item>
                      <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="Enter category" />
                      </Form.Item>
                      <Form.Item label="Release Date" name="releaseDate" rules={[{ required: true, message: 'Required' }]}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                      <Button type="primary" htmlType="submit">Update Movie</Button>
                      <Button onClick={() => navigate('/admin/manage_movie')} style={{ marginLeft: 8 }}>Cancel</Button>
                    </Form>
                  </Card>
                </div>
              }
            />

            {/* Manage Genre */}
            <Route
              path="/manage_genre"
              element={
                <div>
                  <Title level={3}>Manage Genre</Title>
                  <Card className={styles.card}>
                    <Button type="primary" onClick={() => navigate('/admin/manage_genre/add')} style={{ marginBottom: 16 }}>
                      Add Genre
                    </Button>
                    <Table
                      columns={genreColumns}
                      dataSource={genres}
                      rowKey="id"
                      pagination={false}
                    />
                  </Card>
                </div>
              }
            />
            <Route
              path="/manage_genre/add"
              element={
                <div>
                  <Title level={3}>Add Genre</Title>
                  <Card className={styles.card}>
                    <Form
                      form={genreForm}
                      layout="vertical"
                      onFinish={handleAddGenre}
                    >
                      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="Enter genre name" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit">Add Genre</Button>
                      <Button onClick={() => navigate('/admin/manage_genre')} style={{ marginLeft: 8 }}>Cancel</Button>
                    </Form>
                  </Card>
                </div>
              }
            />
            <Route
              path="/manage_genre/edit/:id"
              element={
                <div>
                  <Title level={3}>Edit Genre</Title>
                  <Card className={styles.card}>
                    <Form
                      form={genreForm}
                      layout="vertical"
                      onFinish={handleEditGenre}
                    >
                      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="Enter genre name" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit">Update Genre</Button>
                      <Button onClick={() => navigate('/admin/manage_genre')} style={{ marginLeft: 8 }}>Cancel</Button>
                    </Form>
                  </Card>
                </div>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;