import { Suspense } from 'react';
import { BrowserRouter, Routes as ReactRoutes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { Routes as RouteConfig } from './routers/Routes';
import styles from './App.module.scss';
import Navbar from './components/NavBar/Navbar';
import { Footer } from 'antd/es/layout/layout';

const { Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <ReactRoutes>
          {RouteConfig.map((route, index) => {
            if (route.path === '/admin') {
              return (
                <Route key={index} path={`${route.path}/*`} element={route.component}>
                  {route.children && route.children.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      path={child.path}
                      element={child.component}
                    />
                  ))}
                </Route>
              );
            } else {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout className={styles.layout}>
                      <Navbar />
                      <Content className={styles.content}>
                        {route.component}
                      </Content>
                      <Footer />
                    </Layout>
                  }
                />
              );
            }
          })}
        </ReactRoutes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;