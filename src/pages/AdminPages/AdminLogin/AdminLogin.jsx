import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.scss';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate async login (replace with actual API call in production)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.loginLeft}>
          <h1 className={styles.loginTitle}>Admin Login</h1>
          <p className={styles.loginDesc}>Access the admin dashboard to manage movies, cinemas, and more.</p>
          {error && (
            <p className={styles.error} id="error-message" role="alert">
              {error}
            </p>
          )}
          <form onSubmit={handleLogin}>
            <div className={styles.inputBlock}>
              <label htmlFor="username" className={styles.inputLabel}>
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-describedby={error ? 'error-message' : undefined}
                required
              />
            </div>
            <div className={styles.inputBlock}>
              <label htmlFor="password" className={styles.inputLabel}>
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby={error ? 'error-message' : undefined}
                required
              />
            </div>
            <div className={styles.loginButtons}>
              <button
                type="submit"
                className={styles.inputButton}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
        <div className={styles.loginRight}>
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Modern cinema dashboard illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;