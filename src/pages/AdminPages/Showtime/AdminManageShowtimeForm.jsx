import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  message,
  Typography,
  Select,
  Spin,
  Tag,
} from "antd";
import styles from "./AdminManageShowtimeForm.module.scss";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import ShowTimeService from "../../../services/ShowtimeService";
import MovieService from "../../../services/MovieService";
import RoomService from "../../../services/RoomService";

const { Title, Text } = Typography;
const { Option } = Select;

function AdminManageShowtimeForm({ isEditMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showtimeForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]); // State for selected dates

  // Watch form field values for preview
  const movieId = Form.useWatch("movie_id", showtimeForm);
  const cinemaId = Form.useWatch("cinema_id", showtimeForm);
  const roomId = Form.useWatch("room_id", showtimeForm);
  const price = Form.useWatch("price", showtimeForm);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch movies
        const movieResponse = await MovieService.getAllMovies({ perPage: 100 });
        setMovies(movieResponse.data.filter((movie) => !movie.is_deleted));

        // Fetch rooms
        const roomData = await RoomService.getAllRooms();
        setRooms(roomData.filter((room) => !room.is_deleted));

        // Extract unique cinemas
        const uniqueCinemas = Array.from(
          new Map(
            roomData
              .filter((room) => room.cinema && !room.cinema.is_deleted)
              .map((room) => [room.cinema.cinema_id, room.cinema])
          ).values()
        );
        setCinemas(uniqueCinemas);

        // Load showtime data for edit mode
        if (isEditMode && id) {
          const showtime = await ShowTimeService.getShowTimeById(id);
          if (showtime) {
            const startTimeDayjs = showtime.start_time
              ? dayjs(showtime.start_time, "YYYY-MM-DD HH:mm:ss")
              : null;
            showtimeForm.setFieldsValue({
              movie_id: showtime.movie_id,
              cinema_id: showtime.room?.cinema?.cinema_id,
              room_id: showtime.room_id,
              start_time: startTimeDayjs,
              price: showtime.price,
            });
            setSelectedCinema(showtime.room?.cinema?.cinema_id);
          }
        } else {
          // Initialize empty dates for add mode
          showtimeForm.setFieldsValue({ start_time: null });
          setSelectedDates([]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        message.error(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEditMode, showtimeForm]);

  const handleCinemaChange = (cinemaId) => {
    setSelectedCinema(cinemaId);
    showtimeForm.setFieldsValue({ room_id: undefined });
  };

  const filteredRooms = rooms.filter(
    (room) => room.cinema_id === selectedCinema
  );

  const handleDateChange = (date, dateString) => {
    if (!isEditMode) {
      // Add new date to selectedDates if not already present
      if (date && dayjs.isDayjs(date)) {
        const dateExists = selectedDates.some((d) =>
          d.isSame(date, "minute")
        );
        if (!dateExists) {
          const newDates = [...selectedDates, date];
          setSelectedDates(newDates);
          showtimeForm.setFieldsValue({ start_time: null }); // Reset DatePicker
        }
      }
    } else {
      // Update form for edit mode
      showtimeForm.setFieldsValue({ start_time: date });
    }
  };

  const handleRemoveDate = (index) => {
    const newDates = selectedDates.filter((_, i) => i !== index);
    setSelectedDates(newDates);
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        if (!values.start_time || !dayjs.isDayjs(values.start_time)) {
          message.error("Please select a valid start time.");
          setSubmitting(false);
          return;
        }
        const showtimeData = {
          movie_id: values.movie_id,
          room_id: values.room_id,
          start_time: values.start_time.format("YYYY-MM-DD HH:mm:ss"),
          price: Number(values.price),
        };
        await ShowTimeService.updateShowTime(id, showtimeData);
        message.success("Showtime updated successfully");
      } else {
        if (!selectedDates || selectedDates.length === 0) {
          message.error("Please select at least one date.");
          setSubmitting(false);
          return;
        }

        const createShowtimePromises = selectedDates.map((date) => {
          if (!dayjs.isDayjs(date)) {
            throw new Error("Invalid date format in selectedDates");
          }
          const showtimeData = {
            movie_id: values.movie_id,
            room_id: values.room_id,
            start_time: date.format("YYYY-MM-DD HH:mm:ss"),
            price: Number(values.price),
          };
          return ShowTimeService.createShowTime(showtimeData);
        });

        await Promise.all(createShowtimePromises);
        message.success(`Successfully added ${createShowtimePromises.length} showtime(s).`);
      }

      showtimeForm.resetFields();
      setSelectedDates([]);
      navigate("/admin/manage_showtime");
    } catch (error) {
      console.error("Submit error:", error);
      const action = isEditMode ? "update" : "add";
      message.error(error.message || `Failed to ${action} showtime(s)`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Title level={3} className={styles.pageTitle}>
        {isEditMode ? "Edit Showtime" : "Add Showtime"}
      </Title>
      {loading ? (
        <div className={styles.pageTitle}>
          <Text>Loading...</Text>
        </div>
      ) : (
        <Row gutter={[16, 24]}>
          <Col xs={24} lg={16}>
            <Card className={styles.card}>
              <Form
                form={showtimeForm}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item
                  label="Movie"
                  name="movie_id"
                  rules={[{ required: true, message: "Please select a movie" }]}
                >
                  <Select
                    placeholder="Select a movie"
                    showSearch
                    optionFilterProp="children"
                  >
                    {movies.map((movie) => (
                      <Option key={movie.movie_id} value={movie.movie_id}>
                        {movie.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Cinema"
                  name="cinema_id"
                  rules={[{ required: true, message: "Please select a cinema" }]}
                >
                  <Select
                    placeholder="Select a cinema"
                    onChange={handleCinemaChange}
                    showSearch
                    optionFilterProp="children"
                  >
                    {cinemas.map((cinema) => (
                      <Option key={cinema.cinema_id} value={cinema.cinema_id}>
                        {cinema.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Room"
                  name="room_id"
                  rules={[{ required: true, message: "Please select a room" }]}
                >
                  <Select
                    placeholder="Select a room"
                    disabled={!selectedCinema}
                    showSearch
                    optionFilterProp="children"
                  >
                    {filteredRooms.map((room) => (
                      <Option key={room.room_id} value={room.room_id}>
                        {room.room_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={isEditMode ? "Start Time" : "Select Start Date(s) and Time(s)"}
                  name="start_time"
                >
                  {isEditMode ? (
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                      allowClear
                      disabledDate={disabledDate}
                      style={{ width: "100%", zIndex: 1000 }}
                      placeholder="Select a start time"
                      onChange={handleDateChange}
                    />
                  ) : (
                    <div>
                      <DatePicker
                        showTime={{ format: "HH:mm" }}
                        format="YYYY-MM-DD HH:mm"
                        allowClear
                        disabledDate={disabledDate}
                        style={{ width: "100%", zIndex: 1000 }}
                        placeholder="Select a start time"
                        value={null} // Keep DatePicker empty after each selection
                        onChange={handleDateChange}
                      />
                      {selectedDates.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          {selectedDates.map((date, index) => (
                            <Tag
                              key={index}
                              closable
                              onClose={() => handleRemoveDate(index)}
                              style={{ margin: 4 }}
                            >
                              {date.format("YYYY-MM-DD HH:mm")}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Form.Item>
                <Form.Item
                  label="Price (VNĐ)"
                  name="price"
                  rules={[
                    { required: true, message: "Please enter the price" },
                    {
                      validator: (_, value) => {
                        if (value === "" || value === null || value === undefined) {
                          return Promise.resolve();
                        }
                        const numValue = Number(value);
                        if (isNaN(numValue) || numValue < 0) {
                          return Promise.reject(
                            new Error("Price must be a non-negative number")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  normalize={(value) => (value ? Number(value) : "")}
                >
                  <Input type="number" placeholder="Enter ticket price" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                  >
                    {isEditMode ? "Update Showtime" : "Add Showtimes"}
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/manage_showtime")}
                    style={{ marginLeft: 10 }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card className={styles.card}>
              <Title level={4}>Showtime Preview</Title>
              <Text>
                <strong>Movie:</strong>{" "}
                {movieId
                  ? movies.find((movie) => movie.movie_id === movieId)?.title
                  : "Not provided"}
              </Text>
              <div style={{ height: 4 }} />
              <Text>
                <strong>Cinema:</strong>{" "}
                {cinemaId
                  ? cinemas.find((cinema) => cinema.cinema_id === cinemaId)?.name
                  : "Not provided"}
              </Text>
              <div style={{ height: 4 }} />
              <Text>
                <strong>Room:</strong>{" "}
                {roomId
                  ? rooms.find((room) => room.room_id === roomId)?.room_name
                  : "Not provided"}
              </Text>
              <div style={{ height: 4 }} />
              <Text>
                <strong>{isEditMode ? "Showtime:" : "Allowed Time(s):"}</strong>
              </Text>
              <div style={{ marginTop: "4px" }}>
                {isEditMode ? (
                  <Text>
                    {showtimeForm.getFieldValue("start_time") &&
                    dayjs.isDayjs(showtimeForm.getFieldValue("start_time"))
                      ? showtimeForm.getFieldValue("start_time").format("YYYY-MM-DD HH:mm")
                      : "Not provided"}
                  </Text>
                ) : (
                  selectedDates && selectedDates.length > 0 ? (
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      {selectedDates.map((date, index) => (
                        <li key={index}>
                          <Text>
                            {dayjs.isDayjs(date)
                              ? date.format("YYYY-MM-DD HH:mm")
                              : "Invalid time"}
                          </Text>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Text>Not provided</Text>
                  )
                )}
              </div>
              <div style={{ height: 4 }} />
              <Text>
                <strong>Price:</strong>{" "}
                {price
                  ? `${Number(price).toLocaleString("vi-VN")} VNĐ`
                  : "Not provided"}
              </Text>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default AdminManageShowtimeForm;