import { Suspense } from "react";
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";
import { Layout } from "antd";
import { Routes as RouteConfig } from "./routers/Routes";
import styles from "./App.module.scss";
import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";

const { Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
