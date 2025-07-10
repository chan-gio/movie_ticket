import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Typography, Tag, Space, InputNumber, Select, Spin } from 'antd';
import { toastSuccess, toastError, toastInfo, toastWarning } from '../../../utils/toastNotifier';
import styles from './AdminManageSeats.module.scss';
import '../GlobalStyles.module.scss';
import { Fragment } from 'react';
import { 
  useRoomById, 
  useSeatsByRoomId, 
  useUpdateSeat, 
  useCreateSeats, 
  useDeleteSeats,
  useRefreshSeats,
  useUpdateMultipleSeats,
  useStoreMultipleSeats,
  useSoftDeleteBatchSeats
} from '../../../hooks/useRooms';

const { Title, Paragraph, Text: TypographyText } = Typography;
const { Option } = Select;

function AdminManageSeats() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  
  // Early return if roomId is invalid
  if (!roomId) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Typography.Title level={3} type="danger">
            Invalid room ID
          </Typography.Title>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(7);
  const [initialRows, setInitialRows] = useState(0);
  const [initialCols, setInitialCols] = useState(7);
  const [seatMap, setSeatMap] = useState({});
  const [seatIdMap, setSeatIdMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedType, setSelectedType] = useState('STANDARD');
  const [savingGrid, setSavingGrid] = useState(false);
  const [savingSeats, setSavingSeats] = useState(false);
  const [savingSeatType, setSavingSeatType] = useState(false);
  const [firstRowIndex, setFirstRowIndex] = useState(1);

  // Sử dụng custom hooks với react-query
  const { 
    data: room, 
    isLoading: isLoadingRoom, 
    error: roomError 
  } = useRoomById(roomId);

  const { 
    data: seatsData, 
    isLoading: isLoadingSeats, 
    error: seatsError 
  } = useSeatsByRoomId({ 
    roomId, 
    page: 1, 
    perPage: 1000 
  });

  const { mutate: updateSeat, isLoading: isUpdatingSeat } = useUpdateSeat();
  const { mutate: createSeats, isLoading: isCreatingSeats } = useCreateSeats();
  const { mutate: deleteSeats, isLoading: isDeletingSeats } = useDeleteSeats();
  const { mutate: refreshData, isLoading: isRefreshing } = useRefreshSeats();
  const { mutate: updateMultipleSeats, isLoading: isUpdatingMultipleSeats } = useUpdateMultipleSeats();
  const { mutate: storeMultipleSeats, isLoading: isStoringMultipleSeats } = useStoreMultipleSeats();
  const { mutate: softDeleteBatchSeats, isLoading: isSoftDeletingBatchSeats } = useSoftDeleteBatchSeats();

  // Cập nhật data từ response
  const seats = seatsData?.data || [];

  // Process seats data when it changes
  useEffect(() => {
    // Only process if seats data is available and not loading
    if (isLoadingSeats) {
      return;
    }

    // Check if seats array is actually empty (not just undefined)
    const hasSeats = Array.isArray(seats) && seats.length > 0;

    if (!hasSeats) {
      // When no seats, set default values for grid configuration
      setRows(prev => prev === 0 ? 5 : prev); // Default to 5 rows
      setCols(prev => prev === 7 ? 7 : prev); // Keep default 7 cols
      setInitialRows(prev => prev === 0 ? 5 : prev);
      setInitialCols(prev => prev === 7 ? 7 : prev);
      setSeatMap(prev => Object.keys(prev).length > 0 ? {} : prev);
      setSeatIdMap(prev => Object.keys(prev).length > 0 ? {} : prev);
      setFirstRowIndex(prev => prev !== 1 ? 1 : prev);
    } else {
      const initialSeatMap = {};
      const initialSeatIdMap = {};
      seats.forEach(seat => {
        initialSeatMap[seat.seat_number] = seat.seat_type;
        initialSeatIdMap[seat.seat_number] = seat.seat_id;
      });

      // Calculate grid dimensions from existing seats
      let minRow = Infinity;
      let maxRow = 0;
      let maxCol = 0;
      seats.forEach(seat => {
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
      const numCols = maxCol || 7;
      const newFirstRowIndex = minRow === Infinity ? 1 : minRow;
      
      // Only update state if values are different
      setFirstRowIndex(prev => prev !== newFirstRowIndex ? newFirstRowIndex : prev);
      setRows(prev => prev !== numRows ? numRows : prev);
      setCols(prev => prev !== numCols ? numCols : prev);
      setInitialRows(prev => prev !== numRows ? numRows : prev);
      setInitialCols(prev => prev !== numCols ? numCols : prev);
      setSeatMap(prev => JSON.stringify(prev) !== JSON.stringify(initialSeatMap) ? initialSeatMap : prev);
      setSeatIdMap(prev => JSON.stringify(prev) !== JSON.stringify(initialSeatIdMap) ? initialSeatIdMap : prev);
    }
  }, [seats, isLoadingSeats]);

  // Show error messages
  useEffect(() => {
    if (roomError) {
      toastError(roomError.message || 'Failed to load room data');
    }
  }, [roomError]);

  useEffect(() => {
    // Only show error for seats if it's a real error (not 404)
    if (seatsError && !seatsError.message?.includes('No seats found')) {
      toastError(seatsError.message || 'Failed to load seats data');
    }
  }, [seatsError]);

  const toggleSeatSelection = useCallback((seat) => {
    const row = seat.match(/^[A-Z]+/)[0];
    const col = parseInt(seat.match(/\d+$/)[0]);
    const seatType = seatMap[seat] || 'STANDARD';

    setSelectedSeats(prev => {
      let newSeats = [...prev];
      const isSelected = prev.includes(seat);

      if (seatType === 'COUPLE') {
        let pairSeat;
        if (col % 2 === 1) {
          pairSeat = `${row}${col + 1}`;
        } else {
          pairSeat = `${row}${col - 1}`;
        }

        const pairSeatType = seatMap[pairSeat] || 'STANDARD';
        if (pairSeatType === 'COUPLE' && col <= cols && col >= 1) {
          if (!isSelected) {
            if (!newSeats.includes(seat)) {
              newSeats.push(seat);
            }
            if (!newSeats.includes(pairSeat)) {
              newSeats.push(pairSeat);
            }
          } else {
            newSeats = newSeats.filter(s => s !== seat && s !== pairSeat);
          }
        } else {
          toastError('Cannot select couple seat: pair seat is unavailable or not a couple seat.');
          return prev;
        }
      } else {
        newSeats = isSelected
          ? newSeats.filter(s => s !== seat)
          : [...newSeats, seat];
      }

      return newSeats;
    });
  }, [seatMap, cols]);

  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
    toastInfo('Selection cleared');
  }, []);

  const applySeatType = useCallback(async () => {
    if (selectedSeats.length === 0) {
      toastWarning('Please select at least one seat to apply the type.');
      return;
    }

    if (selectedType === 'COUPLE') {
      for (const seat of selectedSeats) {
        const row = seat.match(/^[A-Z]+/)[0];
        const col = parseInt(seat.match(/\d+$/)[0]);

        if (col % 2 === 1) {
          const rightSeat = `${row}${col + 1}`;
          if (!selectedSeats.includes(rightSeat) || col + 1 > cols) {
            toastError('Please select both seats in the couple pair.');
            return;
          }
        } else {
          const leftSeat = `${row}${col - 1}`;
          if (!selectedSeats.includes(leftSeat) || col - 1 < 1) {
            toastError('Please select both seats in the couple pair.');
            return;
          }
        }
      }
    }

    setSavingSeatType(true);
    
    // Update local state immediately for better UX
    const updatedMap = { ...seatMap };
    selectedSeats.forEach(seat => {
      updatedMap[seat] = selectedType;
    });
    setSeatMap(updatedMap);
    
    // Prepare updates for the mutation
    const updates = selectedSeats.map(seat => {
      const seatId = seatIdMap[seat];
      return {
        seatId,
        data: { seat_type: selectedType }
      };
    }).filter(update => update.seatId); // Filter out seats without IDs

    // Apply updates using the mutation
    updateMultipleSeats(updates, {
      onSuccess: () => {
        setSelectedSeats([]);
        toastSuccess(`Applied ${selectedType} to ${selectedSeats.length} seat(s)`);
      },
      onError: (error) => {
        // Revert local state changes on error
        setSeatMap(seatMap);
        toastError(error.message || 'Failed to apply seat type to seats');
      },
      onSettled: () => {
        setSavingSeatType(false);
      }
    });
  }, [selectedSeats, selectedType, cols, seatMap, seatIdMap, updateMultipleSeats]);

  const handleSaveGridSize = useCallback(async () => {
    if (rows === initialRows && cols === initialCols) {
      toastWarning('No changes to grid size.');
      return;
    }

    setSavingGrid(true);

    try {
      const newSeats = [];
      const newSeatMap = {};
      const newSeatIdMap = {};

      for (let row = 0; row < rows; row++) {
        const rowChar = String.fromCharCode(65 + row + firstRowIndex - 1);
        for (let col = 1; col <= cols; col++) {
          const seatNumber = `${rowChar}${col}`;
          newSeats.push({
            room_id: roomId,
            seat_number: seatNumber,
            seat_type: 'STANDARD',
          });
          newSeatMap[seatNumber] = 'STANDARD';
        }
      }

      // Delete existing seats if any
      if (seats.length > 0) {
        const seatIds = seats.map(seat => seat.seat_id);
        
        await new Promise((resolve, reject) => {
          deleteSeats(seatIds, {
            onSuccess: () => {
              resolve();
            },
            onError: (error) => {
              reject(error);
            },
          });
        });
      }

      // Create new seats
      await new Promise((resolve, reject) => {
        createSeats(newSeats, {
          onSuccess: (response) => {
            const createdSeats = response.data || [];
            createdSeats.forEach(seat => {
              newSeatIdMap[seat.seat_number] = seat.seat_id;
            });

            setSeatMap(newSeatMap);
            setSeatIdMap(newSeatIdMap);
            setInitialRows(rows);
            setInitialCols(cols);
            
            toastSuccess(`Grid size updated to ${rows}x${cols}`);
            resolve();
          },
          onError: (error) => {
            toastError(error.message || 'Failed to create new seats');
            reject(error);
          },
        });
      });
    } catch (error) {
      toastError(error.message || 'Failed to update grid size');
    } finally {
      setSavingGrid(false);
    }
  }, [rows, initialRows, cols, initialCols, firstRowIndex, roomId, seats, deleteSeats, createSeats]);

  const handleResetGridSize = useCallback(() => {
    setRows(initialRows);
    setCols(initialCols);
    toastInfo('Grid size reset to initial values');
  }, [initialRows, initialCols]);

  const generateSeatGrid = useCallback(() => {
    // Safety checks for rows and cols
    const safeRows = Math.max(0, rows || 0);
    const safeCols = Math.max(1, cols || 1);
    
    const rowLabels = Array.from({ length: safeRows }, (_, i) => {
      let num = firstRowIndex + i;
      let label = '';
      while (num > 0) {
        num--;
        label = String.fromCharCode(65 + (num % 26)) + label;
        num = Math.floor(num / 26);
      }
      return label;
    });
    const colLabels = Array.from({ length: safeCols }, (_, i) => i + 1);
    return { rowLabels, colLabels };
  }, [rows, cols, firstRowIndex]);

  const handleSave = useCallback(async () => {
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

      storeMultipleSeats({
        room_id: roomId,
        seats: seatGroups,
      }, {
        onSuccess: () => {
          toastSuccess('Seat configuration saved successfully');
        },
        onError: (error) => {
          toastError(error.message || 'Failed to save seats');
        }
      });
    } catch (error) {
      toastError(error.message || 'Failed to save seat configuration');
    } finally {
      setSavingSeats(false);
    }
  }, [rows, firstRowIndex, seatMap, roomId, storeMultipleSeats]);

  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const isLoading = isLoadingRoom || isLoadingSeats;
  const isSubmitting = savingGrid || savingSeats || savingSeatType || isUpdatingSeat || isCreatingSeats || isDeletingSeats || isUpdatingMultipleSeats || isStoringMultipleSeats || isSoftDeletingBatchSeats;

  // Early return if still loading room data
  if (isLoadingRoom) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin size="large" />
          <Typography.Text>Loading room data...</Typography.Text>
        </div>
      </div>
    );
  }

  // Early return if there are critical errors
  if (roomError && !isLoadingRoom) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Typography.Title level={3} type="danger">
            Error loading room data: {roomError.message}
          </Typography.Title>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
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

  // Safety check for generateSeatGrid
  let rowLabels = [];
  let colLabels = [];
  try {
    const gridData = generateSeatGrid();
    rowLabels = gridData.rowLabels || [];
    colLabels = gridData.colLabels || [];
  } catch (error) {
    console.error('Error generating seat grid:', error);
    rowLabels = [];
    colLabels = [];
  }

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Manage Seats - {room?.cinema?.name || 'Loading...'} - {room?.room_name || 'Loading...'}
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
                  {rowLabels && rowLabels.length > 0 ? (
                    rowLabels.map((row) => (
                      <tr key={row}>
                        <td className={styles.rowLabel}>{row}</td>
                        {colLabels && colLabels.length > 0 ? (
                          colLabels.map((col) => {
                            const seat = `${row}${col}`;
                            const seatType = seatMap[seat] || null;
                            const isNotAvailable = seatType === 'UNAVAILABLE';
                            const isSelected = selectedSeats.includes(seat);
                            const isOddColumn = col % 2 === 1;
                            const coupleClass = seatType === 'COUPLE' ? (isOddColumn ? styles.seatCoupleOdd : styles.seatCoupleEven) : '';
                            return (
                              <Fragment key={seat}>
                                <td>
                                  {seatType ? (
                                    <Button
                                      className={`${styles.seat} ${coupleClass} ${
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
                          })
                        ) : (
                          <td colSpan="1">No columns</td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No rows configured</td>
                    </tr>
                  )}
                  {rowLabels && rowLabels.length > 0 && colLabels && colLabels.length > 0 && (
                    <tr>
                      <td></td>
                      {colLabels.map((col) => (
                        <Fragment key={col}>
                          <td className={styles.colLabel}>{col}</td>
                        </Fragment>
                      ))}
                    </tr>
                  )}
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
              <TypographyText className={styles.value}>{room?.cinema?.name || 'Loading...'}</TypographyText>
            </Row>
            <Row justify="space-between" className={styles.infoRow}>
              <TypographyText className={styles.label}>Room Name</TypographyText>
              <TypographyText className={styles.value}>{room?.room_name || 'Loading...'}</TypographyText>
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