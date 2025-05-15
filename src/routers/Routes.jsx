import { lazy } from 'react';

// Lazy load all page components
const Home = lazy(() => import('../pages/UserPages/HomePage/Home'));
const Auth = lazy(() => import('../pages/UserPages/Auth/Auth'));
const Profile = lazy(() => import('../pages/UserPages/ProfilePage/Profile'));
const MovieDetails = lazy(() => import('../pages/UserPages/DetailPage/MovieDetails'));
const SeatSelection = lazy(() => import('../pages/UserPages/SeatPage/SeatSelection'));
const Payment = lazy(() => import('../pages/UserPages/PaymentPage/Payment'));
const Confirmation = lazy(() => import('../pages/UserPages/ConfirmationPage/Confirmation'));
const Admin = lazy(() => import('../pages/AdminPages/Admin'));
const AdminDashboard = lazy(() => import('../pages/AdminPages/AdminDashboard'));
const AdminProfile = lazy(() => import('../pages/AdminPages/AdminProfile'));
const AdminSettings = lazy(() => import('../pages/AdminPages/AdminSettings'));
const AdminManageUser = lazy(() => import('../pages/AdminPages/AdminManageUser'));
const AdminManageMovie = lazy(() => import('../pages/AdminPages/AdminManageMovie'));
const AdminManageMovieForm = lazy(() => import('../pages/AdminPages/AdminManageMovieForm'));
const AdminManageGenre = lazy(() => import('../pages/AdminPages/AdminManageGenre'));
const AdminManageGenreForm = lazy(() => import('../pages/AdminPages/AdminManageGenreForm'));

// Define routes using an array of objects
const Routes = [
  { path: '/', component: <Home /> },
  { path: '/auth', component: <Auth /> },
  { path: '/profile', component: <Profile /> },
  { path: '/movie/:id', component: <MovieDetails /> },
  { path: '/seats', component: <SeatSelection /> },
  { path: '/payment', component: <Payment /> },
  { path: '/confirmation', component: <Confirmation /> },
  
  { path: '/admin', component: <Admin><AdminDashboard /></Admin> },
  { path: '/admin/profile', component: <Admin><AdminProfile /></Admin> },
  { path: '/admin/settings', component: <Admin><AdminSettings /></Admin> },
  { path: '/admin/manage_user', component: <Admin><AdminManageUser /></Admin> },
  { path: '/admin/manage_movie', component: <Admin><AdminManageMovie /></Admin> },
  { path: '/admin/manage_movie/add', component: <Admin><AdminManageMovieForm isEditMode={false} /></Admin> },
  { path: '/admin/manage_movie/edit/:id', component: <Admin><AdminManageMovieForm isEditMode={true} /></Admin> },
  { path: '/admin/manage_genre', component: <Admin><AdminManageGenre /></Admin> },
  { path: '/admin/manage_genre/add', component: <Admin><AdminManageGenreForm isEditMode={false} /></Admin> },
  { path: '/admin/manage_genre/edit/:id', component: <Admin><AdminManageGenreForm isEditMode={true} /></Admin> },
];

export { Routes };