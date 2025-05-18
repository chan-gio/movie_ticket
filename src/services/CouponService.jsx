import api from './api'; // Import the configured Axios instance

// Service methods for CouponController endpoints
const CouponService = {
  // Fetch all coupons
  getAllCoupons: async () => {
    try {
      const response = await api.get('/coupons');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch coupons');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch coupons');
    }
  },

  // Create a new coupon
  createCoupon: async (couponData) => {
    try {
      const response = await api.post('/coupons', couponData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create coupon');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create coupon');
    }
  },

  // Fetch a single coupon by ID
  getCouponById: async (couponId) => {
    try {
      const response = await api.get(`/coupons/${couponId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch coupon');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch coupon');
    }
  },

  // Update a coupon
  updateCoupon: async (couponId, couponData) => {
    try {
      const response = await api.put(`/coupons/${couponId}`, couponData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update coupon');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update coupon');
    }
  },

  // Soft delete a coupon (set is_active to false)
  softDeleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/coupons/${couponId}/soft`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to soft delete coupon');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to soft delete coupon');
    }
  },

  // Hard delete a coupon
  forceDeleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/coupons/${couponId}/force`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to hard delete coupon');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to hard delete coupon');
    }
  },
};

export default CouponService;