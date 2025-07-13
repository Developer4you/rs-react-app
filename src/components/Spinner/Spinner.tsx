// components/Spinner/Spinner.tsx
import React from 'react';
import styles from './spinner.module.css';
import ReactLogo from '../../assets/react.svg';

class Spinner extends React.Component {
  render() {
    return (
      <div className={styles.spinnerContainer}>
        <img src={ReactLogo} alt="Loading..." className={styles.spinner} />
      </div>
    );
  }
}

export default Spinner;
