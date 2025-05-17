import { Tabs } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CinemaPage.module.scss";

const { TabPane } = Tabs;

const moviesByCinema = {
  "Đồng Đa": {
    "17/5": [
      {
        id: "doraemon-44",
        title: "Doraemon Movie 44: Nobita Và Cuộc Phiêu Lưu Vào Thế Giới Tranh",
        type: "2D Phụ Đề Việt",
        times: ["09:50", "13:40", "17:30", "21:20"],
      },
      {
        id: "detective-kien",
        title: "Thám Tử Kiên: Kỳ Án Khổng Đầu",
        type: "2D Phụ Đề Anh",
        times: ["09:30", "11:55", "14:20", "16:50", "19:15", "21:40"],
      },
    ],
    "18/5": [
      {
        id: "doraemon-44",
        title: "Doraemon Movie 44: Nobita Và Cuộc Phiêu Lưu Vào Thế Giới Tranh",
        type: "2D Phụ Đề Việt",
        times: ["10:00", "14:00", "18:00"],
      },
      {
        id: "detective-kien",
        title: "Thám Tử Kiên: Kỳ Án Khổng Đầu",
        type: "2D Phụ Đề Anh",
        times: ["12:00", "15:30", "20:00"],
      },
    ],
    "19/5": [],
    "20/5": [],
    "21/5": [],
    "22/5": [],
  },
  "Beta Quang Trung": {
    "17/5": [
      {
        id: "movie-a",
        title: "Movie A",
        type: "2D Phụ Đề Việt",
        times: ["10:00", "15:00"],
      },
    ],
    "18/5": [],
    "19/5": [],
    "20/5": [],
    "21/5": [],
    "22/5": [],
  },
};

function CinemaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cinema } = location.state || {};
  const movies = cinema ? moviesByCinema[cinema.name] || {} : {};

  const handleShowtimeClick = (movie, time, e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the parent movieItem
    navigate("/seats", {
      state: {
        cinema,
        movie,
        selectedTime: time,
      },
    });
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={styles.container}>
      {cinema && (
        <div className={styles.cinemaInfo}>
          <div className={styles.cinemaHeader}>
            <img
              src={`https://play-lh.googleusercontent.com/nxo4BC4BQ5hXuNi-UCdPM5kC0uZH1lq7bglINlWNUA_v8yMfHHOtTjhLTvo5NDjVeqx-?text=${cinema.chain}`}
              alt={cinema.chain}
              className={styles.cinemaLogo}
            />
            <div>
              <h1 className={styles.cinemaName}>
                {cinema.chain} {cinema.name}
              </h1>
              <p className={styles.cinemaAddress}>{cinema.address}</p>
            </div>
          </div>
        </div>
      )}
      <Tabs defaultActiveKey="17/5" className={styles.tabs}>
        {Object.keys(movies).map((date) => (
          <TabPane tab={date} key={date}>
            <div className={styles.movieList}>
              {movies[date]?.length > 0 ? (
                movies[date].map((movie, index) => (
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
                      {movie.times.map((time, idx) => (
                        <span
                          key={idx}
                          className={styles.showtime}
                          onClick={(e) => handleShowtimeClick(movie, time, e)}
                        >
                          {time}
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
        ))}
      </Tabs>
    </div>
  );
}

export default CinemaPage;