import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MovieService from '../services/MovieService';

// Hook để lấy danh sách movies với pagination (Admin)
export const useAdminMovies = ({ page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['adminMovies', page, perPage],
    queryFn: async () => {
      const response = await MovieService.getAllMovies({ page, perPage });
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

// Hook để tìm kiếm movies (Admin)
export const useAdminSearchMovies = ({ title, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['adminSearchMovies', title, page, perPage],
    queryFn: async () => {
      const response = await MovieService.searchByTitleFE({ title, page, perPage });
      return response;
    },
    enabled: !!title, // Chỉ gọi khi có title
    staleTime: 1 * 60 * 1000, // Cache ngắn hơn cho search
    cacheTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy movie theo ID (Admin)
export const useAdminMovieById = (movieId) => {
  return useQuery({
    queryKey: ['adminMovie', movieId],
    queryFn: async () => {
      const movie = await MovieService.getMovieById(movieId);
      return movie;
    },
    enabled: !!movieId, // Chỉ gọi khi có movieId
    staleTime: 5 * 60 * 1000, // Cache lâu hơn cho movie details
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để tạo movie mới
export const useCreateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieData, posterFile }) => {
      const response = await MovieService.createMovie(movieData, posterFile);
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch movies list
      queryClient.invalidateQueries(['adminMovies']);
      queryClient.invalidateQueries(['adminSearchMovies']);
      queryClient.invalidateQueries(['nowShowingMovies']);
      queryClient.invalidateQueries(['upcomingMovies']);
      queryClient.invalidateQueries(['allMovies']);
    },
    onError: (error) => {
      console.error("Error creating movie:", error);
    },
  });
};

// Hook để cập nhật movie
export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, movieData, posterFile }) => {
      const response = await MovieService.updateMovie(movieId, movieData, posterFile);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['adminMovie', variables.movieId], data);
      // Invalidate movies list
      queryClient.invalidateQueries(['adminMovies']);
      queryClient.invalidateQueries(['adminSearchMovies']);
      queryClient.invalidateQueries(['nowShowingMovies']);
      queryClient.invalidateQueries(['upcomingMovies']);
      queryClient.invalidateQueries(['allMovies']);
    },
    onError: (error) => {
      console.error("Error updating movie:", error);
    },
  });
};

// Hook để xóa movie (soft delete)
export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId) => {
      const response = await MovieService.softDeleteMovie(movieId);
      return response;
    },
    onSuccess: (_, movieId) => {
      // Xóa movie khỏi cache
      queryClient.removeQueries(['adminMovie', movieId]);
      // Invalidate movies list
      queryClient.invalidateQueries(['adminMovies']);
      queryClient.invalidateQueries(['adminSearchMovies']);
      queryClient.invalidateQueries(['nowShowingMovies']);
      queryClient.invalidateQueries(['upcomingMovies']);
      queryClient.invalidateQueries(['allMovies']);
      // Invalidate deleted movies
      queryClient.invalidateQueries(['deletedMovies']);
    },
    onError: (error) => {
      console.error("Error deleting movie:", error);
    },
  });
};

// Hook để restore movie
export const useRestoreMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId) => {
      const response = await MovieService.restoreMovie(movieId);
      return response;
    },
    onSuccess: () => {
      // Invalidate movies list
      queryClient.invalidateQueries(['adminMovies']);
      queryClient.invalidateQueries(['deletedMovies']);
      queryClient.invalidateQueries(['nowShowingMovies']);
      queryClient.invalidateQueries(['upcomingMovies']);
      queryClient.invalidateQueries(['allMovies']);
    },
    onError: (error) => {
      console.error("Error restoring movie:", error);
    },
  });
};

// Hook để lấy deleted movies
export const useDeletedMovies = ({ title, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['deletedMovies', title, page, perPage],
    queryFn: async () => {
      if (title) {
        return await MovieService.searchDeletedMovies({ title, page, perPage });
      } else {
        return await MovieService.getDeletedMovies();
      }
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để refresh movies data
export const useRefreshMovies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, perPage, title }) => {
      if (title) {
        return await MovieService.searchByTitleFE({ title, page, perPage });
      } else {
        return await MovieService.getAllMovies({ page, perPage });
      }
    },
    onSuccess: (data, variables) => {
      if (variables.title) {
        queryClient.setQueryData(['adminSearchMovies', variables.title, variables.page, variables.perPage], data);
      } else {
        queryClient.setQueryData(['adminMovies', variables.page, variables.perPage], data);
      }
      // Invalidate để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['adminMovies']);
      queryClient.invalidateQueries(['adminSearchMovies']);
    },
    onError: (error) => {
      console.error("Error refreshing movies:", error);
    },
  });
};

// Hook để lấy movies với search và pagination (Admin)
export const useAdminMoviesWithSearch = ({ title, page = 1, perPage = 10 } = {}) => {
  const moviesQuery = useAdminMovies({ page, perPage });
  const searchQuery = useAdminSearchMovies({ title, page, perPage });

  // Trả về query phù hợp dựa trên có title hay không
  if (title) {
    return {
      ...searchQuery,
      data: searchQuery.data,
      isSearching: true,
    };
  }

  return {
    ...moviesQuery,
    data: moviesQuery.data,
    isSearching: false,
  };
};

// Existing hooks for frontend
const formatMovies = (movies) =>
  movies.map((movie) => ({
    movie_id: movie.movie_id,
    title: movie.title || 'Untitled',
    poster_url: movie.poster_url || 'https://wallpapercave.com/wp/wp1816326.jpg',
    genre: movie.genre || 'Unknown',
    adult: movie.adult || 'N/A',
    release_date: movie.release_date || 'Unknown',
    showtimes: movie.showtimes || [], // Đảm bảo showtimes tồn tại
  }));

export const useNowShowingMovies = () => {
  return useQuery({
    queryKey: ['nowShowingMovies'],
    queryFn: async () => {
      const response = await MovieService.getNowShowing();
      return formatMovies(response.data || response);
    },
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ['upcomingMovies'],
    queryFn: async () => {
      const response = await MovieService.getUpcomingMovie();
      return formatMovies(response.data || response);
    },
  });
};

export const useAllMovies = ({ page = 1, perPage = 20 } = {}) => {
  return useQuery({
    queryKey: ['allMovies', page],
    queryFn: async () => {
      const response = await MovieService.getAllMoviesFE({ perPage, page });
      return formatMovies(response.data || response);
    },
    keepPreviousData: true, // Giữ dữ liệu cũ khi tải trang mới (pagination)
  });
};

export const useSearchMovies = ({ title, page = 1, perPage = 20 } = {}) => {
  return useQuery({
    queryKey: ['searchMovies', title, page],
    queryFn: async () => {
      const response = await MovieService.searchByTitleFE({ title, perPage, page });
      return formatMovies(response.data || response);
    },
    enabled: !!title, // Chỉ gọi khi title không rỗng
    keepPreviousData: true,
  });
};