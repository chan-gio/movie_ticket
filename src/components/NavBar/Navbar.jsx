import { Link } from "react-router-dom";
import { Menu, Dropdown, Select, Input, Space, Avatar } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.scss";

const { Option } = Select;

const logo = "https://via.placeholder.com/150x50?text=Movie"; 
const user = {
  picture: null, // Set to null to use default avatar
  fullName: "John Doe",
  email: "john.doe@example.com",
};
const isLoggedIn = true; // Toggle for testing logged-in/logged-out state

const userMenu = (
  <Menu className={styles.userMenu}>
    <Menu.Item key="info">
      Signed in as <br />
      <strong>{user.fullName || user.email}</strong>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="home">
      <Link to="/">Home</Link>
    </Menu.Item>
    <Menu.Item key="profile">
      <Link to="/profile">Your Profile</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="signout">
      <Link to="/auth">Sign out</Link>
    </Menu.Item>
  </Menu>
);

function Navbar() {
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
            <Link to="/cinemas" className={styles.navLink}>
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
          {isLoggedIn ? (
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Avatar
                size={35}
                src={
                  user.picture ||
                  "https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"
                }
                icon={<UserOutlined />}
                className={styles.userAvatar}
              />
            </Dropdown>
          ) : (
            <Link to="/auth" className={styles.signUpButton}>
              Sign up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
