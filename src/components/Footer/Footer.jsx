import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom"; // Added Link import
import styles from "./Footer.module.scss";
import waveImg from "/assets/wave.png";
import {
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import MovieService from "../../services/MovieService";
import { toastError } from "../../utils/toastNotifier";
import { useSettings } from "../../Context/SettingContext"; // Added useSettings import

const Footer = () => {
  const { settings } = useSettings(); // Added useSettings hook
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const navbar = document.querySelector(".navbar");

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update search query in URL
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  // Search function triggered by icon click or Enter
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      navigate("/movies", {
        state: { searchQuery: "", searchResults: null },
      });
      window.scrollTo(0, 0); // Scroll to top
      return;
    }
    try {
      const response = await MovieService.searchByTitleFE({
        title: searchQuery,
        perPage: 20,
        page: 1,
      });
      navigate("/movies", {
        state: { searchQuery, searchResults: response },
      });
      window.scrollTo(0, 0); // Scroll to top
    } catch (error) {
      toastError(error.message || "Failed to search movies");
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.waves}>
        <div
          className={styles.wave}
          id={styles.wave1}
          style={{ backgroundImage: `url(${waveImg})` }}
        ></div>
        <div
          className={styles.wave}
          id={styles.wave2}
          style={{ backgroundImage: `url(${waveImg})` }}
        ></div>
        <div
          className={styles.wave}
          id={styles.wave3}
          style={{ backgroundImage: `url(${waveImg})` }}
        ></div>
        <div
          className={styles.wave}
          id={styles.wave4}
          style={{ backgroundImage: `url(${waveImg})` }}
        ></div>
      </div>

      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <Link to="/" className={styles.footerLogoLink}>
            {" "}
            {/* Updated to use Link */}
            <img src={settings.name} alt="Movie" />
          </Link>
          <div className={styles.searchBar}>
            <span
              className={styles.searchIcon}
              onClick={handleSearch}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm phim, rạp, suất chiếu..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className={styles.socialIcons}>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaPinterest />
            </a>
            <a href="#">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.footerLinks}>
          <div className={styles.linkColumn}>
            <h4>PHIM</h4>
            <ul>
              <li>
                <a href="#">Phim đang chiếu</a>
              </li>
              <li>
                <a href="#">Phim sắp chiếu</a>
              </li>
              <li>
                <a href="#">Suất chiếu đặc biệt</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>RẠP</h4>
            <ul>
              <li>
                <a href="#">Hệ thống rạp</a>
              </li>
              <li>
                <a href="#">Rạp gần bạn</a>
              </li>
              <li>
                <a href="#">Khuyến mãi</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>THÀNH VIÊN</h4>
            <ul>
              <li>
                <a href="#">Tài khoản</a>
              </li>
              <li>
                <a href="#">Điểm thưởng</a>
              </li>
              <li>
                <a href="#">Lịch sử đặt vé</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>HỖ TRỢ</h4>
            <ul>
              <li>
                <a href="#">Liên hệ</a>
              </li>
              <li>
                <a href="#">Câu hỏi thường gặp</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
