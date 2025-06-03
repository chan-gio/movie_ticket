import { Tabs, Spin, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CinemaService from "../../../services/CinemaService";
import BookingService from "../../../services/BookingService";
import useAuth from "../../../utils/auth";
import { useBookingTimer } from "../../../Context/BookingTimerContext";
import styles from "./CinemaPage.module.scss";
import moment from "moment";

const { TabPane } = Tabs;

function CinemaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cinema } = location.state || {};
  const { isAuthenticated, userId } = useAuth({ disableRedirect: true });
  const { startTimer } = useBookingTimer();
  const [moviesByDate, setMoviesByDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(moment().format("D/M"));

  // Tạo danh sách 7 ngày từ hôm nay
  const dates = Array.from({ length: 7 }, (_, i) =>
    moment().add(i, "days")
  );

  // Lấy suất chiếu cho ngày hiện tại khi component mount hoặc cinema thay đổi
  useEffect(() => {
    if (cinema) {
      fetchShowtimes(activeTab);
    }
  }, [cinema]);

  // Lấy suất chiếu khi tab thay đổi
  useEffect(() => {
    if (cinema && !moviesByDate[activeTab]) {
      fetchShowtimes(activeTab);
    }
  }, [activeTab, cinema]);

  // Hàm lấy suất chiếu cho một ngày
  const fetchShowtimes = async (dateKey) => {
    setLoading(true);
    try {
      const date = dates.find((d) => d.format("D/M") === dateKey);
      if (!date) return;

      const formattedDate = date.format("YYYY-MM-DD");
      const showtimes = await CinemaService.getShowtimesByCinemaAndDate(
        cinema.cinema_id,
        formattedDate
      );

      // Nhóm suất chiếu theo phim
      const movies = {};
      showtimes.forEach((showtime) => {
        const movieId = showtime.movie.movie_id;
        if (!movies[movieId]) {
          movies[movieId] = {
            id: movieId,
            title: showtime.movie.title,
            type: "2D Phụ Đề Việt", // Giả định, thay bằng dữ liệu thực nếu có
            times: [],
          };
        }
        movies[movieId].times.push({
          time: moment.utc(showtime.start_time).format("HH:mm"), // Parse as UTC
          room: showtime.room.room_name || showtime.room.room_id || "Unknown",
          showtimeId: showtime.showtime_id,
          roomId: showtime.room.room_id,
        });
      });

      setMoviesByDate((prev) => ({
        ...prev,
        [dateKey]: Object.values(movies),
      }));
    } catch (error) {
      message.error(error.message || "Không thể tải danh sách suất chiếu");
      setMoviesByDate((prev) => ({
        ...prev,
        [dateKey]: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleShowtimeClick = async (movie, timeObj, e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của trình duyệt
    e.stopPropagation(); // Ngăn sự kiện lan truyền

    if (loading) {
      console.log("Click ignored: loading is true");
      return;
    }

    if (!isAuthenticated || !userId) {
      console.log("Authentication failed: redirecting to /auth");
      message.error("You need to log in to book a movie. Redirecting to login...");
      navigate("/auth");
      return;
    }

    if (!timeObj.roomId) {
      message.error("Please select a room to proceed.");
      return;
    }

    if (!timeObj.showtimeId) {
      message.error("Could not determine showtime. Please try again.");
      return;
    }

    const bookingData = {
      user_id: userId,
      showtime_id: timeObj.showtimeId,
      status: "PENDING",
    };

    try {
      setLoading(true);
      console.log("Creating booking with:", bookingData);
      const response = await BookingService.createBooking(bookingData);
      const bookingId = response.booking_id;
      if (!bookingId) {
        throw new Error("Booking ID not returned from server.");
      }

      const path = `/seats/${timeObj.roomId}/${bookingId}`;
      console.log("Navigating to:", path);
      startTimer(bookingId, "SeatSelection", {
        selectedDate: dates.find((d) => d.format("D/M") === activeTab).format("YYYY-MM-DD"),
        selectedTime: timeObj.time,
        selectedRoomId: timeObj.roomId,
      }, path);
      navigate(path, {
        state: {
          cinema,
          movie,
          selectedTime: timeObj.time,
          bookingId,
          roomId: timeObj.roomId,
          selectedDate: dates.find((d) => d.format("D/M") === activeTab).format("YYYY-MM-DD"),
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      message.error(error.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={styles.container}>
      {cinema ? (
        <div className={styles.cinemaInfo}>
          <div className={styles.cinemaHeader}>
            <img
              src={`https://play-lh.googleusercontent.com/nxo4BC4BQ5hXuNi-UCdPM5kC0uZH1lq7bglINlWNUA_v8yMfHHOtTjhLTvo5NDjVeqx-?text=Cinema`}
              alt="Cinema"
              className={styles.cinemaLogo}
            />
            <div>
              <h1 className={styles.cinemaName}>{cinema.name}</h1>
              <p className={styles.cinemaAddress}>{cinema.address}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Không tìm thấy thông tin rạp.</p>
      )}
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin tip="Đang xử lý..." />
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.tabs}
        >
          {dates.map((date) => {
            const dateKey = date.format("D/M");
            const movies = moviesByDate[dateKey] || [];
            return (
              <TabPane tab={dateKey} key={dateKey}>
                <div className={styles.movieList}>
                  {movies.length > 0 ? (
                    movies.map((movie, index) => (
                      <div key={index} className={styles.movieItem}>
                        <div className={styles.movieInfo}>
                          <h3
                            className={styles.movieTitle}
                            onClick={() => handleMovieClick(movie.id)}
                          >
                            {movie.title}
                          </h3>
                          <p className={styles.movieType}>{movie.type}</p>
                        </div>
                        <div className={styles.showtimes}>
                          {movie.times.map((timeObj, idx) => (
                            <span
                              key={idx}
                              className={`${styles.showtime} ${loading ? styles.disabled : ''}`}
                              onClick={(e) => !loading && handleShowtimeClick(movie, timeObj, e)}
                              style={loading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                            >
                              {timeObj.time} - {timeObj.room}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noMovies}>Không có suất chiếu</p>
                  )}
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

export default CinemaPage;