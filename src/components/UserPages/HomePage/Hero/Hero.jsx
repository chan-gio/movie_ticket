import { Row, Col, Typography, Skeleton } from "antd";
import { Link } from "react-router-dom";
import styles from "./Hero.module.scss";
import { useSettings } from "../../../../hooks/useSettings";

const { Title, Paragraph } = Typography;

function Hero() {
  const { data: settings, isLoading, error } = useSettings();

  // Get the banner images
  const bannerImages = () => {
    if (!settings?.banner || !Array.isArray(settings.banner)) return [];
    return settings.banner;
  };

  const images = bannerImages();

  if (error) {
    return <div className={styles.heroContainer}>Error loading banners: {error.message}</div>;
  }

  return (
    <div className={styles.heroContainer}>
      <section className={styles.hero}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <div className={styles.heroSubtitleContainer}>
              <Paragraph className={styles.heroSubtitle}>
                Nearest Cinema, Newest Movie,
              </Paragraph>
              <Title className={styles.heroTitle}>Find out now!</Title>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <div className={styles.imageContainer}>
              {isLoading ? (
                <div className={styles.skeletonContainer}>
                  {[...Array(4)].map((_, idx) => (
                    <Skeleton.Image
                      key={idx}
                      active
                      className={styles.skeletonImage}
                      style={{ width: 110, height: 350 }}
                    />
                  ))}
                </div>
              ) : images.length > 0 ? (
                images.map((url, idx) => (
                  <Link
                    key={idx}
                    className={styles.imgGradient}
                  >
                    <img
                      src={url}
                      alt={`Banner ${idx + 1}`}
                      className={styles.heroImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </Link>
                ))
              ) : (
                <div className={styles.skeletonContainer}>
                  {[...Array(4)].map((_, idx) => (
                    <Skeleton.Image
                      key={idx}
                      active
                      className={styles.skeletonImage}
                      style={{ width: 110, height: 350 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
}

export default Hero;