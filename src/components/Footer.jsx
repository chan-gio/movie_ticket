import styles from './Footer.module.scss';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p>© 2025 Tickitz. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;