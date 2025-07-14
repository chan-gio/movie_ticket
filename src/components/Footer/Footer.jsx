import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import styles from "./Footer.module.scss";
import waveImg from "/assets/wave.png";
import {
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import { useSettingsContext } from "../../Context/SettingContext"; // Updated import

const Footer = () => {
  const { settings, loading } = useSettingsContext(); // Updated hook usage
  const navigate = useNavigate(); // Add navigate hook

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
            <img 
              src={settings?.name || "https://via.placeholder.com/150x50?text=MovieLogo"} 
              alt="Movie" 
              style={{ opacity: loading ? 0.5 : 1 }}
            />
          </Link>
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
                <span onClick={() => navigate('/movies')} style={{cursor: 'pointer'}}>Phim đang chiếu</span>
              </li>
              <li>
                <span onClick={() => navigate('/movies')} style={{cursor: 'pointer'}}>Phim sắp chiếu</span>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>THÀNH VIÊN</h4>
            <ul>
              <li>
                <span onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>Tài khoản</span>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>HỖ TRỢ</h4>
            <ul>
              <li>
                <span style={{cursor: 'pointer'}}>Liên hệ</span>
              </li>
              <li>
                <span style={{cursor: 'pointer'}}>Câu hỏi thường gặp</span>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>Chăm sóc khách hàng</h4>
            <ul>
              <li>Hotline: 0913963203</li>
              <li>Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày bao gồm cả Lễ Tết)</li>
              <li>Email hỗ trợ: <a href="mailto:manhduc889@gmail.com" style={{color: '#D1D5DB'}}>manhduc889@gmail.com</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
