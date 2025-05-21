import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Space, Popconfirm, Typography, Statistic, Spin } from 'antd';
import { ReloadOutlined, UndoOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './DeletedCinemas.module.scss';
import '../GlobalStyles.module.scss';
import CinemaService from '../../../services/CinemaService';

const { Title, Text: TypographyText } = Typography;

function DeletedCinemas() {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await CinemaService.getDeletedCinemas();
      setCinemas(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to load deleted cinemas', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreCinema = async (id) => {
    setRestoring(true);
    try {
      await CinemaService.restoreCinema(id);
      setCinemas(cinemas.filter(cinema => cinema.cinema_id !== id));
      toast.success('Cinema restored successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } catch (error) {
      toast.error(error.message || 'Failed to restore cinema', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: '#5f2eea' },
      });
    } finally {
      setRestoring(false);
    }
  };

  const cinemaColumns = [
    {
      title: 'ID',
      dataIndex: 'cinema_id',
      key: 'cinema_id',
      sorter: (a, b) => a.cinema_id.localeCompare(b.cinema_id),
      render: text => <TypographyText strong>{text}</TypographyText>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure to restore this cinema?"
            onConfirm={() => handleRestoreCinema(record.cinema_id)}
            disabled={restoring}
          >
            <Button
              type="primary"
              icon={<UndoOutlined />}
              className={styles.restoreButton}
              disabled={restoring}
            >
              Restore
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Manage Deleted Cinemas
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/manage_cinema')}
              className={styles.backButton}
              disabled={restoring}
            >
              Back to Manage Cinemas
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
              className={styles.refreshButton}
              disabled={restoring}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={8}>
          <Card className={styles.statisticCard} hoverable>
            <Statistic
              title={<span className={styles.statisticTitle}>Total Deleted Cinemas</span>}
              value={cinemas.length}
              valueStyle={{ color: '#5f2eea' }}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card className={styles.tableCard}>
            {loading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : cinemas.length === 0 ? (
              <div className={styles.empty}>
                <TypographyText>No deleted cinemas found</TypographyText>
              </div>
            ) : (
              <Table
                columns={cinemaColumns}
                dataSource={cinemas}
                rowKey="cinema_id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                }}
                rowClassName={styles.tableRow}
                className={styles.table}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DeletedCinemas;