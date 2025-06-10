import React from "react";
import styles from "./LeftContainer.module.scss";
import { useSettings } from "../../../../Context/SettingContext";

const LeftContainer = () => {
  const { settings } = useSettings();
  return (
    <div className={styles.leftContainer}>
      <div className={styles.leftContent}>
        <img src={settings.name} alt="Movie" />
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
