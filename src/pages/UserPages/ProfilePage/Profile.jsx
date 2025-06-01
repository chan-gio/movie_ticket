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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    navigate("/auth");
  };

  const fetchData = async (page = 1, pageSize = 10) => {
    if (!userId) {
      message.error("User ID not found. Please log in.");
      return;
    }

    try {
      setLoading(true);

      // Fetch user data
      const userResponse = await UserService.getUserById(userId);
      const [firstName, ...lastNameParts] = (userResponse.full_name || "").trim().split(/\s+/);
      const user = {
        firstName: firstName || "",
        lastName: lastNameParts.join(" ") || "",
        email: userResponse.email || "",
        phone: userResponse.phone || "",
        profile_picture_url: userResponse.profile_picture_url || "",
      };
      setUserData(user);

      // Fetch order history with pagination
      const bookingResponse = await BookingService.getBookingsByUserId(userId, { page, per_page: pageSize });
      const transformedOrders = bookingResponse.data.map((booking) => ({
        id: booking.booking_id,
        date: new Date(booking.showtime.start_time).toLocaleString("en-US", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        movie: booking.showtime.movie.title,
        orderCode: booking.order_code,
        status: booking.status === "CONFIRMED" ? "active" : booking.status === "PENDING" ? "pending" : booking.status === "CANCELLED" ? "cancelled" : booking.status,
        createdAt: new Date(booking.created_at).toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));

      setOrderHistory(transformedOrders);
      setPagination({
        current: bookingResponse.current_page,
        pageSize: bookingResponse.per_page,
        total: bookingResponse.total,
      });
    } catch (error) {
      message.error(error.message || "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [userId, navigate]);

  const handleProfileUpdate = () => {
    fetchData(pagination.current, pagination.pageSize); // Refresh userData
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
    fetchData(page, pageSize);
  };

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
                <AccountTab userData={userData} loading={loading} onProfileUpdate={handleProfileUpdate} />
              </TabPane>
              <TabPane tab="Order History" key="history">
                <OrderHistory
                  orderHistory={orderHistory}
                  loading={loading}
                  pagination={pagination}
                  onPaginationChange={handlePaginationChange}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;