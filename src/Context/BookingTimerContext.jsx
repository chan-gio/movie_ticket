import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";

const BookingTimerContext = createContext();

export const BookingTimerProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]); // Array of bookings

  const startTimer = useCallback(
    (bookingId, movieName, step, data = {}, path) => {
      const deadline = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
      const newBooking = {
        bookingId,
        movieName,
        deadline,
        remainingTime: 5 * 60, // Initial remaining time in seconds
        progress: { bookingId, step, data, path },
      };

      setBookings((prev) => {
        const updatedBookings = [...prev, newBooking];
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
        return updatedBookings;
      });

      message.warning(
        `Booking ${bookingId}: You have 5 minutes to complete your booking, or it will be canceled.`
      );
    },
    []
  );

  const updateProgress = useCallback((bookingId, step, data, path) => {
    setBookings((prev) => {
      const updatedBookings = prev.map((booking) => {
        if (booking.bookingId === bookingId) {
          const updatedProgress = { ...booking.progress, step, data, path };
          // Only update if there are actual changes
          if (
            updatedProgress.step === booking.progress.step &&
            updatedProgress.path === booking.progress.path &&
            JSON.stringify(updatedProgress.data) ===
              JSON.stringify(booking.progress.data)
          ) {
            return booking; // No changes, skip update
          }
          return { ...booking, progress: updatedProgress };
        }
        return booking;
      });
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      return updatedBookings;
    });
  }, []);

  const clearTimer = useCallback((bookingId) => {
    setBookings((prev) => {
      const updatedBookings = prev.filter(
        (booking) => booking.bookingId !== bookingId
      );
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      return updatedBookings;
    });
  }, []);

  const resumeBooking = useCallback(
    (bookingId) => {
      const booking = bookings.find((b) => b.bookingId === bookingId);
      if (booking && booking.progress.path) {
        navigate(booking.progress.path);
      }
    },
    [bookings, navigate]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setBookings((prev) => {
        const updatedBookings = prev.map((booking) => {
          const now = new Date().getTime();
          const timeLeft = Math.max(
            0,
            Math.floor((booking.deadline - now) / 1000)
          );
          return { ...booking, remainingTime: timeLeft };
        });

        // Remove expired bookings and redirect if on relevant pages
        const activeBookings = updatedBookings.filter((booking) => {
          if (booking.remainingTime <= 0) {
            if (
              location.pathname.includes("/seats") ||
              location.pathname.includes("/payment")
            ) {
              message.error(
                `Booking ${booking.bookingId}: Your booking time has expired. The booking has been canceled.`
              );
              navigate("/");
            }
            return false; // Remove expired booking
          }
          return true; // Keep active booking
        });

        localStorage.setItem("bookings", JSON.stringify(activeBookings));
        return activeBookings;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [location, navigate]);

  useEffect(() => {
    const storedBookings = localStorage.getItem("bookings");
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  return (
    <BookingTimerContext.Provider
      value={{
        bookings,
        startTimer,
        updateProgress,
        clearTimer,
        resumeBooking,
      }}
    >
      {children}
    </BookingTimerContext.Provider>
  );
};

export const useBookingTimer = () => {
  const context = useContext(BookingTimerContext);
  if (!context) {
    throw new Error(
      "useBookingTimer must be used within a BookingTimerProvider"
    );
  }
  return context;
};
