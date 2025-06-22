import React from "react";
import styles from "./LeftContainer.module.scss";
import { useSettings } from "../../../../hooks/useSettings";

const LeftContainer = () => {
  const { data: settings, isLoading, error } = useSettings();
  
  // Fallback settings nếu chưa load được hoặc có lỗi
  const fallbackSettings = {
    name: "https://via.placeholder.com/150x50?text=MovieLogo"
  };
  
  const currentSettings = settings || fallbackSettings;

  return (
    <div className={styles.leftContainer}>
      <div className={styles.leftContent}>
        <img 
          src={currentSettings.name} 
          alt="Movie" 
          onError={(e) => {
            e.target.src = fallbackSettings.name;
          }}
        />
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
