import api from './api';

const BookingSeatService = {
  getAllBookingSeats: async () => {
    try {
      const response = await api.get('/booking-seats');
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch booking seats');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch booking seats');
    }
  },

  createBookingSeat: async (bookingSeatData) => {
    try {
      const response = await api.post('/booking-seats', bookingSeatData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create booking seat');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to create booking seat');
    }
  },

  getBookingSeatById: async (bookingSeatId) => {
    try {
      const response = await api.get(`/booking-seats/${bookingSeatId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch booking seat');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch booking seat');
    }
  },

  updateBookingSeat: async (bookingSeatId, bookingSeatData) => {
    try {
      const response = await api.put(`/booking-seats/${bookingSeatId}`, bookingSeatData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update booking seat');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to update booking seat');
    }
  },

  softDeleteBookingSeat: async (bookingSeatId) => {
    try {
      const response = await api.delete(`/booking-seats/soft/${bookingSeatId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || 'Failed to soft delete booking seat');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to soft delete booking seat');
    }
  },

  forceDeleteBookingSeat: async (bookingSeatId) => {
    try {
      const response = await api.delete(`/booking-seats/${bookingSeatId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || 'Failed to hard delete booking seat');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to hard delete booking seat');
    }
  },

  getSeatsByShowtime: async (showtimeId) => {
    try {
      const response = await api.get(`/booking-seats/showtimes/${showtimeId}/seats`);
      if (response.data.code === 200) {
        const seatData = response.data.data?.data || [];
        return Array.isArray(seatData) ? seatData : [];
      }
      throw new Error(response.data.message || 'Failed to fetch seats by showtime');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch seats by showtime');
    }
  },

  lockSeat: async (data) => {
    try {
      const response = await api.post('/booking-seats/lock', data);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to lock seat');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to lock seat');
    }
  },

  unlockSeat: async (data) => {
    try {
      const response = await api.post('/booking-seats/unlock', data);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to unlock seat');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to unlock seat');
    }
  },
};

export default BookingSeatService;