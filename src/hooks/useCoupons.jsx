import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CouponService from '../services/CouponService';

// Hook để lấy danh sách coupons với pagination
export const useCoupons = ({ page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['coupons', page, perPage],
    queryFn: async () => {
      const response = await CouponService.getAllCoupons(page, perPage);
      return response;
    },
    staleTime: 2 * 60 * 1000, // Dữ liệu được coi là fresh trong 2 phút
    cacheTime: 5 * 60 * 1000, // Cache được giữ trong 5 phút
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// Hook để tìm kiếm coupons theo code
export const useSearchCouponsByCode = ({ code, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['searchCouponsByCode', code, page, perPage],
    queryFn: async () => {
      const response = await CouponService.searchCouponsByCode(code, page, perPage);
      return response;
    },
    enabled: !!code, // Chỉ gọi khi có code
    staleTime: 1 * 60 * 1000, // Cache ngắn hơn cho search
    cacheTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy coupon theo ID
export const useCouponById = (couponId) => {
  return useQuery({
    queryKey: ['coupon', couponId],
    queryFn: async () => {
      const coupon = await CouponService.getCouponById(couponId);
      return coupon;
    },
    enabled: !!couponId, // Chỉ gọi khi có couponId
    staleTime: 5 * 60 * 1000, // Cache lâu hơn cho coupon details
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để tạo coupon mới
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (couponData) => {
      const response = await CouponService.createCoupon(couponData);
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch coupons list
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['searchCouponsByCode']);
    },
    onError: (error) => {
      console.error("Error creating coupon:", error);
    },
  });
};

// Hook để cập nhật coupon
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ couponId, couponData }) => {
      const response = await CouponService.updateCoupon(couponId, couponData);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['coupon', variables.couponId], data);
      // Invalidate coupons list
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['searchCouponsByCode']);
    },
    onError: (error) => {
      console.error("Error updating coupon:", error);
    },
  });
};

// Hook để soft delete coupon (deactivate)
export const useSoftDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (couponId) => {
      const response = await CouponService.softDeleteCoupon(couponId);
      return response;
    },
    onSuccess: (_, couponId) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['coupon', couponId], (old) => 
        old ? { ...old, is_active: false } : old
      );
      // Invalidate coupons list
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['searchCouponsByCode']);
    },
    onError: (error) => {
      console.error("Error soft deleting coupon:", error);
    },
  });
};

// Hook để restore coupon (activate)
export const useRestoreCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (couponId) => {
      const response = await CouponService.restoreCoupon(couponId);
      return response;
    },
    onSuccess: (data, couponId) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['coupon', couponId], data);
      // Invalidate coupons list
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['searchCouponsByCode']);
    },
    onError: (error) => {
      console.error("Error restoring coupon:", error);
    },
  });
};

// Hook để hard delete coupon
export const useForceDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (couponId) => {
      const response = await CouponService.forceDeleteCoupon(couponId);
      return response;
    },
    onSuccess: (_, couponId) => {
      // Xóa coupon khỏi cache
      queryClient.removeQueries(['coupon', couponId]);
      // Invalidate coupons list
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['searchCouponsByCode']);
    },
    onError: (error) => {
      console.error("Error force deleting coupon:", error);
    },
  });
};

// Hook để cập nhật usage của coupon
export const useUpdateCouponUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ couponId, action }) => {
      const response = await CouponService.updateCouponUsage(couponId, action);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['coupon', variables.couponId], data);
      // Invalidate coupons list
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['searchCouponsByCode']);
    },
    onError: (error) => {
      console.error("Error updating coupon usage:", error);
    },
  });
};

// Hook để increment usage
export const useIncrementCouponUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (couponId) => {
      const response = await CouponService.incrementCouponUsage(couponId);
      return response;
    },
    onSuccess: (data, couponId) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['coupon', couponId], data);
      // Invalidate coupons list
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['searchCouponsByCode']);
    },
    onError: (error) => {
      console.error("Error incrementing coupon usage:", error);
    },
  });
};

// Hook để decrement usage
export const useDecrementCouponUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (couponId) => {
      const response = await CouponService.decrementCouponUsage(couponId);
      return response;
    },
    onSuccess: (data, couponId) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['coupon', couponId], data);
      // Invalidate coupons list
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['searchCouponsByCode']);
    },
    onError: (error) => {
      console.error("Error decrementing coupon usage:", error);
    },
  });
};

// Hook để refresh coupons data
export const useRefreshCoupons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, perPage, code }) => {
      if (code) {
        return await CouponService.searchCouponsByCode(code, page, perPage);
      } else {
        return await CouponService.getAllCoupons(page, perPage);
      }
    },
    onSuccess: (data, variables) => {
      if (variables.code) {
        queryClient.setQueryData(['searchCouponsByCode', variables.code, variables.page, variables.perPage], data);
      } else {
        queryClient.setQueryData(['coupons', variables.page, variables.perPage], data);
      }
      // Invalidate để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['searchCouponsByCode']);
    },
    onError: (error) => {
      console.error("Error refreshing coupons:", error);
    },
  });
};

// Hook để lấy coupons với search và pagination
export const useCouponsWithSearch = ({ code, page = 1, perPage = 10 } = {}) => {
  const couponsQuery = useCoupons({ page, perPage });
  const searchQuery = useSearchCouponsByCode({ code, page, perPage });

  // Trả về query phù hợp dựa trên có code hay không
  if (code) {
    return {
      ...searchQuery,
      data: searchQuery.data,
      isSearching: true,
    };
  }

  return {
    ...couponsQuery,
    data: couponsQuery.data,
    isSearching: false,
  };
}; 