import { Row, Col, Card, Tabs, Radio, Typography } from 'antd';
import styles from './SalesCharts.module.scss';

const { TabPane } = Tabs;
const { Text } = Typography;

function SalesCharts({ salesData }) {
  return (
    <div>
      <Card className={styles.chartCard}>
        <Tabs defaultActiveKey="movie">
          <TabPane tab="Based on Movie" key="movie">
            <Row gutter={[16, 16]}>
              {salesData.map((data, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card className={styles.salesCard}>
                    <Text>{data.movie}</Text>
                    <Radio.Group defaultValue="Weekly" className={styles.timePeriod}>
                      <Radio.Button value="Weekly">Weekly</Radio.Button>
                      <Radio.Button value="Monthly">Monthly</Radio.Button>
                      <Radio.Button value="Yearly">Yearly</Radio.Button>
                    </Radio.Group>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane tab="Based on Location" key="location">
            <Row gutter={[16, 16]}>
              {salesData.map((data, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card className={styles.salesCard}>
                    <Text>{data.movie}</Text>
                    <Radio.Group defaultValue="Weekly" className={styles.timePeriod}>
                      <Radio.Button value="Weekly">Weekly</Radio.Button>
                      <Radio.Button value="Monthly">Monthly</Radio.Button>
                      <Radio.Button value="Yearly">Yearly</Radio.Button>
                    </Radio.Group>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default SalesCharts;