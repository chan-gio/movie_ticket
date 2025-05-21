import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Select, Input, Space, Avatar } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.scss";
import SelectCinemaModal from "../Modal/SelectCinemaModal";

const { Option } = Select;

const logo = "https://via.placeholder.com/150x50?text=Movie";
const user = {
  picture: null,
  fullName: "John Doe",
  email: "john.doe@example.com",
};

function Navbar() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate(); 

  const handleAvatarClick = () => {
    navigate('/profile');
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
            <img src={logo} alt="Movie" />
          </Link>
          <div className={styles.navLinks}>
            <Link to="/movies" className={styles.navLink}>
              Movies
            </Link>
            <Link to="/cinemas" className={styles.navLink} onClick={handleCinemaClick}>
              Cinemas
            </Link>
            <Link to="/buy-ticket" className={styles.navLink}>
              Buy Ticket
            </Link>
          </div>
        </div>
        <div className={styles.navActions}>
          <Select
            defaultValue="Location"
            className={styles.locationSelect}
            onChange={(value) => console.log("Selected location:", value)}
          >
            <Option value="Location" disabled>
              Location
            </Option>
            <Option value="Jakarta">Jakarta</Option>
            <Option value="Bandung">Bandung</Option>
            <Option value="Surabaya">Surabaya</Option>
          </Select>
          <div className={styles.searchForm}>
            <Input
              placeholder="Search"
              className={styles.searchInput}
              suffix={<SearchOutlined className={styles.searchIcon} />}
            />
          </div>
              <Avatar
                size={35}
                src={
                  user.picture ||
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