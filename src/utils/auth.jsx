import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (accessToken && userId) {
      setIsAuthenticated(true);
      setUserId(userId);
    } else {
      setIsAuthenticated(false);
      setUserId(null);
      navigate('/auth');
    }
  }, [navigate]);

  return { isAuthenticated, userId };
};

export default useAuth;