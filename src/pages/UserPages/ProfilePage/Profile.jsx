import React, { useState } from 'react';
import { Row, Col, Card, Tabs, message, Skeleton, Alert, Modal } from 'antd';
import styles from './Profile.module.scss';
import InfoCard from '../../../components/UserPages/ProfilePage/InfoCard/InfoCard';
import AccountTab from '../../../components/UserPages/ProfilePage/AccountTab/AccountTab';
import OrderHistory from '../../../components/UserPages/ProfilePage/OrderHistory/OrderHistory';
import { useUserData, useInvalidateUserData } from '../../../hooks/useProfile';
import useAuth from '../../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../Context/AuthContext';

const { TabPane } = Tabs;

const Profile = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const { logout } = authContext;
  const [activeTab, setActiveTab] = useState('settings'); // Controlled tab state
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  console.log('AuthContext:', authContext);
  console.log('Logout function:', logout);

  // Left section: User data for InfoCard
  const { data: userData, isLoading: isUserLoading, error: userError } = useUserData(userId);
  const invalidateUserData = useInvalidateUserData();

  const handleSignOut = () => {
    console.log('Logout button clicked');
    setLogoutModalVisible(true);
  };

  const handleLogoutConfirm = () => {
    console.log('User confirmed logout');

    // Xóa dữ liệu ngay lập tức
    console.log('Clearing all data...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('profile_picture_url');
    localStorage.removeItem('user_role');
    console.log('All data cleared');

    // Đóng modal
    setLogoutModalVisible(false);

    // Hiển thị thông báo thành công
    message.success('Đăng xuất thành công!');

    // Chuyển hướng về trang chủ ngay lập tức
    navigate('/');
  };

  const handleLogoutCancel = () => {
    console.log('User cancelled logout');
    setLogoutModalVisible(false);
  };

  const handleProfileUpdate = () => {
    invalidateUserData(userId); // Refresh user data
  };

  const handleTabChange = key => {
    setActiveTab(key); // Update active tab
  };

  // Render left section (InfoCard)
  const renderLeftSection = () => {
    if (userError) {
      return <Alert message="Error" description={userError.message || 'Failed to load user data'} type="error" showIcon />;
    }

    if (isUserLoading) {
      return <Skeleton active avatar paragraph={{ rows: 4 }} />;
    }

    if (!userData) {
      return <Alert message="No user data available" type="warning" showIcon />;
    }

    return <InfoCard userData={userData} loading={isUserLoading} onSignOut={handleSignOut} />;
  };

  // Render right section (Tabs with Account Settings and Order History)
  const renderRightSection = () => {
    return (
      <Card className={styles.accountCard}>
        <Tabs activeKey={activeTab} onChange={handleTabChange} className={styles.tabs}>
          <TabPane tab="Account Settings" key="settings">
            {userError ? <Alert message="Error" description={userError.message || 'User data unavailable for settings'} type="error" showIcon /> : isUserLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : <AccountTab userData={userData} loading={isUserLoading} onProfileUpdate={handleProfileUpdate} />}
          </TabPane>
          <TabPane tab="Order History" key="history">
            <OrderHistory />
          </TabPane>
        </Tabs>
      </Card>
    );
  };

  return (
    <div className={styles.profile}>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} md={8}>
          {renderLeftSection()}
        </Col>
        <Col xs={24} md={16}>
          {renderRightSection()}
        </Col>
      </Row>

      {/* Logout Confirmation Modal */}
      <Modal title="Đăng xuất" open={logoutModalVisible} onOk={handleLogoutConfirm} onCancel={handleLogoutCancel} okText="Có" cancelText="Không" confirmLoading={false}>
        <p>Bạn có chắc chắn muốn đăng xuất không?</p>
      </Modal>
    </div>
  );
};

export default Profile;
