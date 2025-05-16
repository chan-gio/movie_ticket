import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Typography, Result, Button, Spin } from 'antd';
import axios from 'axios';
import styles from './Confirmation.module.scss';

const { Title } = Typography;

// Access PayOS credentials from environment variables
const PAYOS_CLIENT_ID = import.meta.env.VITE_PAYOS_CLIENT_ID;
const PAYOS_API_KEY = import.meta.env.VITE_PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = import.meta.env.VITE_PAYOS_CHECKSUM_KEY;
const PAYOS_API_URL = import.meta.env.VITE_PAYOS_API_URL;

function Confirmation() {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orderCode = query.get('orderCode');

    if (orderCode) {
      // Verify payment status with PayOS
      const verifyPayment = async () => {
        try {
          const response = await axios.get(
            `${PAYOS_API_URL}/${orderCode}`,
            {
              headers: {
                'x-client-id': PAYOS_CLIENT_ID,
                'x-api-key': PAYOS_API_KEY,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.data && response.data.data) {
            const status = response.data.data.status;
            setPaymentStatus(status);
          } else {
            setPaymentStatus('FAILED');
          }
        } catch (err) {
          setPaymentStatus('FAILED');
        } finally {
          setLoading(false);
        }
      };

      verifyPayment();
    } else {
      setPaymentStatus('FAILED');
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return (
      <div className={styles.confirmation}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.confirmation}>
      <Card className={styles.card}>
        {paymentStatus === 'PAID' ? (
          <Result
            status="success"
            title="Payment Successful!"
            subTitle="Your order has been confirmed. Enjoy your movie!"
            extra={[
              <Button type="primary" key="home" onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>,
            ]}
          />
        ) : (
          <Result
            status="error"
            title="Payment Failed"
            subTitle="There was an issue with your payment. Please try again."
            extra={[
              <Button type="primary" key="retry" onClick={() => window.location.href = '/payment'}>
                Retry Payment
              </Button>,
            ]}
          />
        )}
      </Card>
    </div>
  );
}

export default Confirmation;