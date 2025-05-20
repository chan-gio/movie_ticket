import api from './api'; // Import the configured Axios instance

// Service methods for PaymentController endpoints
const PaymentService = {
  // Fetch all payments
  getAllPayments: async () => {
    try {
      const response = await api.get('/payments');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch payments');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },

  // Create a new payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create payment');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
  },

  // Fetch a single payment by ID
  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch payment');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment');
    }
  },

  // Update a payment
  updatePayment: async (paymentId, paymentData) => {
    try {
      const response = await api.put(`/payments/${paymentId}`, paymentData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update payment');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update payment');
    }
  },

  // Delete a payment
  deletePayment: async (paymentId) => {
    try {
      const response = await api.delete(`/payments/${paymentId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to delete payment');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete payment');
    }
  },

  // Mark a payment as completed
  markPaymentCompleted: async (paymentId) => {
    try {
      const response = await api.put(`/payments/${paymentId}/mark-completed`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to mark payment as completed');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark payment as completed');
    }
  },

  // Fetch payment link information by orderCode
  getPaymentLinkInfo: async (orderCode) => {
    try {
      const response = await api.get(`/payment/proxy-payos/${orderCode}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch payment link information');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment link information');
    }
  },

   // Create a PayOS payment link
   proxyPayOS: async (paymentData) => {
    try {
      const response = await api.post('/payment/proxy-payos', paymentData);
      if (response.data.code === '00') { // PayOS typically uses '00' for success
        return response.data.data;
      } else {
        throw new Error(response.data.desc || 'Failed to create PayOS payment link');
      }
    } catch (error) {
      throw new Error(error.response?.data?.desc || 'Failed to create PayOS payment link');
    }
  },
};

export default PaymentService;