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

import { useShowtimeById, useUpdateShowtime, useCreateShowtime } from "../../../hooks/useShowtimes";
import { useAdminMovies } from "../../../hooks/useMovies";
import RoomService from "../../../services/RoomService";

const { Title, Text } = Typography;
const { Option } = Select;

function AdminManageShowtimeForm({ isEditMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showtimeForm] = Form.useForm();
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]); // State for selected dates

  // Sử dụng custom hooks với react-query
  const { data: showtime, isLoading: isLoadingShowtime, error: showtimeError } = useShowtimeById(isEditMode ? id : null);
  const { data: moviesData, isLoading: isLoadingMovies } = useAdminMovies({ perPage: 100 });
  const { mutate: updateShowtime, isLoading: isUpdating } = useUpdateShowtime();
  const { mutate: createShowtime, isLoading: isCreating } = useCreateShowtime();

  // Watch form field values for preview
  const movieId = Form.useWatch("movie_id", showtimeForm);
  const cinemaId = Form.useWatch("cinema_id", showtimeForm);
  const roomId = Form.useWatch("room_id", showtimeForm);
  const price = Form.useWatch("price", showtimeForm);

  // Load rooms and cinemas data
  useEffect(() => {
    const loadRoomsData = async () => {
      try {
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
      } catch (error) {
        console.error("Error loading rooms data:", error);
        message.error("Failed to load rooms data");
      }
    };

    loadRoomsData();
  }, []);

  // Set form data when showtime is loaded (edit mode)
  useEffect(() => {
    if (isEditMode && showtime) {
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
    } else if (!isEditMode) {
      // Initialize empty dates for add mode
      showtimeForm.setFieldsValue({ start_time: null });
      setSelectedDates([]);
    }
  }, [showtime, isEditMode, showtimeForm]);

  // Show error message if there's an error
  if (showtimeError) {
    message.error(showtimeError.message || "Failed to load showtime data");
  }

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
    if (isEditMode) {
      if (!values.start_time || !dayjs.isDayjs(values.start_time)) {
        message.error("Please select a valid start time.");
        return;
      }
      const showtimeData = {
        movie_id: values.movie_id,
        room_id: values.room_id,
        start_time: values.start_time.format("YYYY-MM-DD HH:mm:ss"),
        price: Number(values.price),
      };
      
      updateShowtime({ showtimeId: id, showtimeData }, {
        onSuccess: () => {
          message.success("Showtime updated successfully");
          navigate("/admin/manage_showtime");
        },
        onError: (error) => {
          message.error(error.message || "Failed to update showtime");
        },
      });
    } else {
      if (!selectedDates || selectedDates.length === 0) {
        message.error("Please select at least one date.");
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
        return createShowtime(showtimeData);
      });

      try {
        await Promise.all(createShowtimePromises);
        message.success(`Successfully added ${createShowtimePromises.length} showtime(s).`);
        showtimeForm.resetFields();
        setSelectedDates([]);
        navigate("/admin/manage_showtime");
      } catch (error) {
        console.error("Submit error:", error);
        message.error(error.message || "Failed to add showtime(s)");
      }
    }
  };

  const isLoading = isLoadingShowtime || isLoadingMovies;
  const isSubmitting = isUpdating || isCreating;

  return (
    <div>
      <Title level={3} className={styles.pageTitle}>
        {isEditMode ? "Edit Showtime" : "Add Showtime"}
      </Title>
      {isLoading ? (
        <div className={styles.pageTitle}>
          <Spin size="large" />
          <Text>Loading...</Text>
        </div>
      ) : (
        <Row gutter={[16, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Showtime Information" className={styles.formCard}>
              <Form
                form={showtimeForm}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
              >
                {/* Movie Selection */}
                <Form.Item
                  label="Movie"
                  name="movie_id"
                  rules={[{ required: true, message: "Please select a movie" }]}
                >
                  <Select
                    placeholder="Select a movie"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    disabled={isSubmitting}
                  >
                    {moviesData?.data
                      ?.filter((movie) => !movie.is_deleted)
                      .map((movie) => (
                        <Option key={movie.movie_id} value={movie.movie_id}>
                          {movie.title}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

                {/* Cinema Selection */}
                <Form.Item
                  label="Cinema"
                  name="cinema_id"
                  rules={[{ required: true, message: "Please select a cinema" }]}
                >
                  <Select
                    placeholder="Select a cinema"
                    onChange={handleCinemaChange}
                    disabled={isSubmitting}
                  >
                    {cinemas.map((cinema) => (
                      <Option key={cinema.cinema_id} value={cinema.cinema_id}>
                        {cinema.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Room Selection */}
                <Form.Item
                  label="Room"
                  name="room_id"
                  rules={[{ required: true, message: "Please select a room" }]}
                >
                  <Select
                    placeholder="Select a room"
                    disabled={!selectedCinema || isSubmitting}
                  >
                    {filteredRooms.map((room) => (
                      <Option key={room.room_id} value={room.room_id}>
                        {room.room_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Date/Time Selection */}
                {isEditMode ? (
                  <Form.Item
                    label="Start Time"
                    name="start_time"
                    rules={[{ required: true, message: "Please select start time" }]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder="Select date and time"
                      disabledDate={disabledDate}
                      onChange={handleDateChange}
                      disabled={isSubmitting}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item label="Start Time">
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder="Select date and time"
                      disabledDate={disabledDate}
                      onChange={handleDateChange}
                      disabled={isSubmitting}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                )}

                {/* Price */}
                <Form.Item
                  label="Price (VND)"
                  name="price"
                  rules={[
                    { required: true, message: "Please enter price" },
                    { type: "number", min: 0, message: "Price must be positive" },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Enter price"
                    disabled={isSubmitting}
                  />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className={styles.submitButton}
                  >
                    {isEditMode ? "Update Showtime" : "Add Showtime(s)"}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Preview Section */}
          <Col xs={24} lg={8}>
            <Card title="Preview" className={styles.previewCard}>
              <div className={styles.previewContent}>
                <div className={styles.previewItem}>
                  <Text strong>Movie:</Text>
                  <Text>
                    {moviesData?.data?.find((m) => m.movie_id === movieId)?.title || "Not selected"}
                  </Text>
                </div>
                <div className={styles.previewItem}>
                  <Text strong>Cinema:</Text>
                  <Text>
                    {cinemas.find((c) => c.cinema_id === cinemaId)?.name || "Not selected"}
                  </Text>
                </div>
                <div className={styles.previewItem}>
                  <Text strong>Room:</Text>
                  <Text>
                    {filteredRooms.find((r) => r.room_id === roomId)?.room_name || "Not selected"}
                  </Text>
                </div>
                <div className={styles.previewItem}>
                  <Text strong>Price:</Text>
                  <Text type="success">
                    {price ? `${price.toLocaleString("vi-VN")} VND` : "Not set"}
                  </Text>
                </div>

                {/* Selected Dates Display (Add Mode) */}
                {!isEditMode && selectedDates.length > 0 && (
                  <div className={styles.previewItem}>
                    <Text strong>Selected Dates:</Text>
                    <div className={styles.selectedDates}>
                      {selectedDates.map((date, index) => (
                        <Tag
                          key={index}
                          closable
                          onClose={() => handleRemoveDate(index)}
                          className={styles.dateTag}
                        >
                          {date.format("DD/MM/YYYY HH:mm")}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {/* Single Date Display (Edit Mode) */}
                {isEditMode && (
                  <div className={styles.previewItem}>
                    <Text strong>Start Time:</Text>
                    <Text>
                      {showtimeForm.getFieldValue("start_time")
                        ? dayjs(showtimeForm.getFieldValue("start_time")).format("DD/MM/YYYY HH:mm")
                        : "Not selected"}
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default AdminManageShowtimeForm;