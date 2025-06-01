import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ShowMoviesPage from '../pages/UserPages/ShowMoviesPage/ShowMoviesPage';
import CinemaPage from '../pages/UserPages/CinemaPage/CinemaPage';

const Home = lazy(() => import('../pages/UserPages/HomePage/Home'));
const Auth = lazy(() => import('../pages/UserPages/Auth/Auth'));
const Profile = lazy(() => import('../pages/UserPages/ProfilePage/Profile'));
const MovieDetails = lazy(() => import('../pages/UserPages/DetailPage/MovieDetails'));
const SeatSelection = lazy(() => import('../pages/UserPages/SeatPage/SeatSelection'));
const Payment = lazy(() => import('../pages/UserPages/PaymentPage/Payment'));
const Confirmation = lazy(() => import('../pages/UserPages/ConfirmationPage/Confirmation'));
const Admin = lazy(() => import('../pages/AdminPages/Admin'));
const AdminLogin = lazy(() => import('../pages/AdminPages/AdminLogin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/AdminPages/Dashboard/AdminDashboard'));
const AdminProfile = lazy(() => import('../pages/AdminPages/Profile/AdminProfile'));
const AdminSettings = lazy(() => import('../pages/AdminPages/Setting/AdminSettings'));
const AdminManageUser = lazy(() => import('../pages/AdminPages/User/AdminManageUser'));
const AdminManageUserDetails = lazy(() => import('../pages/AdminPages/User/AdminManageUserDetails'));
const AdminManageMovie = lazy(() => import('../pages/AdminPages/Movie/AdminManageMovie'));
const AdminAddMovieForm = lazy(() => import('../pages/AdminPages/Movie/AdminAddMovieForm'));
const AdminEditMovieForm = lazy(() => import('../pages/AdminPages/Movie/AdminEditMovieForm'));
const DeletedMovies = lazy(() => import('../pages/AdminPages/Movie/DeletedMovies'));
const AdminAddCinemaForm = lazy(() => import('../pages/AdminPages/Cinema/AdminAddCinemaForm'));
const AdminEditCinemaForm = lazy(() => import('../pages/AdminPages/Cinema/AdminEditCinemaForm'));
const DeletedCinemas = lazy(() => import('../pages/AdminPages/Cinema/DeletedCinemas'));
const AdminManageShowtime = lazy(() => import('../pages/AdminPages/Showtime/AdminManageShowtime'));
const AdminManageShowtimeForm = lazy(() => import('../pages/AdminPages/Showtime/AdminManageShowtimeForm'));
const AdminManageCinema = lazy(() => import('../pages/AdminPages/Cinema/AdminManageCinema'));
const AdminManageRoom = lazy(() => import('../pages/AdminPages/Room/AdminManageRoom'));
const AdminManageSeats = lazy(() => import('../pages/AdminPages/Seat/AdminManageSeats'));
const AdminManageSeatForm = lazy(() => import('../pages/AdminPages/Seat/AdminManageSeatForm'));
const AdminManageBooking = lazy(() => import('../pages/AdminPages/Booking/AdminManageBooking'));
const AdminManageBookingDetails = lazy(() => import('../pages/AdminPages/Booking/AdminManageBookingDetails'));
const AdminManageCoupon = lazy(() => import('../pages/AdminPages/Coupon/AdminManageCoupon'));
const AdminManageCouponForm = lazy(() => import('../pages/AdminPages/Coupon/AdminManageCouponForm'));

// Protected route wrapper
const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

const Routes = [
  // User routes
  { path: '/', component: <Home /> },
  { path: '/auth', component: <Auth /> },
  { path: '/profile', component: <Profile /> },
  { path: '/movies', component: <ShowMoviesPage /> },
  { path: '/movie/:id', component: <MovieDetails /> },
  { path: '/cinema/:cinemaName', component: <CinemaPage /> },
  { path: '/seats/:roomId/:bookingId', component: <SeatSelection /> },
  { path: '/payment/:bookingId', component: <Payment /> },
  { path: '/confirmation/:bookingId', component: <Confirmation /> },

  // Admin routes
  { path: '/admin/login', component: <AdminLogin /> },
  { path: '/admin', component: <ProtectedAdminRoute><Admin><AdminDashboard /></Admin></ProtectedAdminRoute> },
  { path: '/admin/profile', component: <ProtectedAdminRoute><Admin><AdminProfile /></Admin></ProtectedAdminRoute> },
  { path: '/admin/settings', component: <ProtectedAdminRoute><Admin><AdminSettings /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_user', component: <ProtectedAdminRoute><Admin><AdminManageUser /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_user/details/:id', component: <ProtectedAdminRoute><Admin><AdminManageUserDetails /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_movie', component: <ProtectedAdminRoute><Admin><AdminManageMovie /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_movie/add', component: <ProtectedAdminRoute><Admin><AdminAddMovieForm /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_movie/edit/:id', component: <ProtectedAdminRoute><Admin><AdminEditMovieForm /></Admin></ProtectedAdminRoute> },
  { path: '/admin/deleted_movies', component: <ProtectedAdminRoute><Admin><DeletedMovies /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_cinema', component: <ProtectedAdminRoute><Admin><AdminManageCinema /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_cinema/add_cinema', component: <ProtectedAdminRoute><Admin><AdminAddCinemaForm /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_cinema/edit_cinema/:id', component: <ProtectedAdminRoute><Admin><AdminEditCinemaForm /></Admin></ProtectedAdminRoute> },
  { path: '/admin/deleted_cinemas', component: <ProtectedAdminRoute><Admin><DeletedCinemas /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_rooms/:cinemaId', component: <ProtectedAdminRoute><Admin><AdminManageRoom /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_seats/edit_room/:roomId', component: <ProtectedAdminRoute><Admin><AdminManageSeats /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_seats/add', component: <ProtectedAdminRoute><Admin><AdminManageSeatForm isEditMode={false} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_seats/edit/:id', component: <ProtectedAdminRoute><Admin><AdminManageSeatForm isEditMode={true} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_showtime', component: <ProtectedAdminRoute><Admin><AdminManageShowtime /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_showtime/add', component: <ProtectedAdminRoute><Admin><AdminManageShowtimeForm isEditMode={false} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_showtime/edit/:id', component: <ProtectedAdminRoute><Admin><AdminManageShowtimeForm isEditMode={true} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_booking', component: <ProtectedAdminRoute><Admin><AdminManageBooking /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_booking/details/:id', component: <ProtectedAdminRoute><Admin><AdminManageBookingDetails /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_coupon', component: <ProtectedAdminRoute><Admin><AdminManageCoupon /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_coupon/add', component: <ProtectedAdminRoute><Admin><AdminManageCouponForm isEditMode={false} /></Admin></ProtectedAdminRoute> },
  { path: '/admin/manage_coupon/edit/:id', component: <ProtectedAdminRoute><Admin><AdminManageCouponForm isEditMode={true} /></Admin></ProtectedAdminRoute> },
];

export { Routes };