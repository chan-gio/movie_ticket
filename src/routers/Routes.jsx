import { lazy } from 'react';
import ShowMoviesPage from '../pages/UserPages/ShowMoviesPage/ShowMoviesPage';
import CinemaPage from '../pages/UserPages/CinemaPage/CinemaPage';

// Lazy load all page components
const Home = lazy(() => import('../pages/UserPages/HomePage/Home'));
const Auth = lazy(() => import('../pages/UserPages/Auth/Auth'));
const Profile = lazy(() => import('../pages/UserPages/ProfilePage/Profile'));
const MovieDetails = lazy(() => import('../pages/UserPages/DetailPage/MovieDetails'));
const SeatSelection = lazy(() => import('../pages/UserPages/SeatPage/SeatSelection'));
const Payment = lazy(() => import('../pages/UserPages/PaymentPage/Payment'));
const Confirmation = lazy(() => import('../pages/UserPages/ConfirmationPage/Confirmation'));
const Admin = lazy(() => import('../pages/AdminPages/Admin'));
const AdminDashboard = lazy(() => import('../pages/AdminPages/Dashboard/AdminDashboard'));
const AdminProfile = lazy(() => import('../pages/AdminPages/Profile/AdminProfile'));
const AdminSettings = lazy(() => import('../pages/AdminPages/Setting/AdminSettings'));
const AdminManageUser = lazy(() => import('../pages/AdminPages/User/AdminManageUser'));
const AdminManageUserDetails = lazy(() => import('../pages/AdminPages/User/AdminManageUserDetails'));
const AdminManageMovie = lazy(() => import('../pages/AdminPages/Movie/AdminManageMovie'));
const AdminAddMovieForm = lazy(() => import('../pages/AdminPages/Movie/AdminAddMovieForm'));
const AdminEditMovieForm = lazy(() => import('../pages/AdminPages/Movie/AdminEditMovieForm'));
const DeletedMovies = lazy(() => import('../pages/AdminPages/Movie/DeletedMovies')); // New
const AdminManageShowtime = lazy(() => import('../pages/AdminPages/Showtime/AdminManageShowtime'));
const AdminManageShowtimeForm = lazy(() => import('../pages/AdminPages/Showtime/AdminManageShowtimeForm'));
const AdminManageCinema = lazy(() => import('../pages/AdminPages/Cinema/AdminManageCinema'));
const AdminManageCinemaForm = lazy(() => import('../pages/AdminPages/Cinema/AdminManageCinemaForm'));
const AdminManageRoomForm = lazy(() => import('../pages/AdminPages/Room/AdminManageRoomForm'));
const AdminManageSeats = lazy(() => import('../pages/AdminPages/Seat/AdminManageSeats'));
const AdminManageSeatForm = lazy(() => import('../pages/AdminPages/Seat/AdminManageSeatForm'));
const AdminManageBooking = lazy(() => import('../pages/AdminPages/Booking/AdminManageBooking'));
const AdminManageBookingDetails = lazy(() => import('../pages/AdminPages/Booking/AdminManageBookingDetails'));
const AdminManageCoupon = lazy(() => import('../pages/AdminPages/Coupon/AdminManageCoupon'));
const AdminManageCouponForm = lazy(() => import('../pages/AdminPages/Coupon/AdminManageCouponForm'));

// Define routes using an array of objects
const Routes = [
  { path: '/', component: <Home /> },
  { path: '/auth', component: <Auth /> },
  { path: '/profile', component: <Profile /> },
  { path: '/movies', component: <ShowMoviesPage /> },
  { path: '/movie/:id', component: <MovieDetails /> },
  { path: '/cinema/:cinemaName', component: <CinemaPage /> },
  { path: '/seats', component: <SeatSelection /> },
  { path: '/payment', component: <Payment /> },
  { path: '/confirmation', component: <Confirmation /> },
  { path: '/admin', component: <Admin><AdminDashboard /></Admin> },
  { path: '/admin/profile', component: <Admin><AdminProfile /></Admin> },
  { path: '/admin/settings', component: <Admin><AdminSettings /></Admin> },
  { path: '/admin/manage_user', component: <Admin><AdminManageUser /></Admin> },
  { path: '/admin/manage_user/details/:id', component: <Admin><AdminManageUserDetails /></Admin> },
  { path: '/admin/manage_movie', component: <Admin><AdminManageMovie /></Admin> },
  { path: '/admin/manage_movie/add', component: <Admin><AdminAddMovieForm /></Admin> },
  { path: '/admin/manage_movie/edit/:id', component: <Admin><AdminEditMovieForm /></Admin> },
  { path: '/admin/deleted_movies', component: <Admin><DeletedMovies /></Admin> }, // New
  { path: '/admin/manage_showtime', component: <Admin><AdminManageShowtime /></Admin> },
  { path: '/admin/manage_showtime/add', component: <Admin><AdminManageShowtimeForm isEditMode={false} /></Admin> },
  { path: '/admin/manage_showtime/edit/:id', component: <Admin><AdminManageShowtimeForm isEditMode={true} /></Admin> },
  { path: '/admin/manage_cinema', component: <Admin><AdminManageCinema /></Admin> },
  { path: '/admin/manage_cinema/add_cinema', component: <Admin><AdminManageCinemaForm isEditMode={false} /></Admin> },
  { path: '/admin/manage_cinema/edit_cinema/:id', component: <Admin><AdminManageCinemaForm isEditMode={true} /></Admin> },
  { path: '/admin/manage_cinema/add_room', component: <Admin><AdminManageRoomForm isEditMode={false} /></Admin> },
  { path: '/admin/manage_cinema/edit_room/:id', component: <Admin><AdminManageRoomForm isEditMode={true} /></Admin> },
  { path: '/admin/manage_seats/edit_room/:roomId', component: <Admin><AdminManageSeats /></Admin> },
  { path: '/admin/manage_seats/add', component: <Admin><AdminManageSeatForm isEditMode={false} /></Admin> },
  { path: '/admin/manage_seats/edit/:id', component: <Admin><AdminManageSeatForm isEditMode={true} /></Admin> },
  { path: '/admin/manage_booking', component: <Admin><AdminManageBooking /></Admin> },
  { path: '/admin/manage_booking/details/:id', component: <Admin><AdminManageBookingDetails /></Admin> },
  { path: '/admin/manage_coupon', component: <Admin><AdminManageCoupon /></Admin> },
  { path: '/admin/manage_coupon/add', component: <Admin><AdminManageCouponForm isEditMode={false} /></Admin> },
  { path: '/admin/manage_coupon/edit/:id', component: <Admin><AdminManageCouponForm isEditMode={true} /></Admin> },
];

export { Routes };