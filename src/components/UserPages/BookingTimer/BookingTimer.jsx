import React from "react";
import { Progress, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BookingTimer.module.scss";
import { useBookingTimer } from "../../../Context/BookingTimerContext";
import BookingService from "../../../services/BookingService";

const BookingTimer = () => {
  const { bookings, resumeBooking, clearTimer } = useBookingTimer();
  const navigate = useNavigate();
  const location = useLocation();

  if (!bookings || bookings.length === 0) return null;

  const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Hàm xử lý hủy đặt chỗ
  const handleCancelBooking = async (bookingId) => {
    try {
      await BookingService.updateBookingStatus(bookingId, "CANCELLED");
      clearTimer(bookingId); // Xóa đặt chỗ khỏi danh sách
      message.error(`Booking ${bookingId}: Your booking has been cancelled.`);
      
      // Redirect to homepage if on /seats or /payment pages
      if (
        location.pathname.includes("/seats") ||
        location.pathname.includes("/payment")
      ) {
        navigate("/");
      }
    } catch (error) {
      message.error(`Failed to cancel booking ${bookingId}: ${error.message}`);
    }
  };

  return (
    <div className={styles.timerWrapper}>
      {bookings.map((booking) => (
        <div
          key={booking.bookingId}
          className={styles.timerContainer}
          onClick={() => resumeBooking(booking.bookingId)}
        >
          <div className={styles.timerContent}>
            <span className={styles.timerText}>
              {booking.movieName}: {formatRemainingTime(booking.remainingTime)}
            </span>
            <Progress
              type="circle"
              percent={(booking.remainingTime / (5 * 60)) * 100}
              size={50}
              strokeColor={booking.remainingTime <= 30 ? "#ff4d4f" : "#722ed1"}
              format={() => ""}
            />
            {/* Nút X để hủy đặt chỗ */}
            <button
              className={styles.cancelButton}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn sự kiện click lan sang resumeBooking
                handleCancelBooking(booking.bookingId);
              }}
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingTimer;