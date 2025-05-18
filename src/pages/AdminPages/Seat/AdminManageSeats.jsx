import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Typography, Tag, Space, InputNumber, message, Select, Spin } from 'antd';
import axios from 'axios';
import styles from './AdminManageSeats.module.scss';
import '../GlobalStyles.module.scss';
import { Fragment } from 'react';

const { Title, Paragraph, Text: TypographyText } = Typography;
const { Option } = Select;

// API base URL (replace with your backend URL)
const API_BASE_URL = 'http://your-backend-api-url';

// Fetch seats for a room
const fetchSeats = async (roomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/seats`, {
      params: { room_id: roomId },
    });
    return response.data.data; // Assuming the API returns seats in response.data.data
  } catch (error) {
    message.error('Failed to fetch seats');
    return [];
  }
};

// Save seats using storeMultiple endpoint
const saveSeats = async (roomId, seatGroups) => {
  try {
    for (const group of seatGroups) {
      const response = await axios.post(`${API_BASE_URL}/seats/store-multiple`, {
        room_id: roomId,
        prefix: group.prefix,
        start_index: group.start_index,
        end_index: group.end_index,
        seat_type: group.seat_type,
      });
      if (response.status !== 201) {
        message.warning(`Some seats in ${group.prefix} were not created (possibly already exist)`);
      }
    }
    message.success('Seat configuration saved successfully');
  } catch (error) {
    message.error('Failed to save seats');
    throw error;
  }
};

// Mock API call to fetch room details (replace with real API if needed)
const fetchRoomById = async (id) => {
  const rooms = [
    { room_id: 'r1', room_name: 'Room 1', cinema_id: 'c1', cinema_name: 'Cinema 1' },
    { room_id: 'r2', room_name: 'Room 2', cinema_id: 'c1', cinema_name: 'Cinema 1' },
    { room_id: 'r3', room_name: 'Room 1', cinema_id: 'c2', cinema_name: 'Cinema 2' },
    { room_id: 'r4', room_name: 'Room 2', cinema_id: 'c2', cinema_name: 'Cinema 2' },
  ];
  return rooms.find(room => room.room_id === id);
};

function AdminManageSeats() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [seats, setSeats] = useState([]);
  const [rows, setRows] = useState(7); // Default number of rows
  const [cols, setCols] = useState(14); // Default number of columns
  const [seatMap, setSeatMap] = useState({}); // Map of seat types (e.g., { 'A1': 'STANDARD', 'A2': 'VIP' })
  const [selectedSeats, setSelectedSeats] = useState([]); // Track selected seats
  const [selectedType, setSelectedType] = useState('STANDARD'); // Track the type to apply
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedRoom = await fetchRoomById(roomId);
        setRoom(fetchedRoom);
        const fetchedSeats = await fetchSeats(roomId);
        const initialSeatMap = {};
        fetchedSeats.forEach(seat => {
          initialSeatMap[seat.seat_number] = seat.seat_type;
        });
        setSeats(fetchedSeats);
        setSeatMap(initialSeatMap);
      } catch (error) {
        message.error('Failed to load room data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [roomId]);

  const toggleSeatSelection = (seat) => {
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const clearSelection = () => {
    setSelectedSeats([]);
    message.info('Selection cleared');
  };

  const applySeatType = () => {
    if (selectedSeats.length === 0) {
      message.warning('Please select at least one seat to apply the type.');
      return;
    }
    setSeatMap(prev => {
      const updatedMap = { ...prev };
      selectedSeats.forEach(seat => {
        updatedMap[seat] = selectedType;
      });
      return updatedMap;
    });
    setSelectedSeats([]); // Clear selection after applying
    message.success(`Applied ${selectedType} to ${selectedSeats.length} seat(s)`);
  };

  const generateSeatGrid = () => {
    const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i)); // A, B, C, ...
    const colLabels = Array.from({ length: cols }, (_, i) => i + 1); // 1, 2, 3, ...
    return { rowLabels, colLabels };
  };

  const handleSave = async () => {
    // Group seats by prefix (row) and type for storeMultiple
    const seatGroups = [];
    const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));

    rowLabels.forEach(prefix => {
      const seatsInRow = Object.entries(seatMap).filter(([seatNumber]) => seatNumber.startsWith(prefix));
      const typeGroups = {};

      seatsInRow.forEach(([seatNumber, seatType]) => {
        if (seatType === 'NOT_AVAILABLE') return; // Skip Not Available seats
        if (!typeGroups[seatType]) {
          typeGroups[seatType] = [];
        }
        typeGroups[seatType].push(parseInt(seatNumber.replace(prefix, '')));
      });

      Object.entries(typeGroups).forEach(([seatType, indices]) => {
        if (indices.length === 0) return;
        indices.sort((a, b) => a - b); // Sort indices for continuous ranges
        let start = indices[0];
        let end = start;
        const ranges = [];

        for (let i = 1; i < indices.length; i++) {
          if (indices[i] === end + 1) {
            end = indices[i];
          } else {
            ranges.push({ start_index: start, end_index: end });
            start = indices[i];
            end = start;
          }
        }
        ranges.push({ start_index: start, end_index: end });

        ranges.forEach(range => {
          seatGroups.push({
            prefix,
            start_index: range.start_index,
            end_index: range.end_index,
            seat_type: seatType,
          });
        });
      });
    });

    try {
      await saveSeats(roomId, seatGroups);
      // Refresh seats after saving
      const fetchedSeats = await fetchSeats(roomId);
      const updatedSeatMap = {};
      fetchedSeats.forEach(seat => {
        updatedSeatMap[seat.seat_number] = seat.seat_type;
      });
      setSeats(fetchedSeats);
      setSeatMap(updatedSeatMap);
    } catch (error) {
      // Error handling is already done in saveSeats
    }
  };

  const { rowLabels, colLabels } = generateSeatGrid();

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className={styles.error}>
        Room not found
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Manage Seats - {room.cinema_name} - {room.room_name}
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => navigate('/admin/manage_cinema')}
            className={styles.backButton}
          >
            Back to Cinemas
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.mainContent}>
        {/* Seat Grid */}
        <Col xs={24} lg={16}>
          <Card className={styles.seatCard} hoverable>
            <Row gutter={[16, 16]} className={styles.controls}>
              <Col>
                <TypographyText className={styles.label}>Number of Rows:</TypographyText>
                <InputNumber
                  min={1}
                  value={rows}
                  onChange={value => setRows(value)}
                  className={styles.inputNumber}
                />
              </Col>
              <Col>
                <TypographyText className={styles.label}>Number of Columns:</TypographyText>
                <InputNumber
                  min={1}
                  value={cols}
                  onChange={value => setCols(value)}
                  className={styles.inputNumber}
                />
              </Col>
              <Col>
                <TypographyText className={styles.label}>Select Seat Type:</TypographyText>
                <Select
                  value={selectedType}
                  onChange={setSelectedType}
                  className={styles.select}
                >
                  <Option value="STANDARD">Standard</Option>
                  <Option value="VIP">VIP</Option>
                  <Option value="COUPLE">Couple</Option>
                  <Option value="NOT_AVAILABLE">Not Available</Option>
                </Select>
              </Col>
              <Col>
                <Button type="primary" onClick={applySeatType} className={styles.applyButton}>
                  Apply Type
                </Button>
              </Col>
              <Col>
                <Button onClick={clearSelection} className={styles.clearButton}>
                  Clear Selection
                </Button>
              </Col>
            </Row>
            <div className={styles.screen}>
              <Paragraph className={styles.screenText}>Screen</Paragraph>
              <div className={styles.screenLine}></div>
            </div>
            <div className={styles.seatGrid}>
              <table>
                <tbody>
                  {rowLabels.map((row) => (
                    <tr key={row}>
                      <td className={styles.rowLabel}>{row}</td>
                      {colLabels.map((col) => {
                        const seat = `${row}${col}`;
                        const seatType = seatMap[seat] || 'STANDARD';
                        const isNotAvailable = seatType === 'NOT_AVAILABLE';
                        const isSelected = selectedSeats.includes(seat);
                        return (
                          <Fragment key={seat}>
                            <td>
                              <Button
                                className={`${styles.seat} ${
                                  isSelected ? styles.seatSelected :
                                  isNotAvailable ? styles.seatNotAvailable :
                                  seatType === 'VIP' ? styles.seatVip :
                                  seatType === 'COUPLE' ? styles.seatCouple : ''
                                }`}
                                onClick={() => toggleSeatSelection(seat)}
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
                    {colLabels.map((col) => (
                      <Fragment key={col}>
                        <td className={styles.colLabel}>{col}</td>
                      </Fragment>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <Title level={4} className={styles.seatingKeyTitle}>
              Seating Key
            </Title>
            <Row gutter={[16, 16]} className={styles.seatingKey}>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.availableBox}></Tag>
                  <Paragraph className={styles.keyLabel}>Standard</Paragraph>
                </Space>
              </Col>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.selectBox}></Tag>
                  <Paragraph className={styles.keyLabel}>Selected</Paragraph>
                </Space>
              </Col>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.vipBox}></Tag>
                  <Paragraph className={styles.keyLabel}>VIP</Paragraph>
                </Space>
              </Col>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.loveBox}></Tag>
                  <Paragraph className={styles.keyLabel}>Couple</Paragraph>
                </Space>
              </Col>
              <Col xs={12} sm={5}>
                <Space>
                  <Tag className={styles.notAvailableBox}></Tag>
                  <Paragraph className={styles.keyLabel}>Not Available</Paragraph>
                </Space>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className={styles.actionButtons}>
              <Col xs={24} md={12}>
                <Button
                  block
                  onClick={() => navigate('/admin/manage_cinema')}
                  className={styles.backButton}
                >
                  Back to Cinemas
                </Button>
              </Col>
              <Col xs={24} md={12}>
                <Button
                  type="primary"
                  block
                  onClick={handleSave}
                  className={styles.saveButton}
                >
                  Save Changes
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Room Info */}
        <Col xs={24} lg={8}>
          <Card className={styles.infoCard} hoverable>
            <Title level={4} className={styles.sectionTitle}>
              Room Information
            </Title>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Cinema Name</TypographyText>
              <TypographyText className={styles.value}>{room.cinema_name}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Room Name</TypographyText>
              <TypographyText className={styles.value}>{room.room_name}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Total Seats</TypographyText>
              <TypographyText className={styles.value}>{Object.values(seatMap).filter(type => type !== 'NOT_AVAILABLE').length}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Standard Seats</TypographyText>
              <TypographyText className={styles.value}>{Object.values(seatMap).filter(type => type === 'STANDARD').length}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>VIP Seats</TypographyText>
              <TypographyText className={styles.value}>{Object.values(seatMap).filter(type => type === 'VIP').length}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Couple Seats</TypographyText>
              <TypographyText className={styles.value}>{Object.values(seatMap).filter(type => type === 'COUPLE').length}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Not Available Seats</TypographyText>
              <TypographyText className={styles.value}>{Object.values(seatMap).filter(type => type === 'NOT_AVAILABLE').length}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Selected Seats</TypographyText>
              <TypographyText className={styles.value}>{selectedSeats.length}</TypographyText>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminManageSeats;