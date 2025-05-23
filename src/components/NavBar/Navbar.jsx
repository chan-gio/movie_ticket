import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Select, Input, Avatar } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.scss";
import SelectCinemaModal from "../Modal/SelectCinemaModal";
import { useSettings } from "../../Context/SettingContext";
import MovieService from "../../services/MovieService";
import { toastError } from "../../utils/toastNotifier"; // Import toastError

const { Option } = Select;

function Navbar() {
  const { settings } = useSettings();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();

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
      toastError(error.message || "Failed to search movies"); // Use toastError
    }
  };

  const handleAvatarClick = () => {
    navigate("/profile");
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

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.leftSection}>
          <Link to="/" className={styles.navbarLogo}>
            <img src={settings.name} alt="Movie" />
          </Link>
          <div className={styles.navLinks}>
            <Link to="/movies" className={styles.navLink}>
              Movies
            </Link>
            <Link
              to="/cinemas"
              className={styles.navLink}
              onClick={handleCinemaClick}
            >
              Cinemas
            </Link>
          </div>
        </div>
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
            size={35}
            src={
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
