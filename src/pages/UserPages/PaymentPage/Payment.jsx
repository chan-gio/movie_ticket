/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Typography, Form, Input, Button, Space, Skeleton, Progress, List, Alert } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import styles from "./Payment.module.scss";
import BookingService from "../../../services/BookingService";
import UserService from "../../../services/UserService";
import PaymentService from "../../../services/PaymentService";
import CouponService from "../../../services/CouponService";
import { useSettings } from "../../../Context/SettingContext";
import { useBookingTimer } from "../../../Context/BookingTimerContext";
import { toastError } from "../../../utils/toastNotifier";

const { Title, Text, Paragraph } = Typography;

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const { settings, error: settingsError } = useSettings();
  const { bookings, clearTimer, updateProgress } = useBookingTimer();
  const [isShowtimePast, setIsShowtimePast] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const hasFetched = useRef(false);

  // Find the booking from the bookings array
  const currentBooking = bookings.find((b) => b.bookingId === bookingId);
  const initialCouponCode =
    currentBooking?.progress.step === "Payment" &&
    currentBooking?.progress.bookingId === bookingId
      ? currentBooking.progress.data.couponCode || ""
      : "";

  // Fetch initial data
  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    const fetchData = async () => {
      if (!bookingId) {
        toastError("Booking ID not provided");
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);

        const bookingResponse = await BookingService.getBookingById(bookingId);

        // Check if the booking is canceled
        if (bookingResponse.status === 'CANCELLED') {
          toastError("This booking has been canceled.");
          navigate("/");
          setFetchLoading(false);
          return;
        }

        setBooking(bookingResponse);

        const userId = bookingResponse.user_id;
        if (userId) {
          const userResponse = await UserService.getUserById(userId);
          setUser(userResponse);

          form.setFieldsValue({
            fullName: userResponse.full_name,
            email: userResponse.email,
            phoneNumber: userResponse.phone,
            couponCode: initialCouponCode,
          });
        } else {
          console.warn('User ID not found in booking response');
        }

        const showtimeDate = bookingResponse.showtime?.start_time ? new Date(bookingResponse.showtime.start_time) : null;
        const currentDate = new Date("2025-05-24T19:54:00+07:00");

        if (showtimeDate && currentDate > showtimeDate) {
          setIsShowtimePast(true);
          toastError("This showtime has already passed. Please select a different showtime.");
        }

        setFetchLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        toastError(err.message || "Failed to fetch data");
        setFetchLoading(false);
      }
    };

    fetchData();
    hasFetched.current = true;

    if (settingsError) {
      toastError(settingsError);
      navigate("/");
    }
  }, [bookingId, form, settingsError, navigate]);

  const orderData = booking
    ? {
        date: booking.showtime?.start_time ? new Date(booking.showtime.start_time).toISOString().split("T")[0] : 'Unknown Date',
        time: booking.showtime?.start_time ? new Date(booking.showtime.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : 'Unknown Time',
        movieTitle: booking.showtime?.movie?.title || 'Unknown Movie',
        cinema: 'Cinema 1',
        tickets: booking.booking_seats?.length || 0,
        basePrice: booking.showtime?.price || 0,
      }
    : {
        date: '2025-05-15',
        time: '2:00 PM',
        movieTitle: 'Movie 1',
        cinema: 'Cinema 1',
        tickets: 2,
        basePrice: 5000,
      };

  const sortedSeats = booking?.booking_seats?.slice().sort((a, b) => {
    const seatA = a.seat?.seat_number || '';
    const seatB = b.seat?.seat_number || '';

    const rowA = seatA.charAt(0);
    const colA = parseInt(seatA.slice(1), 10);
    const rowB = seatB.charAt(0);
    const colB = parseInt(seatB.slice(1), 10);

    if (rowA < rowB) return -1;
    if (rowA > rowB) return 1;

    return colA - colB;
  }) || [];

  const calculateSeatPrice = (seatNumber) => {
    const seat = sortedSeats.find((bs) => bs.seat?.seat_number === seatNumber)?.seat;
    if (!seat || !settings) return orderData.basePrice;

    const basePrice = orderData.basePrice;
    const seatType = seat.seat_type;

    switch (seatType) {
      case "VIP":
        return basePrice + (basePrice * settings.vip / 100);
      case "Couple":
        return basePrice + (basePrice * settings.couple / 100);
      case "Standard":
      default:
        return basePrice;
    }
  };

  const calculateBaseTotalPrice = () => {
    return sortedSeats.reduce((total, bookingSeat) => {
      const seatPrice = calculateSeatPrice(bookingSeat.seat?.seat_number);
      return total + seatPrice;
    }, 0);
  };

  const calculateTotalPrice = () => {
    const baseTotal = calculateBaseTotalPrice();
    if (!coupon) return baseTotal;

    const discountAmount = (baseTotal * coupon.discount) / 100;
    return Math.max(0, baseTotal - discountAmount);
  };

  const validateCoupon = async (couponCode) => {
    try {
      const couponData = await CouponService.searchCouponByExactCode(couponCode);
      if (!couponData) {
        throw new Error("Coupon not found.");
      }

      if (!couponData.is_active) {
        throw new Error("This coupon is not active.");
      }

      if (couponData.is_used >= couponData.quantity) {
        throw new Error("This coupon has reached its usage limit.");
      }

      const expiryDate = new Date(couponData.expiry_date);
      const currentDate = new Date("2025-05-24T19:54:00+07:00");
      if (currentDate > expiryDate) {
        throw new Error("This coupon has expired.");
      }

      setCoupon(couponData);
      return couponData;
    } catch (err) {
      toastError(err.message || "Failed to apply coupon.");
      setCoupon(null);
      throw err;
    }
  };

  const handleCouponEnter = async (e) => {
    const couponCode = e.target.value?.trim();
    if (!couponCode) {
      setCoupon(null);
      const path = `/payment/${bookingId}`;
      updateProgress(bookingId, "Payment", { couponCode: "" }, path);
      try {
        await BookingService.updateCoupon(bookingId, null);
      } catch (err) {
        toastError(err.message || "Failed to remove coupon");
      }
      return;
    }

    setLoading(true);
    try {
      const couponData = await validateCoupon(couponCode);
      const path = `/payment/${bookingId}`;
      updateProgress(bookingId, "Payment", { couponCode }, path);
    } catch (err) {
      // Error message already displayed in validateCoupon
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    if (isShowtimePast) {
      toastError("Cannot proceed with payment for a past showtime. Please select a different showtime.");
      return;
    }

    if (sortedSeats.length === 0) {
      toastError("No seats selected for this booking. Please go back and select seats.");
      return;
    }

    setLoading(true);
    setError(null);

    let appliedCoupon = coupon;
    const couponCode = values.couponCode?.trim();
    if (couponCode && !coupon) {
      try {
        appliedCoupon = await validateCoupon(couponCode);
      } catch (err) {
        setLoading(false);
        return;
      }
    }

    // Update the coupon_id in the bookings table
    try {
      await BookingService.updateCoupon(bookingId, couponCode || null);
    } catch (err) {
      toastError(err.message || "Failed to update coupon in booking");
      setLoading(false);
      return;
    }

    // Increment coupon usage if a coupon is applied
    if (appliedCoupon) {
      try {
        await CouponService.incrementCouponUsage(appliedCoupon.coupon_id);
      } catch (couponErr) {
        console.error('Coupon usage increment error:', couponErr);
        toastError(couponErr.message || "Failed to increment coupon usage. Please try again.");
        setLoading(false);
        return;
      }
    }

    const totalPrice = calculateTotalPrice();

    try {
      await BookingService.updateTotalPrice(bookingId, totalPrice);
    } catch (updateErr) {
      console.error('Update total price error:', updateErr);
      toastError('Failed to update total price. Please try again.');
      setLoading(false);
      return;
    }

    const orderCode = Math.floor(100000 + Math.random() * 900000);
    try {
      await BookingService.updateOrderCode(bookingId, orderCode.toString());
    } catch (updateErr) {
      console.error('Update order code error:', updateErr);
      toastError('Failed to update order code. Please try again.');
      setLoading(false);
      return;
    }

    const description = orderData.movieTitle.length <= 9 ? orderData.movieTitle : orderData.movieTitle.substring(0, 9);
    const baseUrl = 'http://localhost:5173';
    const returnUrl = `${baseUrl}/confirmation/${bookingId}?orderCode=${orderCode}`;
    const cancelUrl = `${baseUrl}/payment/${bookingId}`;

    const paymentData = {
      orderCode,
      amount: totalPrice,
      description,
      returnUrl,
      cancelUrl,
      buyerName: values.fullName,
      buyerEmail: values.email,
      buyerPhone: values.phoneNumber,
      items: [
        {
          name: orderData.movieTitle,
          quantity: orderData.tickets,
          price: orderData.basePrice,
        },
      ],
    };

    try {
      const response = await PaymentService.proxyPayOS(paymentData);

      if (response && response.checkoutUrl) {
        clearTimer(bookingId);
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error('Failed to create payment link: Invalid response structure');
      }
    } catch (err) {
      console.error('PayOS Service Error:', err.message);
      toastError('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatRemainingTime = (seconds) => {
    if (seconds === null || seconds === undefined) return "";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (fetchLoading) {
    return (
      <div className={styles.payment}>
        <Row gutter={[16, 16]} className={styles.section}>
          <Col xs={24} lg={16}>
            <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 0 }} />
            <Card className={styles.infoCard}>
              {[...Array(6)].map((_, index) => (
                <Row key={index} justify="space-between" style={{ marginBottom: 16 }}>
                  <Skeleton.Input active size="small" style={{ width: 150 }} />
                  <Skeleton.Input active size="small" style={{ width: 100 }} />
                </Row>
              ))}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 0 }} />
            <Card className={styles.personalCard}>
              {[...Array(3)].map((_, index) => (
                <Skeleton.Input key={index} active size="large" block style={{ marginBottom: 16 }} />
              ))}
              <Skeleton active paragraph={{ rows: 1 }} title={{ width: "80%" }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.section}>
          <Col xs={24} lg={16}>
            <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 0 }} />
            <Card className={styles.methodCard}>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
            <Space className={styles.navButtons}>
              <Skeleton.Button active size="large" style={{ width: 150 }} />
              <Skeleton.Button active size="large" style={{ width: 200 }} />
            </Space>
          </Col>
        </Row>
      </div>
    );
  }

  const baseTotal = calculateBaseTotalPrice();
  const finalTotal = calculateTotalPrice();
  const discountAmount = coupon ? baseTotal - finalTotal : 0;

  return (
    <div className={styles.payment}>
      <Row gutter={[16, 16]} className={styles.section}>
        <Col xs={24} lg={16}>
          <Title level={3}>Payment Info</Title>
          <Card className={styles.infoCard}>
            <List>
              <List.Item>
                <Text className={styles.label}>Date & time</Text>
                <Text className={styles.value}>{orderData.date} at {orderData.time}</Text>
              </List.Item>
              <List.Item>
                <Text className={styles.label}>Movie title</Text>
                <Text className={styles.value}>{orderData.movieTitle}</Text>
              </List.Item>
              <List.Item>
                <Text className={styles.label}>Cinema name</Text>
                <Text className={styles.value}>{orderData.cinema}</Text>
              </List.Item>
              <List.Item>
                <Text className={styles.label}>Number of tickets</Text>
                <Text className={styles.value}>{orderData.tickets} pieces</Text>
              </List.Item>
              <List.Item>
                <Text className={styles.label}>Seats</Text>
                <Text className={styles.value}>
                  {sortedSeats.map(bookingSeat => bookingSeat.seat?.seat_number || bookingSeat.seat_id).join(', ') || 'None'}
                </Text>
              </List.Item>
              {coupon && (
                <List.Item>
                  <Text className={styles.label}>Coupon Discount ({coupon.discount}%)</Text>
                  <Text className={styles.value}>-{discountAmount.toFixed(2)}đ</Text>
                </List.Item>
              )}
              <List.Item>
                <Text className={styles.label}>Total payment</Text>
                <Text className={styles.value}>{finalTotal.toFixed(2)}đ</Text>
              </List.Item>
            </List>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Title level={3}>Personal Info</Title>
          <Card className={styles.personalCard}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Jonas El Rodriguez" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Required' },
                  { type: 'email', message: 'Invalid email' },
                ]}
              >
                <Input placeholder="jonasrodri123@gmail.com" />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Required' },
                  { pattern: /^\d+$/, message: 'Must be a number' },
                ]}
              >
                <Input addonBefore="+84" placeholder="81445687121" />
              </Form.Item>
              <Form.Item
                label="Coupon Code (Optional)"
                name="couponCode"
              >
                <Input
                  placeholder="Enter coupon code (e.g., SAVE10)"
                  onPressEnter={handleCouponEnter}
                />
              </Form.Item>
              <Alert
                message="Fill your info correctly."
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                className={styles.alert}
              />
            </Form>
          </Card>
        </Col>
      </Row>

      {currentBooking?.remainingTime !== undefined && (
        <Row gutter={[16, 16]} className={styles.section}>
          <Col xs={24}>
            <div className={styles.timer}>
              <Paragraph className={styles.timerText}>
                Time remaining to complete payment: {formatRemainingTime(currentBooking.remainingTime)}
              </Paragraph>
              <Progress
                percent={(currentBooking.remainingTime / (5 * 60)) * 100}
                showInfo={false}
                status={currentBooking.remainingTime <= 30 ? "exception" : "active"}
                className={styles.timerProgress}
              />
            </div>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]} className={styles.section}>
        <Col xs={24} lg={16}>
          <Title level={3}>Checkout with PayOS</Title>
          <Card className={styles.methodCard}>
            <Text>If everything looks good, click 'Proceed to Payment' to finalize your order.</Text>
          </Card>
          <Space className={styles.navButtons}>
            <Button
              className={styles.prevButton}
              onClick={() => {
                const path = `/seats/${booking.showtime.room_id}/${bookingId}`;
                updateProgress(bookingId, "SeatSelection", { couponCode: form.getFieldValue("couponCode") }, path);
                navigate(path);
              }}
            >
              Previous step
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              className={styles.payButton}
              loading={loading}
              disabled={isShowtimePast}
            >
              Proceed to Payment
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default Payment;