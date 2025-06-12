import { useQuery } from '@tanstack/react-query';
import MovieService from '../services/MovieService';

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

export const useAllMovies = ({ page = 1, perPage = 20 }) => {
  return useQuery({
    queryKey: ['allMovies', page],
    queryFn: async () => {
      const response = await MovieService.getAllMoviesFE({ perPage, page });
      return formatMovies(response.data || response);
    },
    keepPreviousData: true, // Giữ dữ liệu cũ khi tải trang mới (pagination)
  });
};

export const useSearchMovies = ({ title, page = 1, perPage = 20 }) => {
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