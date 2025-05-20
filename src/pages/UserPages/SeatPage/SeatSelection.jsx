import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Typography, Tag, Space, Spin, message } from "antd";
import styles from "./SeatSelection.module.scss";
import SeatService from "../../../services/SeatService";
import BookingService from "../../../services/BookingService";
import BookingSeatService from "../../../services/BookingSeatService";

const { Title, Paragraph } = Typography;

function SeatSelection() {
  const { roomId, bookingId } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [seatBookingStatus, setSeatBookingStatus] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        price: booking.showtime?.price ? booking.showtime.price / 1000 : 0,
      }
    : {
        movieTitle: "Movie 1",
        cinema: "Cinema 1",
        picture: "https://statics.vincom.com.vn/http/vincom-ho/thuong_hieu/anh_logo/CGV-Cinemas.png/8e6196f9adbc621156a5519c267b3e93.webp",
        date: "2025-05-15",
        time: "2:00 PM",
        price: 10,
      };

  const toggleSeat = (seat) => {
    const seatStatus = Array.isArray(seatBookingStatus) ? seatBookingStatus.find(
      (s) => s.seat_number === seat
    ) : null;
    const isBooked = seatStatus ? seatStatus.is_booked : false;

    if (isBooked) {
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
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
      const totalPrice = orderInfo.price * selectedSeats.length * 1000;
      const totalPriceNumber = Number(totalPrice);
      if (isNaN(totalPriceNumber)) {
        throw new Error("Total price calculation resulted in a non-numeric value.");
      }

      await BookingService.updateTotalPrice(bookingId, totalPriceNumber);
      message.success("Total price updated successfully!");

      sessionStorage.setItem('paymentData', JSON.stringify({
        selectedSeats,
        date: orderInfo.date,
        time: orderInfo.time,
      }));
      navigate(`/payment/${bookingId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      message.error(err.message || "Failed to complete checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMovie = () => {
    sessionStorage.removeItem('paymentData');
    navigate('/movies');
  };

  if (loading) {
    return (
      <div className={styles.seatSelection}>
        <Spin size="large" />
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
            <Button className={styles.changeButton} onClick={() => navigate(`/movie/${booking?.showtime?.movie?.movie_id || ''}`)}>
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
                        const seatStatus = Array.isArray(seatBookingStatus) ? seatBookingStatus.find(
                          (s) => s.seat_number === seatNumber
                        ) : null;
                        const isSelected = selectedSeats.includes(seatNumber);
                        const isBooked = seatStatus ? seatStatus.is_booked : false;
                        const seatType = seat ? seat.seat_type : null;
                        const seatClass = isBooked
                          ? styles.soldBox
                          : seatType === "VIP"
                          ? styles.seatVIP
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
                  <Paragraph>Love nest</Paragraph>
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
              <Paragraph className={styles.label}>One ticket price</Paragraph>
              <Paragraph className={styles.value}>${orderInfo.price}</Paragraph>
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
                ${orderInfo.price * selectedSeats.length}
              </Paragraph>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SeatSelection;