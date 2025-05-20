import { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Space, Spin } from 'antd';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import JsBarcode from 'jsbarcode';
import BookingService from '../../../services/BookingService';
import PaymentService from '../../../services/PaymentService';
import styles from './Confirmation.module.scss';

const { Title, Paragraph } = Typography;

function Confirmation() {
  const { bookingId } = useParams();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const barcodeRef = useRef(null); 
  const isProcessing = useRef(false);

  // Memoize orderCode extraction
  const orderCode = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get('orderCode');
  }, [location.search]);

  useEffect(() => {
    const verifyPaymentAndUpdateBooking = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        if (!orderCode || !bookingId) {
          setPaymentStatus('FAILED');
          return;
        }

        const paymentInfo = await PaymentService.getPaymentLinkInfo(orderCode);

        if (paymentInfo?.status === 'PAID') {
          await BookingService.updateBookingStatus(bookingId, 'CONFIRMED');
          const bookingData = await BookingService.getBookingById(bookingId);

          const ticketInfo = {
            movieTitle: bookingData?.showtime?.movie?.title || 'Unknown',
            date: bookingData?.showtime?.start_time || new Date().toISOString(),
            time: bookingData?.showtime?.start_time
              ? new Date(bookingData.showtime.start_time).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })
              : 'Unknown',
            category: bookingData?.showtime?.movie?.adult || 'Unknown',
            seats: bookingData?.booking_seats?.map((bs) => bs.seat.seat_number) || [],
            price: bookingData?.total_price ? bookingData.total_price / 1000 : 0,
          };

          setPaymentStatus('PAID');
          setTicketInfo(ticketInfo);
        } else {
          setPaymentStatus('FAILED');
        }
      } catch (err) {
        console.error('Error processing payment or booking:', err.message);
        setPaymentStatus('FAILED');
      } finally {
        setLoading(false);
        isProcessing.current = false;
      }
    };

    verifyPaymentAndUpdateBooking();
  }, [orderCode, bookingId]);

  useEffect(() => {
    if (paymentStatus === 'PAID' && bookingId && barcodeRef.current) {
      const canvas = barcodeRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      JsBarcode(canvas, bookingId, {
        format: 'CODE128',
        width: 1,
        height: 100,
        displayValue: true,
        background: '#f9f5ff',
        lineColor: '#5f2eea',
        margin: 5,
      });
    }
  }, [paymentStatus, bookingId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <div className={styles.confirmation}>
        <Spin size="large" />
      </div>
    );
  }

  if (paymentStatus !== 'PAID') {
    return (
      <div className={styles.confirmation}>
        <Card className={styles.mainCard}>
          <Title level={3} className={styles.title}>
            Payment Failed
          </Title>
          <Paragraph>
            There was an issue with your payment. Please try again or contact support.
          </Paragraph>
          <Button type="primary" onClick={() => (window.location.href = `/payment/${bookingId}`)}>
            Retry Payment
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.confirmation}>
      <Card className={styles.mainCard}>
        <Title level={3} className={styles.title}>
          Proof of Payment
        </Title>
        <Card className={styles.ticketCard}>
          <Row>
            <Col xs={24} md={16} className={styles.leftTicket}>
              <div className={styles.headerInfo}>
                <svg width="126" height="49" viewBox="0 0 126 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.99432 17.1861V13.6364H26.7188V17.1861H20.4844V34H16.2287V17.1861H9.99432ZM29.3935 34V18.7273H33.6293V34H29.3935ZM31.5213 16.7585C30.8916 16.7585 30.3513 16.5497 29.9006 16.1321C29.4564 15.7079 29.2344 15.2008 29.2344 14.6108C29.2344 14.0275 29.4564 13.527 29.9006 13.1094C30.3513 12.6851 30.8916 12.473 31.5213 12.473C32.151 12.473 32.688 12.6851 33.1321 13.1094C33.5829 13.527 33.8082 14.0275 33.8082 14.6108C33.8082 15.2008 33.5829 15.7079 33.1321 16.1321C32.688 16.5497 32.151 16.7585 31.5213 16.7585ZM43.9229 34.2983C42.3585 34.2983 41.0129 33.9669 39.886 33.304C38.7657 32.6345 37.904 31.7064 37.3008 30.5199C36.7042 29.3333 36.4059 27.9678 36.4059 26.4233C36.4059 24.8589 36.7075 23.4867 37.3107 22.3068C37.9206 21.1203 38.7856 20.1955 39.9059 19.5327C41.0262 18.8632 42.3585 18.5284 43.9031 18.5284C45.2354 18.5284 46.4021 18.7704 47.4031 19.2543C48.404 19.7382 49.1961 20.4176 49.7795 21.2926C50.3628 22.1676 50.6843 23.1951 50.744 24.375H46.7468C46.6341 23.6127 46.3358 22.9995 45.8519 22.5355C45.3746 22.0649 44.7482 21.8295 43.9727 21.8295C43.3164 21.8295 42.743 22.0085 42.2525 22.3665C41.7686 22.7178 41.3907 23.2315 41.119 23.9077C40.8472 24.5838 40.7113 25.4025 40.7113 26.3636C40.7113 27.3381 40.8439 28.1667 41.109 28.8494C41.3808 29.5322 41.762 30.0526 42.2525 30.4105C42.743 30.7685 43.3164 30.9474 43.9727 30.9474C44.4566 30.9474 44.8907 30.848 45.2752 30.6491C45.6663 30.4503 45.9878 30.1619 46.2397 29.7841C46.4982 29.3996 46.6673 28.9389 46.7468 28.402H50.744C50.6777 29.5687 50.3595 30.5961 49.7894 31.4844C49.226 32.366 48.4471 33.0554 47.4528 33.5526C46.4585 34.0497 45.2818 34.2983 43.9229 34.2983ZM57.294 29.6051L57.304 24.5241H57.9205L62.8125 18.7273H67.6747L61.1023 26.4034H60.098L57.294 29.6051ZM53.456 34V13.6364H57.6918V34H53.456ZM63.0014 34L58.5071 27.348L61.331 24.3551L67.9631 34H63.0014ZM69.8324 34V13.6364H83.3153V17.1861H74.1378V22.0384H82.4205V25.5881H74.1378V34H69.8324ZM90.3675 13.6364V34H86.1317V13.6364H90.3675ZM93.7607 34V18.7273H97.9964V34H93.7607ZM95.8885 16.7585C95.2588 16.7585 94.7185 16.5497 94.2678 16.1321C93.8236 15.7079 93.6016 15.2008 93.6016 14.6108C93.6016 14.0275 93.8236 13.527 94.2678 13.1094C94.7185 12.6851 95.2588 12.473 95.8885 12.473C96.5182 12.473 97.0552 12.6851 97.4993 13.1094C97.95 13.527 98.1754 14.0275 98.1754 14.6108C98.1754 15.2008 97.95 15.7079 97.4993 16.1321C97.0552 16.5497 96.5182 16.7585 95.8885 16.7585ZM104.929 18.7273L107.733 24.0668L110.607 18.7273H114.952L110.527 26.3636L115.071 34H110.746L107.733 28.7202L104.77 34H100.395L104.929 26.3636L100.554 18.7273H104.929Z" fill="white" />
                  <path d="M8 3L9.5 6L12 7L9.5 8L8 11L6.5 8L4 7L6.5 6L8 3ZM118 3L119.5 6L122 7L119.5 8L118 11L116.5 8L114 7L116.5 6L118 3Z" fill="white" />
                </svg>
              </div>
              <div className={styles.ticketBody}>
                <Row gutter={[8, 8]}>
                  <Col xs={12}>
                    <Paragraph className={styles.info}>Movie</Paragraph>
                    <Paragraph className={styles.infoValue}>{ticketInfo.movieTitle}</Paragraph>
                  </Col>
                  <Col xs={6}>
                    <Paragraph className={styles.info}>Date</Paragraph>
                    <Paragraph className={styles.infoValue}>{formatDate(ticketInfo.date)}</Paragraph>
                  </Col>
                  <Col xs={6}>
                    <Paragraph className={styles.info}>Time</Paragraph>
                    <Paragraph className={styles.infoValue}>{ticketInfo.time}</Paragraph>
                  </Col>
                  <Col xs={6}>
                    <Paragraph className={styles.info}>Category</Paragraph>
                    <Paragraph className={styles.infoValue}>{ticketInfo.category}</Paragraph>
                  </Col>
                  <Col xs={6}>
                    <Paragraph className={styles.info}>Count</Paragraph>
                    <Paragraph className={styles.infoValue}>{ticketInfo.seats.length} pieces</Paragraph>
                  </Col>
                  <Col xs={6}>
                    <Paragraph className={styles.info}>Seats</Paragraph>
                    <Paragraph className={styles.infoValue}>{ticketInfo.seats.join(', ')}</Paragraph>
                  </Col>
                  <Col xs={6}>
                    <Paragraph className={styles.info}>Price</Paragraph>
                    <Paragraph className={styles.infoValue}>${ticketInfo.price}</Paragraph>
                  </Col>
                </Row>
                <div className={styles.barcodeContainer}>
                  <canvas
                    ref={barcodeRef}
                    className={styles.barcode}
                    width="50"
                    height="200"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        <Space className={styles.buttons}>
          <Button icon={<DownloadOutlined />} className={styles.actionButton}>
            Download
          </Button>
          <Button icon={<PrinterOutlined />} className={styles.actionButton}>
            Print
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default Confirmation;