import api from "./api";

const BookingService = {
  getAllBookings: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get("/bookings", {
        params: { page, per_page: perPage },
      });
      if (response.data.code === 200) {
        return {
          data: response.data.data.data,
          pagination: {
            current: response.data.data.current_page,
            pageSize: response.data.data.per_page,
            total: response.data.data.total,
          },
        };
      }
      throw new Error(response.data.message || "Failed to fetch bookings");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch bookings");
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create booking");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to create booking");
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch booking");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch booking");
    }
  },

  getBookingsByUserId: async (userId, params = {}) => {
    try {
      const response = await api.get(`/bookings/userId/${userId}`, { params });
      if (response.data.code === 200) {
        return {
          data: response.data.data.data,
          current_page: response.data.data.current_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
        };
      }
      throw new Error(response.data.message || "Failed to fetch bookings for user");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch bookings for user");
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, { status });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update booking status");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update booking status");
    }
  },

  updateTotalPrice: async (bookingId, totalPrice) => {
    try {
      const response = await api.put(`/bookings/bookings/${bookingId}/total-price`, {
        total_price: totalPrice,
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update total price");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update total price");
    }
  },

  updateOrderCode: async (bookingId, orderCode) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/order-code`, {
        order_code: orderCode,
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update order code");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update order code");
    }
  },

  updateCoupon: async (bookingId, couponCode) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/coupon`, {
        code: couponCode,
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update coupon for booking");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update coupon for booking");
    }
  },

  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/soft/${bookingId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to delete booking");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to delete booking");
    }
  },

  searchBooking: async (keyword, page = 1, perPage = 10) => {
    try {
      const response = await api.get("/bookings/search", {
        params: { keyword, page, per_page: perPage },
      });
      if (response.data.code === 200) {
        return {
          data: response.data.data.data,
          pagination: {
            current: response.data.data.current_page,
            pageSize: response.data.data.per_page,
            total: response.data.data.total,
          },
        };
      }
      throw new Error(response.data.message || "Failed to search bookings");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to search bookings");
    }
  },

  updateBarcode: async (bookingId, barcodeUrl) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/barcode`, {
        barcode: barcodeUrl,
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update barcode URL");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update barcode URL");
    }
  },
};

export default BookingService;