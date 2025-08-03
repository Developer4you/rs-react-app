import styles from './spinner.module.css';
import ReactLogo from '../../assets/react.svg';

export const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <img
        src={ReactLogo}
        alt="Loading..."
        className={styles.spinner}
        data-testid="spinner"
      />
    </div>
  );
};
