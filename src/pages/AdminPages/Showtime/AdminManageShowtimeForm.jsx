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
} from "antd";
import styles from "./AdminManageShowtimeForm.module.scss";
import dayjs from "dayjs";
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

  // Watch form field values for preview
  const movieId = Form.useWatch("movie_id", showtimeForm);
  const cinemaId = Form.useWatch("cinema_id", showtimeForm);
  const roomId = Form.useWatch("room_id", showtimeForm);
  const startTime = Form.useWatch("start_time", showtimeForm);
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
            // Parse start_time with dayjs
            const startTimeDayjs = showtime.start_time
              ? dayjs(showtime.start_time)
              : null;
            console.log(
              "Loaded start_time:",
              showtime.start_time,
              "Parsed:",
              startTimeDayjs?.format("YYYY-MM-DD HH:mm:ss")
            );

            showtimeForm.setFieldsValue({
              movie_id: showtime.movie_id,
              cinema_id: showtime.room?.cinema?.cinema_id,
              room_id: showtime.room_id,
              start_time: startTimeDayjs,
              price: showtime.price,
            });
            setSelectedCinema(showtime.room?.cinema?.cinema_id);
          }
        }
      } catch (error) {
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

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const showtimeData = {
        movie_id: values.movie_id,
        room_id: values.room_id,
        start_time: values.start_time
          ? values.start_time.format("YYYY-MM-DD HH:mm:ss")
          : null,
        price: Number(values.price),
      };

      console.log("Submitting showtimeData:", showtimeData);

      if (isEditMode) {
        await ShowTimeService.updateShowTime(id, showtimeData);
        message.success("Showtime updated successfully");
      } else {
        await ShowTimeService.createShowTime(showtimeData);
        message.success("Showtime added successfully");
      }

      showtimeForm.resetFields();
      navigate("/admin/manage_showtime");
    } catch (error) {
      message.error(
        error.message || `Failed to ${isEditMode ? "update" : "add"} showtime`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const disabledDate = (current) => {
    // Disable dates before today (June 1, 2025, 23:03 +07)
    return current && current < dayjs().startOf("day");
  };

  return (
    <div>
      <Title level={3} className={styles.pageTitle}>
        {isEditMode ? "Edit Showtime" : "Add Showtime"}
      </Title>
      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
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
                  label="Start Time"
                  name="start_time"
                  rules={[{ required: true, message: "Please select a start time" }]}
                >
                  <DatePicker
                    showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD HH:mm"
                    disabledDate={disabledDate}
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      console.log(
                        "DatePicker changed:",
                        value ? value.format("YYYY-MM-DD HH:mm:ss") : null
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Price (VND)"
                  name="price"
                  rules={[
                    { required: true, message: "Please enter the price" },
                    {
                      type: "number",
                      min: 0,
                      message: "Price must be a non-negative number",
                    },
                  ]}
                  normalize={(value) => (value ? Number(value) : value)}
                >
                  <Input type="number" placeholder="Enter ticket price" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    {isEditMode ? "Update Showtime" : "Add Showtime"}
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/manage_showtime")}
                    style={{ marginLeft: 8 }}
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
                  : "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Cinema:</strong>{" "}
                {cinemaId
                  ? cinemas.find((cinema) => cinema.cinema_id === cinemaId)?.name
                  : "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Room:</strong>{" "}
                {roomId
                  ? rooms.find((room) => room.room_id === roomId)?.room_name
                  : "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Start Time:</strong>{" "}
                {startTime ? startTime.format("YYYY-MM-DD HH:mm:ss") : "Not Set"}
              </Text>
              <br />
              <Text>
                <strong>Price:</strong>{" "}
                {price
                  ? `${Number(price).toLocaleString("vi-VN")} VND`
                  : "Not Set"}
              </Text>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default AdminManageShowtimeForm;