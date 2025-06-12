import { Suspense } from 'react';
import { BrowserRouter, Routes as ReactRoutes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from 'react-error-boundary';
import { routeConfig } from './routers/Routes';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './QueryClient';
import { SettingsProvider } from './Context/SettingContext';
import { BookingTimerProvider } from './Context/BookingTimerContext';
import styles from './App.module.scss';
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';
import BookingTimer from './components/UserPages/BookingTimer/BookingTimer';

const { Content } = Layout;

const ErrorFallback = ({ error }) => (
  <div className={styles.error}>
    <h2>Lỗi tải trang</h2>
    <p>{error.message}</p>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <BrowserRouter>
          <BookingTimerProvider>
            <BookingTimer />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<div className={styles.loading}>Đang tải...</div>}>
                <ReactRoutes>
                  {routeConfig.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        route.path.startsWith('/admin') ? (
                          route.element
                        ) : (
                          <Layout className={styles.layout}>
                            <Navbar />
                            <Content className={styles.content}>
                              {route.element}
                            </Content>
                            <Footer />
                          </Layout>
                        )
                      }
                    />
                  ))}
                </ReactRoutes>
              </Suspense>
            </ErrorBoundary>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              progressStyle={{ background: '#5f2eea' }}
            />
          </BookingTimerProvider>
        </BrowserRouter>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;