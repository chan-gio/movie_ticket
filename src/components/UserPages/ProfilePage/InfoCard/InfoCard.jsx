/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Skeleton, Button, message, Upload, Progress } from 'antd';
import { UserOutlined, LogoutOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons';
import styles from './InfoCard.module.scss';
import { uploadImageToCloudinary } from '../../../../utils/cloudinaryConfig';
import UserService from '../../../../services/UserService';
import { toastError, toastSuccess } from '../../../../utils/toastNotifier';

const { Title, Paragraph } = Typography;

const InfoCard = ({ userData, loading, onSignOut }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileImage, setProfileImage] = useState('');

  // Function to clean escaped URL
  const cleanUrl = url => {
    if (!url) return null;
    return url.replace(/\\\//g, '/'); // Remove escape backslashes
  };

  // Sync profileImage with userData.picture
  useEffect(() => {
    if (userData?.profile_picture_url) {
      const cleanedUrl = cleanUrl(userData.profile_picture_url);
      setProfileImage(cleanedUrl);
    }
  }, [userData]);

  const handleAvatarUploadChange = async ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.slice(-1); // Limit to one file
    setFileList(updatedFileList);

    if (updatedFileList.length > 0) {
      const file = updatedFileList[0].originFileObj;
      setUploading(true);
      setUploadProgress(0);

      try {
        const rawUrl = await uploadImageToCloudinary(file, import.meta.env.VITE_MOVIE_POSTER_UPLOAD_PRESET || 'profile_picture_preset', progress => {
          setUploadProgress(progress);
        });

        const imageUrl = cleanUrl(rawUrl); // Clean the URL

        if (!imageUrl) {
          throw new Error('Failed to upload profile picture to Cloudinary');
        }

        const userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('User ID not found. Please log in again.');
        }

        const updatedData = { profile_picture_url: imageUrl };
        const updatedUser = await UserService.updateUser(userId, updatedData);

        setProfileImage(imageUrl);
        setFileList([{ ...updatedFileList[0], url: imageUrl, status: 'done' }]);
        localStorage.setItem('profile_picture_url', imageUrl);
        toastSuccess('Profile picture updated successfully');
      } catch (error) {
        console.error('Upload error:', error.message);
        if (error.message.includes('Upload preset')) {
          toastError('Cloudinary configuration error: Invalid upload preset. Please check your Cloudinary settings.');
        } else if (error.message.includes('User ID not found')) {
          toastError('Session expired. Please log in again.');
        } else {
          toastError(error.message || 'Failed to update profile picture');
        }
        setFileList([]);
        setProfileImage(cleanUrl(userData?.profile_picture_url)); // Reset with cleaned URL
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    } else {
      setProfileImage(cleanUrl(userData?.profile_picture_url)); // Reset with cleaned URL
    }
  };

  const uploadProps = {
    onChange: handleAvatarUploadChange,
    fileList,
    beforeUpload: file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files (JPEG, PNG, etc.)!');
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
    accept: 'image/*'
  };

  if (loading) {
    return (
      <Card className={styles.infoCard}>
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </Card>
    );
  }

  return (
    <Card className={styles.infoCard}>
      <div className={styles.infoHeader}>
        <Paragraph className={styles.infoLabel}>INFO</Paragraph>
      </div>
      <div className={styles.profileInfo}>
        <Upload {...uploadProps}>
          <div className={styles.profileImageWrapper} style={{ cursor: 'pointer' }}>
            <Avatar size={150} src={profileImage || 'https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg'} icon={<UserOutlined />} className={styles.avatar} />
            <button type="button" className={styles.cameraIconBtn} tabIndex={-1} aria-label="Thay đổi ảnh đại diện" style={{ border: 'none', outline: 'none' }}>
              <CameraOutlined />
            </button>
            {uploading && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%'
                }}
              >
                <Progress type="circle" percent={uploadProgress} size={50} strokeColor="#5f2eea" />
              </div>
            )}
          </div>
        </Upload>
        <Title level={4} className={styles.userName}>
          {userData?.firstName} {userData?.lastName}
        </Title>
        <Paragraph className={styles.userRole}>{userData.email}</Paragraph>
        <Button type="primary" icon={<LogoutOutlined />} onClick={onSignOut} className={styles.logoutButton}>
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default InfoCard;
