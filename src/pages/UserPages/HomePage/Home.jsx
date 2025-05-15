import React from "react";
import styles from "./Home.module.scss";

// Import các component con
import Hero from "../../../components/Hero/Hero.jsx";
import NowShowing from "../../../components/NowShowing/NowShowing.jsx";
import UpcomingMovies from "../../../components/UpcomingMovies/UpcomingMovies.jsx";
import Subscribe from "../../../components/Subscribe/Subscribe.jsx";

const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.section}>
        <Hero />
      </section>

      <section className={styles.section}>
        <NowShowing />
      </section>

      <section className={styles.section}>
        <UpcomingMovies />
      </section>

      <section className={styles.section}>
        <Subscribe />
      </section>
    </div>
  );
};

export default Home;
