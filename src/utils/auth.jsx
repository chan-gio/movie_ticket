import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = ({ disableRedirect = false } = {}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [profile_picture_url, setProfile_picture_url] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    const url = localStorage.getItem('profile_picture_url');
    setProfile_picture_url(url);
    if (accessToken && userId) {
      setIsAuthenticated(true);
      setUserId(userId);
    } else {
      setIsAuthenticated(false);
      setUserId(null);
      if (!disableRedirect) {
        navigate('/auth');
      }
    }
  }, [navigate, disableRedirect]);

  return { isAuthenticated, userId, profile_picture_url };
};

export default useAuth;