import React, { useState, useEffect } from "react";
import { Row, Col, Card, Tabs, message } from "antd";
import styles from "./Profile.module.scss";
import InfoCard from "../../../components/UserPages/ProfilePage/InfoCard/InfoCard";
import AccountTab from "../../../components/UserPages/ProfilePage/AccountTab/AccountTab";
import OrderHistory from "../../../components/UserPages/ProfilePage/OrderHistory/OrderHistory";
import UserService from "../../../services/UserService";
import BookingService from "../../../services/BookingService";
import useAuth from "../../../utils/auth";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const Profile = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    navigate('/auth');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        message.error("User ID not found. Please log in.");
        return;
      }

      try {
        setLoading(true);

        // Fetch user data
        const userResponse = await UserService.getUserById(userId);
        const [firstName, ...lastNameParts] = userResponse.full_name.split(" ");
        const user = {
          firstName,
          lastName: lastNameParts.join(" "),
          email: userResponse.email,
          phoneNumber: userResponse.phone,
          picture: userResponse.profile_picture_url,
          loyaltyPoints: 320, // Placeholder since this field isn't in the API response
        };
        setUserData(user);

        // Fetch order history
        const bookingResponse = await BookingService.getBookingsByUserId(userId, { per_page: 10 });
        const transformedOrders = bookingResponse.data.map((booking) => ({
          id: booking.booking_id,
          date: new Date(booking.showtime.start_time).toLocaleString('en-US', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          movie: booking.showtime.movie.title,
          cinemaLogo: "https://via.placeholder.com/50x21?text=Cinema",
          status: booking.status === "CONFIRMED" ? "active" : booking.status === "PENDING" ? "pending" : "used",
        }));
        setOrderHistory(transformedOrders);
      } catch (error) {
        message.error(error.message || "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  if (!userData && !loading) {
    return (
      <div className={styles.profile}>
        <h2>Failed to load profile data</h2>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} md={8}>
          <InfoCard userData={userData} loading={loading} onSignOut={handleSignOut} />
        </Col>
        <Col xs={24} md={16}>
          <Card className={styles.accountCard}>
            <Tabs defaultActiveKey="settings" className={styles.tabs}>
              <TabPane tab="Account Settings" key="settings">
                <AccountTab userData={userData} loading={loading} />
              </TabPane>
              <TabPane tab="Order History" key="history">
                <OrderHistory orderHistory={orderHistory} loading={loading} />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;