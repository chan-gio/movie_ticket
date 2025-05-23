import React from "react";
import { Progress } from "antd";
import styles from "./BookingTimer.module.scss";
import { useBookingTimer } from "../../../Context/BookingTimerContext";

const BookingTimer = () => {
  const { bookings, resumeBooking } = useBookingTimer();

  if (!bookings || bookings.length === 0) return null;

  const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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
              Booking {booking.bookingId}: {formatRemainingTime(booking.remainingTime)}
            </span>
            <Progress
              type="circle"
              percent={(booking.remainingTime / (5 * 60)) * 100}
              size={50}
              strokeColor={booking.remainingTime <= 30 ? "#ff4d4f" : "#722ed1"}
              format={() => ""}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingTimer;