/* eslint-disable no-unused-vars */
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CinemaService from '../services/CinemaService';

const formatCinemas = (cinemas) =>
  cinemas.map((cinema) => ({
    cinema_id: cinema.cinema_id,
    name: cinema.name || 'Unknown',
    address: cinema.address || 'Unknown',
  }));

// Hook để lấy tất cả cinemas với infinite scroll
export const useCinemas = ({ city = null, pageSize = 20 }) => {
  return useInfiniteQuery({
    queryKey: ['cinemas', city],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        let response;
        if (city) {
          response = await CinemaService.searchCinemaByAddress(city, pageParam);
        } else {
          response = await CinemaService.getAllCinemas({ per_page: pageSize, page: pageParam });
        }
        const { data, last_page } = response;
        if (!Array.isArray(data)) {
          throw new Error('Dữ liệu rạp không đúng định dạng');
        }
        return {
          data: formatCinemas(data),
          nextPage: pageParam < last_page ? pageParam + 1 : undefined,
        };
      } catch (error) {
        throw new Error(error.message || 'Không thể tải danh sách rạp');
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: true,
    retry: 1, // Limit retries to avoid infinite loops on failure
  });
};

// Hook để tìm kiếm cinemas theo tên với infinite scroll
export const useSearchCinemasByName = ({ searchTerm, pageSize = 20 }) => {
  return useInfiniteQuery({
    queryKey: ['searchCinemas', searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await CinemaService.searchCinemaByName(searchTerm, pageParam);
        const { data, last_page } = response;
        if (!Array.isArray(data)) {
          throw new Error('Dữ liệu rạp không đúng định dạng');
        }
        return {
          data: formatCinemas(data),
          nextPage: pageParam < last_page ? pageParam + 1 : undefined,
        };
      } catch (error) {
        throw new Error(error.message || 'Không thể tìm kiếm rạp');
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!searchTerm,
    retry: 1,
  });
};

// Hook để lấy cinema theo ID
export const useCinemaById = (cinemaId) => {
  return useQuery({
    queryKey: ['cinema', cinemaId],
    queryFn: async () => {
      const cinema = await CinemaService.getCinemaById(cinemaId);
      return cinema;
    },
    enabled: !!cinemaId, // Chỉ gọi khi có cinemaId
    staleTime: 5 * 60 * 1000, // Cache lâu hơn cho cinema details
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy tất cả cinemas (không infinite scroll)
export const useAllCinemas = ({ page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['allCinemas', page, perPage],
    queryFn: async () => {
      const response = await CinemaService.getAllCinemas({ page, per_page: perPage });
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

// Hook để tìm kiếm cinemas theo địa chỉ
export const useSearchCinemasByAddress = ({ city, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['searchCinemasByAddress', city, page, perPage],
    queryFn: async () => {
      const response = await CinemaService.searchCinemaByAddress(city, page);
      return response;
    },
    enabled: !!city, // Chỉ gọi khi có city
    staleTime: 1 * 60 * 1000, // Cache ngắn hơn cho search
    cacheTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook để tạo cinema mới
export const useCreateCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cinemaData) => {
      const response = await CinemaService.createCinema(cinemaData);
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch cinemas list
      queryClient.invalidateQueries(['cinemas']);
      queryClient.invalidateQueries(['allCinemas']);
      queryClient.invalidateQueries(['searchCinemas']);
      queryClient.invalidateQueries(['searchCinemasByAddress']);
    },
    onError: (error) => {
      console.error("Error creating cinema:", error);
    },
  });
};

// Hook để cập nhật cinema
export const useUpdateCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cinemaId, cinemaData }) => {
      const response = await CinemaService.updateCinema(cinemaId, cinemaData);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['cinema', variables.cinemaId], data);
      // Invalidate cinemas list
      queryClient.invalidateQueries(['cinemas']);
      queryClient.invalidateQueries(['allCinemas']);
      queryClient.invalidateQueries(['searchCinemas']);
      queryClient.invalidateQueries(['searchCinemasByAddress']);
    },
    onError: (error) => {
      console.error("Error updating cinema:", error);
    },
  });
};

// Hook để soft delete cinema
export const useSoftDeleteCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cinemaId) => {
      const response = await CinemaService.softDeleteCinema(cinemaId);
      return response;
    },
    onSuccess: (_, cinemaId) => {
      // Xóa cinema khỏi cache
      queryClient.removeQueries(['cinema', cinemaId]);
      // Invalidate cinemas list
      queryClient.invalidateQueries(['cinemas']);
      queryClient.invalidateQueries(['allCinemas']);
      queryClient.invalidateQueries(['searchCinemas']);
      queryClient.invalidateQueries(['searchCinemasByAddress']);
    },
    onError: (error) => {
      console.error("Error soft deleting cinema:", error);
    },
  });
};

// Hook để restore cinema
export const useRestoreCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cinemaId) => {
      const response = await CinemaService.restoreCinema(cinemaId);
      return response;
    },
    onSuccess: () => {
      // Invalidate cinemas list
      queryClient.invalidateQueries(['cinemas']);
      queryClient.invalidateQueries(['allCinemas']);
      queryClient.invalidateQueries(['searchCinemas']);
      queryClient.invalidateQueries(['searchCinemasByAddress']);
    },
    onError: (error) => {
      console.error("Error restoring cinema:", error);
    },
  });
};

// Hook để destroy cinema
export const useDestroyCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cinemaId) => {
      const response = await CinemaService.destroyCinema(cinemaId);
      return response;
    },
    onSuccess: (_, cinemaId) => {
      // Xóa cinema khỏi cache
      queryClient.removeQueries(['cinema', cinemaId]);
      // Invalidate cinemas list
      queryClient.invalidateQueries(['cinemas']);
      queryClient.invalidateQueries(['allCinemas']);
      queryClient.invalidateQueries(['searchCinemas']);
      queryClient.invalidateQueries(['searchCinemasByAddress']);
    },
    onError: (error) => {
      console.error("Error destroying cinema:", error);
    },
  });
};

// Hook để refresh cinemas data
export const useRefreshCinemas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const cinemas = await CinemaService.getAllCinemas();
      return cinemas;
    },
    onSuccess: (data) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['allCinemas'], data);
      // Invalidate để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['cinemas']);
      queryClient.invalidateQueries(['allCinemas']);
    },
    onError: (error) => {
      console.error("Error refreshing cinemas:", error);
    },
  });
};