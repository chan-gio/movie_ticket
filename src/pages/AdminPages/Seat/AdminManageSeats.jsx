/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Typography, Tag, Space, InputNumber, Select, Spin } from 'antd';
import { toastSuccess, toastError, toastInfo, toastWarning } from '../../../utils/toastNotifier';
import SeatService from '../../../services/SeatService';
import RoomService from '../../../services/RoomService';
import styles from './AdminManageSeats.module.scss';
import '../GlobalStyles.module.scss';
import { Fragment } from 'react';

const { Title, Paragraph, Text: TypographyText } = Typography;
const { Option } = Select;

function AdminManageSeats() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [seats, setSeats] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(14);
  const [initialRows, setInitialRows] = useState(0);
  const [initialCols, setInitialCols] = useState(14);
  const [seatMap, setSeatMap] = useState({});
  const [seatIdMap, setSeatIdMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedType, setSelectedType] = useState('STANDARD');
  const [loading, setLoading] = useState(true);
  const [savingGrid, setSavingGrid] = useState(false);
  const [savingSeats, setSavingSeats] = useState(false);
  const [savingSeatType, setSavingSeatType] = useState(false);
  const [firstRowIndex, setFirstRowIndex] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const roomResponse = await RoomService.getRoomById(roomId);
        setRoom(roomResponse);

        const seatResponse = await SeatService.getSeatByRoomId(roomId);
        const fetchedSeats = seatResponse.data || [];

        if (fetchedSeats.length === 0) {
          setRows(0);
          setCols(14);
          setInitialRows(0);
          setInitialCols(14);
          setSeatMap({});
          setSeatIdMap({});
          setFirstRowIndex(1);
        } else {
          const initialSeatMap = {};
          const initialSeatIdMap = {};
          fetchedSeats.forEach(seat => {
            initialSeatMap[seat.seat_number] = seat.seat_type;
            initialSeatIdMap[seat.seat_number] = seat.seat_id;
          });

          let minRow = Infinity;
          let maxRow = 0;
          let maxCol = 0;
          fetchedSeats.forEach(seat => {
            const rowChar = seat.seat_number.match(/^[A-Z]+/)[0];
            const col = parseInt(seat.seat_number.match(/\d+$/)[0]);
            const rowIndex = rowChar.split('').reduce((acc, char) => {
              return acc * 26 + (char.charCodeAt(0) - 64);
            }, 0);
            minRow = Math.min(minRow, rowIndex);
            maxRow = Math.max(maxRow, rowIndex);
            maxCol = Math.max(maxCol, col);
          });

          const numRows = maxRow > 0 ? maxRow - minRow + 1 : 1;
          const numCols = maxCol || 14;
          setFirstRowIndex(minRow === Infinity ? 1 : minRow);
          setRows(numRows);
          setCols(numCols);
          setInitialRows(numRows);
          setInitialCols(numCols);
          setSeatMap(initialSeatMap);
          setSeatIdMap(initialSeatIdMap);
        }
        setSeats(fetchedSeats);
      } catch (error) {
        toastError(error.message || 'Failed to load room or seats data');
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
    toastInfo('Selection cleared');
  };

  const applySeatType = async () => {
    if (selectedSeats.length === 0) {
      toastWarning('Please select at least one seat to apply the type.');
      return;
    }

    // Kiểm tra khi áp dụng loại COUPLE
    if (selectedType === 'COUPLE') {
      for (const seat of selectedSeats) {
        const row = seat.match(/^[A-Z]+/)[0];
        const col = parseInt(seat.match(/\d+$/)[0]);

        if (col % 2 === 1) { // Cột lẻ (1, 3, 5, ...)
          const rightSeat = `${row}${col + 1}`;
          if (!selectedSeats.includes(rightSeat) || col + 1 > cols) {
            toastError('Vui lòng chọn hai ghế cạnh nhau để apply type couple');
            return;
          }
        } else { // Cột chẵn (2, 4, 6, ...)
          const leftSeat = `${row}${col - 1}`;
          if (!selectedSeats.includes(leftSeat) || col - 1 < 1) {
            toastError('Vui lòng chọn hai ghế cạnh nhau để apply type couple');
            return;
          }
        }
      }
    }

    setSavingSeatType(true);
    try {
      const updatedMap = { ...seatMap };
      const updatePromises = selectedSeats.map(async (seat) => {
        const seatId = seatIdMap[seat];
        if (!seatId) {
          throw new Error(`Seat ID not found for seat ${seat}`);
        }
        await SeatService.updateSeat(seatId, { seat_type: selectedType });
        updatedMap[seat] = selectedType;
      });

      await Promise.all(updatePromises);
      setSeatMap(updatedMap);
      setSelectedSeats([]);
      toastSuccess(`Applied ${selectedType} to ${selectedSeats.length} seat(s)`);
    } catch (error) {
      toastError(error.message || 'Failed to apply seat type');
    } finally {
      setSavingSeatType(false);
    }
  };

  const handleSaveGridSize = async () => {
    if (rows === initialRows && cols === initialCols) {
      toastWarning('No changes to grid size.');
      return;
    }

    setSavingGrid(true);
    try {
      const newSeats = [];
      const updatedSeatMap = { ...seatMap };
      const updatedSeatIdMap = { ...seatIdMap };
      let changesMade = false;

      if (rows > initialRows) {
        const newRowCount = rows - initialRows;
        const newRowLabels = Array.from({ length: newRowCount }, (_, i) => {
          let num = firstRowIndex + initialRows + i;
          let label = '';
          while (num > 0) {
            num--;
            label = String.fromCharCode(65 + (num % 26)) + label;
            num = Math.floor(num / 26);
          }
          return label;
        });

        for (const prefix of newRowLabels) {
          const seatData = {
            room_id: roomId,
            prefix,
            start_index: 1,
            end_index: cols,
            seat_type: 'STANDARD',
          };
          const createdSeats = await SeatService.createBatchSeats(seatData);
          newSeats.push(...createdSeats);
          createdSeats.forEach(seat => {
            updatedSeatMap[seat.seat_number] = seat.seat_type;
            updatedSeatIdMap[seat.seat_number] = seat.seat_id;
          });
        }
        changesMade = true;
      }

      if (cols > initialCols) {
        const newColCount = cols - initialCols;
        const rowLabels = Array.from({ length: rows }, (_, i) => {
          let num = firstRowIndex + i;
          let label = '';
          while (num > 0) {
            num--;
            label = String.fromCharCode(65 + (num % 26)) + label;
            num = Math.floor(num / 26);
          }
          return label;
        });

        for (const prefix of rowLabels) {
          const seatData = {
            room_id: roomId,
            prefix,
            start_index: initialCols + 1,
            end_index: cols,
            seat_type: 'STANDARD',
          };
          const createdSeats = await SeatService.createBatchSeats(seatData);
          newSeats.push(...createdSeats);
          createdSeats.forEach(seat => {
            updatedSeatMap[seat.seat_number] = seat.seat_type;
            updatedSeatIdMap[seat.seat_number] = seat.seat_id;
          });
        }
        changesMade = true;
      }

      if (rows < initialRows) {
        const rowsToDelete = Array.from({ length: initialRows - rows }, (_, i) => {
          let num = firstRowIndex + rows + i;
          let label = '';
          while (num > 0) {
            num--;
            label = String.fromCharCode(65 + (num % 26)) + label;
            num = Math.floor(num / 26);
          }
          return label;
        });

        const deleteRowPromises = rowsToDelete.map(async (prefix) => {
          const seatsInRow = seats.filter(seat => seat.seat_number.startsWith(prefix));
          if (seatsInRow.length === 0) return;

          const maxCol = Math.max(...seatsInRow.map(seat => parseInt(seat.seat_number.match(/\d+$/)[0])));
          await SeatService.softDeleteBatchSeats({
            room_id: roomId,
            prefix,
            start_index: 1,
            end_index: maxCol,
          });
        });

        await Promise.all(deleteRowPromises);
        changesMade = true;
      }

      if (cols < initialCols) {
        const rowLabels = Array.from({ length: initialRows }, (_, i) => {
          let num = firstRowIndex + i;
          let label = '';
          while (num > 0) {
            num--;
            label = String.fromCharCode(65 + (num % 26)) + label;
            num = Math.floor(num / 26);
          }
          return label;
        });

        const deleteColPromises = rowLabels.map(async (prefix) => {
          const seatsInRow = seats.filter(seat => seat.seat_number.startsWith(prefix));
          if (seatsInRow.length === 0) return;

          await SeatService.softDeleteBatchSeats({
            room_id: roomId,
            prefix,
            start_index: cols + 1,
            end_index: initialCols,
          });
        });

        await Promise.all(deleteColPromises);
        changesMade = true;
      }

      if (!changesMade) {
        toastWarning('No changes to grid size were applied.');
        setSavingGrid(false);
        return;
      }

      const response = await SeatService.getSeatByRoomId(roomId);
      const fetchedSeats = response.data || [];
      const updatedSeatMapFinal = {};
      const updatedSeatIdMapFinal = {};
      fetchedSeats.forEach(seat => {
        updatedSeatMapFinal[seat.seat_number] = seat.seat_type;
        updatedSeatIdMapFinal[seat.seat_number] = seat.seat_id;
      });

      let minRow = Infinity;
      let maxRow = 0;
      let maxCol = 0;
      fetchedSeats.forEach(seat => {
        const rowChar = seat.seat_number.match(/^[A-Z]+/)[0];
        const col = parseInt(seat.seat_number.match(/\d+$/)[0]);
        const rowIndex = rowChar.split('').reduce((acc, char) => {
          return acc * 26 + (char.charCodeAt(0) - 64);
        }, 0);
        minRow = Math.min(minRow, rowIndex);
        maxRow = Math.max(maxRow, rowIndex);
        maxCol = Math.max(maxCol, col);
      });

      const numRows = maxRow > 0 ? maxRow - minRow + 1 : (rows || 1);
      const numCols = maxCol || 14;
      setFirstRowIndex(minRow === Infinity ? 1 : minRow);
      setRows(numRows);
      setCols(numCols);
      setInitialRows(numRows);
      setInitialCols(numCols);
      setSeats(fetchedSeats);
      setSeatMap(updatedSeatMapFinal);
      setSeatIdMap(updatedSeatIdMapFinal);
      setSelectedSeats([]);

      let message = 'Grid size updated successfully';
      if (rows < initialRows) message += `; deleted ${initialRows - rows} row(s)`;
      if (cols < initialCols) message += `; deleted ${initialCols - cols} column(s)`;
      if (rows > initialRows || cols > initialCols) message += `; added new seats`;
      toastSuccess(message);
    } catch (error) {
      toastError(error.message || 'Failed to update grid size');
    } finally {
      setSavingGrid(false);
    }
  };

  const handleResetGridSize = () => {
    setRows(initialRows);
    setCols(initialCols);
    toastInfo('Grid size reset to initial values');
  };

  const generateSeatGrid = () => {
    const rowLabels = Array.from({ length: rows }, (_, i) => {
      let num = firstRowIndex + i;
      let label = '';
      while (num > 0) {
        num--;
        label = String.fromCharCode(65 + (num % 26)) + label;
        num = Math.floor(num / 26);
      }
      return label;
    });
    const colLabels = Array.from({ length: cols }, (_, i) => i + 1);
    return { rowLabels, colLabels };
  };

  const handleSave = async () => {
    setSavingSeats(true);
    try {
      const seatGroups = [];
      const rowLabels = Array.from({ length: rows }, (_, i) => {
        let num = firstRowIndex + i;
        let label = '';
        while (num > 0) {
          num--;
          label = String.fromCharCode(65 + (num % 26)) + label;
          num = Math.floor(num / 26);
        }
        return label;
      });

      rowLabels.forEach(prefix => {
        const seatsInRow = Object.entries(seatMap).filter(([seatNumber]) => seatNumber.startsWith(prefix));
        const typeGroups = {};

        seatsInRow.forEach(([seatNumber, seatType]) => {
          if (seatType === 'UNAVAILABLE') return;
          if (!typeGroups[seatType]) {
            typeGroups[seatType] = [];
          }
          typeGroups[seatType].push(parseInt(seatNumber.replace(prefix, '')));
        });

        Object.entries(typeGroups).forEach(([seatType, indices]) => {
          if (indices.length === 0) return;
          indices.sort((a, b) => a - b);
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

      await SeatService.storeMultipleSeats({
        room_id: roomId,
        seats: seatGroups,
      });
      const response = await SeatService.getSeatByRoomId(roomId);
      const fetchedSeats = response.data || [];
      const updatedSeatMap = {};
      const updatedSeatIdMap = {};
      fetchedSeats.forEach(seat => {
        updatedSeatMap[seat.seat_number] = seat.seat_type;
        updatedSeatIdMap[seat.seat_number] = seat.seat_id;
      });

      let minRow = Infinity;
      let maxRow = 0;
      let maxCol = 0;
      fetchedSeats.forEach(seat => {
        const rowChar = seat.seat_number.match(/^[A-Z]+/)[0];
        const col = parseInt(seat.seat_number.match(/\d+$/)[0]);
        const rowIndex = rowChar.split('').reduce((acc, char) => {
          return acc * 26 + (char.charCodeAt(0) - 64);
        }, 0);
        minRow = Math.min(minRow, rowIndex);
        maxRow = Math.max(maxRow, rowIndex);
        maxCol = Math.max(maxCol, col);
      });

      const numRows = maxRow > 0 ? maxRow - minRow + 1 : (rows || 1);
      setFirstRowIndex(minRow === Infinity ? 1 : minRow);
      setRows(numRows);
      setCols(maxCol || 14);
      setInitialRows(numRows);
      setInitialCols(maxCol);
      setSeats(fetchedSeats);
      setSeatMap(updatedSeatMap);
      setSeatIdMap(updatedSeatIdMap);
      toastSuccess('Seat configuration saved successfully');
    } catch (error) {
      toastError(error.message || 'Failed to save seats');
    } finally {
      setSavingSeats(false);
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
            Manage Seats - {room.cinema.name} - {room.room_name}
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
        <Col xs={24} lg={16}>
          <Card className={styles.seatCard} hoverable>
            <Title level={4} className={styles.sectionTitle}>
              Seat Grid
            </Title>
            <Row gutter={[16, 16]} className={styles.controls}>
              <Col>
                <TypographyText className={styles.label}>Number of Rows:</TypographyText>
                <InputNumber
                  min={0}
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
                <Button
                  type="primary"
                  onClick={handleSaveGridSize}
                  className={styles.saveGridButton}
                  loading={savingGrid}
                >
                  Save Grid Size
                </Button>
                <Button
                  onClick={handleResetGridSize}
                  className={styles.resetGridButton}
                >
                  Reset Grid Size
                </Button>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className={styles.seatTypeControls}>
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
                  <Option value="UNAVAILABLE">Unavailable</Option>
                </Select>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={applySeatType}
                  className={styles.applyButton}
                  loading={savingSeatType}
                >
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
                        const seatType = seatMap[seat] || null;
                        const isNotAvailable = seatType === 'UNAVAILABLE';
                        const isSelected = selectedSeats.includes(seat);
                        return (
                          <Fragment key={seat}>
                            <td>
                              {seatType ? (
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
                              ) : (
                                <Button
                                  className={`${styles.seat} ${isSelected ? styles.seatSelected : ''}`}
                                  onClick={() => toggleSeatSelection(seat)}
                                >
                                  {col}
                                </Button>
                              )}
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
                  onClick={() => navigate(-1)}
                  className={styles.backButton}
                >
                  Back to Rooms
                </Button>
              </Col>
              
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className={styles.infoCard} hoverable>
            <Title level={4} className={styles.sectionTitle}>
              Room Information
            </Title>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Cinema Name</TypographyText>
              <TypographyText className={styles.value}>{room.cinema.name}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Room Name</TypographyText>
              <TypographyText className={styles.value}>{room.room_name}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Total Seats</TypographyText>
              <TypographyText className={styles.value}>{Object.values(seatMap).filter(type => type && type !== 'UNAVAILABLE').length}</TypographyText>
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
              <TypographyText className={styles.value}>{Object.values(seatMap).filter(type => type === 'UNAVAILABLE').length}</TypographyText>
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