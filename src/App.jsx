import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { Layout } from 'antd';
import styles from './App.module.scss';

const { Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route
          path="*"
          element={
            <Layout className={styles.layout}>
              <Navbar />
              <Content className={styles.content}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/seats" element={<SeatSelection />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/confirmation" element={<Confirmation />} />
                </Routes>
              </Content>
              <Footer />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;