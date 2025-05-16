import { Link } from "react-router-dom";
import { Card, Row, Col, Button, Typography, Tag, Space } from "antd";
import styles from "./SeatSelection.module.scss";
import { Fragment, useState } from "react";

const { Title, Paragraph } = Typography;

const orderInfo = {
  movieTitle: "Movie 1",
  cinema: "Cinema 1",
  picture:
    "https://statics.vincom.com.vn/http/vincom-ho/thuong_hieu/anh_logo/CGV-Cinemas.png/8e6196f9adbc621156a5519c267b3e93.webp",
  date: "2025-05-15",
  time: "2:00 PM",
  price: 10,
};

const rows = ["A", "B", "C", "D", "E", "F", "G"];
const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={styles.seatSelection}>
      {/* Secondary Navbar */}
      <div className={styles.secondaryNavbar}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} className={styles.movieTitle}>
              {orderInfo.movieTitle}
            </Title>
          </Col>
          <Col>
            <Link to="/">
              <Button className={styles.changeButton}>Change movie</Button>
            </Link>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <Row gutter={[16, 16]} className={styles.mainContent}>
        {/* Seat Selection */}
        <Col xs={24} lg={16}>
          <Title level={3}>Choose Your Seat</Title>
          <Card className={styles.seatCard}>
            <div className={styles.screen}>
              <Paragraph className={styles.screenText}>Screen</Paragraph>
              <div className={styles.screenLine}></div>
            </div>
            <div className={styles.seatGrid}>
              <table>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row}>
                      <td>{row}</td>
                      {cols.map((col) => {
                        const seat = `${row}${col}`;
                        const isSelected = selectedSeats.includes(seat);
                        return (
                          <Fragment key={seat}>
                            
                            <td>
                              <Button
                                className={`${styles.seat} ${
                                  isSelected ? styles.seatSelected : ""
                                }`}
                                onClick={() => toggleSeat(seat)}
                              >
                                {col}
                              </Button>
                            </td>
                          </Fragment>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    {cols.map((col) => (
                      <Fragment key={col}>
                        

                        <td>{col}</td>
                      </Fragment>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <Title level={4} className={styles.seatingKeyTitle}>
              Seating key
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={6}>
                <Space>
                  <Tag className={styles.availableBox}></Tag>
                  <Paragraph>Available</Paragraph>
                </Space>
              </Col>
              <Col xs={6}>
                <Space>
                  <Tag className={styles.selectBox}></Tag>
                  <Paragraph>Selected</Paragraph>
                </Space>
              </Col>
              <Col xs={6}>
                <Space>
                  <Tag className={styles.loveBox}></Tag>
                  <Paragraph>Love nest</Paragraph>
                </Space>
              </Col>
              <Col xs={6}>
                <Space>
                  <Tag className={styles.soldBox}></Tag>
                  <Paragraph>Sold</Paragraph>
                </Space>
              </Col>
            </Row>
          </Card>
          <Row gutter={[16, 16]} className={styles.checkoutButtons}>
            <Col xs={24} md={12}>
              <Link to="/">
                <Button block className={styles.changeMovieButton}>
                  Change your movie
                </Button>
              </Link>
            </Col>
            <Col xs={24} md={12}>
              <Link to="/payment">
                <Button type="primary" block className={styles.checkoutButton}>
                  Checkout now
                </Button>
              </Link>
            </Col>
          </Row>
        </Col>

        {/* Order Info */}
        <Col xs={24} lg={8}>
          <Title level={3}>Order Info</Title>
          <Card className={styles.orderCard}>
            <div className={styles.cinemaInfo}>
              <img
                src={orderInfo.picture}
                alt={orderInfo.cinema}
                className={styles.cinemaLogo}
              />
              <Title level={4}>{orderInfo.cinema}</Title>
            </div>
            <Row justify="space-between">
              <Paragraph className={styles.label}>Movie selected</Paragraph>
              <Paragraph className={styles.value}>
                {orderInfo.movieTitle}
              </Paragraph>
            </Row>
            <Row justify="space-between">
              <Paragraph className={styles.label}>
                {formatDate(orderInfo.date)}
              </Paragraph>
              <Paragraph className={styles.value}>{orderInfo.time}</Paragraph>
            </Row>
            <Row justify="space-between">
              <Paragraph className={styles.label}>One ticket price</Paragraph>
              <Paragraph className={styles.value}>${orderInfo.price}</Paragraph>
            </Row>
            <Row justify="space-between">
              <Paragraph className={styles.label}>Seat choosed</Paragraph>
              <Paragraph className={styles.value}>
                {selectedSeats.join(", ") || "None"}
              </Paragraph>
            </Row>
            <div className={styles.divider} />
            <Row justify="space-between">
              <Paragraph className={styles.totalLabel}>Total Payment</Paragraph>
              <Paragraph className={styles.totalValue}>
                ${orderInfo.price * selectedSeats.length}
              </Paragraph>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SeatSelection;
