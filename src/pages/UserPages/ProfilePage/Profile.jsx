import { Row, Col, Card, Tabs } from "antd";
import styles from "./Profile.module.scss";
import InfoCard from "../../../components/UserPages/ProfilePage/InfoCard/InfoCard";
import AccountTab from "../../../components/UserPages/ProfilePage/AccountTab/AccountTab";
import OrderHistory from "../../../components/UserPages/ProfilePage/OrderHistory/OrderHistory";

const { TabPane } = Tabs;

const userData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "1234567890",
  picture: null,
  loyaltyPoints: 320,
};

const orderHistory = [
  {
    id: 1,
    date: "Tuesday, 07 July 2020 - 04:30pm",
    movie: "Spider-Man: Homecoming",
    cinemaLogo: "https://via.placeholder.com/50x21?text=CineOne",
    status: "active",
  },
  {
    id: 2,
    date: "Monday, 14 June 2020 - 02:00pm",
    movie: "Avengers: End Game",
    cinemaLogo: "https://via.placeholder.com/50x43?text=EBV",
    status: "used",
  },
  {
    id: 3,
    date: "Monday, 10 March 2020 - 04:00pm",
    movie: "Thor: Ragnarok",
    cinemaLogo: "https://via.placeholder.com/50x43?text=EBV",
    status: "used",
  },
];

const Profile = () => {
  return (
    <div className={styles.profile}>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} md={8}>
          <InfoCard userData={userData} />
        </Col>
        <Col xs={24} md={16}>
          <Card className={styles.accountCard}>
            <Tabs defaultActiveKey="settings" className={styles.tabs}>
              <TabPane tab="Account Settings" key="settings">
                <AccountTab userData={userData} />
              </TabPane>
              <TabPane tab="Order History" key="history">
                <OrderHistory orderHistory={orderHistory} />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
