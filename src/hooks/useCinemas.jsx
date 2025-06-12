/* eslint-disable no-unused-vars */
import { useInfiniteQuery } from '@tanstack/react-query';
import CinemaService from '../services/CinemaService';

const formatCinemas = (cinemas) =>
  cinemas.map((cinema) => ({
    cinema_id: cinema.cinema_id,
    name: cinema.name || 'Unknown',
    address: cinema.address || 'Unknown',
  }));

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