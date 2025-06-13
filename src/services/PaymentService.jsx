import api from './api';

const PaymentService = {
  getAllPayments: async () => {
    try {
      const response = await api.get('/payment');
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch payments');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },

  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payment', paymentData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create payment');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
  },

  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch payment');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payment');
    }
  },

  updatePayment: async (paymentId, paymentData) => {
    try {
      const response = await api.put(`/payment/${paymentId}`, paymentData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update payment');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to update payment');
    }
  },

  deletePayment: async (paymentId) => {
    try {
      const response = await api.delete(`/payment/${paymentId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || 'Failed to delete payment');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to delete payment');
    }
  },

  markPaymentCompleted: async (paymentId) => {
    try {
      const response = await api.patch(`/payment/payments/${paymentId}/complete`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to mark payment as completed');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to mark payment as completed');
    }
  },

  getPaymentLinkInfo: async (orderCode) => {
    try {
      const response = await api.get(`/payment/proxy-payos/${orderCode}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch payment link information');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payment link information');
    }
  },

  proxyPayOS: async (paymentData) => {
    try {
      const response = await api.post('/payment/proxy-payos', paymentData);
      if (response.data.code === '00') {
        return response.data.data;
      }
      throw new Error(response.data.desc || 'Failed to create PayOS payment link');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.desc || 'Failed to create PayOS payment link');
    }
  },
};

export default PaymentService;