import { Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import styles from './AdminLayout.module.scss';

const { Sider, Content } = Layout;

function AdminLayout({ children, handleLogout, navigate }) {
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
            <Menu.Item key="manage_showtime">
              <Link to="/admin/manage_showtime">Manage Showtime</Link>
            </Menu.Item>
            <Menu.Item key="manage_cinema">
              <Link to="/admin/manage_cinema">Manage Cinema</Link>
            </Menu.Item>
            <Menu.Item key="manage_seats">
              <Link to="/admin/manage_seats">Manage Seats</Link>
            </Menu.Item>
            <Menu.Item key="manage_booking">
              <Link to="/admin/manage_booking">Manage Booking</Link>
            </Menu.Item>
            <Menu.Item key="manage_coupon">
              <Link to="/admin/manage_coupon">Manage Coupon</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Main Content */}
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;