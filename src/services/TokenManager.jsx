// TokenManager để quản lý trạng thái refresh token một cách tập trung
class TokenManager {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Kiểm tra xem có đang refresh token không
  getIsRefreshing() {
    return this.isRefreshing;
  }

  // Đặt trạng thái đang refresh
  setRefreshing(refreshing) {
    this.isRefreshing = refreshing;
  }

  // Thêm request vào queue khi đang refresh
  addToQueue(resolve, reject) {
    this.failedQueue.push({ resolve, reject });
  }

  // Xử lý queue khi refresh thành công/thất bại
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      try {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      } catch (err) {
        console.error('Error processing queued promise:', err);
      }
    });
    
    this.failedQueue = [];
  }

  // Lấy queue hiện tại
  getQueue() {
    return this.failedQueue;
  }

  // Clear queue
  clearQueue() {
    this.failedQueue = [];
  }
}

// Export singleton instance
const tokenManager = new TokenManager();
export default tokenManager; 