import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatService from '../services/SeatService';
import BookingService from '../services/BookingService';
import BookingSeatService from '../services/BookingSeatService';
import { useSettingsWithFallback } from './useSettings';
import { useBookingTimer } from '../Context/BookingTimerContext';
import { toastSuccess, toastError } from '../utils/toastNotifier';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Hook for seat selection data management
export const useSeatSelection = (roomId, bookingId) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasFetched = useRef(false);
  const { settings, isLoading: settingsLoading, error: settingsError } = useSettingsWithFallback();
  const { bookings, updateProgress, clearTimer } = useBookingTimer();

  const currentBooking = bookings.find((b) => b.bookingId === bookingId);
  const initialSeats =
    currentBooking?.progress.step === 'SeatSelection' &&
    currentBooking?.progress.bookingId === bookingId &&
    Array.isArray(currentBooking?.progress.data.selectedSeats)
      ? currentBooking.progress.data.selectedSeats
      : [];

  const [selectedSeats, setSelectedSeats] = useState(initialSeats);

  // Fetch booking data
  const { 
    data: booking, 
    isLoading: bookingLoading, 
    error: bookingError,
    refetch: refetchBooking 
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await BookingService.getBookingById(bookingId);
      if (response.status === 'CANCELLED') {
        toastError('This booking has been canceled.');
        navigate('/');
        throw new Error('Booking cancelled');
      }
      return response;
    },
    enabled: !!bookingId,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Fetch seats by room
  const { 
    data: seats = [], 
    isLoading: seatsLoading, 
    error: seatsError,
    refetch: refetchSeats 
  } = useQuery({
    queryKey: ['seats', roomId],
    queryFn: async () => {
      const response = await SeatService.getSeatByRoomId(roomId);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Fetch seat booking status by showtime
  const showtimeId = booking?.showtime?.showtime_id;
  const { 
    data: seatBookingStatus = [], 
    isLoading: seatStatusLoading, 
    error: seatStatusError,
    refetch: refetchSeatStatus 
  } = useQuery({
    queryKey: ['seatBookingStatus', showtimeId],
    queryFn: async () => {
      const response = await BookingSeatService.getSeatsByShowtime(showtimeId);
      return Array.isArray(response) ? response : [];
    },
    enabled: !!showtimeId,
    staleTime: 30 * 1000, // 30 seconds (frequent updates)
    cacheTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Create booking seat mutation
  const createBookingSeatMutation = useMutation({
    mutationFn: async (bookingSeatData) => {
      return await BookingSeatService.createBookingSeat(bookingSeatData);
    },
    onSuccess: () => {
      // Invalidate seat booking status to refresh data
      queryClient.invalidateQueries(['seatBookingStatus', showtimeId]);
    },
    onError: (error) => {
      console.error('Error creating booking seat:', error);
      toastError(error.message || 'Failed to book seat');
    },
  });

  // Update total price mutation
  const updateTotalPriceMutation = useMutation({
    mutationFn: async (totalPrice) => {
      return await BookingService.updateTotalPrice(bookingId, totalPrice);
    },
    onSuccess: () => {
      // Invalidate booking data to refresh
      queryClient.invalidateQueries(['booking', bookingId]);
    },
    onError: (error) => {
      console.error('Error updating total price:', error);
      toastError(error.message || 'Failed to update total price');
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async () => {
      return await BookingService.updateBookingStatus(bookingId, 'CANCELLED');
    },
    onSuccess: () => {
      clearTimer(bookingId);
      toastError(`Booking ${bookingId}: Your booking has been cancelled.`);
      navigate('/movies');
    },
    onError: (error) => {
      toastError(`Failed to cancel booking: ${error.message}`);
    },
  });

  // Setup real-time updates with Pusher
  useEffect(() => {
    if (!showtimeId) return;

    window.Pusher = Pusher;
    const echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_KEY,
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true,
      encrypted: true,
    });

    echo.channel(`showtime.${showtimeId}`)
      .listen('.seat.booked', (e) => {
        // Update seat booking status in cache
        queryClient.setQueryData(['seatBookingStatus', showtimeId], (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((s) =>
            s.seat_number === e.seat_number ? { ...s, is_booked: true } : s
          );
        });

        if (e.booking_id !== bookingId) {
          setSelectedSeats((prev) => prev.filter((s) => s !== e.seat_number));
          toastError(`Seat ${e.seat_number} has been booked by another user`);
        } else {
          toastSuccess(`Seat ${e.seat_number} booked successfully`);
        }
      });

    return () => {
      echo.leave(`showtime.${showtimeId}`);
    };
  }, [showtimeId, bookingId, queryClient]);

  // Handle booking timeout
  useEffect(() => {
    if (currentBooking?.timeLeft === '00:00' && selectedSeats.length > 0) {
      setSelectedSeats([]);
      toastError('Booking timed out. Seats have been released.');
    }
  }, [currentBooking, selectedSeats]);

  // Handle settings error
  useEffect(() => {
    if (settingsError) {
      toastError(settingsError);
      navigate(`/movie/${booking?.showtime?.movie?.movie_id || ''}`);
    }
  }, [settingsError, navigate, booking]);

  // Calculate seat layout
  const parseSeatLayout = () => {
    const rows = new Set();
    const cols = new Set();

    if (Array.isArray(seats) && seats.length > 0) {
      seats.forEach((seat) => {
        if (seat && typeof seat.seat_number === 'string') {
          const row = seat.seat_number.charAt(0);
          const col = parseInt(seat.seat_number.slice(1), 10);
          rows.add(row);
          cols.add(col);
        }
      });
    }

    return {
      rows: Array.from(rows).sort(),
      cols: Array.from(cols).sort((a, b) => a - b),
    };
  };

  const { rows, cols } = parseSeatLayout();

  // Calculate seat price
  const calculateSeatPrice = (seatNumber, basePrice) => {
    const seat = seats.find((s) => s.seat_number === seatNumber);
    if (!seat || !settings) return basePrice;

    const seatType = seat.seat_type.toUpperCase();

    switch (seatType) {
      case 'VIP':
        return basePrice + (basePrice * settings.vip / 100);
      case 'COUPLE':
        return basePrice + (basePrice * settings.couple / 100);
      case 'STANDARD':
      default:
        return basePrice;
    }
  };

  // Calculate total price
  const calculateTotalPrice = (basePrice) => {
    return selectedSeats.reduce((total, seatNumber) => {
      const seatPrice = calculateSeatPrice(seatNumber, basePrice);
      return total + seatPrice;
    }, 0);
  };

  // Toggle seat selection
  const toggleSeat = (seatNumber) => {
    const seat = seats.find((s) => s.seat_number === seatNumber);
    if (!seat) {
      console.error('Seat not found:', seatNumber);
      toastError('Seat not found');
      return;
    }

    const seatStatus = Array.isArray(seatBookingStatus)
      ? seatBookingStatus.find((s) => s.seat_number === seatNumber)
      : null;
    const isBooked = seatStatus ? seatStatus.is_booked : false;
    const seatType = seat.seat_type.toUpperCase();

    if (isBooked || seatType === 'UNAVAILABLE') {
      return;
    }

    const isSelected = selectedSeats.includes(seatNumber);

    setSelectedSeats((prev) => {
      let newSeats = [...prev];

      if (seatType === 'COUPLE') {
        const row = seatNumber.match(/^[A-Z]+/)[0];
        const col = parseInt(seatNumber.match(/\d+$/)[0], 10);
        let pairSeat;

        if (col % 2 === 1) {
          pairSeat = `${row}${col + 1}`;
        } else {
          pairSeat = `${row}${col - 1}`;
        }

        const pairSeatObj = seats.find((s) => s.seat_number === pairSeat);
        const pairSeatStatus = Array.isArray(seatBookingStatus)
          ? seatBookingStatus.find((s) => s.seat_number === pairSeat)
          : null;
        const isPairBooked = pairSeatStatus ? pairSeatStatus.is_booked : false;

        if (!pairSeatObj || isPairBooked || pairSeatObj.seat_type.toUpperCase() !== 'COUPLE') {
          toastError('Cannot select couple seat: pair seat is unavailable or not a couple seat.');
          return prev;
        }

        if (isSelected) {
          newSeats = newSeats.filter((s) => s !== seatNumber && s !== pairSeat);
        } else {
          if (!newSeats.includes(seatNumber)) {
            newSeats.push(seatNumber);
          }
          if (!newSeats.includes(pairSeat)) {
            newSeats.push(pairSeat);
          }
        }
      } else {
        if (isSelected) {
          newSeats = newSeats.filter((s) => s !== seatNumber);
        } else {
          newSeats = [...newSeats, seatNumber];
        }
      }

      const path = `/seats/${roomId}/${bookingId}`;
      updateProgress(bookingId, 'SeatSelection', { selectedSeats: newSeats }, path);
      return newSeats;
    });
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      toastError('Please select at least one seat to proceed.');
      return;
    }

    try {
      // Create booking seats for all selected seats
      const bookingSeatPromises = selectedSeats.map(async (seatNumber) => {
        const seat = seats.find((s) => s.seat_number === seatNumber);
        if (!seat) {
          throw new Error(`Seat not found: ${seatNumber}`);
        }

        const bookingSeatData = {
          booking_id: bookingId,
          seat_id: seat.seat_id,
        };

        return createBookingSeatMutation.mutateAsync(bookingSeatData);
      });

      await Promise.all(bookingSeatPromises);

      const basePrice = booking?.showtime?.price || 0;
      const totalPrice = calculateTotalPrice(basePrice);
      await updateTotalPriceMutation.mutateAsync(totalPrice);

      const path = `/payment/${bookingId}`;
      updateProgress(bookingId, 'Payment', { selectedSeats }, path);
      navigate(path, { state: { totalPrice } });
      toastSuccess('Seats booked successfully! Proceeding to payment');
    } catch (err) {
      console.error('Checkout error:', err);
      toastError(err.message || 'Failed to book seats. Please try again.');
    }
  };

  // Handle change movie
  const handleChangeMovie = () => {
    cancelBookingMutation.mutate();
  };

  // Loading states
  const isLoading = bookingLoading || seatsLoading || seatStatusLoading || settingsLoading;
  const hasError = bookingError || seatsError || seatStatusError;

  return {
    // Data
    booking,
    seats,
    seatBookingStatus,
    selectedSeats,
    settings,
    rows,
    cols,
    
    // Loading and error states
    isLoading,
    hasError,
    bookingError,
    seatsError,
    seatStatusError,
    
    // Actions
    toggleSeat,
    handleCheckout,
    handleChangeMovie,
    setSelectedSeats,
    
    // Utility functions
    calculateSeatPrice,
    calculateTotalPrice,
    parseSeatLayout,
    
    // Refresh functions
    refetchBooking,
    refetchSeats,
    refetchSeatStatus,
    
    // Mutations
    createBookingSeatMutation,
    updateTotalPriceMutation,
    cancelBookingMutation,
  };
}; 