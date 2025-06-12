import { useQuery } from '@tanstack/react-query';
import MovieService from '../services/MovieService';
import ShowtimeService from '../services/ShowtimeService';

const formatShowtimes = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  const groupedByCinema = data.reduce((acc, showtime) => {
    const cinemaId = showtime.room?.cinema?.cinema_id || 'unknown';
    const cinemaName = showtime.room?.cinema?.name || 'Unknown Cinema';
    const cinemaAddress = showtime.room?.cinema?.address || 'Unknown Address';

    if (!acc[cinemaId]) {
      acc[cinemaId] = {
        cinema_id: cinemaId,
        cinema: cinemaName,
        address: cinemaAddress,
        showtimes: [],
        price: showtime.price || 'N/A',
      };
    }
    acc[cinemaId].showtimes.push({
      showtime_id: showtime.showtime_id,
      start_time: showtime.start_time,
      room: showtime.room,
    });
    return acc;
  }, {});

  return Object.values(groupedByCinema);
};

export const useMovieDetails = (movieId) => {
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Unknown';

  // Fetch movie details
  const movieQuery = useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      const data = await MovieService.getMovieById(movieId);
      return {
        movie_id: data.movie_id,
        title: data.title || 'Untitled',
        picture: data.poster_url || 'https://wallpapercave.com/wp/wp1816326.jpg',
        genre: data.genre || 'Unknown',
        releaseDate: formatDate(data.release_date),
        directed: data.director || 'Unknown',
        duration: data.duration ? `${data.duration} min` : 'Unknown',
        cast: data.cast || 'Unknown',
        synopsis: data.description || 'No synopsis available',
      };
    },
    enabled: !!movieId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch showtimes
  const showtimesQuery = useQuery({
    queryKey: ['showtimes', movieId],
    queryFn: async () => {
      const response = await ShowtimeService.getShowTimesByMovieId(movieId);
      return formatShowtimes(response.data);
    },
    enabled: !!movieId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    movie: movieQuery.data,
    showtimes: showtimesQuery.data || [],
    isLoading: movieQuery.isLoading || showtimesQuery.isLoading,
    error: movieQuery.error || showtimesQuery.error,
  };
};