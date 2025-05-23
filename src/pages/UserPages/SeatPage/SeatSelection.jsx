import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Typography, Tag, Space, Skeleton, message } from "antd";
import styles from "./SeatSelection.module.scss";
import SeatService from "../../../services/SeatService";
import BookingService from "../../../services/BookingService";
import BookingSeatService from "../../../services/BookingSeatService";
import { useSettings } from "../../../Context/SettingContext";
import { useBookingTimer } from "../../../Context/BookingTimerContext";

const { Title, Paragraph } = Typography;

function SeatSelection() {
  const { roomId, bookingId } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const { settings, error: settingsError } = useSettings();
  const { bookings, updateProgress } = useBookingTimer();

  // Find the booking from the bookings array
  const currentBooking = bookings.find((b) => b.bookingId === bookingId);
  const initialSeats =
    currentBooking?.progress.step === "SeatSelection" &&
    currentBooking?.progress.bookingId === bookingId &&
    Array.isArray(currentBooking?.progress.data.selectedSeats)
      ? currentBooking.progress.data.selectedSeats
      : [];

  const [selectedSeats, setSelectedSeats] = useState(initialSeats);
  const [seats, setSeats] = useState([]);
  const [seatBookingStatus, setSeatBookingStatus] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    const fetchData = async () => {
      if (!roomId || !bookingId) {
        setError("Room ID or Booking ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const seatsResponse = await SeatService.getSeatByRoomId(roomId);
        setSeats(seatsResponse.data);

        const bookingResponse = await BookingService.getBookingById(bookingId);
        setBooking(bookingResponse);

        const showtimeId = bookingResponse.showtime?.showtime_id;
        if (showtimeId) {
          const seatStatusResponse = await BookingSeatService.getSeatsByShowtime(showtimeId);
          setSeatBookingStatus(Array.isArray(seatStatusResponse) ? seatStatusResponse : []);
        } else {
          console.warn('Showtime ID not found in booking response');
          setSeatBookingStatus([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
    hasFetched.current = true;
  }, [roomId, bookingId]);

  const parseSeatLayout = () => {
    const rows = new Set();
    const cols = new Set();

    seats.forEach((seat) => {
      const row = seat.seat_number.charAt(0);
      const col = parseInt(seat.seat_number.slice(1), 10);
      rows.add(row);
      cols.add(col);
    });

    return {
      rows: Array.from(rows).sort(),
      cols: Array.from(cols).sort((a, b) => a - b),
    };
  };

  const { rows, cols } = parseSeatLayout();

  const orderInfo = booking
    ? {
        movieTitle: booking.showtime?.movie?.title || "Unknown Movie",
        cinema: "Cinema 1",
        picture: booking.showtime?.movie?.poster_url || "https://statics.vincom.com.vn/http/vincom-ho/thuong_hieu/anh_logo/CGV-Cinemas.png/8e6196f9adbc621156a5519c267b3e93.webp",
        date: booking.showtime?.start_time ? new Date(booking.showtime.start_time).toISOString().split("T")[0] : "Unknown Date",
        time: booking.showtime?.start_time ? new Date(booking.showtime.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Unknown Time",
        basePrice: booking.showtime?.price || 0,
      }
    : {
        movieTitle: "Movie 1",
        cinema: "Cinema 1",
        picture: "https://statics.vincom.com.vn/http/vincom-ho/thuong_hieu/anh_logo/CGV-Cinemas.png/8e6196f9adbc621156a5519c267b3e93.webp",
        date: "2025-05-15",
        time: "2:00 PM",
        basePrice: 10,
      };

  const calculateSeatPrice = (seatNumber) => {
    const seat = seats.find((s) => s.seat_number === seatNumber);
    if (!seat || !settings) return orderInfo.basePrice;

    const basePrice = orderInfo.basePrice;
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

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatNumber) => {
      const seatPrice = calculateSeatPrice(seatNumber);
      return total + seatPrice;
    }, 0);
  };

  const toggleSeat = (seat) => {
    const seatStatus = Array.isArray(seatBookingStatus)
      ? seatBookingStatus.find((s) => s.seat_number === seat)
      : null;
    const isBooked = seatStatus ? seatStatus.is_booked : false;

    if (isBooked) {
      return;
    }

    setSelectedSeats((prev) => {
      const newSeats = prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat];
      const path = `/seats/${roomId}/${bookingId}`;
      updateProgress(bookingId, "SeatSelection", { selectedSeats: newSeats }, path);
      return newSeats;
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      message.error("Please select at least one seat to proceed.");
      return;
    }

    try {
      setLoading(true);

      const bookingSeatPromises = selectedSeats.map(async (seatNumber) => {
        const seat = seats.find((s) => s.seat_number === seatNumber);
        if (!seat) {
          throw new Error(`Seat not found: ${seatNumber}`);
        }

        const bookingSeatData = {
          booking_id: bookingId,
          seat_id: seat.seat_id,
        };

        return BookingSeatService.createBookingSeat(bookingSeatData);
      });

      await Promise.all(bookingSeatPromises);
      message.success("Seats booked successfully!");

      const path = `/payment/${bookingId}`;
      updateProgress(bookingId, "Payment", { selectedSeats }, path);
      navigate(path);
    } catch (err) {
      console.error('Checkout error:', err);
      message.error(err.message || "Failed to complete checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMovie = () => {
    const path = `/movies`;
    updateProgress(bookingId, "MovieSelection", { selectedSeats }, path);
    navigate(path);
  };

  if (loading) {
    return (
      <div className={styles.seatSelection}>
        <div className={styles.secondaryNavbar}>
          <Row justify="space-between" align="middle">
            <Col>
              <Skeleton.Input active size="large" style={{ width: 200 }} />
            </Col>
            <Col>
              <Skeleton.Button active size="default" />
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]} className={styles.mainContent}>
          <Col xs={24} lg={16}>
            <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 0 }} />
            <Card className={styles.seatCard}>
              <div className={styles.screen}>
                <Skeleton.Input active size="small" style={{ width: 100 }} />
                <div className={styles.screenLine}></div>
              </div>
              <div className={styles.seatGrid}>
                <table>
                  <tbody>
                    {[...Array(5)].map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>
                          <Skeleton.Input active size="small" style={{ width: 20 }} />
                        </td>
                        {[...Array(10)].map((_, colIndex) => (
                          <td key={colIndex}>
                            <Skeleton.Button active size="small" style={{ width: 40, height: 40 }} />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      {[...Array(10)].map((_, colIndex) => (
                        <td key={colIndex}>
                          <Skeleton.Input active size="small" style={{ width: 20 }} />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <Skeleton active title={{ width: "20%" }} paragraph={{ rows: 0 }} />
              <Row gutter={[16, 16]}>
                {[...Array(5)].map((_, index) => (
                  <Col key={index} xs={5}>
                    <Space>
                      <Skeleton.Button active size="small" style={{ width: 24, height: 24 }} />
                      <Skeleton.Input active size="small" style={{ width: 80 }} />
                    </Space>
                  </Col>
                ))}
              </Row>
            </Card>
            <Row gutter={[16, 16]} className={styles.checkoutButtons}>
              <Col xs={24} md={12}>
                <Skeleton.Button active size="large" block />
              </Col>
              <Col xs={24} md={12}>
                <Skeleton.Button active size="large" block />
              </Col>
            </Row>
          </Col>

          <Col xs={24} lg={8}>
            <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 0 }} />
            <Card className={styles.orderCard}>
              <div className={styles.cinemaInfo}>
                <Skeleton.Image active style={{ width: 50, height: 50 }} />
                <Skeleton.Input active size="large" style={{ width: 150, marginLeft: 16 }} />
              </div>
              {[...Array(5)].map((_, index) => (
                <Row key={index} justify="space-between" style={{ marginBottom: 16 }}>
                  <Skeleton.Input active size="small" style={{ width: 150 }} />
                  <Skeleton.Input active size="small" style={{ width: 100 }} />
                </Row>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.seatSelection}>
        <Title level={3}>Error</Title>
        <Paragraph>{error}</Paragraph>
        <Button type="primary" onClick={() => navigate(`/movie/${booking?.showtime?.movie?.movie_id || ''}`)}>
          Go Back
        </Button>
      </div>
    );
  }

  if (settingsError) {
    return (
      <div className={styles.seatSelection}>
        <Title level={3}>Error</Title>
        <Paragraph>{settingsError}</Paragraph>
        <Button type="primary" onClick={() => navigate(`/movie/${booking?.showtime?.movie?.movie_id || ''}`)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.seatSelection}>
      <div className={styles.secondaryNavbar}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} className={styles.movieTitle}>
              {orderInfo.movieTitle}
            </Title>
          </Col>
          <Col>
            <Button className={styles.changeButton} onClick={handleChangeMovie}>
              Go back
            </Button>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={16}>
          <Title level={3}>Choose Your Seat</Title>
          <Card className={styles.seatCard}>
            <div className={styles.screen}>
              <Paragraph className={styles.screenText}>Screen</Paragraph>
              <div className={styles.screenLine}></div>
            </div>
            <div className={styles.seatGrid}>
              <table>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row}>
                      <td>{row}</td>
                      {cols.map((col) => {
                        const seatNumber = `${row}${col}`;
                        const seat = seats.find(
                          (s) => s.seat_number === seatNumber
                        );
                        const seatStatus = Array.isArray(seatBookingStatus)
                          ? seatBookingStatus.find((s) => s.seat_number === seatNumber)
                          : null;
                        const isSelected = selectedSeats.includes(seatNumber);
                        const isBooked = seatStatus ? seatStatus.is_booked : false;
                        const seatType = seat ? seat.seat_type : null;
                        const seatClass = isBooked
                          ? styles.soldBox
                          : seatType === "VIP"
                          ? styles.seatVIP
                          : seatType === "Couple"
                          ? styles.loveBox
                          : styles.seatStandard;

                        return (
                          <td key={seatNumber}>
                            {seat ? (
                              <Button
                                className={`${styles.seat} ${seatClass} ${
                                  isSelected ? styles.seatSelected : ""
                                }`}
                                onClick={() => toggleSeat(seatNumber)}
                                disabled={isBooked}
                              >
                                {col}
                              </Button>
                            ) : (
                              <span className={styles.emptySeat}></span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    {cols.map((col) => (
                      <td key={col}>{col}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <Title level={4} className={styles.seatingKeyTitle}>
              Seating key
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={5}>
                <Space>
                  <Tag className={styles.seatStandard}></Tag>
                  <Paragraph>Standard</Paragraph>
                </Space>
              </Col>
              <Col xs={5}>
                <Space>
                  <Tag className={styles.seatVIP}></Tag>
                  <Paragraph>VIP</Paragraph>
                </Space>
              </Col>
              <Col xs={5}>
                <Space>
                  <Tag className={styles.loveBox}></Tag>
                  <Paragraph>Couple</Paragraph>
                </Space>
              </Col>
              <Col xs={5}>
                <Space>
                  <Tag className={styles.selectBox}></Tag>
                  <Paragraph>Selected</Paragraph>
                </Space>
              </Col>
              <Col xs={4}>
                <Space>
                  <Tag className={styles.soldBox}></Tag>
                  <Paragraph>Sold</Paragraph>
                </Space>
              </Col>
            </Row>
          </Card>
          <Row gutter={[16, 16]} className={styles.checkoutButtons}>
            <Col xs={24} md={12}>
              <Button
                block
                className={styles.changeMovieButton}
                onClick={handleChangeMovie}
              >
                Change your movie
              </Button>
            </Col>
            <Col xs={24} md={12}>
              <Button
                type="primary"
                block
                className={styles.checkoutButton}
                disabled={selectedSeats.length === 0}
                onClick={handleCheckout}
                loading={loading}
              >
                Checkout now
              </Button>
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={8}>
          <Title level={3}>Order Info</Title>
          <Card className={styles.orderCard}>
            <div className={styles.cinemaInfo}>
              <img
                src={orderInfo.picture}
                alt={orderInfo.cinema}
                className={styles.cinemaLogo}
              />
              <Title level={4}>{orderInfo.cinema}</Title>
            </div>
            <Row justify="space-between">
              <Paragraph className={styles.label}>Movie selected</Paragraph>
              <Paragraph className={styles.value}>
                {orderInfo.movieTitle}
              </Paragraph>
            </Row>
            <Row justify="space-between">
              <Paragraph className={styles.label}>
                {formatDate(orderInfo.date)}
              </Paragraph>
              <Paragraph className={styles.value}>{orderInfo.time}</Paragraph>
            </Row>
            <Row justify="space-between">
              <Paragraph className={styles.label}>Standard price</Paragraph>
              <Paragraph className={styles.value}>{orderInfo.basePrice}đ</Paragraph>
            </Row>
            <Row justify="space-between">
              <Paragraph className={styles.label}>VIP price</Paragraph>
              <Paragraph className={styles.value}>
                {settings ? (orderInfo.basePrice + (orderInfo.basePrice * settings.vip / 100)) : orderInfo.basePrice}đ
              </Paragraph>
            </Row>
            <Row justify="space-between">
              <Paragraph className={styles.label}>Couple price</Paragraph>
              <Paragraph className={styles.value}>
                {settings ? (orderInfo.basePrice + (orderInfo.basePrice * settings.couple / 100)) : orderInfo.basePrice}đ
              </Paragraph>
            </Row>
            <Row justify="space-between">
              <Paragraph className={styles.label}>Seat choosed</Paragraph>
              <Paragraph className={styles.value}>
                {selectedSeats.join(", ") || "None"}
              </Paragraph>
            </Row>
            <div className={styles.divider} />
            <Row justify="space-between">
              <Paragraph className={styles.totalLabel}>Total Payment</Paragraph>
              <Paragraph className={styles.totalValue}>
                {calculateTotalPrice()}đ
              </Paragraph>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SeatSelection;