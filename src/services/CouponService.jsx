import api from "./api"; // Import the configured Axios instance

const CouponService = {
  // Fetch all coupons with pagination
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
      } else {
        throw new Error(response.data.message || "Failed to fetch coupons");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to fetch coupons. Please try again later."
          : error.response?.data?.message || "Failed to fetch coupons";
      throw new Error(message);
    }
  },

  // Create a new coupon
  createCoupon: async (couponData) => {
    try {
      const response = await api.post("/coupons", couponData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create coupon");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to create coupon. Please try again later."
          : error.response?.data?.message || "Failed to create coupon";
      throw new Error(message);
    }
  },

  // Fetch a single coupon by ID
  getCouponById: async (couponId) => {
    try {
      const response = await api.get(`/coupons/${couponId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch coupon");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to fetch coupon. Please try again later."
          : error.response?.data?.message || "Failed to fetch coupon";
      throw new Error(message);
    }
  },

  // Update a coupon
  updateCoupon: async (couponId, couponData) => {
    try {
      const response = await api.put(`/coupons/${couponId}`, couponData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update coupon");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to update coupon. Please try again later."
          : error.response?.data?.message || "Failed to update coupon";
      throw new Error(message);
    }
  },

  // Soft delete a coupon (set is_active to false)
  softDeleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/coupons/soft/${couponId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(
          response.data.message || "Failed to soft delete coupon"
        );
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to soft delete coupon. Please try again later."
          : error.response?.data?.message || "Failed to soft delete coupon";
      throw new Error(message);
    }
  },

  // Hard delete a coupon
  forceDeleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/coupons/${couponId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(
          response.data.message || "Failed to hard delete coupon"
        );
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to hard delete coupon. Please try again later."
          : error.response?.data?.message || "Failed to hard delete coupon";
      throw new Error(message);
    }
  },
};

export default CouponService;
