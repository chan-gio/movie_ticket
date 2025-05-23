import api from "./api"; // Import the configured Axios instance

const CouponService = {
  getAllCoupons: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get("/coupons", {
        params: { page, per_page: perPage },
      });
      if (response.data.code === 200) {
        return {
          data: response.data.data.data, // Extract coupons array
          pagination: {
            current: response.data.data.current_page,
            pageSize: response.data.data.per_page,
            total: response.data.data.total,
          },
        };
      }
      throw new Error(response.data.message || "Failed to fetch coupons");
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to fetch coupons. Please try again later."
          : error.response?.data?.message || "Failed to fetch coupons";
      throw new Error(message);
    }
  },

  createCoupon: async (couponData) => {
    try {
      const response = await api.post("/coupons", couponData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create coupon");
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to create coupon. Please try again later."
          : error.response?.data?.message || "Failed to create coupon";
      throw new Error(message);
    }
  },

  getCouponById: async (couponId) => {
    try {
      const response = await api.get(`/coupons/${couponId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch coupon");
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to fetch coupon. Please try again later."
          : error.response?.data?.message || "Failed to fetch coupon";
      throw new Error(message);
    }
  },

  updateCoupon: async (couponId, couponData) => {
    try {
      const response = await api.put(`/coupons/${couponId}`, couponData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update coupon");
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to update coupon. Please try again later."
          : error.response?.data?.message || "Failed to update coupon";
      throw new Error(message);
    }
  },

  softDeleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/coupons/soft/${couponId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to soft delete coupon");
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to soft delete coupon. Please try again later."
          : error.response?.data?.message || "Failed to soft delete coupon";
      throw new Error(message);
    }
  },

  restoreCoupon: async (couponId) => {
    try {
      const response = await api.patch(`/coupons/restore/${couponId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to restore coupon");
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to restore coupon. Please try again later."
          : error.response?.data?.message || "Failed to restore coupon";
      throw new Error(message);
    }
  },

  forceDeleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/coupons/force/${couponId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to hard delete coupon");
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to hard delete coupon. Please try again later."
          : error.response?.data?.message || "Failed to hard delete coupon";
      throw new Error(message);
    }
  },

  // Search coupons by code (partial match)
  searchCouponsByCode: async (code) => {
    try {
      const response = await api.get("/coupons/search/code", {
        params: { code },
      });
      if (response.data.code === 200) {
        return response.data.data; // Returns an array of matching coupons
      }
      throw new Error(response.data.message || "Failed to search coupons");
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to search coupons. Please try again later."
          : error.response?.data?.message || "Failed to search coupons";
      throw new Error(message);
    }
  },

  // Search coupon by code (exact match)
  searchCouponByExactCode: async (code) => {
    try {
      const response = await api.get("/coupons/search/exact-code", {
        params: { code },
      });
      if (response.data.code === 200) {
        return response.data.data; // Returns a single coupon (or null if not found)
      }
      throw new Error(response.data.message || "Failed to search coupon by exact code");
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to search coupon by exact code. Please try again later."
          : error.response?.data?.message || "Failed to search coupon by exact code";
      throw new Error(message);
    }
  },
};

export default CouponService;