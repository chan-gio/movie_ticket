import api from "./api";

const CouponService = {
  getAllCoupons: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get("/coupons", {
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
      throw new Error(response.data.message || "Failed to fetch coupons");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch coupons");
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
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to create coupon");
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
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch coupon");
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
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update coupon");
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
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to soft delete coupon");
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
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to restore coupon");
    }
  },

  forceDeleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/coupons/${couponId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to hard delete coupon");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to hard delete coupon");
    }
  },

  searchCouponsByCode: async (code) => {
    try {
      const response = await api.get("/coupons/search/code", {
        params: { code },
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to search coupons");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to search coupons");
    }
  },

  searchCouponByExactCode: async (code) => {
    try {
      const response = await api.get("/coupons/search/exact-code", {
        params: { code },
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to search coupon by exact code");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to search coupon by exact code");
    }
  },

  updateCouponUsage: async (couponId, action) => {
    try {
      const response = await api.post(`/coupons/${couponId}/usage`, { action });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || `Failed to ${action} coupon usage`);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || `Failed to ${action} coupon usage`);
    }
  },

  decrementCouponUsage: async (couponId) => {
    try {
      const response = await api.post(`/coupons/${couponId}/usage`, { action: "decrement" });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to decrement coupon usage");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to decrement coupon usage");
    }
  },

  incrementCouponUsage: async (couponId) => {
    try {
      const response = await api.post(`/coupons/${couponId}/usage`, { action: "increment" });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to increment coupon usage");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to increment coupon usage");
    }
  },
};

export default CouponService;