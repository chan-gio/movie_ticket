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

// Define routes using an array of objects
const Routes = [
  { path: '/', component: <Home /> },
  { path: '/auth', component: <Auth /> },
  { path: '/profile', component: <Profile /> },
  { path: '/movie/:id', component: <MovieDetails /> },
  { path: '/seats', component: <SeatSelection /> },
  { path: '/payment', component: <Payment /> },
  { path: '/confirmation', component: <Confirmation /> },
  {
    path: '/admin',
    component: <Admin />,
    children: [
      { path: '', component: null }, // Dashboard (handled in Admin.jsx)
      { path: 'profile', component: null },
      { path: 'settings', component: null },
      { path: 'manage_user', component: null },
      { path: 'manage_movie', component: null },
      { path: 'manage_movie/add', component: null },
      { path: 'manage_movie/edit/:id', component: null },
      { path: 'manage_genre', component: null },
      { path: 'manage_genre/add', component: null },
      { path: 'manage_genre/edit/:id', component: null },
    ],
  },
];

export { Routes };