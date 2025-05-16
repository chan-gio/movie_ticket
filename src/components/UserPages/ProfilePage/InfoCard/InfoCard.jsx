import { Card, Avatar, Typography, Progress, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./InfoCard.module.scss";

const { Title, Paragraph } = Typography;

const InfoCard = ({ userData }) => {
  return (
    <Card className={styles.infoCard}>
      <div className={styles.infoHeader}>
        <Paragraph className={styles.infoLabel}>INFO</Paragraph>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.0013 16.3333C15.29 16.3333 16.3346 15.2887 16.3346 14C16.3346 12.7113 15.29 11.6667 14.0013 11.6667C12.7126 11.6667 11.668 14C11.668 15.2887 12.7126 16.3333 14.0013 16.3333Z"
            fill="#5F2EEA"
          />
          <path
            d="M22.1654 16.3333C23.454 16.3333 24.4987 15.2887 24.4987 14C24.4987 12.7113 23.454 11.6667 22.1654 11.6667C20.8767 11.6667 19.832 14C19.832 15.2887 20.8767 16.3333 22.1654 16.3333Z"
            fill="#5F2EEA"
          />
          <path
            d="M5.83333 16.3333C7.122 16.3333 8.16667 15.2887 8.16667 14C8.16667 12.7113 7.122 11.6667 5.83333 11.6667C4.54467 11.6667 3.5 14C3.5 15.2887 4.54467 16.3333 5.83333 16.3333Z"
            fill="#5F2EEA"
          />
        </svg>
      </div>
      <div className={styles.profileInfo}>
        <Avatar
          size={150}
          src={
            userData.picture ||
            "https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"
          }
          icon={<UserOutlined />}
          className={styles.profileImage}
        />
        <Title level={4} className={styles.userName}>
          {userData.firstName} {userData.lastName}
        </Title>
        <Paragraph className={styles.userRole}>Moviegoers</Paragraph>
      </div>
      <div className={styles.divider} />
      <div className={styles.loyaltySection}>
        <Paragraph className={styles.loyaltyLabel}>Loyalty Points</Paragraph>
        <Card className={styles.loyaltyCard}>
          <Title level={5} className={styles.loyaltyTitle}>
            Moviegoers
          </Title>
          <Space>
            <Paragraph className={styles.points}>
              {userData.loyaltyPoints}
            </Paragraph>
            <Paragraph className={styles.pointsLabel}>points</Paragraph>
          </Space>
        </Card>
        <Paragraph className={styles.progressText}>
          180 points become a master
        </Paragraph>
        <Progress
          percent={(userData.loyaltyPoints / 500) * 100}
          showInfo={false}
          strokeColor="#5f2eea"
          className={styles.progressBar}
        />
      </div>
    </Card>
  );
};

export default InfoCard;
