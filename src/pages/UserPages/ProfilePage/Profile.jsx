/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Row, Col, Card, Tabs, message, Skeleton, Alert } from 'antd';
import styles from './Profile.module.scss';
import InfoCard from '../../../components/UserPages/ProfilePage/InfoCard/InfoCard';
import AccountTab from '../../../components/UserPages/ProfilePage/AccountTab/AccountTab';
import OrderHistory from '../../../components/UserPages/ProfilePage/OrderHistory/OrderHistory';
import { useUserData, useOrderHistory, useInvalidateUserData } from '../../../hooks/useProfile';
import useAuth from '../../../utils/auth';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const Profile = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [activeTab, setActiveTab] = useState('settings'); // Controlled tab state

  // Left section: User data for InfoCard
  const { data: userData, isLoading: isUserLoading, error: userError } = useUserData(userId);

  // Right section: Order history for OrderHistory tab
  const { data: orderData, isLoading: isOrderLoading, error: orderError } = useOrderHistory(userId, {
    page: pagination.current,
    pageSize: pagination.pageSize,
  });
  const invalidateUserData = useInvalidateUserData();

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    navigate('/auth');
  };

  const handleProfileUpdate = () => {
    invalidateUserData(userId); // Refresh user data
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
    setActiveTab('history'); // Keep OrderHistory tab active
  };

  const handleTabChange = (key) => {
    setActiveTab(key); // Update active tab
  };

  // Render left section (InfoCard)
  const renderLeftSection = () => {
    if (userError) {
      return (
        <Alert
          message="Error"
          description={userError.message || 'Failed to load user data'}
          type="error"
          showIcon
        />
      );
    }

    if (isUserLoading) {
      return <Skeleton active avatar paragraph={{ rows: 4 }} />;
    }

    if (!userData) {
      return <Alert message="No user data available" type="warning" showIcon />;
    }

    return (
      <InfoCard userData={userData} loading={isUserLoading} onSignOut={handleSignOut} />
    );
  };

  // Render right section (Tabs with Account Settings and Order History)
  const renderRightSection = () => {
    return (
      <Card className={styles.accountCard}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className={styles.tabs}
        >
          <TabPane tab="Account Settings" key="settings">
            {userError ? (
              <Alert
                message="Error"
                description={userError.message || 'User data unavailable for settings'}
                type="error"
                showIcon
              />
            ) : isUserLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <AccountTab
                userData={userData}
                loading={isUserLoading}
                onProfileUpdate={handleProfileUpdate}
              />
            )}
          </TabPane>
          <TabPane tab="Order History" key="history">
            {orderError ? (
              <Alert
                message="Error"
                description={orderError.message || 'Failed to load order history'}
                type="error"
                showIcon
              />
            ) : isOrderLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <OrderHistory
                orderHistory={orderData?.orders || []}
                loading={isOrderLoading}
                pagination={{
                  ...pagination,
                  total: orderData?.pagination.total || 0,
                }}
                onPaginationChange={handlePaginationChange}
              />
            )}
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
    </div>
  );
};

export default Profile;