import api from './api'; // Import the configured Axios instance

// Service methods for BookingSeatController endpoints
const BookingSeatService = {
  // Fetch all booking seats that are not deleted
  getAllBookingSeats: async () => {
    try {
      const response = await api.get('/booking-seats');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch booking seats');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking seats');
    }
  },

  // Create a new booking seat
  createBookingSeat: async (bookingSeatData) => {
    try {
      const response = await api.post('/booking-seats', bookingSeatData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create booking seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking seat');
    }
  },

  // Fetch a single booking seat by ID
  getBookingSeatById: async (bookingSeatId) => {
    try {
      const response = await api.get(`/booking-seats/${bookingSeatId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch booking seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking seat');
    }
  },

  // Update a booking seat
  updateBookingSeat: async (bookingSeatId, bookingSeatData) => {
    try {
      const response = await api.put(`/booking-seats/${bookingSeatId}`, bookingSeatData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update booking seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update booking seat');
    }
  },

  // Soft delete a booking seat
  softDeleteBookingSeat: async (bookingSeatId) => {
    try {
      const response = await api.delete(`/booking-seats/${bookingSeatId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to soft delete booking seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to soft delete booking seat');
    }
  },

  // Hard delete a booking seat
  forceDeleteBookingSeat: async (bookingSeatId) => {
    try {
      const response = await api.delete(`/booking-seats/${bookingSeatId}/force`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to hard delete booking seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to hard delete booking seat');
    }
  },

  // Fetch seats by showtime ID
  getSeatsByShowtime: async (showtimeId) => {
    try {
      const response = await api.get(`/booking-seats/showtime/${showtimeId}/seats`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch seats by showtime');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch seats by showtime');
    }
  },
};

export default BookingSeatService;