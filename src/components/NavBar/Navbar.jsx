import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input, Avatar } from "antd";
import { UserOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.scss";
import SelectCinemaModal from "../Modal/SelectCinemaModal";
import { useSettings } from "../../Context/SettingContext";
import MovieService from "../../services/MovieService";
import { toastError } from "../../utils/toastNotifier";
import useAuth from "../../utils/auth";

function Navbar() {
  const { settings } = useSettings();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || ""); // Local state for search input
  const navigate = useNavigate();
  const { profile_picture_url } = useAuth();

  // Hamburger menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Update local state on input change, don't update URL
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value); // Only update local state
  };

  // Search function triggered by icon click or Enter
  const handleSearch = async () => {
    // Update URL search params only when search is triggered
    setSearchParams(searchQuery ? { search: searchQuery } : {});
    
    if (searchQuery.trim() === "") {
      navigate("/movies", {
        state: { searchQuery: "", searchResults: null },
      });
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
    } catch (error) {
      toastError(error.message || "Failed to search movies");
    }
  };

  // Handle search button click, close menu in mobile view
  const handleSearchButtonClick = () => {
    handleSearch();
    setMenuOpen(false); // Close menu in mobile view
  };

  const handleAvatarClick = () => {
    navigate("/profile");
    setMenuOpen(false); // Close menu in mobile view
  };

  const handleCinemaClick = (e) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Close menu when clicking a nav link (on mobile)
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <MenuOutlined />
        </button>
        <div className={styles.navbarLogo}>
          <Link to="/">
            <img src={settings.name} alt="Movie" />
          </Link>
        </div>
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <Link
            to="/movies"
            className={styles.navLink}
            onClick={handleNavLinkClick}
          >
            Movies
          </Link>
          <Link
            to="/cinemas"
            className={styles.navLink}
            onClick={handleCinemaClick}
          >
            Cinemas
          </Link>
          {/* Search & Avatar in mobile menu */}
          <div className={styles.mobileMenuExtras}>
            <div className={styles.searchForm}>
              <Input
                placeholder="Search"
                className={styles.searchInput}
                suffix={
                  <SearchOutlined
                    className={styles.searchIcon}
                    onClick={handleSearchButtonClick}
                  />
                }
                value={searchQuery}
                onChange={handleSearchInputChange}
                onPressEnter={handleSearch}
              />
            </div>
            <Avatar
              size={50}
              src={
                profile_picture_url ||
                "https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"
              }
              icon={<UserOutlined />}
              className={styles.userAvatar}
              onClick={handleAvatarClick}
            />
          </div>
        </div>
        {/* NavActions for desktop */}
        <div className={styles.navActions}>
          <div className={styles.searchForm}>
            <Input
              placeholder="Search"
              className={styles.searchInput}
              suffix={
                <SearchOutlined
                  className={styles.searchIcon}
                  onClick={handleSearch}
                />
              }
              value={searchQuery}
              onChange={handleSearchInputChange}
              onPressEnter={handleSearch}
            />
          </div>
          <Avatar
            size={50}
            src={
              profile_picture_url ||
              "https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"
            }
            icon={<UserOutlined />}
            className={styles.userAvatar}
            onClick={handleAvatarClick}
          />
        </div>
      </div>
      <SelectCinemaModal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </nav>
  );
}

export default Navbar;