import { Card, Typography, Form, Input, Button } from "antd";
import styles from "./Subscribe.module.scss";

const { Title, Paragraph } = Typography;

function Subscribe() {
  return (
    <section className={styles.section}>
      <Card className={styles.subscribeCard}>
        <Paragraph className={styles.subscribeText}>
          Be the vanguard of the
        </Paragraph>
        <Title level={3} className={styles.subscribeTitle}>
          Moviegoers
        </Title>
        <Form layout="inline" className={styles.subscribeForm}>
          <Form.Item>
            <Input
              placeholder="Type your email"
              className={styles.subscribeInput}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.subscribeButton}
            >
              Join now
            </Button>
          </Form.Item>
        </Form>
        <Paragraph className={styles.subscribeFooter}>
          By joining you as a Tickitz member, <br />
          we will always send you the latest updates via email.
        </Paragraph>
      </Card>
    </section>
  );
}

export default Subscribe;
