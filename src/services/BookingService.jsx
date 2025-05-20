import api from "./api"; // Import the configured Axios instance

const BookingService = {
  // Fetch all bookings with pagination
  getAllBookings: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get("/bookings", {
        params: { page, per_page: perPage },
      });
      if (response.data.code === 200) {
        return {
          data: response.data.data.data, // Extract bookings array
          pagination: {
            current: response.data.data.current_page,
            pageSize: response.data.data.per_page,
            total: response.data.data.total,
          },
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to fetch bookings. Please try again later."
          : error.response?.data?.message || "Failed to fetch bookings";
      throw new Error(message);
    }
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create booking");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to create booking. Please try again later."
          : error.response?.data?.message || "Failed to create booking";
      throw new Error(message);
    }
  },

  // Fetch a single booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch booking");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to fetch booking. Please try again later."
          : error.response?.data?.message || "Failed to fetch booking";
      throw new Error(message);
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, { status });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to update booking status"
        );
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to update booking status. Please try again later."
          : error.response?.data?.message || "Failed to update booking status";
      throw new Error(message);
    }
  },

  // Update booking total price
  updateTotalPrice: async (bookingId, totalPrice) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/total-price`, {
        total_price: totalPrice,
      });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to update total price"
        );
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to update total price. Please try again later."
          : error.response?.data?.message || "Failed to update total price";
      throw new Error(message);
    }
  },

  // Soft delete a booking
  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/soft/${bookingId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete booking");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to delete booking. Please try again later."
          : error.response?.data?.message || "Failed to delete booking";
      throw new Error(message);
    }
  },
};

export default BookingService;
