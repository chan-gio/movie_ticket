import { Row, Col, Typography } from "antd";
import styles from "./Hero.module.scss";

const { Title, Paragraph } = Typography;

function Hero() {
  return (
    <section className={styles.hero}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Paragraph className={styles.heroSubtitle}>
            Nearest Cinema, Newest Movie,
          </Paragraph>
          <Title className={styles.heroTitle}>Find out now!</Title>
        </Col>
        <Col xs={24} md={12}>
          <div className={styles.imageContainer}>
            {[
              "https://wallpapercave.com/wp/wp1816326.jpg",
              "https://static01.nyt.com/images/2020/02/05/multimedia/05xp-lionking/merlin_165677088_8820db00-d13c-4f15-a5a4-be78b888c5b6-jumbo.jpg?quality=90&auto=webp",
              "https://wallpapercave.com/wp/wp3703396.jpg",
            ].map((src, idx) => (
              <div
                key={idx}
                className={styles.imgGradient}
                style={{ paddingTop: `${(2 - idx) * 40}px` }}
              >
                <img
                  src={src}
                  alt={`Poster ${idx + 1}`}
                  className={styles.heroImage}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default Hero;
