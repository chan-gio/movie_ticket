// src/routers/Routes.jsx
import { lazy } from 'react';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import ShowMoviesPage from '../pages/UserPages/ShowMoviesPage/ShowMoviesPage';
import CinemaPage from '../pages/UserPages/CinemaPage/CinemaPage';

const Home = lazy(() => import('../pages/UserPages/HomePage/Home.jsx'));
const Auth = lazy(() => import('../pages/UserPages/Auth/Auth.jsx'));
const Profile = lazy(() => import('../pages/UserPages/ProfilePage/Profile.jsx'));
const MovieDetails = lazy(() => import('../pages/UserPages/DetailPage/MovieDetails.jsx'));
const SeatSelection = lazy(() => import('../pages/UserPages/SeatPage/SeatSelection.jsx'));
const Payment = lazy(() => import('../pages/UserPages/PaymentPage/Payment.jsx'));
const Confirmation = lazy(() => import('../pages/UserPages/ConfirmationPage/Confirmation.jsx'));
const Admin = lazy(() => import('../pages/AdminPages/Admin.jsx'));
const AdminLogin = lazy(() => import('../pages/AdminPages/AdminLogin/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('../pages/AdminPages/Dashboard/AdminDashboard.jsx'));
const AdminProfile = lazy(() => import('../pages/AdminPages/Profile/AdminProfile.jsx'));
const AdminSettings = lazy(() => import('../pages/AdminPages/Setting/AdminSettings.jsx'));
const AdminManageUser = lazy(() => import('../pages/AdminPages/User/AdminManageUser.jsx'));
const AdminManageUserDetails = lazy(() => import('../pages/AdminPages/User/AdminManageUserDetails.jsx'));
const AdminManageMovie = lazy(() => import('../pages/AdminPages/Movie/AdminManageMovie.jsx'));
const AdminAddMovieForm = lazy(() => import('../pages/AdminPages/Movie/AdminAddMovieForm.jsx'));
const AdminEditMovieForm = lazy(() => import('../pages/AdminPages/Movie/AdminEditMovieForm.jsx'));
const DeletedMovies = lazy(() => import('../pages/AdminPages/Movie/DeletedMovies.jsx'));
const AdminAddCinemaForm = lazy(() => import('../pages/AdminPages/Cinema/AdminAddCinemaForm.jsx'));
const AdminEditCinemaForm = lazy(() => import('../pages/AdminPages/Cinema/AdminEditCinemaForm.jsx'));
const DeletedCinemas = lazy(() => import('../pages/AdminPages/Cinema/DeletedCinemas.jsx'));
const AdminManageShowtime = lazy(() => import('../pages/AdminPages/Showtime/AdminManageShowtime.jsx'));
const AdminManageShowtimeForm = lazy(() => import('../pages/AdminPages/Showtime/AdminManageShowtimeForm.jsx'));
const AdminManageCinema = lazy(() => import('../pages/AdminPages/Cinema/AdminManageCinema.jsx'));
const AdminManageRoom = lazy(() => import('../pages/AdminPages/Room/AdminManageRoom.jsx'));
const AdminManageSeats = lazy(() => import('../pages/AdminPages/Seat/AdminManageSeats.jsx'));
const AdminManageSeatForm = lazy(() => import('../pages/AdminPages/Seat/AdminManageSeatForm.jsx'));
const AdminManageBooking = lazy(() => import('../pages/AdminPages/Booking/AdminManageBooking.jsx'));
const AdminManageBookingDetails = lazy(() => import('../pages/AdminPages/Booking/AdminManageBookingDetails.jsx'));
const AdminManageCoupon = lazy(() => import('../pages/AdminPages/Coupon/AdminManageCoupon.jsx'));
const AdminManageCouponForm = lazy(() => import('../pages/AdminPages/Coupon/AdminManageCouponForm.jsx'));

const routeConfig = [
  // User routes
  { path: '/', element: <Home /> },
  { path: '/auth', element: <Auth /> },
  { path: '/profile', element: <Profile /> },
  { path: '/movies', element: <ShowMoviesPage /> },
  { path: '/movie/:id', element: <MovieDetails /> },
  { path: '/cinema/:cinemaName', element: <CinemaPage /> },
  { path: '/seats/:roomId/:bookingId', element: <SeatSelection /> },
  { path: '/payment/:bookingId', element: <Payment /> },
  { path: '/confirmation/:bookingId', element: <Confirmation /> },

  // Admin routes
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin', element: <ProtectedAdminRoute><Admin><AdminDashboard /></Admin></ProtectedAdminRoute> },
  { path: '/admin/profile', element: <ProtectedAdminRoute><Admin><AdminProfile /></Admin></ProtectedAdminRoute> },
  { path: '/admin/settings', element: <ProtectedAdminRoute><Admin><AdminSettings /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_user', element: <ProtectedAdminRoute><Admin><AdminManageUser /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_user/details/:id', element: <ProtectedAdminRoute><Admin><AdminManageUserDetails /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_movie', element: <ProtectedAdminRoute><Admin><AdminManageMovie /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_movie/add', element: <ProtectedAdminRoute><Admin><AdminAddMovieForm /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_movie/edit/:id', element: <ProtectedAdminRoute><Admin><AdminEditMovieForm /></Admin></ProtectedAdminRoute> },
  { path: '/admin/deleted_movies', element: <ProtectedAdminRoute><Admin><DeletedMovies /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_cinema', element: <ProtectedAdminRoute><Admin><AdminManageCinema /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_cinema/add_cinema', element: <ProtectedAdminRoute><Admin><AdminAddCinemaForm /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_cinema/edit_cinema/:id', element: <ProtectedAdminRoute><Admin><AdminEditCinemaForm /></Admin></ProtectedAdminRoute> },
  { path: '/admin/deleted_cinemas', element: <ProtectedAdminRoute><Admin><DeletedCinemas /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_rooms/:cinemaId', element: <ProtectedAdminRoute><Admin><AdminManageRoom /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_seats/edit_room/:roomId', element: <ProtectedAdminRoute><Admin><AdminManageSeats /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_seats/add', element: <ProtectedAdminRoute><Admin><AdminManageSeatForm isEditMode={false} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_seats/edit/:id', element: <ProtectedAdminRoute><Admin><AdminManageSeatForm isEditMode={true} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_showtime', element: <ProtectedAdminRoute><Admin><AdminManageShowtime /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_showtime/add', element: <ProtectedAdminRoute><Admin><AdminManageShowtimeForm isEditMode={false} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_showtime/edit/:id', element: <ProtectedAdminRoute><Admin><AdminManageShowtimeForm isEditMode={true} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_booking', element: <ProtectedAdminRoute><Admin><AdminManageBooking /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_booking/details/:id', element: <ProtectedAdminRoute><Admin><AdminManageBookingDetails /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_coupon', element: <ProtectedAdminRoute><Admin><AdminManageCoupon /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_coupon/add', element: <ProtectedAdminRoute><Admin><AdminManageCouponForm isEditMode={false} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_coupon/edit/:id', element: <ProtectedAdminRoute><Admin><AdminManageCouponForm isEditMode={true} /></Admin></ProtectedAdminRoute> },
];

export { routeConfig };