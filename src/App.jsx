import { Suspense } from "react";
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";
import { Layout } from "antd";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes as RouteConfig } from "./routers/Routes";
import { SettingsProvider } from "./Context/SettingContext";
import { BookingTimerProvider } from "./Context/BookingTimerContext";
import styles from "./App.module.scss";
import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";
import BookingTimer from "./components/UserPages/BookingTimer/BookingTimer";

const { Content } = Layout;

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <BookingTimerProvider>
          <BookingTimer /> {/* Add the timer component */}
          <ReactRoutes>
            {RouteConfig.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  route.path.startsWith("/admin") ? (
                    route.component
                  ) : (
                    <Layout className={styles.layout}>
                      <Navbar />
                      <Content className={styles.content}>
                        {route.component}
                      </Content>
                      <Footer />
                    </Layout>
                  )
                }
              />
            ))}
          </ReactRoutes>
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
  );
}

export default App;