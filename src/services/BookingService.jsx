import api from "./api"; // Import the configured Axios instance

const BookingService = {
  // Fetch all bookings
  getAllBookings: async () => {
    try {
      const response = await api.get("/bookings");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch bookings"
      );
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
      throw new Error(
        error.response?.data?.message || "Failed to create booking"
      );
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
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking"
      );
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
      throw new Error(
        error.response?.data?.message || "Failed to update booking status"
      );
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
      throw new Error(
        error.response?.data?.message || "Failed to update total price"
      );
    }
  },

  // Soft delete a booking
  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete booking");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete booking"
      );
    }
  },
};

export default BookingService;
