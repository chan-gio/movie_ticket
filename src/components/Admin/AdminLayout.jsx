/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { Layout, Menu, Button, Drawer } from 'antd';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import styles from './AdminLayout.module.scss';

const { Sider, Content } = Layout;

function AdminLayout({ children, handleLogout, navigate }) {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuContent = (
    <>
      <Menu mode="inline" defaultSelectedKeys={['dashboard']} className={styles.menu} onClick={() => setDrawerVisible(false)}>
        <Menu.Item key="dashboard">
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link to="/admin/profile">Profile</Link>
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
        <Menu.Item key="manage_booking">
          <Link to="/admin/manage_booking">Manage Booking</Link>
        </Menu.Item>
        <Menu.Item key="manage_coupon">
          <Link to="/admin/manage_coupon">Manage Coupon</Link>
        </Menu.Item>
        <Menu.Item key="settings">
          <Link to="/admin/settings">Settings</Link>
        </Menu.Item>
      </Menu>
      {/* Logout button for mobile */}
      <div className={styles.mobileLogoutButton}>
        <Button icon={<LogoutOutlined />} onClick={handleLogout} className={styles.logoutButton} block>
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <Layout className={styles.adminLayout}>
      {/* Custom Admin Navbar */}
      <div className={styles.adminNavbar}>
        <div className={styles.navbarContainer}>
          {/* Hamburger menu for mobile */}
          <Button className={styles.menuButton} icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} type="text" style={{ display: 'none' }} />
          <Link to="/admin" className={styles.navbarBrand}>
            Admin Panel
          </Link>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} className={styles.logoutButton + ' ' + styles.desktopLogoutButton}>
            Logout
          </Button>
        </div>
      </div>

      <Layout>
        {/* Sidebar for desktop */}
        <Sider width={200} className={styles.sider} breakpoint="md" collapsedWidth={0} style={{ display: 'block' }}>
          {menuContent}
        </Sider>
        {/* Drawer for mobile */}
        <Drawer title="Admin Menu" placement="left" closable={true} onClose={() => setDrawerVisible(false)} open={drawerVisible} className={styles.drawer} bodyStyle={{ padding: 0 }}>
          {menuContent}
        </Drawer>
        {/* Main Content */}
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
