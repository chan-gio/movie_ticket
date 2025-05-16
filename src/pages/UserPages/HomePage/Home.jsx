import React from "react";
import { Divider } from "antd";
import styles from "./Home.module.scss";

// Import các component con
import Hero from "../../../components/UserPages/HomePage/Hero/Hero.jsx";
import NowShowing from "../../../components/UserPages/HomePage/HomeCard/NowShowing.jsx";
import UpcomingMovies from "../../../components/UserPages/HomePage/HomeCard/UpcomingMovies.jsx";

const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.section}>
        <Hero />
      </section>

      <Divider />

      <section className={styles.section}>
        <NowShowing />
      </section>

      <Divider />

      <section className={styles.section}>
        <UpcomingMovies />
      </section>
    </div>
  );
};

export default Home;
