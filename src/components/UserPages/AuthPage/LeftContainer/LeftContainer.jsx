import React from "react";
import styles from "./LeftContainer.module.scss";

const logo = "https://via.placeholder.com/150x50?text=Movie"; // Replace with actual logo

const LeftContainer = () => {
  return (
    <div className={styles.leftContainer}>
      <div className={styles.leftContent}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <p className={styles.tagline}>wait, watch, wow!</p>
        <p className={styles.subTagline}>Lets build your account</p>
        <ul className={styles.steps}>
          <li>
            <span className={`${styles.stepCircle} ${styles.active}`}>1</span>
            <span className={styles.stepText}>Fill your details</span>
          </li>
          <li>
            <span className={styles.stepCircle}>2</span>
            <span className={styles.stepText}>Activate your account</span>
          </li>
          <li>
            <span className={styles.stepCircle}>3</span>
            <span className={styles.stepText}>Done</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftContainer;
