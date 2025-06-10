import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Typography, Tag, Space, Skeleton } from "antd";
import moment from "moment";
import styles from "./SeatSelection.module.scss";
import SeatService from "../../../services/SeatService";
import BookingService from "../../../services/BookingService";
import BookingSeatService from "../../../services/BookingSeatService";
import { useSettings } from "../../../Context/SettingContext";
import { useBookingTimer } from "../../../Context/BookingTimerContext";
import { toastSuccess, toastError } from "../../../utils/toastNotifier";

const { Title, Paragraph } = Typography;

function SeatSelection() {
  const { roomId, bookingId } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const { settings, error: settingsError } = useSettings();
  const { bookings, updateProgress, clearTimer } = useBookingTimer();

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
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    const fetchData = async () => {
      if (!roomId || !bookingId) {
        toastError("Room ID or Booking ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const bookingResponse = await BookingService.getBookingById(bookingId);

        // Check if the booking is canceled
        if (bookingResponse.status === 'CANCELLED') {
          toastError("This booking has been canceled.");
          navigate("/");
          setLoading(false);
          return;
        }

        setBooking(bookingResponse);

        const seatsResponse = await SeatService.getSeatByRoomId(roomId);
        setSeats(seatsResponse.data);

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
        toastError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
    hasFetched.current = true;

    // Navigate back if settingsError exists
    if (settingsError) {
      toastError(settingsError);
      navigate(`/movie/${booking?.showtime?.movie?.movie_id || ''}`);
    }
  }, [roomId, bookingId, settingsError, navigate, booking]);

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

  const formatTime = (dateString) => {
    return dateString ? moment.utc(dateString).format("HH:mm") : "Unknown";
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const orderInfo = booking
    ? {
        movieTitle: booking.showtime?.movie?.title || "Unknown Movie",
        cinema: booking.showtime?.room?.cinema?.name || "Cinema 1",
        roomName: booking.showtime?.room?.name || "Unknown Room",
        picture: booking.showtime?.movie?.poster_url || "https://statics.vincom.com.vn/http/vincom-ho/thuong_hieu/anh_logo/CGV-Cinemas.png/8e6196f9adbc621156a5519c267b3e93.webp",
        date: booking.showtime?.start_time ? new Date(booking.showtime.start_time).toISOString().split("T")[0] : "Unknown Date",
        time: booking.showtime?.start_time ? formatTime(booking.showtime.start_time) : "Unknown Time",
        basePrice: booking.showtime?.price || 0,
      }
    : {
        movieTitle: "Movie 1",
        cinema: "Cinema 1",
        roomName: "Unknown Room",
        picture: "https://statics.vincom.com.vn/http/vincom-ho/thuong_hieu/anh_logo/CGV-Cinemas.png/8e6196f9adbc621156a5519c267b3e93.webp",
        date: "2025-06-06",
        time: "21:31",
        basePrice: 10,
      };

  const calculateSeatPrice = (seatNumber) => {
    const seat = seats.find((s) => s.seat_number === seatNumber);
    if (!seat || !settings) return orderInfo.basePrice;

    const basePrice = orderInfo.basePrice;
    const seatType = seat.seat_type.toUpperCase();

    switch (seatType) {
      case "VIP":
        return basePrice + (basePrice * settings.vip / 100);
      case "COUPLE":
        return basePrice + (basePrice * settings.couple / 100);
      case "STANDARD":
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

  const toggleSeat = (seatNumber) => {
    const seat = seats.find((s) => s.seat_number === seatNumber);
    if (!seat) return;

    const seatStatus = Array.isArray(seatBookingStatus)
      ? seatBookingStatus.find((s) => s.seat_number === seatNumber)
      : null;
    const isBooked = seatStatus ? seatStatus.is_booked : false;
    const seatType = seat.seat_type.toUpperCase();

    if (isBooked || seatType === "UNAVAILABLE") {
      return;
    }

    setSelectedSeats((prev) => {
      let newSeats = [...prev];
      const isSelected = prev.includes(seatNumber);

      if (seatType === "COUPLE") {
        const row = seatNumber.match(/^[A-Z]+/)[0];
        const col = parseInt(seatNumber.match(/\d+$/)[0]);
        let pairSeat;

        if (col % 2 === 1) {
          pairSeat = `${row}${col + 1}`;
        } else {
          pairSeat = `${row}${col - 1}`;
        }

        const pairSeatObj = seats.find((s) => s.seat_number === pairSeat);
        const pairSeatStatus = Array.isArray(seatBookingStatus)
          ? seatBookingStatus.find((s) => s.seat_number === pairSeat)
          : null;
        const isPairBooked = pairSeatStatus ? pairSeatStatus.is_booked : false;

        if (!isSelected) {
          if (pairSeatObj && !isPairBooked && pairSeatObj.seat_type.toUpperCase() === "COUPLE") {
            if (!newSeats.includes(seatNumber)) {
              newSeats.push(seatNumber);
            }
            if (!newSeats.includes(pairSeat)) {
              newSeats.push(pairSeat);
            }
          } else {
            toastError("Cannot select couple seat: pair seat is unavailable or not a couple seat.");
            return prev;
          }
        } else {
          newSeats = newSeats.filter((s) => s !== seatNumber && s !== pairSeat);
        }
      } else {
        newSeats = isSelected
          ? newSeats.filter((s) => s !== seatNumber)
          : [...newSeats, seatNumber];
      }

      const path = `/seats/${roomId}/${bookingId}`;
      updateProgress(bookingId, "SeatSelection", { selectedSeats: newSeats }, path);
      console.log("SELECTED SEATS:", selectedSeats);
      return newSeats;
    });
  };

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      toastError("Please select at least one seat to proceed.");
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
      toastSuccess("Seats booked successfully!");

      const totalPrice = calculateTotalPrice();

      // Update booking with totalPrice
      await BookingService.updateTotalPrice(bookingId, totalPrice);

      const path = `/payment/${bookingId}`;
      updateProgress(bookingId, "Payment", { selectedSeats }, path);
      navigate(path, { state: { totalPrice } });
    } catch (err) {
      console.error('Checkout error:', err);
      toastError(err.message || "Failed to complete checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMovie = async () => {
    try {
      await BookingService.updateBookingStatus(bookingId, "CANCELLED");
      clearTimer(bookingId);
      toastError(`Booking ${bookingId}: Your booking has been cancelled.`);
      navigate("/movies");
    } catch (error) {
      toastError(`Failed to cancel booking: ${error.message}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
            <Button className={styles.changeButton} onClick={handleGoBack}>
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
                      <td className={styles.rowLabel}>{row}</td>
                      {cols.map((col) => {
                        const seatNumber = `${row}${col}`;
                        const seat = seats.find((s) => s.seat_number === seatNumber);
                        const seatStatus = Array.isArray(seatBookingStatus)
                          ? seatBookingStatus.find((s) => s.seat_number === seatNumber)
                          : null;
                        const isSelected = selectedSeats.includes(seatNumber);
                        const isBooked = seatStatus ? seatStatus.is_booked : false;
                        const seatType = seat ? seat.seat_type.toUpperCase() : null;
                        const isOddColumn = col % 2 === 1; // Xác định cột lẻ
                        const coupleClass = seatType === "COUPLE" ? (isOddColumn ? styles.seatCoupleOdd : styles.seatCoupleEven) : "";
                        const seatClass = isBooked
                          ? styles.seatNotAvailable
                          : seatType === "VIP"
                          ? styles.seatVip
                          : seatType === "COUPLE"
                          ? styles.seatCouple
                          : seatType === "UNAVAILABLE"
                          ? styles.seatUnavailable
                          : styles.seatStandard;

                        return (
                          <td key={seatNumber}>
                            {seat ? (
                              <Button
                                className={`${styles.seat} ${seatClass} ${coupleClass} ${
                                  isSelected ? styles.seatSelected : ""
                                }`}
                                onClick={() => toggleSeat(seatNumber)}
                                disabled={isBooked || seatType === "UNAVAILABLE"}
                                data-col={col} // Giữ lại để debug nếu cần
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
                      <td key={col} className={styles.colLabel}>{col}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <Title level={4} className={styles.seatingKeyTitle}>
              Seating Key
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.availableBox}></Tag>
                  <Paragraph>Standard</Paragraph>
                </Space>
              </Col>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.vipBox}></Tag>
                  <Paragraph>VIP</Paragraph>
                </Space>
              </Col>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.loveBox}></Tag>
                  <Paragraph>Couple</Paragraph>
                </Space>
              </Col>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.selectBox}></Tag>
                  <Paragraph>Selected</Paragraph>
                </Space>
              </Col>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.notAvailableBox}></Tag>
                  <Paragraph>Sold</Paragraph>
                </Space>
              </Col>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.unavailableBox}></Tag>
                  <Paragraph>Unavailable</Paragraph>
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
              <Paragraph className={styles.label}>Room</Paragraph>
              <Paragraph className={styles.value}>{orderInfo.roomName}</Paragraph>
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
                {settings ? ((orderInfo.basePrice + (orderInfo.basePrice * settings.couple / 100)) * 2) : orderInfo.basePrice}đ
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